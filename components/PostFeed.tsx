import { IPostDocument } from '@/mongodb/models/post'
import React, { Key } from 'react'
import Post from './Post'


function PostFeed({posts}: {posts: IPostDocument[]}) {
  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id as Key} post={post} />
      ))}
    </div>
  )
}

export default PostFeed