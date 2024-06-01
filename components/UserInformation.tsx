import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Button } from './ui/button';
import { Sign } from 'crypto';

async function UserInformation() {
    const user = await currentUser();
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const img = user?.imageUrl;
    return (
        <div className='flex flex-col p-1 justify-center items-center bg-white mr-6 rounded-lg border-py-4'>
            <Avatar>
                {user?.id ? (
                    <AvatarImage src={user?.imageUrl} />
                ) : (
                    <AvatarImage src="https://github.com/shadcn.png" />
                )
                }
                <AvatarFallback >{firstName?.charAt(0)}{lastName?.charAt(0)} </AvatarFallback>
            </Avatar>

            <SignedIn>
                <div className='text-center'>
                    <p className='font-semibold'>
                        {firstName} {lastName} 
                    </p>

                    <p className='text-xs'>
                        @{firstName}{lastName}-{user?.id?.slice(-4)}
                    </p>
                </div>
            </SignedIn>

            <SignedOut>
                <div className='text-center space-y-2'>
                    <p className='font-semibold'>
                        You are not signed in!
                    </p>
                    <Button asChild className='bg-blue-700 text-white '>
                        <SignInButton>Sign In</SignInButton>
                    </Button>

                </div>
            </SignedOut>
            <hr className='w-full border-gray-200 my-5'/>

            <div className="flex justify-between w-full px-4 text-sm">
                <p className="font-semibold text-gray-400">Posts</p>
                <p className="text-blue-400">0</p>
            </div>
            <div className="flex justify-between w-full px-4 text-sm">
                <p className="font-semibold text-gray-400">Comments</p>
                <p className="text-blue-400">0</p>
            </div>

            
        </div>
    )
}

export default UserInformation