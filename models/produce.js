const mongoose = require("mongoose")

const produceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please specify the produce name"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please specify the produce owner"],
      ref: "User",
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
        required: [true, "Invalid location"],
      },
    },
    region: {
      type: String,
      required: [true, "Please provide the region of your crop"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "cereal / grain",
        "legume",
        "vegetable",
        "Fruit",
        "nut",
        "oilseed",
        "latex",
        "sugar crop",
        "green manure",
        "tuber",
      ],
      required: [true, "Please provide the category of your crop"],
    },
    description: {
      type: String,
      maxlength: 250,
      minlength: 30,
      default: "",
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

const Produce = mongoose.model("Produce", produceSchema)

module.exports = Produce
