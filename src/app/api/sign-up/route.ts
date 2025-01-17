
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrtypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request) {

    await dbConnect();
    try {

        await request.json();
        const { username , email , password} = await request.json();
        
    } catch (error) {
        console.error("error connecting db" , error)
        return Response.json({success : false , message : "error connecting db"}
        , {status : 500})
        
    }
    
}
