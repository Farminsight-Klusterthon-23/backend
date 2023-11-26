const OpenAI = require("openai")
require("dotenv").config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

module.exports.systemMessage = {
  role: "system",
  content:
    "You are a Agricultural farming assistant with very vast knowledge on farming eager to help. All output should be in JSON format.",
}

const model = "gpt-3.5-turbo-1106"

module.exports.getCompletion = async function (
  messages = [module.exports.systemMessage],
  format = "text"
) {
  const completion = await openai.chat.completions.create({
    messages: messages,
    model,
    response_format: {
      type: format,
    },
  })
  return await completion.choices[0].message.content
}

module.exports.getFarmProduceInfo = async function (crop = "") {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output JSON",
      },
      {
        role: "user",
        content: `Provide JSON response with the following structure on information about this crop "${crop}". The returned JSON should be an object containing all the properties specified":
        {
            name: name of crop,
            recommendedTemperature,
            rainfallRequirement: format like so:  "Well-distributed, with an optimum range of {rainfall range} per year.",
            soilDrainage,
            soilType,
            commonPests,
            soilPHLevels,
            majorDiseases,
            varietesResistantToDisease,
            sunlightRequirement,
            lifeCycle: in the format: {crop} is a eg: biennial, annual, etc plant
            regionsThatFavourGrowth,
            description: max length is 250 charachters,
            averageTimeToMaturity,
            durationOfGrowth,
            pestControl,
            specialNoteOnHarvest,
            category: enum = ["cereal",
        "grain",
        "legume",
        "vegetable",
        "fruit",
        "nut",
        "oilseed",
        "latex",
        "sugar crop",
        "green manure",
        "root and tuber", "other"]
        }`,
      },
    ],
    model,
    response_format: {
      type: "json_object",
    },
  })
  return await completion.choices[0].message.content
}
