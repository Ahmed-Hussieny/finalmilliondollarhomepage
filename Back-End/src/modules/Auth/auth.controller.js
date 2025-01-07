import jwt from 'jsonwebtoken';
import User from '../../../DB/models/user.model.js';
import bcrypt from 'bcryptjs';
import { verificationEmailTemplete } from '../../utils/verify-email-templet.js';
import sendEmailService from '../services/send-email.services.js';

//& ===================== SIGN UP API =====================
export const signUp = async (req, res, next) => {
    //* 1- destructure the request body
    const {username, email, password, role} = req.body;
    
    //* 2- check if user is already registered
    
    const isEmailDuplicated = await User.findOne({email});
    if(isEmailDuplicated) return next({message: 'Email is already registered', cause: 400});
    //* 3- hashing the password
    const hashedPassword = bcrypt.hashSync(password, +process.env.HASH_SALT);
    console.log(req.body);
    //* send Email to the user with the verification link
    const userToken = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});
    const isEmailSent = await sendEmailService({
        to: email,
        subject: 'Email verification',
        message: verificationEmailTemplete(username,`${process.env.HOST_URL}/auth/verifyEmail?userToken=${userToken}`)
    });
    if(!isEmailSent) return next({message: 'Email is not sent', cause: 500});
    
    //* 4- create a new user
    const newUser = await User.create({username, email, password:hashedPassword, role});
    if(!newUser) return next({message: 'User is not created', cause: 500});

    //* 5- send the response
    return res.status(201).json({message: 'User is created successfully', user: newUser});
}

//& ===================== VERIFY EMAIL API =====================
export const verifyEmail = async (req, res, next) => {
    //* 1- get the user token from the query
    const {userToken} = req.query;
    if(!userToken) return next({message: 'User token is missing', cause: 400});

    //* 2- verify the user token
    const decodedData = jwt.verify(userToken, process.env.JWT_SECRET);
    if(!decodedData) return next({message: 'User token is invalid', cause: 400});
    
    //* 3- find the user by the email
    const user = await User.findOne({email: decodedData.email});
    if(!user) return next({message: 'User is not found', cause: 404});
    
    //* 4- update the user status to verified
    user.isVerified = true;
    await user.save();
    
    //* 5- send the response
    return res.status(200).json({message: 'Email is verified successfully', user});
};

//& ===================== SIGN IN API =====================
export const signIn = async (req, res, next) => {
    //* 1- get the email and password from the request body
    const {email, password} = req.body;
    console.log(req.body);
    //* 2- find the user by the email
    const user = await User.findOne({email});
    if(!user) return next({message: 'هذا الحساب غير مسجل', cause: 404});
    
    //* 3- check if the user is verified
    if(!user.isVerified) return next({message: 'هذا الحساب غير مفعل', cause: 401});

    //* 4- check the password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if(!isPasswordValid) return next({message: 'الرقم السري غير صحيح', cause: 400});

    //* 5- generate the token
    const userToken = jwt.sign({email, role:user.role, id:user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});

    //* 6- update the user status to logged in
    user.isloggedIn = true;
    user.token = userToken;
    await user.save();

    //* 7- send the response
    return res.status(200).json({message: 'تم تسجيل الدخول بنجاح', userData: user, userToken});
};
