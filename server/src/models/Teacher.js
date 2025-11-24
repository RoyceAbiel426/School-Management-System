import bcrypt from "bcrypt";
import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    teacherID: {
      type: String,
      required: true,
      unique: true,
      match: /^te\d{3}[bgm]\d{4}$/, // Format: te010m1102
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
    },
    nic: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Teacher",
    },
    school: {
      type: String,
      required: true,
      match: /^sch_\d{3}[bgm]$/, // Format: sch_010m
    },
    teachSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Mapping Subject to Course
    },
    teachSclass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassGroup", // Mapping sclass to ClassGroup
    },
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        presentCount: {
          type: String,
        },
        absentCount: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
teacherSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
teacherSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
