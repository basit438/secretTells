
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrtypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/models/user.model";


export async function POST(request: Request) {

    await dbConnect();
    try {
        const { username , email , password} = await request.json();

       const existingUserVerifiedBYUsername = await UserModel.findOne({
            username,
            isVerified : true
        })
       //check if the username is alrady taken
        if(existingUserVerifiedBYUsername){
            return Response.json({success : false , message : "user already exists"}
            , {status : 400})
        }
        
        //check if the email is alrady taken

       const existingUserByEmail = await UserModel.findOne({email})

       const verifyCode = Math.floor(Math.random() * 1000000).toString();

       if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
            return Response.json({success : false , message : "Email already verified"}
            , {status : 400})
        }
        else{
            const hashedPassword = await bcrtypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save();
        }

       }
       else{

        const hashedPassword = await bcrtypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser =  new UserModel({
            username,
            email,
            password : hashedPassword,
            verifyCode : verifyCode,
            verifyCodeExpiry : expiryDate,
            isVerified : false,
            isAcceptingMessages : true,
            messages : []
        })

        await newUser.save();
       }
       //send verification email 

      const emailResponse =  await sendVerificationEmail(email, username, verifyCode);

      if(!emailResponse.success){
        return Response.json({success : false , message : emailResponse.message}
        , {status : 500})
      }

      return Response.json({success : true , message : "user created successfully, please check your email to verify your account"}
      , {status : 200})


    } catch (error) {
        console.error("error connecting db" , error)
        return Response.json({success : false , message : "error connecting db"}
        , {status : 500})
        
    }
    
}
