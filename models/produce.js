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
    category: {
      type: String,
      enum: [
        "cereal",
        "grain",
        "legume",
        "vegetable",
        "fruit",
        "nut",
        "oilseed",
        "latex",
        "sugar crop",
        "green manure",
        "root and tuber",
        "other",
      ],
      required: [true, "Please provide the category of your crop"],
    },
    description: {
      type: String,
      maxlength: 250,
      default: "",
    },
    averageTimeToMaturity: String,
    varietesResistantToDisease: [String],
    majorDiseases: [String],
    commonPests: [String],
    soilPHLevels: String,
    recommendedSoil: String,
    soilDrainage: String,
    soilType: String,
    rainfallRequirement: String,
    recommendedTemperature: String,
    lifeCycle: String,
    regionsThatFavourGrowth: [String],
    sunlightRequirement: String,
    durationOfGrowth: String,
    pestControl: String,
    specialNoteOnHarvest: String,
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
