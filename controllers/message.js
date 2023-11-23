const Message = require("../models/message")
const { QueryBuilder } = require("../utils/controller")

module.exports.createMessage = async function (data) {
  let { conversation, sender, isAI, recipients, attachments, text } = data
  const message = new Message({
    conversation,
    sender,
    isAI,
    recipients,
    attachments,
    text,
  })
  return await message.save()
}

module.exports.deleteMessage = async function (data) {
  const { messageId, userId } = data
  const message = await Message.findOneAndDelete({
    _id: messageId,
    recipients: { $in: userId },
  })
  return message
}

module.exports.getMessage = async function (data) {
  const { messageId, userId } = data
  return await Message.findOne({
    _id: messageId,
    recipients: { $in: userId },
  })
}

module.exports.getMultipleMessages = async function (data) {
  let { conversation, userId, query = {} } = data
  query = {
    ...query,
    conversation,
    recipients: { $in: userId },
  }
  const MessageQueryBuilder = new QueryBuilder(Message, query)
  return await MessageQueryBuilder.find()
}
