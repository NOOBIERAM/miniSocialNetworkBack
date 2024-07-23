const { Friend, User } = require('../models');
const { Op } = require("sequelize");

module.exports = {
    addFriend: async (req, res) => {
        try {
            const { userId, friendId } = req.body
            const [friendRequest, create] = await Friend.findOrCreate({
                where: { userId, friendId },
                defaults: { userId, friendId, status: 'pending' }
            })

            create ? res.status(201).json(friendRequest) : res.status(409).json({ message: 'User already added' })
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
                attributes:['id','userId','friendId'],
                include: [
                    // {
                    //     model: User,
                    //     as: 'Requester',
                    //     attributes:['name','firstname','image']
                    // }, perso 
                    {
                        model: User, as: 'Receiver',
                        attributes: ['name', 'firstname', 'image']
                    }
                    // amis
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
                    userId,
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
    },
    getSuggestFriends: async (req, res) => {
        try {
            const { userId } = req.params
            const friendList = await User.findAll({
                attributes: ['id', 'name', 'firstname', 'email', 'image'],
                include: [{
                    model: Friend,
                    as: 'friends',
                    // where: { userId:{[Op.ne]: userId}}
                    // where: { userId:{[Op.ne]: userId}}
                }]
            })
            const user = []
            for (x in friendList) {
                if (friendList[x].dataValues.friends.length == 0) user.push(friendList[x].dataValues)
                else if (friendList[x].dataValues.friends[0].dataValues.userId != userId) {
                    user.push(friendList[x].dataValues)
                }
                // else {
                //     console.log(friendList[x].dataValues.friends[0].dataValues.userId," == ",friendList[x].dataValues.friends[0].dataValues.status)

                // }

            }
            console.log(user);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}