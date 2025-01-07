import axios from "axios";
import Pixel from "../../../DB/models/pixel.model.js";
import { createCharge } from "../Services/tapPayment.js";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { generatePixelImage, generateTempPixelImage } from "../../utils/generateSvgImage.js";
//&================ ADD PIXEL ======================&//
export const addPixel = async (req, res, next) => {
  const { username, email, title, description, position, size, type, url } =
    req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Failed to add pixel" });
  }
  const content = req.file.path.split("uploads/")[1];
  const newPosition = JSON.parse(position);
  const newSize = JSON.parse(size);

  const existingPixels = await Pixel.find({ isVerified: true });

  const isIntersecting = existingPixels.some((pixel) => {
    const existingPosition = pixel.position;
    const existingSize = pixel.size;

    const isXIntersecting =
      newPosition.x < existingPosition.x + existingSize.width &&
      newPosition.x + newSize.width > existingPosition.x;
    const isYIntersecting =
      newPosition.y < existingPosition.y + existingSize.height &&
      newPosition.y + newSize.height > existingPosition.y;

    return isXIntersecting && isYIntersecting;
  });

  // response in arabic
  if (isIntersecting) {
    // delete the file
    fs.unlinkSync(path.resolve("uploads", content));
    return res
      .status(400)
      .json({ message: "موقع اللوقو يتقاطع مع لوقو موجود" });
  }
  //check if the pixel is out of the grid
  if (
    newPosition.x + newSize.width > 1000 ||
    newPosition.y + newSize.height > 1000
  ) {
    // delete the file
    fs.unlinkSync(path.resolve("uploads", content));
    return res.status(400).json({ message: "موقع اللوقو خارج الشبكة" });
  }
  // Create the new pixel
  const pixel = await Pixel.create({
    username,
    email,
    title,
    description,
    position: newPosition,
    content,
    size: newSize,
    type,
    url,
  });

  if (!pixel) {
    fs.unlinkSync(path.resolve("uploads", content));
    return res.status(400).json({ message: "Failed to add pixel" });
  }
  await generateTempPixelImage({ id: pixel._id });
  const price = newSize.width * newSize.height * 2;

  try {
    const paymentLink = await createCharge({
      price,
      title,
      id: pixel._id,
      username,
      email,
    });

    if (!paymentLink) {
      // delete the file
      fs.unlinkSync(path.resolve("uploads", content));
      await Pixel.findByIdAndDelete(pixel._id);
      return res.status(500).json({ message: "Failed to create payment link" });
    }
    
    return res.status(201).json({
      message: "Pixel added successfully. Proceed to payment.",
      paymentLink,
      success: true,
      pixel,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create payment link" });
  }
};

//&================ GET PIXELS ======================&//
export const getPixels = async (req, res, next) => {
  const pixels = await Pixel.find({ isVerified: true });
  if (!pixels) {
    return res.status(400).json({ message: "Failed to get pixels" });
  }
  const numberOfPixelsUsed = pixels
    .map((pixel) => pixel.size.width * pixel.size.height)
    .reduce((acc, curr) => acc + curr, 0);
  return res
    .status(200)
    .json({
      message: "Pixels fetched successfully",
      pixels,
      numberOfPixelsUsed,
    });
};

//& generat The big image using Sharp
export const generatePixelsImage = async (req, res) => {
  try {
    // Fetch pixel data from the database
    const pixelData = await Pixel.find({ isVerified: true });
    if (!pixelData || pixelData.length === 0) {
      return res.status(400).json({ message: "No verified pixel data found" });
    }

    // Start building the SVG content with a grid background
    let svgContent = `
        <svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
            <!-- Define a pattern for the grid background -->
            <defs>
                <pattern id="grid" width="1" height="1" patternUnits="userSpaceOnUse">
                    <rect width="1" height="1" fill="white" />
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="1" />
                </pattern>
            </defs>

            <!-- Apply the grid background to a large rectangle -->
            <rect width="1000" height="1000" fill="url(#grid)" />
    `;

    // Loop through each pixel and create an SVG <a> tag with a tooltip for the title
    for (const pixel of pixelData) {
      const { x, y } = pixel.position;
      const { width, height } = pixel.size;
      const imagePath = `https://2d15-102-46-146-22.ngrok-free.app/uploads/${pixel.content}`; // Correct image path
      const link = pixel.url; // The link the image should go to when clicked
      const title = pixel.title || "No Title"; // Pixel title for the tooltip

      // Draw a solid white rectangle to mask the grid under each small image
      svgContent += `
            <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="white" />
        `;

      // Add an <a> tag with the link, <image> tag, and <title> for the tooltip
      svgContent += `
            <a href="${link}" target="_blank">
                <title>${title}</title>
                <image x="${x}" y="${y}" width="${width}" height="${height}" href="${imagePath}" />
            </a>
        `;
    }

    // Close the SVG tag
    svgContent += `</svg>`;

    // Send the SVG content directly as a response
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(svgContent);
  } catch (error) {
    console.error("Error generating SVG:", error);
    res.status(500).send({ error: "Failed to generate SVG" });
  }
};


//&====================== WEBHOOK ======================&//
export const verifyPayment = async (req, res) => {
  const { id, metadata } = req.body;
  const logoId = metadata.logoId;
  console.log("tap_id", logoId);

  const options = {
    method: "GET",
    url: `${process.env.TAP_URL}/charges/${id}`,
    headers: {
      accept: "application/json",
      Authorization: `${process.env.TAP_SECRET_KEY}`,
    },
  };
  const response = await axios.request(options);
  let logo;
  if (response.data.status === "CAPTURED") {
    logo = await Pixel.findByIdAndUpdate(
      logoId,
      { isVerified: true },
      { new: true }
    );
  }
  await generatePixelImage();
  if (!logo) {
    return res.status(404).json({ message: "Logo not found" });
  }
  return res
    .status(200)
    .json({ message: "Payment verified and logo updated", logo });
};

// & ================== ADMIN FUNCTIONALITY ===============================
export const addPixelWithoutPayment = async (req, res, next) => {
  const { username, email, title, description, position, size, type, url } =
    req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Failed to add pixel" });
  }
  const content = req.file.path.split("uploads/")[1];
  const newPosition = JSON.parse(position);
  const newSize = JSON.parse(size);

  const existingPixels = await Pixel.find({ isVerified: true });

  const isIntersecting = existingPixels.some((pixel) => {
    const existingPosition = pixel.position;
    const existingSize = pixel.size;

    const isXIntersecting =
      newPosition.x < existingPosition.x + existingSize.width &&
      newPosition.x + newSize.width > existingPosition.x;
    const isYIntersecting =
      newPosition.y < existingPosition.y + existingSize.height &&
      newPosition.y + newSize.height > existingPosition.y;

    return isXIntersecting && isYIntersecting;
  });

  // response in arabic
  if (isIntersecting) {
    // delete the file
    fs.unlinkSync(path.resolve("uploads", content));
    return res
      .status(400)
      .json({ message: "موقع اللوقو يتقاطع مع لوقو موجود" });
  }
  //check if the pixel is out of the grid
  if (
    newPosition.x + newSize.width > 1000 ||
    newPosition.y + newSize.height > 1000
  ) {
    // delete the file
    fs.unlinkSync(path.resolve("uploads", content));
    return res.status(400).json({ message: "موقع اللوقو خارج الشبكة" });
  }
  // Create the new pixel
  const pixel = await Pixel.create({
    username,
    email,
    title,
    description,
    position: newPosition,
    content,
    size: newSize,
    type,
    url,
    isVerified: true,
  });

  if (!pixel) {
    // delete the file
    fs.unlinkSync(path.resolve("uploads", content));
    return res.status(400).json({ message: "Failed to add pixel" });
  }
  await generatePixelImage();

  return res.status(201).json({
    message: "Pixel added successfully.",
    success: true,
    pixel,
  });
};

// & =================== GET PIXEL BY URL =============================
export const getPixelByRowAndCol = async (req, res, next) => {
    const { row, col } = req.query;
    
    const pixel = await Pixel.findOne({
        'position.x': Number(col) * 10,
        'position.y': Number(row) * 10,
        isVerified: true,
    });
    
    if (!pixel) {
        return next({message:"هذا اللوقو غير موجود" ,cause:404})
    }
    return res.status(200).json({ message: " تم العثور علي اللوقو بنجاح",success:true, pixel });
};

//& =================== UPDATE PIXEL ============================= &//
export const updatePixel = async (req, res, next) => {
  const { row,col } = req.query;
  const { username, email, title, description, position, size } = req.body;
  const pixel = await Pixel.findOne({
    'position.x': Number(col) * 10,
    'position.y': Number(row) * 10,
    isVerified: true,
});
  if (!pixel) {
    return res.status(404).json({ message: "Pixel not found" });
  }
  if (req.file) {
    pixel.content = req.file.path.split("uploads/")[1];
  }
  if (username) pixel.username = username;
  if (email) pixel.email = email;
  if (title) pixel.title = title;
  if (description) pixel.description = description;
  if (position) {
    //check if the pixel is out of the grid
    pixel.position = JSON.parse(position);
    }
  if (size) pixel.size = JSON.parse(size);
  
  if (
    pixel.position.x + pixel.size.width > 1000 ||
    pixel.position.y + pixel.size.height > 1000
  ) {
    // delete the file
    if (req.file) {
        fs.unlinkSync(path.resolve("uploads", req.file.path.split("uploads/")[1]));
    }
    return res.status(400).json({ message: "موقع اللوقو خارج الشبكة" });
  }
  const updatedPixel = await pixel.save();
  if (!updatedPixel) {
    return res.status(400).json({ message: "Failed to update pixel" });
  }
  await generatePixelImage();
  return res.status(200).json({ message: "تم تحديث الشعار بنجاح", pixel,success:true });
};

//& =================== DELETE PIXEL ============================= &//
export const deletePixel = async (req, res, next) => {
  const { row, col } = req.query;
  const pixel = await Pixel.findOne({
    'position.x': Number(col) * 10,
    'position.y': Number(row) * 10,
    isVerified: true,
}).select("content");
  if (!pixel) {
    return res.status(404).json({ message: "Pixel not found" });
  }
  const deletedPixel = await Pixel.findByIdAndDelete(pixel._id);
  if (!deletedPixel) {
    return res.status(400).json({ message: "Failed to delete pixel" });
  }
  await generatePixelImage();
  fs.unlinkSync(path.resolve("uploads", pixel.content));
  // fs.unlinkSync(`/uploads/${pixel.content}`);
  
  return res.status(200).json({ message: "تم حذف الشعار بنجاح", pixel,success:true });
};
