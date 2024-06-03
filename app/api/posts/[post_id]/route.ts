import connectDB from "@/actions/mongodb/db";
import { Post } from "@/actions/mongodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request:Request, {params} : {params : {post_id: string}}) {
    auth().protect();
    await connectDB();

    try {
        const post =Post.findById(params.post_id);

        if(!post){
            return NextResponse.json({error: "Post Not Found"}, {status: 404}); 
        }
        return NextResponse.json(post);

    } catch (error) {
        return NextResponse.json({error: "An error occured while fetching the Post"}, {status: 500});
    }
}
export interface DeletePostRequestBody{
    userId: string;
}

export async function DELETE(request:Request, {params} : {params : {post_id: string}}) {
    auth().protect();

    // const user = await currentUser();
    await connectDB();

    const {userId}: DeletePostRequestBody = await request.json();
    try {
        const post =Post.findById(params.post_id);

        if(!post){
            return NextResponse.json({error: "Post Not Found"}, {status: 404}); 
        }

        await post.removePost();
    } catch (error) {
        return NextResponse.json({error: "An error occured while deleeting the Post"}, {status: 500});
    }
    }
}