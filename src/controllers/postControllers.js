const { Post, Friend, User } = require('../models');
module.exports = {

    addPost: async (req, res) => {
        try {
            const { userId, content } = req.body
            const image = req.file ? req.file.path : null;
            const post = await Post.create({ userId, content, image })
            res.status(201).json(post)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deletePost: async (req,res) =>{
        try {
            const {id} = req.params
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
    getAllPost: async (req,res) => {
        try {
            const post = await Post.findAll({
                where:{ userId : req.params.userId}
            });
            if (post) {
                res.status(200).json({post});
            }
            else {
                res.status(500).json({ error: 'Une Erreur c\'est produite' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getFriendPost: async (req, res) => {
        try {
            const {userId} = req.params
            const friends = await Friend.findAll({
                where:{ userId },
                attributes : ['id','userId'],
                include : [{
                    model : User,
                    attributes : ['id', 'name','firstname','email','image'],
                    as:'Receiver',
                    include:[{
                        model: Post,
                        attributes : ['id', 'content','image','createdAt'],
                        as:'posts'
                    }]
                }]
            })
            res.status(200).json({friends});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}