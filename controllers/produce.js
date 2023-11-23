const Produce = require("../models/produce")
const { routeTryCatcher, QueryBuilder } = require("../utils/controller")

module.exports.createProduce = routeTryCatcher(async function (req, res, next) {
  const { name, description, category, region, longitude, latitude } = req.body
  const produce = new Produce({
    name,
    description,
    category,
    region,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    user: req.user._id,
  })
  req.response = {
    produce: await produce.save(),
    message: "Data created successfully",
    status: 201,
  }
  next()
})

module.exports.updateProduce = routeTryCatcher(async function (req, res, next) {
  const { name, description, category, region, longitude, latitude } = req.body
  const produce = await Produce.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    {
      name,
      description,
      category,
      region,
      [longitude && latitude && "location"]: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
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
    hasMore: produce.length === (req.query.limit || 100),
    message: "Success",
    status: 200,
  }
  next()
})
