const { ObjectId } = require("mongodb");
const { User, Thought } = require("../models");

module.exports = {
  //get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },
  //get one thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((dbThoughtData) => {
        //if no thought is found, send 404
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },
  //create thought
  createThought({ body }, res) {
    Thought.create(body).then((dbThoughtData) => {});
  },
  //update thought by id
  async updateThought({ params, body }, res) {},
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
  addReaction({ params, body }, res) {},
  //delete reaction
  removeReaction({ params }, res) {},
};
