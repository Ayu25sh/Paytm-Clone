const Account = require("../models/Account");
const User = require("../models/User");
const zod = require("zod");
const jwt = require("jsonwebtoken");


require("dotenv").config();



//  signup
const signupSchema = zod.object({
    userName: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),

});

exports.signup = async(req,res) => {
    try{
        const data = req.body;
        const {success}  = signupSchema.safeParse(req.body);

        if(!success){
            return res.status(411).json({
                success:false,
                message:"Incorrect inputs",
            })
        }

        const existingUser = await User.find({
                                    userName: data.userName
                                })

        if(!existingUser){
            return res.status(411).json({
                success:false,
                message:"Email Already Taken",
            })
        }

        const user = await User.create(data);
        const token = jwt.sign({
            userId: user._id
        },process.env.JWT_SECRET);

        await Account.create({
                            userId: user._id,
                            balance: 1 + Math.random() * 10000
        })

        return res.status(200).json({
            success:true,
            message:"User created successfully ",
            token
        })
                            
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
} 


//login
const loginSchema = zod.object({
    userName: zod.string().email(),
    password: zod.string(),
})

exports.login = async(req,res) => {
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
            message:"User loggedin successfully ",
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

exports.updateProfile = async(req,res) => {
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

//get user by name
exports.getByName = async(req,res) => {
    try{
        const filter = req.query.filter || "";

        const users = await User.find({
             $or: [{
                firstName: {
                    "$regex": filter
                }
            }, {
                lastName: {
                    "$regex": filter
                }
            }]
        })

        return res.status(200).json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
