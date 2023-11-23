const Conversation = require("../models/conversation")
const { QueryBuilder } = require("../utils/controller")

module.exports.createConversation = async function (data) {
  const { participants, title } = data
  const conversation = new Conversation({
    participants,
    title,
  })
  return await conversation.save()
}

module.exports.deleteConversation = async function (data) {
  const { conversationId, userId } = data
  const conversation = await Conversation.findOneAndDelete({
    _id: conversationId,
    participants: { $in: userId },
  })
  return conversation
}

module.exports.getConversation = async function (data) {
  const { conversationId, userId } = data
  return await Conversation.findOne({
    _id: conversationId,
    participants: { $in: userId },
  })
}

module.exports.getMultipleConversations = async function (data) {
  let { conversationId, userId, query = {} } = data
  query = { ...query, _id: conversationId, participants: { $in: userId } }
  const ConversationQueryBuilder = new QueryBuilder(Conversation, query)
  return await ConversationQueryBuilder.find()
}
