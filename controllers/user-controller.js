const { User } = require('../models');

const msg = 'No user found with this id!';

const userController = {
    getUsers(req, res) {
        User.find({})
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },

    getUserById(req, res) {
        User.findOne({ _id: req.params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: msg })
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },

    createUser(req, res) {
        User.create(req.body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err))
    },

    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: msg })
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: msg })
                    return;
                }
                res.json(dbUserData);
            })
    },

    addFriend(req, res) {
        // Make sure user cannot friend self
        if (req.params.userId === req.params.friendId) {
            res.json({ message: 'Cannot friend self' });
            return;
        }

        // Ensure friend exists first
        User.findOneAndUpdate(
            { _id: req.params.friendId },
            { $addToSet: { friends: req.params.userId } },
            { new: true }
        )
            .then(friend => {
                if (!friend) {
                    res.status(404).json({ message: 'Friend not found!' });
                    return;
                }
                return User.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $addToSet: { friends: req.params.friendId } },
                    { new: true }
                )
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: msg });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    removeFriend(req, res) {
        // Update user's friend list first
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'Something went wrong' });
                    return;
                }

                // Update friend's friend list
                return User.findOneAndUpdate(
                    { _id: req.params.friendId },
                    { $pull: { friends: req.params.userId } },
                    { new: true }
                )
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'Something went wrong' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    }
}

module.exports = userController;