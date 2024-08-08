const { Post, Friend, User, LikePost, sequelize } = require('../models');
const { Op, where } = require("sequelize");

module.exports = {

    addPost: async (req, res) => {
        try {
            const { userId } = req.body
            const content = req.body.content ? req.body.content : ''
            const image = (req.file != null) || (req.file != undefined)   ? `uploads/${req.file.filename}` : null;
            console.log(content);
            console.log(req.file);
            const post = await Post.create({ userId, content, image })
            res.status(201).json(post)
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    },
    deletePost: async (req, res) => {
        try {
            const { id } = req.params
            const post = await Post.findByPk(id);
            if (post) {
                await post.destroy();
                res.status(204).send('deleted');
            }
            else {
                res.status(500).json({ error: 'Une Erreur c\'est produite' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAllPost: async (req, res) => {
        try {
            const post = await Post.findAll({
                where: { userId: req.params.userId },
                include: [{
                    model: LikePost,
                    as: 'likePost'
                }]
            });
            // const like = await LikePost.count({
            //     where:{ postId :15}
            // })
            let allPost = []
            for (x of post) {
                // const user = await LikePost.findAll({
                //     where:{postId:17}
                // })

                let userLiked = []

                for (y of x.likePost) userLiked.push(y.userId)


                allPost.push({
                    id: x.id,
                    userId: x.userId,
                    content: x.content,
                    image: x.image,
                    like: x.likePost.length,
                    userLiked: userLiked
                })
            }

            res.status(200).json(allPost);

            // LikePost.count()
            // console.log(post);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getFriendPost: async (req, res) => {
        try {
            const { userId } = req.params
            const friendList = await Friend.findAll({
                where: {
                    [Op.or]: [{ userId: userId }, { friendId: userId }],
                },
                attributes: ['id'],
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'firstname', 'email', 'image'],
                    as: 'Requester',
                    include: [{
                        model: Post,
                        attributes: ['id', 'content', 'image', 'createdAt'],
                        as: 'posts',
                        // limit: 1,
                        order: sequelize.random(),
                        include: [{
                            model: LikePost,
                            as: 'likePost'
                        }]
                    }],
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'firstname', 'email', 'image'],
                    as: 'Receiver',
                    include: [{
                        model: Post,
                        attributes: ['id', 'content', 'image', 'createdAt'],
                        as: 'posts',
                        // limit: 1,
                        order: sequelize.random(),
                        include: [{
                            model: LikePost,
                            as: 'likePost'
                        }]
                    }],
                }],

            })
            const post = []
            for (x in friendList) {
                if (friendList[x].dataValues.Requester.posts.length != 0 && friendList[x].dataValues.Requester.id != userId) {
                    let userLiked = []
                    for (y of friendList[x].dataValues.Requester.posts[0].likePost) userLiked.push(y.userId)
                    post.push({

                        id: friendList[x].dataValues.Requester.posts[0].id,
                        name: friendList[x].dataValues.Requester.name + ' ' + friendList[x].dataValues.Requester.firstname,
                        splitedName: friendList[x].dataValues.Requester.name[0] + friendList[x].dataValues.Requester.firstname[0],
                        content: friendList[x].dataValues.Requester.posts[0].content,
                        postImage: friendList[x].dataValues.Requester.posts[0].image,
                        like: friendList[x].dataValues.Requester.posts[0].likePost.length,
                        userLiked: userLiked.includes(parseInt(userId))
                    })
                }
                if (friendList[x].dataValues.Receiver.posts.length != 0 && friendList[x].dataValues.Receiver.id != userId) {
                    let userLiked = []
                    for (y of friendList[x].dataValues.Receiver.posts[0].likePost) userLiked.push(y.userId)
                    post.push({
                        id: friendList[x].dataValues.Receiver.posts[0].id,
                        name: friendList[x].dataValues.Receiver.name + ' ' + friendList[x].dataValues.Receiver.firstname,
                        splitedName: friendList[x].dataValues.Receiver.name[0] + friendList[x].dataValues.Receiver.firstname[0],
                        content: friendList[x].dataValues.Receiver.posts[0].content,
                        postImage: friendList[x].dataValues.Receiver.posts[0].image,
                        like: friendList[x].dataValues.Receiver.posts[0].likePost.length,
                        userLiked: userLiked.includes(parseInt(userId))
                    })
                }
            }
            res.status(200).json(post);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getPostCount: async (req, res) => {
        try {
            const { count } = await Post.findAndCountAll({
                where: { userId: req.params.userId }
            });
            res.status(200).json(count);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}