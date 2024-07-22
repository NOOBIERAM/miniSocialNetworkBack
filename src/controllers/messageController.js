const { Message } = require('../models');
module.exports = {
    createMessage: async (req, res) => {
        try {
            const { content, senderId, receiverId } = req.body
            const message = await Message.create({
                content, senderId, receiverId
            })
            res.status(200).json({ 'info': 'message stored', message })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getMessage: async (req, res) => {
        try {
            const { senderId, receiverId } = req.body
            const message = await Message.findAll({
                // attributes: ['UserId', 'msg', 'room'],
                where: { senderId, receiverId }
            })
            res.status(200).json({message})
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}