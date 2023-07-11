const { Schema, model } = require("mongoose");

// User Schema
const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trimmed: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Must use a valid email address",
      ],
    },
    thoughts: [{ type: Schema.Types.ObjectId, ref: "Thought" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Virtual to count friends
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// User Model
const User = model("User", userSchema);

module.exports = User;
