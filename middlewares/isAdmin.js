import { User } from "../models/User/User.js"


export const isAdmin = async(req,res,next)=>{
    // Find the user
    const user = await User.findById(req.userAuthId)

    if(user.isAdmin){
        next()
    }else{
        next(new Error('Access denied, Admin only'))
    }
}