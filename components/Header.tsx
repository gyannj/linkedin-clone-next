import React from 'react'
import Image from 'next/image'

function Header() {
  return (
    <div className='flex'>
        <Image className="rounded-lg" src="https://links.papareact.com/b3z" alt="logo" width={40} height={40}  />
    </div>
  )
}

export default Header