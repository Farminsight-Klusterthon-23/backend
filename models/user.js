const mongoose = require("mongoose")
const { hashValue } = require("../utils/security")
const CustomError = require("../utils/error")

const userSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: "",
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    firstName: {
      type: String,
      required: [true, "First name is required"],
      lowercase: true,
      trim: true,
      minlength: 4,
      maxlength: 15,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      lowercase: true,
      trim: true,
      minlength: 4,
      maxlength: 15,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: [
        (value) =>
          value.length > 0 && /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value),
        "Invalid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    origin: {
      state: String,
      country: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: [true, "Invalid location"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
        required: [true, "Invalid Coordinates"],
      },
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  }
)

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    if (
      this.password.includes(this.firstName) ||
      this.password.includes(this.lastName) ||
      this.password.includes(this.email)
    )
      return next(
        new CustomError(
          "Your password cannot contain your first name, last name or email"
        )
      )
    else this.password = hashValue(this.password)
  }
  next()
})

const User = mongoose.model("User", userSchema)

module.exports = User
