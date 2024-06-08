"use client"

import { useUser } from "@clerk/nextjs"
import { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import createCommentAction from "@/actions/createCommentAction"
import { toast } from "sonner"

function CommentForm({ postId }: { postId: any }) {
    const { user } = useUser()
    const ref = useRef<HTMLFormElement>(null)
    const createCommentActionWithPostId = createCommentAction.bind(null, postId);

    const handleCommentAction = async (formData: FormData): Promise<void> => {
        const formDataCopy = formData;
        ref.current?.reset();
        try {
            await createCommentActionWithPostId(formDataCopy);
        } catch (error) {
            console.log("Error Creating Comment: ", error)
        }
    }

    return (
        <form
            ref={ref}
            action={(formData) => {
                const promise= handleCommentAction(formData);
                toast.promise(promise,{
                    loading:"Posting comment...",
                    success:"Comment posted",
                    error:"Failed to post comment"
                })

            }}
            className="flex items-center space-x-1"
        >
            <Avatar>
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 bg-white border rounded-full px-3 py-2">
                <input
                    type="text"
                    name="commentInput"
                    placeholder="Add a comment..."
                    className="outline-none flex-1 text-sm bg-transparent"
                />
                <button type="submit" hidden>
                    Comment
                </button>
            </div>
        </form>
    )
}

export default CommentForm