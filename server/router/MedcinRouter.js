import { Router } from "express";
import {
  SingUp,
  LogIn,
  GetProgrameRequest,
  AddReqForPrograme,
  DeleteForRequestPrograme,
  upload,
  UploadPdf,
  getDoctors,
  activateDoctor,
  deleteDoctor,
  getMyClients,
  getMyPrograme,
} from "../controller/MedcinController.js";

const MedcinRouter = Router();

MedcinRouter.post("/signup", SingUp);
MedcinRouter.post("/login", LogIn);
MedcinRouter.post("/request-programe", AddReqForPrograme);
MedcinRouter.get("/programe-requests", GetProgrameRequest);
MedcinRouter.delete("/programe-requests", DeleteForRequestPrograme);
MedcinRouter.post("/upload", upload.single("pdfFile"), UploadPdf);
MedcinRouter.get("/doctors", getDoctors);
MedcinRouter.get("/clients/:id", getMyClients);
MedcinRouter.get("/myPrograme/:id", getMyPrograme);
MedcinRouter.put("/doctors/:id", activateDoctor);
MedcinRouter.delete("/doctors/:id", deleteDoctor);

export default MedcinRouter;
