module.exports.routeTryCatcher = function (asyncRouteHandler) {
  return async function (req, res, next) {
    try {
      return await asyncRouteHandler(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

module.exports.sendResponse = function (req, res, next) {
  res.json(req.response || {}).status(req.response?.status || 500)
}

module.exports.QueryBuilder = class {
  constructor(Model, queryObj) {
    this.Model = Model
    this.queryObj = queryObj
    this.query = null
    this.page = null
    this.page = 1
    this.limit = 100
  }

  #filter() {
    const queryObj = { ...this.queryObj }
    const excludedFields = ["page", "sort", "limit", "fields"]
    excludedFields.forEach((el) => delete queryObj[el])
    let stringifiedQueryObj = JSON.stringify(queryObj)
    stringifiedQueryObj = stringifiedQueryObj.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    )
    this.query = this.Model.find(JSON.parse(stringifiedQueryObj))
    return this
  }

  #sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(",").join(" ")
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort("-createdAt")
    }
    return this
  }

  #limitFields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(",").join(" ")
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select("-__v")
    }
    return this
  }

  #paginate() {
    this.page = this.queryObj.page * 1 || this.page
    this.limit = this.queryObj.limit * 1 || this.limit
    const skip = (this.page - 1) * this.limit
    this.query = this.query.skip(skip).limit(this.limit)
    return this
  }

  async find() {
    return this.#filter().#sort().#limitFields().#paginate().query
  }
}

const handleDuplicateKeyError = (err) => {
  const key = Object.keys(err.keyValue)[0]
  const value = err.keyValue[key]
  const message = `Duplicate error: The ${key}, ${value} already exists.`
  return new Error(message)
}
const handleCastError = (err) => {
  const invalid = err.path
  const message = `Invalid value for ${invalid}`
  return new Error(message)
}
const handleTypeError = (err) => {
  const message = `Something went wrong!`
  return new Error(message)
}
const handleValidationError = (err) => {
  const message = Object.values(err.errors)
    .map((val) => val.message)
    .join(", ")
  return new Error(message)
}

module.exports.socketTryCatcher = (asyncFunc) => {
  return async function (io, socket, data) {
    try {
      return await asyncFunc(io, socket, data)
    } catch (err) {
      let error = err
      if (err.name === "ValidationError") error = handleValidationError(err)
      if (err.code === 11000) error = handleDuplicateKeyError(err)
      if (err.name === "CastError") error = handleCastError(err)
      if (err.name === "TypeError") error = handleTypeError(err)
      console.log(error, err)
      socket.emit("error", error.message)
    }
  }
}
