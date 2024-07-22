const { Comment, User } = require('../models');
module.exports = {

    addComment: async (req, res) => {
        try {
            const { userId, postId, content } = req.body
            const coms = await Comment.create({ userId, postId, content })
            res.status(201).json(coms)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getComment: async(req,res) => {
        try {
            const { postId } = req.params
            const coms = await Comment.findAll({
                where: {postId},
                include:[{
                    model: User,
                    attributes:['id','name','firstname','image'],
                    as: 'author'
                }]
            })
            res.status(201).json(coms)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateComment : async(req, res) => {
        try {
            const coms = await Comment.findByPk(req.params.comsId)
            if(coms){
                coms.content = req.body.content;
                coms.save()
                res.status(200).json(coms)
            }
            else res.status(201).send("Commentaire n'existe pas")
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteComment : async (req, res) => {
        try {
            const coms = await Comment.findByPk(req.params.comsId)
            if(coms){
                coms.content = req.body.content;
                coms.destroy()
                res.status(200).json({message : "Comment deleted"})
            }
            else res.status(201).send("Commentaire n'existe plus")
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
}