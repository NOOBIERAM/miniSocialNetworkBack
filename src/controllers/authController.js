const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const User = require('../models').User;

module.exports = {
    register: async (req, res) => {
        const { name, firstname, email, password } = req.body
        const photo = req.file ? req.file.path : null;
        
        console.log(password, photo, name, firstname, email);
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)
            const [user, create] = await User.findOrCreate({
                where: { email },
                defaults: { name, firstname, email, password: hashedPassword }
            })
            const token = jwtUtils.userTokenGenerator(user)
            create ? res.status(200).json({ message: 'Succes', Authorization: `Bearer ${token}` }) : res.status(409).json({ message: 'User already exist' }) 
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    login: async (req, res) => {

        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: "Utilisataeur n'existe pas" });
            }
            bcrypt.compare(password, user.password, (err, resBycrypt) => {
                if (err) return res.status(403).json(err)
                if (resBycrypt) {
                    return res.status(200).json({
                        'message': 'connected',
                        'Authorization': jwtUtils.userTokenGenerator(user)
                    })
                } else {
                    return res.status(403).json({ 'message': "Mots de passe incorrecte" })
                }
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}