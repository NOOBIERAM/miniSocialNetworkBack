const { Message } = require('../models');
const { Op } = require("sequelize");
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
            const { senderId, receiverId } = req.params
            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        { senderId: senderId, receiverId: receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ]
                },
                attributes: ['content', 'senderId', 'receiverId', 'createdAt'],
                order: [['createdAt', 'ASC']] // Trier les messages par date de création, du plus ancien au plus récent
            });
            res.status(200).json(messages)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}