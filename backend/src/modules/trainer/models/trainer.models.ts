import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ITrainer extends Document {
  userId: mongoose.Types.ObjectId; // reference to the User model
  specialization: string;
  yearsOfExperience: number;
  about: string;
  certifications: string[];
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  approvedBy?: mongoose.Types.ObjectId; // reference admin
  approvedAt?: Date;
  createdAt: Date;
  updateAt: Date;
}

const trainerSchema = new Schema<ITrainer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // populate  based on reference
      required: [true, "User ID is required"],
      unique: true, // a user can only have on trainer profile
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: [0, "Experience cannot be negative"],
    },
    about: {
      type: String,
      required: [true, "About section is required"],
      trim: true,
      maxLength: [1000, "About section cannot exceed 1000 characters"],
    },
    certifications: {
      type: [String],
      required: [true, "At least one certification is required"],
      validate: {
        validator: (v: number[]) => v.length > 0,
        message: "Certifications arrays cannot be empty",
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: undefined,
    },
    approvedBy: {
      type: Schema.Types.ObjectId, // reference
      ref: "User", // populate the data
      default: "undefined",
    },
    approvedAt: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        return ret;
      },
    },
  },
);

const Trainer: Model<ITrainer> = mongoose.model<ITrainer>(
  "Trainer",
  trainerSchema,
);

export default Trainer;
