const { Thought, User } = require('../models');

const msg = 'No thought found with this id!';

const thoughtController = {
    getThoughts(req, res) {
        Thought.find({})
            .then(dbData => res.json(dbData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },

    getThoughtById(req, res) {
        Thought.findById({ _id: req.params.id })
            .then(dbData => {
                if (!dbData) {
                    res.status(404).json({ message: msg })
                    return;
                }
                res.json(dbData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    createThought(req, res) {
        Thought.create(req.body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: msg });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        )
            .then(dbData => {
                if (!dbData) {
                    res.status(404).json({ message: msg });
                    return;
                }
                res.json(dbData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.id })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: msg });
                }
                return User.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $pull: { thoughts: deletedThought._id } },
                    { new: true }
                )
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            { new: true, runValidators: true }
        )
            .then(dbData => {
                if (!dbData) {
                    res.status(404).json({ message: msg });
                    return;
                }
                res.json(dbData)
            })
            .catch(err => res.json(err));
    },

    deleteReaction(req, res) {
        Thought.findByIdAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { _id: req.params.reactionId } } },
            { new: true, runValidators: true }
        )
            .then(dbData => res.json(dbData))
            .catch(err => res.json(err));
    }
}

module.exports = thoughtController;