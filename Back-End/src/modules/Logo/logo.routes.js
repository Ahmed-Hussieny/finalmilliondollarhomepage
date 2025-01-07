import { Router } from "express";
import * as logoController from "./logo.controller.js";
import { multerMiddlewareLocal } from "../../middlewares/multer.js";
import { allowedExtension } from "../../utils/allowedExtension.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { logoEndPointsRoles } from "./logo.endPoints.roles.js";
const logoRouter = Router();

logoRouter.post(
  "/addLogo",
  multerMiddlewareLocal({ extensions: allowedExtension.image }).single("image"),
  logoController.addLogo
);
logoRouter.post(
  "/addUnpaidLogo",
  auth(logoEndPointsRoles.ADD_LOGO),
  multerMiddlewareLocal({ extensions: allowedExtension.image }).single("image"),
  logoController.addUnpaidLogo
);
logoRouter.put(
  "/updateLogo/:id",
  auth(logoEndPointsRoles.UPDATE_LOGO),
  multerMiddlewareLocal({ extensions: allowedExtension.image }).single("image"),
  logoController.updateLogo
);
logoRouter.get("/getLogos", logoController.getLogos);
logoRouter.post("/webhook", logoController.verifyPayment);
logoRouter.delete("/deleteLogo/:id",auth(logoEndPointsRoles.DELETE_LOGO), logoController.deleteLogo);
export default logoRouter;
