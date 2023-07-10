const { ObjectId } = require("mongodb");
const { User, Thought } = require("../models");

module.exports = {
  //get all thoughts
  async getAllThoughts(req, res) {
    try {
      const dbThoughtData = await Thought.find({})
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v");
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  //create thought
  async createThought({ body }, res) {
    try {
      const dbThoughtData = await Thought.create(body);
      //find user and push thought id to user's thoughts array
      const dbUserData = await User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );
      //if no user is found, send 404
      if (!dbUserData) {
        res.status(404).json({
          message: "No user found with this id!",
        });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  //get one thought by id
  async getThoughtById({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOne({
        _id: params.id,
      }).populate("reactions");
      //if no thought is found, send 404
      if (!dbThoughtData) {
        res.status(404).json({
          message: "No thought found with this id!",
        });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },
  //update thought by id
  async updateThought({ params, body }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        {
          _id: params.id,
        },
        body,
        {
          new: true,
          runValidators: true,
        }
      );
      //if no thought is found, send 404
      if (!dbThoughtData) {
        res.status(404).json({
          message: "No thought found with this id!",
        });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  //delete thought
  async deleteThought({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndDelete({
        _id: params.id,
      });
      //if no thought is found, send 404
      if (!dbThoughtData) {
        res.status(404).json({
          message: "No thought found with this id!",
        });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  //add reaction
  async addReaction({ params, body }, res) {
    try {
      console.log("helloworld");
      const dbThoughtData = await Thought.findOneAndUpdate(
        {
          _id: params.thoughtId,
        },
        {
          $push: {
            reactions: body,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      //if no thought is found, send 404
      if (!dbThoughtData) {
        res.status(404).json({
          message: "No thought found with this id!",
        });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  //delete reaction
  async removeReaction({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        {
          _id: params.thoughtId,
        },
        {
          $pull: {
            reactions: {
              reactionId: params.reactionId,
            },
          },
        },
        {
          new: true,
        }
      );
      //if no thought is found, send 404
      if (!dbThoughtData) {
        res.status(404).json({
          message: "No thought found with this id!",
        });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },
};
