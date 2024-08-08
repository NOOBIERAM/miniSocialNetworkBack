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
                defaults: { name, firstname, email, password: hashedPassword, image },
                attributes:['name', 'firstname', 'email']
            })
            // const token = jwtUtils.userTokenGenerator(user)
            // create ? res.status(200).json({ message: 'Succes', Authorization: `Bearer ${token}` }) : res.status(409).json({ message: 'User already exist' })
            create ? res.status(200).json( user ) : res.status(409).json({ message: 'User already exist' }) 
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    login: async (req, res) => {
        
            const { email, password } = req.body;
            const user = await User.findOne({ 
                where: { email },
                // attributes : ['name','firstname','email','image']
             });
            if (!user) {
                return res.status(401).json({ message: "Utilisataeur n'existe pas" });
            }

            const deHashPasssword = await bcrypt.compare(password,user.password)
            console.log("dehashed pass   "+deHashPasssword);
            if (deHashPasssword) 
                {// return res.status(200).json({
                //     'message': 'Succes',
                //     'Authorization': jwtUtils.userTokenGenerator(user)
                // })

             
                res.status(200).json({
                    'id': user.id,
                    'name': user.name,
                    'firstname': user.firstname,
                    'email': user.email,
                    'image': user.image,
                }) }
            
            else return res.status(403).json({ 'message': "Mots de passe incorrecte" })
                
        
    },
    getAbout: async (req,res) => {
        try {
            const id = req.params.id
            console.log(id);
            const user = await User.findOne({
                where : { id },
                attributes : ['name','firstname','email','image']
            })
            if(user) res.status(200).json({user})
                else res.status(404).json({message : 'User not found'})
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getProfil: async (req,res) => {
        try {
            const user = {
                id : req.user.id,
                name : req.user.name,
                firstname : req.user.firstname,
                email : req.user.email,
                image : req.user.image,
            }
            res.status(200).json({user})
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
   
}