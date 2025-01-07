import mongoose, { model, Schema } from "mongoose";
import { systemRoles } from "../../src/utils/system-roles.js";

// & user schema
const userSchem = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(systemRoles),
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isloggedIn: {
      type: Boolean,
      default: false,
    },
    token:{
      type: String,
      unique: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || model("User", userSchem);

export default User;
