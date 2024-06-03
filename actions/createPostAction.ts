'use server'

import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

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

  //Upload the image if available

  //Create post in database

  //revalidate '/' -home page

}

export default createPostAction