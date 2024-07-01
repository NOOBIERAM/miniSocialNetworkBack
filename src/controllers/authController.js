const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const User = require('../models').User;
const fs = require('fs');
const { Op } = require('sequelize');

module.exports = {
    register:  async (req, res) => {
        const {username,nom, prenom, tel, email, password} = req.body

        try {
            await bcrypt.hash(password,10, async (err, cryptedPass) => {
                if( !err ){
                    const [user, create] = await User.findOrCreate({
                        where : {email, tel},
                        defaults : {username, nom, prenom, tel, email, password : cryptedPass}
                    })
                    const token = jwtUtils.userTokenGenerator(user)
                    create ? res.status(200).json({ message : 'Succes', Authorization : `Bearer ${token}`}) : res.status(409).json({ message : 'User already exist' })
                }
            })  
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    },
    login:  async (req, res) => {

        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
              return res.status(401).json({ message: "Utilisataeur n'existe pas" });
            }
            bcrypt.compare(password, user.password,(err, resBycrypt) => {
                if(err) return res.status(403).json(err)
                if(resBycrypt){
                    return res.status(200).json({
                        'message' : 'connected',
                        'Authorization'  : jwtUtils.userTokenGenerator(user)
                    })
                }else{
                    return res.status(403).json({  'message': "Mots de passe incorrecte"})
                }
            })
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    },
}