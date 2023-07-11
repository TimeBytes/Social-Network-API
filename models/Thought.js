const { Schema, model, Types } = require("mongoose");
const { DateTime } = require("luxon");

// Reaction Schema
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      // default value set to a new ObjectId
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // use getter to format date
      get: function (value) {
        return DateTime.fromJSDate(value).toFormat("LLL d',' yyyy 'at' hh:mma");
      },
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Thought Schema
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // use getter to format date
      get: function (value) {
        return DateTime.fromJSDate(value).toFormat("LLL d',' yyyy 'at' hh:mma");
      },
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Virtual to get total count of reactions
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// Create the Thought model using the Thought Schema
const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
