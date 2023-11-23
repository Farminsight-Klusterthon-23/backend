const mongoose = require("mongoose")

const messaageAttachment = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
)

const messageModel = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
      required: [true, "A message must have a conversation id"],
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    isAI: {
      type: Boolean,
      default: true,
    },
    recipients: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
      ],
      validate: [
        function (val) {
          const setFromVal = new Set(val)
          return setFromVal.size === val.length && val.length <= 1
        },
        "Duplicate recipients or list too long",
      ],
    },
    attachments: {
      type: [messaageAttachment],
      validate: function (val) {
        return val.length <= 10
      },
    },
    text: {
      type: String,
      default: "",
      trim: true,
      collation: {
        locale: "en",
        strength: 2,
      },
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
)

const Message = mongoose.model("Message", messageModel)

Message.createIndexes({ title: "text" })

module.exports = Message
