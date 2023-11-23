const { conversationEventHandlers } = require('./conversations')
const { messageEventHandlers } = require('./messages')

const namespacesSrc = {
  conversations: '/conversations',
  messages: '/messages',
}

module.exports.namespacesEventsHandlers = {
  [namespacesSrc.conversations]: conversationEventHandlers,
  [namespacesSrc.messages]: messageEventHandlers,
}

module.exports.namespaces = Object.values(namespacesSrc)
