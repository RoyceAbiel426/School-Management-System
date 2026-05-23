import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "./src/models/Admin.js";
import { generateSchoolID } from "./src/utils/idGenerator.js";

dotenv.config();

const getNextAdminId = async () => {
  const lastAdmin = await Admin.findOne()
    .sort({ createdAt: -1 })
    .select("adminID")
    .lean();

  if (!lastAdmin?.adminID) {
    return "adm0001";
  }

  const match = lastAdmin.adminID.match(/^adm(\d{4})$/);
  if (!match) {
    throw new Error(
      `Cannot derive next adminID from existing value: ${lastAdmin.adminID}`,
    );
  }

  const nextNumber = Number.parseInt(match[1], 10) + 1;
  if (nextNumber > 9999) {
    throw new Error("Maximum admin limit reached (adm9999)");
  }

  return `adm${String(nextNumber).padStart(4, "0")}`;
};

const seedAdmin = async () => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error("MONGO_URL is missing in environment variables");
  }

  const sampleAdmin = {
    name: process.env.SAMPLE_ADMIN_NAME || "Sample Admin",
    email: process.env.SAMPLE_ADMIN_EMAIL || "admin@example.com",
    password: process.env.SAMPLE_ADMIN_PASSWORD || "Admin@12345",
    schoolName: process.env.SAMPLE_ADMIN_SCHOOL_NAME || "Sample School",
    schoolType: process.env.SAMPLE_ADMIN_SCHOOL_TYPE || "mixed",
    address: process.env.SAMPLE_ADMIN_ADDRESS || "Colombo",
    contactNumber: process.env.SAMPLE_ADMIN_CONTACT || "+94770000000",
    role: "principal",
    status: "active",
  };

  if (!["boys", "girls", "mixed"].includes(sampleAdmin.schoolType)) {
    throw new Error(
      "SAMPLE_ADMIN_SCHOOL_TYPE must be one of: boys, girls, mixed",
    );
  }

  await mongoose.connect(mongoUrl);

  const existingAdmin = await Admin.findOne({
    email: sampleAdmin.email,
  }).lean();
  if (existingAdmin) {
    console.log("Sample admin already exists. No new account created.");
    console.log(`Email: ${existingAdmin.email}`);
    console.log(`AdminID: ${existingAdmin.adminID}`);
    console.log(`SchoolID: ${existingAdmin.schoolID}`);
    return;
  }

  const adminID = await getNextAdminId();
  const schoolID = await generateSchoolID(sampleAdmin.schoolType);

  const admin = new Admin({
    adminID,
    schoolID,
    ...sampleAdmin,
  });

  await admin.save();

  console.log("Sample admin account created successfully.");
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${sampleAdmin.password}`);
  console.log(`AdminID: ${admin.adminID}`);
  console.log(`SchoolID: ${admin.schoolID}`);
};

seedAdmin()
  .catch((error) => {
    console.error("Failed to seed sample admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
