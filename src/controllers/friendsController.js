const { Friend, User } = require('../models');

module.exports = {
    addFriend: async (req, res) => {
        try {
            const { userId, friendId } = req.body
            const friendRequest = await Friend.create({
                userId, friendId,
                status: 'pending'
            })
            res.status(201).json(friendRequest);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    accetptFriend: async (req, res) => {
        try {
            const { id } = req.params
            const friendRequest = await Friend.findByPk(id);
            if (friendRequest) {
                friendRequest.status = 'accepted'
                await friendRequest.save();
                res.status(200).json(friendRequest);
            }
            else {
                res.status(404).json({ error: 'Friend request not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteFriend: async (req, res) => {
        try {
            const { id } = req.params
            const friendRequest = await Friend.findByPk(id);
            if (friendRequest) {
                await friendRequest.destroy();
                res.status(204).send('deleted');
            }
            else {
                res.status(404).json({ error: 'Friend request not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAccetptedFriends: async (req, res) => {
        try {
            const { userId } = req.params;
            const friends = await Friend.findAll({
                where: {
                    userId,
                    status: 'accepted'
                },
                include: [
                    { model: User, as: 'Requester' },
                    { model: User, as: 'Receiver' }
                ]
            });
            res.status(200).json(friends);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getPendingFriend: async (req, res) => {
        try {
            const { userId } = req.params;
            const pendingRequests = await Friend.findAll({
                where: {
                    friendId: userId,
                    status: 'pending'
                },
                include: [
                    { model: User, as: 'Requester' }
                ]
            });
            res.status(200).json(pendingRequests);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}