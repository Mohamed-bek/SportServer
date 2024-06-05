import Medcin from "../model/MedcinModel.js";
import bcrypt from "bcrypt";
import Client from "../model/ClientModel.js";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import { parse, isValid } from "date-fns";

export const SingUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      birthday,
      gender,
      specialite,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !birthday ||
      !gender ||
      !specialite
    ) {
      throw new Error("All Information is required");
    }

    const parsedBirthday = parse(birthday, "dd/MM/yyyy", new Date());
    if (!isValid(parsedBirthday)) {
      throw new Error("Invalid date format. Use DD/MM/YYYY");
    }

    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(password, salt);

    const medcin = await Medcin.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hash,
      birthday: parsedBirthday,
      gender,
      specialite,
    });

    if (!medcin) {
      throw new Error("Medcin not created");
    }

    res.status(200).json({ user: medcin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// export const SingUp = async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       password,
//       birthday,
//       gender,
//       specialite,
//     } = req.body;
//     if (
//       !firstName ||
//       !lastName ||
//       !email ||
//       !phoneNumber ||
//       !password ||
//       !birthday ||
//       !gender ||
//       !specialite
//     ) {
//       throw new Error("All Information is required");
//     }

//     const salt = await bcrypt.genSalt(8);
//     const hash = await bcrypt.hash(password, salt);

//     const medcin = await Medcin.create({
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       password: hash,
//       birthday,
//       gender,
//       specialite,
//     });

//     if (!medcin) {
//       throw new Error("medcin not created");
//     }

//     res.status(200).json({ user: medcin });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

export const LogIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("All Information is required");
    }
    const medcin = await Medcin.findOne({ email });
    if (!medcin) {
      throw new Error("Email does not exist");
    }
    if (!(await bcrypt.compare(password, medcin.password))) {
      throw new Error("Password is incorrect");
    }
    res.status(200).json({ user: medcin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const AddReqForPrograme = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      weight,
      height,
      birthday,
      gender,
      healthProblems,
      doctorId,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !weight ||
      !height ||
      !birthday ||
      !gender ||
      !healthProblems ||
      !doctorId
    ) {
      throw new Error("All Fields Are Required");
    }
    const medcin = await Medcin.findById(doctorId);
    if (!medcin) throw new Error("The Doctor is Not Found");

    const parsedBirthday = parse(birthday, "dd/MM/yyyy", new Date());
    if (isNaN(parsedBirthday)) {
      throw new Error("Invalid date format. Please use 'dd/MM/yyyy'.");
    }
    const client = await Client.create({
      firstName,
      lastName,
      weight,
      height,
      birthday: parsedBirthday, // Use the parsed date
      gender,
      healthProblems,
      doctorId: new mongoose.Types.ObjectId(doctorId),
    });
    if (!client) throw new Error("The Request is Not Made");
    res.status(200).json({ client, key: client._id });
  } catch (error) {
    console.error("Error in AddReqForPrograme:", error);
    res.status(400).json({ error: error.message });
  }
};
export const GetProgrameRequest = async (req, res) => {
  try {
    const { id } = req.query;
    const medcin = await Medcin.findById(id);
    if (!medcin) throw new Error("The Doctor is Not Found");
    if (medcin.role !== "admin") throw new Error("You Cant get This Content");
    const programes = await Client.find();
    res.status(200).json({ programes });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const DeleteForRequestPrograme = async (req, res) => {
  try {
    const { id, programeId } = req.query;
    const medcin = await Medcin.findById(id);
    if (!medcin) throw new Error("The Doctor is Not Found");
    if (medcin.role !== "admin") throw new Error("You Cant get This Content");
    await Client.findByIdAndDelete(programeId);
    res.status(200).json({});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const __dirname = path.resolve();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "uploads")); // Use an absolute path here
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// export const upload = multer({ storage: storage });

// export const UploadPdf = async (req, res) => {
//   try {
//     console.log("problem ");
//     const { id } = req.body;
//     const youtubeLinks = JSON.parse(req.body.youtubeLinks);
//     const pdfFile = req.file ? req.file.path : null;
//     console.log(id);
//     console.log(youtubeLinks);
//     const checkClient = await Client.findById(id);
//     if (!checkClient) throw new Error("Couldn't find the Programe");
//     if (checkClient.isDone) throw new Error("The Programe has been done");
//     await Client.findByIdAndUpdate(id, { youtubeLinks, pdfFile, isDone: true });
//     res.status(200).json({ checkClient, youtubeLinks });
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// };

const __dirname = path.resolve();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // Use an absolute path here
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage: storage });

export const UploadPdf = async (req, res) => {
  try {
    console.log("problem ");
    const { id } = req.body;
    const youtubeLinks = JSON.parse(req.body.youtubeLinks);
    const pdfFile = req.file ? path.relative(__dirname, req.file.path) : null; // Get the relative path
    console.log(id);
    console.log(youtubeLinks);
    console.log(pdfFile); // Log the relative path
    const checkClient = await Client.findById(id);
    if (!checkClient) throw new Error("Couldn't find the Programe");
    if (checkClient.isDone) throw new Error("The Programe has been done");
    await Client.findByIdAndUpdate(id, { youtubeLinks, pdfFile, isDone: true });
    res.status(200).json({ checkClient, youtubeLinks });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
export const getDoctors = async (req, res) => {
  try {
    const oldDoctors = await Medcin.find({ isActive: true, role: "doctor" });
    const newDoctors = await Medcin.find({ isActive: false, role: "doctor" });
    res.status(200).json({ oldDoctors, newDoctors });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const activateDoctor = async (req, res) => {
  try {
    const doctor = await Medcin.findById(req.params.id);
    if (!doctor) {
      throw new Error("No doctor");
    }
    if (doctor.isActive) {
      throw new Error("doctor is Active Already");
    }
    doctor.isActive = true;
    await doctor.save();
    res.status(200).json({});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Medcin.findByIdAndDelete(req.params.id);
    if (!doctor) {
      throw new Error("No doctor");
    }
    res.status(200).json({});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getMyClients = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid doctor ID" });
  }
  try {
    const clients = await Client.find({
      doctorId: new mongoose.Types.ObjectId(id),
    });
    res.status(200).json({ clients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getMyPrograme = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid doctor ID" });
  }
  try {
    const programe = await Client.findById(id);
    res.status(200).json({ programe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
