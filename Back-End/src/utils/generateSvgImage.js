import Pixel from "../../DB/models/pixel.model.js";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const generatePixelImage = async () => {
    try {
      // Fetch pixel data from the database
      const pixelData = await Pixel.find({ isVerified: true });
  
      let svgContent = `
              <svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
                  <!-- Define a pattern for the grid background -->
                  <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <rect width="10" height="10" fill="white" />
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="1" />
                      </pattern>
                  </defs>
  
                  <!-- Apply the grid background to a large rectangle -->
                  <rect width="1000" height="1000" fill="url(#grid)" />
          `;
  
      for (const pixel of pixelData) {
        const { x, y } = pixel.position;
        const { width, height } = pixel.size;
        const imagePath = path.resolve("uploads", pixel.content); // Local image path
        const title = pixel.title || "No Title"; // Pixel title for the tooltip
  
        if (fs.existsSync(imagePath)) {
          // Convert the image to Base64 for embedding in the SVG
          const base64Image = await sharp(imagePath)
            .resize(width, height) // Resize to the required dimensions
            .toBuffer()
            .then(
              (buffer) => `data:image/png;base64,${buffer.toString("base64")}`
            );
  
          const link = pixel.url;
  
          // Draw a solid white rectangle to mask the grid under each small image
          svgContent += `
                      <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="white" />
                  `;
  
          // Add the Base64-encoded image directly into the SVG
          svgContent += `
                      <g>
                      <a href="${link}" target="_blank">
                          <title>${title}</title>
                          <image x="${x}" y="${y}" width="${width}" height="${height}" href="${base64Image}" />
                       </a>
                      </g>
                  `;
        } else {
          console.warn(`Image not found at path: ${imagePath}`);
        }
      }
  
      // Close the SVG tag
      svgContent += `</svg>`;
  
      // Save the SVG file locally
      const outputPath = path.resolve("gridImage", "pixels_image.svg");
      fs.writeFileSync(outputPath, svgContent);
  
      return outputPath;
    } catch (error) {
      console.error("Error generating SVG:", error);
      throw new Error("Failed to generate SVG");
    }
  };

//&================= GENERATE TEMP IAMGE =================
export const generateTempPixelImage = async ({id}) => {
    try {
        const pixel = await Pixel.findById(id);
      // Fetch pixel data from the database
      const pixelData = await Pixel.find({ isVerified: true });
      pixelData.push(pixel);

      let svgContent = `
              <svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
                  <!-- Define a pattern for the grid background -->
                  <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <rect width="10" height="10" fill="white" />
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="1" />
                      </pattern>
                  </defs>
  
                  <!-- Apply the grid background to a large rectangle -->
                  <rect width="1000" height="1000" fill="url(#grid)" />
          `;
  
      for (const pixel of pixelData) {
        const { x, y } = pixel.position;
        const { width, height } = pixel.size;
        const imagePath = path.resolve("uploads", pixel.content); // Local image path
        const title = pixel.title || "No Title"; // Pixel title for the tooltip
  
        if (fs.existsSync(imagePath)) {
          // Convert the image to Base64 for embedding in the SVG
          const base64Image = await sharp(imagePath)
            .resize(width, height) // Resize to the required dimensions
            .toBuffer()
            .then(
              (buffer) => `data:image/png;base64,${buffer.toString("base64")}`
            );
  
          const link = pixel.url;
  
          // Draw a solid white rectangle to mask the grid under each small image
          svgContent += `
                      <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="white" />
                  `;
  
          // Add the Base64-encoded image directly into the SVG
          svgContent += `
                      <g>
                      <a href="${link}" target="_blank">
                          <title>${title}</title>
                          <image x="${x}" y="${y}" width="${width}" height="${height}" href="${base64Image}" />
                       </a>
                      </g>
                  `;
        } else {
          console.warn(`Image not found at path: ${imagePath}`);
        }
      }
  
      // Close the SVG tag
      svgContent += `</svg>`;
  
      // Save the SVG file locally
      const outputPath = path.resolve("gridImage", "pixels_temp_image.svg");
      fs.writeFileSync(outputPath, svgContent);
  
      return outputPath;
    } catch (error) {
      console.error("Error generating SVG:", error);
      throw new Error("Failed to generate SVG");
    }
  };