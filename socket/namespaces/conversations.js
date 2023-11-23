const {
  createConversation,
  getConversation,
  getUserConversations,
  getMultipleConversations,
} = require("../../controllers/conversation")
const { socketTryCatcher } = require("../../utils/controller")

const events = {
  new: "new",
  update: "update",
  getOne: "getOne",
  getMany: "getMany",
  deleteOne: "deleteOne",
}

module.exports.conversationEventHandlers = {
  [events.new]: socketTryCatcher(async (_io, socket) => {
    const data = {
      participants: [socket.user._id.toString()],
      title: "",
    }
    const newConversation = await createConversation(data)
    socket.emit(events.new, newConversation)
  }),
  [events.getOne]: socketTryCatcher(async (_io, socket, data = {}) => {
    const Conversation = await getConversation({
      conversationId: data.conversationId,
      userID: socket.user._id.toString(),
    })
    socket.emit(events.getOne, Conversation)
  }),
  [events.getMany]: socketTryCatcher(async (_io, socket, data = {}) => {
    const conversations = await getMultipleConversations({
      userId: socket.user._id.toString(),
      conversationId: data.conversationId,
      query: { page: data.page | 1, limit: data.limit | 100 },
    })
    socket.emit(events.getMany, conversations)
  }),
  [events.deleteOne]: socketTryCatcher(async (_io, socket, data = {}) => {
    const conversations = await getMultipleConversations({
      userId: socket.user._id.toString(),
      conversationId: data.conversationId,
    })
    socket.emit(events.deleteOne, conversations)
  }),
}
