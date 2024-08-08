const { Friend, User, Message } = require('../models');
const { Op, where } = require("sequelize");
const { userTokenGenerator } = require('../utils/jwt.utils');

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
                    [Op.or]: [
                        { userId: userId }, { friendId: userId }
                    ],
                    status: 'accepted'
                },
                attributes: ['id', 'userId', 'friendId'],
                include: [
                    {
                        model: User,
                        as: 'Requester',
                        attributes: ['id', 'name', 'firstname', 'image'],
                    },
                    {
                        model: User, as: 'Receiver',
                        attributes: ['id', 'name', 'firstname', 'image'],
                    }
                ]
            });
            let friendAll = []
            for (x of friends) {
                if (x.Requester.id != userId) friendAll.push({
                    id: x.Requester.id,
                    name: x.Requester.name + ' ' + x.Requester.firstname,
                    splitedName: x.Requester.name[0] + x.Requester.firstname[0],
                    image: x.Requester.image,
                })
                if (x.Receiver.id != userId) friendAll.push({
                    id: x.Receiver.id,
                    name: x.Receiver.name + ' ' + x.Receiver.firstname,
                    splitedName: x.Receiver.name[0] + x.Receiver.firstname[0],
                    image: x.Receiver.image,
                })
            }
            res.status(200).json(friendAll);
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
                // attributes: ['id', 'userId'],
                include: [
                    {
                        model: User, as: 'Requester',
                        // attributes: ['id', 'name', 'firstname', 'image']
                    }
                ]
            });
            pending = []

            for (x of pendingRequests) pending.push({
                id: x.id,
                name: x.Requester.dataValues.name,
                firstname: x.Requester.dataValues.firstname,
                image: x.Requester.dataValues.image,
            })

            res.status(200).json(pending);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getSuggestFriends: async (req, res) => {
        try {
            const { userId } = req.params
            const userFriend = await Friend.findAll({
                where: {
                    [Op.and]:[
                        {[Op.or]: [
                            { userId: userId }, { friendId: userId }
                        ]},
                        {[Op.or]: [
                            { status: 'pending' }, { status: 'accepted' }
                        ]}
                    ]
                },
            })
            let friend = []
            for(let x of userFriend){
                friend.push(x.userId,x.friendId)
                friend.push(x.friendId)
            }
            if(friend.length == 0)friend.push(userId)
            const friendList = await User.findAll({
                attributes: ['id', 'name', 'firstname', 'email', 'image'],
                where:{
                    id :{[Op.notIn]: friend}
                }
            })
            res.status(200).json(friendList);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    getMessagesBetweenUsers: async (req, res) => {
        try {
            const { userId, friendId } = req.params; // Assumer que userId et friendId sont passés comme paramètres

            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        { senderId: userId, receiverId: friendId },
                        { senderId: friendId, receiverId: userId }
                    ]
                },
                attributes: ['content', 'senderId', 'receiverId', 'createdAt'],
                order: [['createdAt', 'ASC']] // Trier les messages par date de création, du plus ancien au plus récent
            });

            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getFollower: async (req, res) => {
        try {
            const { userId } = req.params;
            console.log(userId);
            console.log(userId);
            const { count } = await Friend.findAndCountAll({
                where: {
                    [Op.or]: [{ userId: userId }, { friendId: userId }],
                    status: 'accepted'
                },
            });
            res.status(200).json(count);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

 // for (x in friendList) {
            //     console.log(x.dataValues == undefined);
            //     if (x.dataValues == undefined) {
                   
            //         for(x of friendList){
            //             if (x.id != userId) {
            //                 user.push({
            //                     id : x.id,
            //                     name : x.name,
            //                     firstname : x.firstname,
            //                     image : x.image
            //                 })
            //             }
            //         }
            //         break;
            //     };
            //     if (friendList[x].dataValues.id != userId) {
            //         if (friendList[x].dataValues.friends.length != 0) {
            //             let friend = [];
            //             let notExist = false;
            //             for (y of friendList[x].dataValues.friends) {
            //                 friend.push(y.friendId)

            //                 if (y.friendId == userId && (y.status == 'pending' || y.status == 'accepted')) {
            //                     notExist = true;
            //                 }
            //             }
            //             if (friend.includes(userId)) {
            //                 user.push({
            //                     id: friendList[x].dataValues.id,
            //                     name: friendList[x].dataValues.name,
            //                     firstname: friendList[x].dataValues.firstname,
            //                     image: friendList[x].dataValues.image,
            //                 })
            //             }
            //         } else {
            //             user.push({
            //                 id: friendList[x].dataValues.id,
            //                 name: friendList[x].dataValues.name,
            //                 firstname: friendList[x].dataValues.firstname,
            //                 image: friendList[x].dataValues.image,
            //             })
            //         }
            //     }
            // }

            // const suggest = []
            // for (x in user) {
            //     fr = []
            //     for (y in userFriend) 
            //     {
            //         console.log(userFriend[y].dataValues.friendId);
            //         fr.push(userFriend[y].dataValues.friendId)
            //         fr.push(userFriend[y].dataValues.userId)
            //     }
            //     if (!fr.includes(user[x].id)) suggest.push(user[x])
            // }