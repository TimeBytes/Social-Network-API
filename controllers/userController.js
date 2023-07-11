const { User, Thought } = require("../models");

module.exports = {
  //get all users
  async getAllUsers(req, res) {
    try {
      const dbUserData = await User.find({})
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .select("-__v");
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  //create user
  async createUser({ body }, res) {
    try {
      const validateDuplicateEmail = await User.findOne({ email: body.email });
      if (validateDuplicateEmail) {
        return res.status(400).json({ msg: "Email already in use!" });
      }
      const validateDuplicateUsername = await User.findOne({
        username: body.username,
      });
      if (validateDuplicateUsername) {
        return res.status(400).json({ msg: "Username already in use!" });
      }
      const dbUserData = await User.create(body);
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  //get one user by id
  async getUserById({ params }, res) {
    try {
      const dbUserData = await User.findOne({ _id: params.id })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .select("-__v");
      //if no user is found, send 404
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },
  //update user by id
  async updateUser({ params, body }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.id },
        { $set: body },
        { new: true, runValidators: true }
      );
      //if no user is found, send 404
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },
  //delete user
  async deleteUser({ params }, res) {
    try {
      const user = await User.findOneAndDelete({ _id: params.id });
      if (!user) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: "User and associated thoughts deleted!" });
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  //add friend
  async addFriend({ params }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true, runValidators: true }
      );
      //if no user is found, send 404
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  //remove friend
  async removeFriend({ params }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true, runValidators: true }
      );
      //if no user is found, send 404
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },
};
