const ChatMessage = require('../models').ChatMessage;

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

module.exports = {
    create: (req, res) => {
        const { UserId, msg, room } = req.body

        ChatMessage.create({
            UserId : UserId,
            msg : msg,
            room : room
        }).then(async (data) => {
            return await res.status(200).json({'message':'message stored', msg:data})
        })
        .catch((err) => {
            return res.status(400).json({'message': 'cannot store message'})
        })
    },
    createMessage : (UserId, msg, room ) => {
        ChatMessage.create({
            UserId : UserId,
            msg : msg,
            room : room
        }).then(async (data) => {
            return data
        })
        .catch((err) => {
            return err
        })
    },
    get : async (req, res) => {
        const room  = req.params.room

        await ChatMessage.findAll({
            attributes : ['UserId', 'msg', 'room'],
            where :{
                room : room
            }
        }).then((data) => {
            res.status(201).json({message : 'success', msg :data});
        })
        .catch((err) => {
            res.status(400).json({ 'message' : err });
        });

    },
    chatBot : async (req,res)=>{
        const message = req.body.message
        const MODEL_NAME = "gemini-1.0-pro";
        const API_KEY = "AIzaSyCR3JrLBGsFOTo1klthVZtVo3q1fkIe5UQ";

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };
  
        const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        ];
  
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [
            ],
        });
  
        const result = await chat.sendMessage(message);
        const response = result.response;
        let newText = response.text().replace(/\*\*/g, '');

           return  await res.status(200).json({mess: 'success', msg:{type:'bot', msg: newText }})
           
        }
    
}