const {
  createConversation,
  getConversation,
  updateConversation,
  getUserConversations,
} = require("../../controllers/conversation")
const { socketTryCatcher } = require("../../utils/controller")

const events = {
  new: "new",
  update: "update", 
  getOne: "getOne",
  getMany: "getMany",
}

module.exports.conversationEventHandlers = {
  [events.new]: socketTryCatcher(async (_io, socket, data = {}) => {
    const query = {
      creator: socket.user._id,
      participants: [...new Set([socket.user._id.toString()])],
    }
    const newConversation = await createConversation(query)
    socket.emit(events.new, newConversation)
  }),
  [events.getOne]: socketTryCatcher(async (_io, socket, data = {}) => {
    const Conversation = await getConversation({
      _id: data.conversationId,
      participants: { $in: socket.user._id },
    })
    socket.emit(events.getOne, Conversation)
  }),
  [events.update]: socketTryCatcher(async (_io, socket, data = {}) => {
    const { query = {}, update } = data
    const updConversation = await updateConversation(
      { ...query, participants: { $in: socket.user._id } },
      update
    )
    socket.emit(events.update, updConversation)
  }),
  [events.getMany]: socketTryCatcher(async (_io, socket, data = {}) => {
    const conversations = await getUserConversations({
      userId: socket.user._id.toString(),
      page: data.page | 1,
      limit: data.limit | 100,
    })
    socket.emit(events.getMany, conversations)
  }),
}
