const OpenAI = require("openai")

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
