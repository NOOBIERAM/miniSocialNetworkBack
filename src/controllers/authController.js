const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const {User} = require('../models');

module.exports = {
    register: async (req, res) => {
        const { name, firstname, email, password } = req.body
        const image = req.file ? `uploads/${req.file.filename}` : null;
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)
            const [user, create] = await User.findOrCreate({
                where: { email },
                defaults: { name, firstname, email, password: hashedPassword, image }
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
            console.log(password);
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: "Utilisataeur n'existe pas" });
            }

            const deHashPasssword = await bcrypt.compare(password,user.password)
            console.log("dehashed pass   "+deHashPasssword);
            if (deHashPasssword) 
                return res.status(200).json({
                    'message': 'Succes',
                    'Authorization': jwtUtils.userTokenGenerator(user)
                })
            
            else return res.status(403).json({ 'message': "Mots de passe incorrecte" })
                
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAbout: async (req,res) => {
        try {
            const id = req.params.id
            console.log(id);
            const user = await User.findOne({
                where : { id },
                attributes : ['name','firstname','image']
            })
            if(user) res.status(200).json({user})
                else res.status(404).json({message : 'User not found'})
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}