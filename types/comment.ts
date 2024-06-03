import {IUser} from '@/types/user'
import mongoose, { Schema, models } from 'mongoose';

export interface ICommentBase{
    user: IUser;
    text:string;
}

export interface IComment extends Document, ICommentBase {
    // _id: any;
    // _id: any; //this line
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
    user: {
        userId: {type: String, required: true},
        userImage: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String},
    },
    text: {type: String, required: true},
},
    {
        timestamps:true,
    }
)

export const Comment = models.Comment || mongoose.model<IComment>("Comment",commentSchema)