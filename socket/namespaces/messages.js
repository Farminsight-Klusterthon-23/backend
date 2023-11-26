const {
  createMessage,
  getMultipleMessages,
  deleteMessage,
  getMessage,
} = require("../../controllers/message")
const { socketTryCatcher } = require("../../utils/controller")
const { getCompletion } = require("../../OpenAI/index.js")

const events = {
  new: "new",
  getOne: "getOne",
  getMany: "getMany",
  deleteOne: "deleteOne",
  question: "question",
}

const newMessageHandler = socketTryCatcher(async (_io, socket, data = {}) => {
  const { content, conversation } = data
  const userId = socket.user._id.toString()
  const previousMsgs = await getMultipleMessages({
    conversation,
    userId,
    query: { sort: "-createdAt", limit: 100 },
  })
  const messages = previousMsgs.map(({ role, content }) => ({ role, content }))

  const aiReply = await getCompletion(messages, "json_object")

  const userMsg = await createMessage({
    conversation,
    conversationOwner: userId,
    role: "user",
    content,
  })

  const aiMessage = await createMessage({
    conversation,
    conversationOwner: userId,
    role: "assistant",
    content: JSON.stringify(aiReply),
  })
  socket.emit(events.new, [userMsg, aiMessage])
})

const deleteMessageHandler = socketTryCatcher(
  async (_io, socket, data = {}) => {
    const deletedMessage = await deleteMessage({
      messageId: data.messageId,
      userId: socket.user._id.toString(),
    })
    socket.emit(events.new, newMsg)
  }
)

const questionEventHandler = socketTryCatcher(
  async (_io, socket, data = {}) => {
    const { question } = data
    const answer = await getCompletion([
      {
        role: "user",
        content: `${question}`,
      },
    ])
    socket.emit(events.question, { question, answer })
  }
)

const getMessageHandler = socketTryCatcher(async (_io, socket, data = {}) => {
  socket.emit(
    events.getOne,
    await getMessage({
      messageId: data.messageId,
      userId: socket.user._id.toString(),
    })
  )
})

const getMultipleMessagesHandler = socketTryCatcher(
  async (_io, socket, data = {}) => {
    socket.emit(
      events.getMany,
      await getMultipleMessages({
        conversation: data.conversation,
        userId: socket.user._id.toString(),
        query: {
          page: data.page || 1,
          limit: data.limit || 100,
        },
      })
    )
  }
)

module.exports.messageEventHandlers = {
  [events.new]: newMessageHandler,
  [events.deleteOne]: deleteMessageHandler,
  [events.getOne]: getMessageHandler,
  [events.getMany]: getMultipleMessagesHandler,
  [events.question]: questionEventHandler,
}
