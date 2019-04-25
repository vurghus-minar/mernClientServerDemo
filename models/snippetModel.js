const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SnippetSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    name: {
      type: String
    },
    avatar: {
      type: String
    },
    title: {
      type: String,
      required: true
    },
    prefix: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "users"
        }
      }
    ],
    dislikes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "users"
        }
      }
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "users"
        },
        name: {
          type: String
        },
        avatar: {
          type: String
        },
        comment: {
          type: String,
          required: true
        },
        date: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Snippet = mongoose.model("snippet", SnippetSchema);

module.exports = Snippet;
