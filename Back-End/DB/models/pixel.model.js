/**
 *  {
    "id": "pixel1",
    "position": { "x": 0, "y": 0 },
    "content": "../public/logo.jpeg",
    "size": { "width": 98, "height": 26 },
    "type": "image"
  },
 */

import mongoose, { model, Schema } from "mongoose";

  const pixelSchema = new Schema({
    title: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    description: { type: String, required: true },
    position: { type: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    }, required: true },
    content: { type: String, required: true },
    size: { type: {
        width: { type: Number, required: true },
        height: { type: Number, required: true }
    }, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true },
    isVerified: { type: Boolean, default: false }
  }, {
    timestamps: true
  });

const Pixel = mongoose.models.Pixel || model('Pixel', pixelSchema);
    
export default Pixel;