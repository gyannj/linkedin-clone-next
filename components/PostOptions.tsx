"use client"

import React, { useEffect, useState } from 'react';
import { IPostDocument } from '@/mongodb/models/post';
import { SignedIn, useUser } from '@clerk/nextjs';
import { Button } from './ui/button';
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LikePostRequestBody } from '@/app/api/posts/[post_id]/like/route';
import { UnlikePostRequestBody } from '@/app/api/posts/[post_id]/unlike/route';
import { set } from 'mongoose';
import CommentFeed from './CommentFeed';
import CommentForm from './CommentForm';
import { toast } from 'sonner';

function PostOptions({ post }: { post: IPostDocument }) {
    const [isCommentsOpen, setIsCommentOpen] = useState(false);
    const { user } = useUser();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes);

    useEffect(() => {
        if (user?.id && post.likes?.includes(user.id)) {
            setLiked(true);
        }
    },
        [post, user]);

    const likeOrUnlikePost = async () => {
        if (!user?.id) {
            // toast.error("Sign In to like/unlike")
            throw new Error("User not authenticated");
        }

        const originalLiked = liked;
        const originalLikes = likes;

        const newLikes = liked ? likes?.filter((like) => like !== user.id) : [...(likes ?? []), user.id];

        const body: LikePostRequestBody | UnlikePostRequestBody = {
            userId: user.id
        };
        setLiked(!liked);
        setLikes(newLikes);

        const response = await fetch(`/api/posts/${post._id}/${liked ? 'unlike' : 'like'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            setLiked(originalLiked);
            setLikes(originalLikes);
            throw new Error("Failed to like/unlike post")
        }

        const fetchLikesResponse = await fetch(`/api/posts/${post._id}/like`);
        if (!fetchLikesResponse.ok) {
            setLiked(originalLiked);
            setLikes(originalLikes);
            throw new Error("Failed to fetch likes")
        }

        const newLikesData = await fetchLikesResponse.json();
        setLikes(newLikesData);
    }

    return (
        <div>
            <div className='flex justify-between p-4'>
                <div>
                    {likes && likes.length > 0 && (
                        <p className='text-xs text-gray-500 cursor-pointer'>
                            {likes.length} likes
                        </p>
                    )}
                </div>

                <div>
                    {post?.comments && post.comments.length > 0 && (
                        <p
                            className='text-xs text-gray-500 cursor-pointer'
                            onClick={() => setIsCommentOpen(!isCommentsOpen)}
                        >
                            {post.comments.length} comments
                        </p>
                    )}
                </div>
            </div>

            <div className='flex p-2 justify-between px-2 border-t'>
                <Button
                    variant="ghost"
                    className='postButton'
                    onClick={()=>{
                        const promise =likeOrUnlikePost();
                        toast.promise(promise,{
                           
                            error:"Sign in to like/unlike"
                        })
                    }}
                >
                    <ThumbsUpIcon className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")} />
                    Like
                </Button>
                <Button
                    variant="ghost"
                    className='postButton'
                    onClick={() => setIsCommentOpen(!isCommentsOpen)}
                >
                    <MessageCircle className={cn("mr-1", isCommentsOpen && "text-gray-600 fill-gray-600")} />
                    Comment
                </Button>
                <Button
                    variant="ghost"
                    className='postButton'
                >
                    <Repeat2 className="mr-1" />
                    Repost
                </Button>
                <Button
                    variant="ghost"
                    className='postButton'
                >
                    <Send className="mr-1" />
                    Send
                </Button>
            </div>
                {isCommentsOpen && (
                    <div className="p-4">
                        {user?.id && <CommentForm postId={post._id} />}
                        <hr className='mt-2'/>
                        <CommentFeed post={post} />
                    </div>
                )}
        </div>
    );
}

export default PostOptions;
