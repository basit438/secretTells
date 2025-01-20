import { NextAuthOptions } from "next-auth";

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import UserModel from "@/models/user.model"
import dbConnect from "@/lib/dbConnect";


export const authOptions : NextAuthOptions = {
    providers: [
        Credentials ({
            id : "credentials",
            name: "credentials",
            credentials :{
                username: { label: "Email", type: "text ", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials:any) :Promise<any>{
                await dbConnect()
                try {

                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.email},
                            {username : credentials.email}
                            
                        ]
                    })

                    if(!user){
                        throw new Error("No user found with this email")
                    }

                    if(!user.isVerified){
                        throw new Error ("Please verify your account before log in")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password , user.password)

                    if(isPasswordCorrect){
                        return user
                    } else{
                        throw new Error("password incorrect")
                    }
                    
                } catch (error :any) {
                    throw new Error(error)
                    
                }
            }
           })
    ],

  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   return true
    // },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl
    // },
   
    async jwt({ token, user}) {

        if(user){
            token._id = user._id?.toString()
            token.isVerified = user.isVerified;
            token.isAcceptingMessages =user.isAcceptingMessages;
            token.username = user.username
        }
      return token
    },
    
    async session({ session,  token }) {
        if(token){
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
        }
        return session
      }
},










    pages : {
        signIn : '/sign-in'
    },
    session :{
        strategy : "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,


}
