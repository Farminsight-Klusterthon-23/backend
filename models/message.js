const mongoose = require("mongoose")

const messaageAttachment = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
)

const messageModel = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
    },
    conversation: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
      required: [true, "A message must have a conversation id"],
    },
    conversationOwner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    attachments: {
      type: [messaageAttachment],
      validate: function (val) {
        return val.length <= 10
      },
    },
    content: {
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
