import { Router } from "express";
import * as pixelController from "./pixel.controller.js";
import { multerMiddlewareLocal } from "../../middlewares/multer.js";
import { allowedExtension } from "../../utils/allowedExtension.js";
import { logoEndPointsRoles } from "../Logo/logo.endPoints.roles.js";
import { auth } from "../../middlewares/auth.middleware.js";
import expressAsyncHandler from "express-async-handler";
// import { auth } from "../../middlewares/auth.middleware.js";
// import { logoEndPointsRoles } from "./logo.endPoints.roles.js";
const pixelRouter = Router();

pixelRouter.post(
  "/addPixel",
  multerMiddlewareLocal({ extensions: allowedExtension.image }).single("image"),
  expressAsyncHandler(pixelController.addPixel)
);
//addWithoutPayment
pixelRouter.post(
  "/addPixelWithoutPayment",
  auth(logoEndPointsRoles.ADD_LOGO),
  multerMiddlewareLocal({ extensions: allowedExtension.image }).single("image"),
  expressAsyncHandler(pixelController.addPixelWithoutPayment)
);
pixelRouter.get("/getPixels", expressAsyncHandler(pixelController.getPixels));
pixelRouter.get("/generatePixelsImage", expressAsyncHandler(pixelController.generatePixelsImage));

pixelRouter.get("/getPixelByRowAndCol", expressAsyncHandler(pixelController.getPixelByRowAndCol));
pixelRouter.put("/updatePixel",  multerMiddlewareLocal({ extensions: allowedExtension.image }).single("image"),
expressAsyncHandler(pixelController.updatePixel));
pixelRouter.delete("/deletePixel", expressAsyncHandler(pixelController.deletePixel));

pixelRouter.post("/webhook", pixelController.verifyPayment);

export default pixelRouter;
