import { IUser } from "@/types/user";
import mongoose, {Schema,  Document, models, Model} from "mongoose";
import { Comment, IComment, ICommentBase } from "@/types/comment";


export interface IPostBase {
    user: IUser;
    text: string;
    imageUrl?:string;
    comments?:IComment[];
    likes?:string[];
}

export interface IPost extends Document,IPostBase{
    createdAt: Date;
    updatedAt:Date;
}

interface IPostMethods {
    likePost(userId: string): Promise<void>;
    unlikePost(userId: string): Promise<void>;
    commentOnPost(comment: ICommentBase): Promise<void>;
    getAllComments(): Promise<IComment[]>;
    removePost(): Promise<void>;
}

interface IPostStatics {
    getAllPosts(): Promise<IPostDocument[]>;
}

export interface IPostDocument extends IPost, IPostMethods{}

interface IPostModel extends IPostStatics, Model<IPostDocument> {}

const PostSchema = new Schema<IPostDocument>(
    {
        user: {
            userId: {type: String, required: true},
            userImage: {type: String, required: true},
            firstName: {type: String, required: true},
            lastName: {type: String},
        },
        text: {type: String, required: true},
        imageUrl: {type: String},
        comments: {type: [Schema.Types.ObjectId], ref: "Comment", default: []},
        likes: {type: [String]}
    },
    {
        timestamps: true,
    }

)

PostSchema.methods.likePost = async function(userId: string) {
    try {
        await this.updateOne({ $addToSet: { likes: userId}})
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error liking post: ${error.message}`);
        } else {
            throw new Error('Unknown error occurred while liking post');
        }
    }
}
PostSchema.methods.unlikePost = async function(userId: string) {
    try {
        await this.updateOne({ $pull: { likes: userId}})
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error unliking post: ${error.message}`);
        } else {
            throw new Error('Unknown error occurred while unliking post');
        }
    }
}

PostSchema.methods.removePost = async function ()  {
    try {
        await this.model.deleteOne({ _id: this._id });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error removing post: ${error.message}`);
        } else {
            throw new Error('Unknown error occurred while removing post');
        }
    }
}
PostSchema.methods.removePost = async function (commentToAdd: ICommentBase)  {
    try {
        const comment = await Comment.create(commentToAdd);
        this.comments.push(comment._id);
        await this.save();
        
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error commenting on post: ${error.message}`);
        } else {
            throw new Error('Unknown error occurred while commenting on post');
        }
    }
}

PostSchema.methods.getAllComments = async function() {
    try {
        await this.populate({
            path: "comments",
            options: {sort: { createdAt: -1}},
        }
        );
        return this.comments;
    } catch (error) {
        console.log("error when getting all comments", error);
    }
}

PostSchema.statics.getAllPosts = async function () {
    try {
      const posts = await this.find()
        .sort({ createdAt: -1 })
        .populate({
          path: "comments",
  
          options: { sort: { createdAt: -1 } },
        })
        .populate("likes")
        .lean(); // lean() returns a plain JS object instead of a mongoose document
  
      return posts.map((post: IPostDocument) => ({
        ...post,
        _id: post._id?.toString(),
        comments: post.comments?.map((comment: IComment) => ({
          ...comment,
          _id: comment._id?.toString(),
        })),
      }));
    } catch (error) {
      console.log("error when getting all posts", error);
    }
  };

export const Post = models.Post as IPostModel || mongoose.model<IPostDocument, IPostModel>("Post",PostSchema)
