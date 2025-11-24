import bcrypt from "bcrypt";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    adminID: {
      type: String,
      required: true,
      unique: true,
      match: /^adm\d{4}$/, // Format: adm0001, adm0002, etc.
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email pattern
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      match: /^\+?\d{10,15}$/, // Supports + or plain digits
    },
    contactNumber: {
      type: String,
      match: /^\+?\d{10,15}$/, // Alias for compatibility
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "moderator", "principal"],
      default: "admin",
    },
    schoolName: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined values to not conflict
    },
    schoolID: {
      type: String,
      unique: true,
      sparse: true,
      match: /^sch_\d{3}[bgm]$/, // Format: sch_010m
    },
    schoolType: {
      type: String,
      enum: ["boys", "girls", "mixed"],
    },
    address: {
      type: String,
    },
    schoolEmail: {
      type: String,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    establishedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    permissions: {
      students: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },
      courses: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },
      sports: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },
      library: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },
      attendance: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },
      results: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },
      coaches: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash password before saving
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 🔐 Method to compare password during login
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check permissions
adminSchema.methods.hasPermission = function (resource, action) {
  if (this.role === "super_admin") return true;
  return this.permissions[resource]?.[action] || false;
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
