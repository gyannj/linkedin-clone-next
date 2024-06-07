"use server"

import { AddCommentRequestBody } from "@/app/api/posts/[post_id]/comments/route";
import { Post } from "@/mongodb/models/post";
import { ICommentBase } from "@/types/comment";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

async function createCommentAction(
    postId: string,
    formData: FormData
) {
    const user = await currentUser();
    const commentInput = formData.get("commentInput") as string;
    if (!commentInput) {
        throw new Error("Comment cannot be empty");
    }
    if(!postId) {
        throw new Error("Post ID is required");
    }
    if(!user?.id) {
        throw new Error("User not authenticated");
    }
    const userDB: IUser = {
      userId: user.id,
      userImage: user.imageUrl,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    };

    const body: AddCommentRequestBody = {
        user: userDB,
        text: commentInput,
    };
    const post = await Post.findById(postId);
    if (!post) {
        throw new Error("Post not found");
    }

    const comment: ICommentBase= {
      user: userDB,
      text: commentInput,
    }

    try {
      await post.commentOnPost(comment);
      revalidatePath('/')
    } catch (error) {
      throw new Error("An error occurred while adding comment");
    }

}

export default createCommentAction