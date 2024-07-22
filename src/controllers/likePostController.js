const { LikePost } = require('../models');
module.exports = {
    addLike: async (req, res) => {
        try {
            const { postId,userId } = req.body
            const [liked, create] = await LikePost.findOrCreate({
                where: { postId,userId },
                defaults: { postId,userId }
            })
            if(create) res.status(200).json({ liked })
            else{
                await liked.destroy()
                res.status(200).json({message: 'unliked'})
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getCountLike: async (req, res) => {
        try {
            const likeAmount = await LikePost.count()
            res.status(200).json({ likeAmount })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    isLiked: async (req, res) => {
        try {
            const { postId,userId } = req.body
            const isLiked = await LikePost.findOne({
                where: {
                    postId,userId
                }
            }) ? true : false
            res.status(200).json({isLiked})
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}