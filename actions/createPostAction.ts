'use server'

import { IUser } from '@/types/user';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import { Post } from '@/mongodb/models/post';
import { AddPostRequestBody } from '@/app/api/posts/route';
import generateSASToken from '@/lib/generateSASToken';
import { BlobServiceClient } from '@azure/storage-blob';
import { containerName } from '@/lib/generateSASToken';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';

async function createPostAction(formData: FormData) {
  const user = await currentUser();
  console.log(user)

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let image_url= undefined;
  
  if (!user?.id) {
    throw new Error("User not authenticated");
  }

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
    console.log("Uploading image to azure blob storage", image);

    const accountName = process.env.AZURE_STORAGE_NAME;
    const sasToken= await generateSASToken();


    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    );

    const containerClient =
    blobServiceClient.getContainerClient(containerName);

    const timestamp = new Date().getTime();
    const file_name = `${randomUUID()}_${timestamp}.png`;
    
    const blockBlobClient= containerClient.getBlockBlobClient(file_name);

    const imageBuffer = await image.arrayBuffer();
    const res = await  blockBlobClient.uploadData(imageBuffer);

    image_url = res._response.request.url;

    console.log("File uploaded successfully!", image_url);
    
    const body: AddPostRequestBody ={
      user: userDB,
      text: postInput,
  
      imageUrl: image_url
  }
  }else{
    const body= {
      user:userDB,
      text: postInput,
    };

    await Post.create(body);
  }
 } catch (error) {
    console.log("Failed to create post: ", error)
 }
  

  revalidatePath('/');
  

}

export default createPostAction