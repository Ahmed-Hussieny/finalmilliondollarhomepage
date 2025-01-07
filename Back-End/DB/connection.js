import mongoose from "mongoose";

const connection_DB = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('DB connected');
    }).catch((err) => {
        console.log('DB connection failed', err);
    });
};
export default connection_DB;