const {
  createMessage,
  getMultipleMessages,
  deleteMessage,
  getMessage,
} = require("../../controllers/message")
const { socketTryCatcher } = require("../../utils/controller")
const mongoose = require("mongoose")

const events = {
  new: "new",
  getOne: "getOne",
  getMany: "getMany",
  deleteOne: "deleteOne",
}

const newMessageHandler = socketTryCatcher(async (_io, socket, data = {}) => {
  let newMsgData = ({
    conversation,
    sender,
    isAI,
    recipients,
    attachments,
    text,
  } = data)
  const newMsg = await createMessage({
    conversation,
    sender,
    isAI,
    recipients,
    attachments,
    text,
  })
  socket.emit(events.new, newMsg)
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
}
