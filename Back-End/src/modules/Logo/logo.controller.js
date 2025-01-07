import Logo from "../../../DB/models/logo.model.js";
import axios from "axios";
import { systemRoles } from "../../utils/system-roles.js";
import { createCharge } from "../Services/tapPayment.js";
//&====================== ADD LOGO ======================&//
export const addLogo = async (req, res, next) => {
  const { username, email, title, description, rows, cols, logoLink, selectedCells } = req.body;

  // Map selectedCells to pixels
  let pixels = selectedCells.map((cell) => ({
    pixelNumber: cell.cellId,
    smallImage: cell.canvasData,
  }));

  //* Fetch all verified logos
  const logos = await Logo.find({ isVerified: true });
  if (!logos) {
    return res.status(400).json({ message: "Failed to fetch logos" });
  }

  //* Create a Set of all pixelNumbers from verified logos
  const verifiedPixelNumbers = new Set();
  logos.forEach((logo) => {
    logo.pixels.forEach((pixel) => {
      verifiedPixelNumbers.add(pixel.pixelNumber);
    });
  });

  //* Check for duplicate pixels
  for (const newPixel of pixels) {
    if (verifiedPixelNumbers.has(newPixel.pixelNumber)) {
      return res.status(400).json({ message: "Pixel is already taken" });
    }
  }

  const price = rows * cols * 20;

  //* Validate selected cells
  if (rows * cols !== selectedCells.length) {
    return res.status(400).json({ message: "Failed to add logo" });
  }

  //* Create a new logo document
  const logo = await Logo.create({
    username,
    email,
    title,
    description,
    image: req.file.path.split("uploads/")[1],
    rows,
    cols,
    pixels,
    logoLink,
  });

  if (!logo) {
    return res.status(400).json({ message: "Failed to add logo" });
  }

  //* Payment processing (mocked in this example)
  try {
    const paymentLink = await createCharge({
      price,
      title,
      id: logo._id,
      username,
      email,
    });

    if (!paymentLink) {
      // Delete the logo if payment link creation fails
      await Logo.findByIdAndDelete(logo._id);
      return res.status(500).json({ message: "Failed to create payment link" });
    }

    return res.status(201).json({
      message: "Logo added successfully. Proceed to payment.",
      paymentLink,
      success: true,
      logo,
    });
  } catch (error) {
    console.error("Payment error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to create payment link" });
  }
};

//&====================== ADD UNPAID LOGO ======================&//
export const addUnpaidLogo = async (req, res, next) => {
  const { username, email, title, description, rows, cols, logoLink, selectedCells } = req.body;

  // Map selectedCells to pixels
  let pixels = selectedCells.map((cell) => ({
    pixelNumber: cell.cellId,
    smallImage: cell.canvasData,
  }));

  //* Fetch all verified logos
  const logos = await Logo.find({ isVerified: true });
  if (!logos) {
    return res.status(400).json({ message: "Failed to fetch logos" });
  }

  //* Create a Set of all pixelNumbers from verified logos
  const verifiedPixelNumbers = new Set();
  logos.forEach((logo) => {
    logo.pixels.forEach((pixel) => {
      verifiedPixelNumbers.add(pixel.pixelNumber);
    });
  });

  //* Check for duplicate pixels
  for (const newPixel of pixels) {
    if (verifiedPixelNumbers.has(newPixel.pixelNumber)) {
      console.log("Pixel is already taken", newPixel.pixelNumber);
      return res.status(400).json({ message: "Pixel is already taken" });
    }
  }

  //* Validate selected cells
  if (rows * cols !== selectedCells.length) {
    return res.status(400).json({ message: "Failed to add logo" });
  }

  //* Create a new logo document with isVerified initially true
  const logo = await Logo.create({
    username,
    email,
    title,
    description,
    image: req.file.path.split("uploads/")[1],
    rows,
    cols,
    pixels,
    logoLink,
    isVerified: true,
  });

  if (!logo) {
    return res.status(400).json({ message: "Failed to add logo" });
  }

  //* Return the created logo
  return res.status(201).json({
    message: "Logo added successfully",
    logo,
    success: true,
  });
};


//&====================== UPDATE LOGO ======================&//
export const updateLogo = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.authUser;
  const { username, email, title, description, rows, cols, logoLink, selectedCells } = req.body;

  //* Check if the user is an admin
  if (role !== systemRoles.ADMIN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  //* Check if the logo exists and is verified
  const logoExist = await Logo.findById(id);
  if (!logoExist) {
    return res.status(404).json({ message: "Logo not found" });
  }
  if (!logoExist.isVerified) {
    return res.status(400).json({ message: "Logo is not verified" });
  }

  //* Update fields if provided
  if (username) logoExist.username = username;
  if (email) logoExist.email = email;
  if (title) logoExist.title = title;
  if (description) logoExist.description = description;
  if (req.file) logoExist.image = req.file.path;
  if (logoLink) logoExist.logoLink = logoLink;

  if (rows || cols) {
    logoExist.rows = rows;
    logoExist.cols = cols;

    //* Validate the number of selected cells
    if (selectedCells && selectedCells.length !== rows * cols) {
      return res.status(400).json({ message: "Number of pixels is not equal to the number of rows and cols" });
    }
  }

  //* Handle pixel updates if `selectedCells` is provided
  if (selectedCells) {
    const logos = await Logo.find({ isVerified: true });
    if (!logos) {
      return res.status(400).json({ message: "Failed to fetch logos" });
    }

    //* Map selectedCells to pixels
    const pixels = selectedCells.map((cell) => ({
      pixelNumber: cell.cellId,
      smallImage: cell.canvasData,
    }));

    //* Create a Set of all pixelNumbers from verified logos (excluding the current logo)
    const verifiedPixelNumbers = new Set();
    logos.forEach((logo) => {
      if (logo._id.toString() !== id) {
        logo.pixels.forEach((pixel) => {
          verifiedPixelNumbers.add(pixel.pixelNumber);
        });
      }
    });

    //* Check for duplicate pixels
    for (const newPixel of pixels) {
      if (verifiedPixelNumbers.has(newPixel.pixelNumber)) {
        console.log("Pixel is already taken", newPixel.pixelNumber);
        return res.status(400).json({ message: "Pixel is already taken" });
      }
    }

    logoExist.pixels = pixels;
  }

  //* Save updated logo
  const updatedLogo = await logoExist.save();
  if (!updatedLogo) {
    return res.status(500).json({ message: "Failed to update logo" });
  }

  //* Return the updated logo
  return res.status(200).json({
    message: "Logo updated successfully",
    logo: updatedLogo,
    success: true,
  });
};

//&====================== WEBHOOK ======================&//
export const verifyPayment = async (req, res) => {
  const { id, metadata } = req.body;
  const logoId = metadata.logoId;
  console.log("tap_id", logoId);

const options = {
  method: 'GET',
  url: `${process.env.TAP_URL}/charges/${id}`,
  headers: {
    accept: 'application/json',
    Authorization:  `${process.env.TAP_SECRET_KEY}`
  }
};
const response = await axios.request(options)
let logo;
if (response.data.status === 'CAPTURED') {
  logo = await Logo.findByIdAndUpdate(
    logoId,
    { isVerified: true },
    { new: true }
  );  
}
  if (!logo) {
    return res.status(404).json({ message: "Logo not found" });
  }
  return res.status(200).json({ message: "Payment verified and logo updated", logo });
};

//&====================== GET LOGOS ======================&//
export const getLogos = async (req, res, next) => {
  const logos = await Logo.find({isVerified: true});
  if (!logos) {
    return res.status(400).json({ message: "Failed to fetch logos" });
  }
  return res.status(200).json({ logos });
};

//&====================== DELETE LOGO ======================&//
export const deleteLogo = async (req, res, next) => {
  const { id } = req.params;
  const {role} = req.authUser;
  //* check if the user is not an admin
  if (role !== systemRoles.ADMIN) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const logo = await Logo.findByIdAndDelete(id);
  if (!logo) {
    return res.status(404).json({ message: "Logo not found" });
  }
  return res.status(200).json({ message: "Logo deleted successfully", success: true });
};