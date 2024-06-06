'use server'

import { revalidate } from '@/app/page';
import {Post} from '@/mongodb/models/post'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache';
import React from 'react'

async function deletePostAction(postId: any) {
 const user = await currentUser();

    if (!user?.id) {
        throw new Error("User not authenticated");
    }
    const post = await Post.findById(postId);

    if(!post){
        throw new Error("Post not found")
    }
    if(post.user.userId !== user.id){
        throw new Error("Unauthorized")
    }
    try {
        await post.removePost();
        revalidatePath("/");
    } catch (error) {
        // console.error(error);
        throw new Error("Failed to delete post")
    }
}

export default deletePostAction