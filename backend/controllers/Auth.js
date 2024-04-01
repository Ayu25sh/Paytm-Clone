const zod = require("zod");
const jwt = require("json-web-token");
import User from "../models/User"

require("dotenv").config();



//  signup
const signupSchema = zod.object({
    userName: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),

});

const signup = async(req,res) => {
    try{
        const data = req.body;
        const {success}  = signupSchema.safeParse(req.body);

        if(!success){
            return res.status(411).json({
                success:false,
                message:"Incorrect inputs",
            })
        }

        const existingUser = await User.findOne({
                                    userName: data.userName
                                })

        if(!existingUser){
            return res.status(411).json({
                success:false,
                message:"Email Already Taken",
            })
        }

        const user = await User.create(body);
        const token = jwt.sign({
            userId: user._id
        },process.env.JWT_SECRET);


        return res.status(200).json({
            success:true,
            message:"User created successfully ",
            token
        })
                            
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
} 


//login
const loginSchema = zod.object({
    userName: zod.string(),
    password: zod.string(),
})

const login = async(req,res) => {
    try{
        const data = req.body;
        const {success} = loginSchema.safeParse(data);

        if(!success){
            return res.status(411).json({
                success:false,
                message:"Incorrect input"
            })
        }

        const userDetails = await User.findOne({userName: data.userName});
        if(!userDetails){
            return res.status(411).json({
                success:false,
                message:"User not found"
            })
        }

        if(userDetails.password !== data.password){
            return  res.status(411).json({
                success:false,
                message:"Incorrect password"
            });
        }

        const token = jwt.sign({
            userId: userDetails._id
        },process.env.JWT_SECRET);


        return res.status(200).json({
            success:true,
            message:"User created successfully ",
            token
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//update
const updatedSchema = zod.object({
    userName: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

const updateProfile = async(req,res) => {
    try{
        const id = req.userId;
        const data = req.body;
        const {success} = updatedSchema.safeParse(data);

        if(!success){
            return res.status(411).json({
                success:false,
                message:"Incorrect input"
            })
        }

        const updatedUser = await User.findByIdAndUpdate(id,{data});

        return res.status(200).json({
            success:true,
            message:"User Updated Successfully",
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//