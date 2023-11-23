const {
  createMessage,
  getMany,
  MessageController,
} = require('../../controllers/message')
const { socketTryCatcher } = require('../../utils/controller')
const mongoose = require('mongoose')

const events = {
  new: 'new',
  update: 'update',
  getOne: 'getOne',
  getMany: 'getMany',
  messagesSeen: 'messagesSeen',
  messagesDelivered: 'messagesDelivered',
}

const newMessageHandler = socketTryCatcher(async (_io, socket, data = {}) => {
 
  let newMsgData = {
    ...data,
    sender: socket.user._id,
  }
  const newMsg = await createMessage(newMsgData)
  socket.emit(events.new, newMsg)
})


module.exports.messageEventHandlers = {
  [events.new]: newMessageHandler,
  [events.getOne]: socketTryCatcher(async (_io, socket, data = {}) => {
    socket.emit(
      events.getOne,
      await MessageController.getDoc({
        ...data,
        recipients: { $in: socket.user._id } 
      }),
    )
  }),
  [events.getMany]: socketTryCatcher(async (_io, socket, data = {}) => {
    socket.emit(
      events.getMany,
      await getMany({
        ...data,
        or: [
          { recipients: { $in: socket.user._id } },
        ],
      }),
    )
  }),
}
