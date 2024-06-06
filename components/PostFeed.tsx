import { IPostDocument } from '@/mongodb/models/post'
import React from 'react'

function PostFeed({posts}: {posts: IPostDocument[]}) {
  return (
    <div>PostFeed</div>
  )
}

export default PostFeed