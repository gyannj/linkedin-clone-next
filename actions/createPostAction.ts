'use server'

import { IUser } from '@/types/user';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import { Post } from '@/mongodb/models/post';
import { AddPostRequestBody } from '@/app/api/posts/route';

async function createPostAction(formData: FormData) {
  const user = await currentUser();

  if(!user){
    throw new Error("User not authenticated"); 
  }

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let imageUrl: string | undefined;

  if(!postInput){
    throw new Error("Post input is required")
  }

  //Define the user
const userDB: IUser = {
  userId: user.id,
  userImage: user.imageUrl,
  firstName:user.firstName || "",
  lastName:user.lastName || "",
  
}
  //Upload the image if available
 try {
  if(image.size>0){
    const body: AddPostRequestBody ={
      user: userDB,
      text: postInput,
  
      // imageUrl?: image_url
  }
  }else{
    const body= {
      user:userDB,
      text: postInput,
    };

    await Post.create(body);
  }
 } catch (error) {
    console.log("Failed to create post", error)
 }
  //Create post in database

  //revalidate '/' -home page

}

export default createPostAction