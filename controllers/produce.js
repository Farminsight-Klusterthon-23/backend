const Produce = require("../models/produce")
const { routeTryCatcher, QueryBuilder } = require("../utils/controller")
const { getFarmProduceInfo } = require("../OpenAI/index")

module.exports.createProduce = routeTryCatcher(async function (req, res, next) {
  const {
    name,
    description,
    category,
    averageTimeToMaturity,
    varietesResistantToDisease,
    majorDiseases,
    commonPests,
    soilPHLevels,
    recommendedSoil,
    soilDrainage,
    soilType,
    rainfallRequirement,
    recommendedTemperature,
    lifeCycle,
    regionsThatFavourGrowth,
    sunlightRequirement,
    durationOfGrowth,
    pestControl,
    specialNoteOnHarvest,
  } = req.body
  const produce = new Produce({
    name,
    description,
    category,
    user: req.user._id,
    averageTimeToMaturity,
    varietesResistantToDisease,
    majorDiseases,
    commonPests,
    soilPHLevels,
    recommendedSoil,
    soilDrainage,
    soilType,
    rainfallRequirement,
    recommendedTemperature,
    lifeCycle,
    regionsThatFavourGrowth,
    sunlightRequirement,
    durationOfGrowth,
    pestControl,
    specialNoteOnHarvest,
  })
  req.response = {
    produce: await produce.save(),
    message: "Data created successfully",
    status: 201,
  }
  next()
})

module.exports.updateProduce = routeTryCatcher(async function (req, res, next) {
  const {
    name,
    description,
    category,
    region,
    averageTimeToMaturity,
    varietesResistantToDisease,
    majorDiseases,
    commonPests,
    soilPHLevels,
    recommendedSoil,
    soilDrainage,
    soilType,
    rainfallRequirement,
    recommendedTemperature,
    lifeCycle,
    regionsThatFavourGrowth,
    sunlightRequirement,
    durationOfGrowth,
    pestControl,
    specialNoteOnHarvest,
  } = req.body
  const produce = await Produce.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    {
      name,
      description,
      category,
      region,
      averageTimeToMaturity,
      varietesResistantToDisease,
      majorDiseases,
      commonPests,
      soilPHLevels,
      recommendedSoil,
      soilDrainage,
      soilType,
      rainfallRequirement,
      recommendedTemperature,
      lifeCycle,
      regionsThatFavourGrowth,
      sunlightRequirement,
      durationOfGrowth,
      pestControl,
      specialNoteOnHarvest,
    },
    {
      new: true,
    }
  )
  req.response = {
    produce,
    message: "Data updated successfully",
    status: 201,
  }
  next()
})

module.exports.deleteProduce = routeTryCatcher(async function (req, res, next) {
  const produce = await Produce.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  })
  req.response = {
    produce,
    message: "Data deleted successfully",
    status: 204,
  }
  next()
})

module.exports.getSingleProduce = routeTryCatcher(async function (
  req,
  res,
  next
) {
  req.response = {
    produce: await Produce.findOne({ _id: req.params.id, user: req.user.id }),
    message: "Success",
    status: 200,
  }
  next()
})

module.exports.getMultipleProduce = routeTryCatcher(async function (
  req,
  res,
  next
) {
  req.query.user = req.user._id
  const ProduceQueryBuilder = new QueryBuilder(Produce, req.query)
  const produce = await ProduceQueryBuilder.find()
  req.response = {
    produce,
    totalCount: produce.length,
    page: req.query.page || 1,
    hasMore: produce.length === (req.query.limit || 100),
    message: "Success",
    status: 200,
  }
  next()
})

module.exports.generateInfoOnCrop = routeTryCatcher(async (req, res, next) => {
  if (req.params.crop?.length === 0) {
    req.response = {
      message: "Please provide a crop",
      status: 400,
    }
    return next()
  }
  const data = await getFarmProduceInfo(req.params.crop)
  console.log(typeof data)
  req.response = {
    data: JSON.parse(data),
    status: 200,
    message: "Success!",
  }
  return next()
})
