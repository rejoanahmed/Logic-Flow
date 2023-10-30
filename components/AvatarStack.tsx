'use client'

import { Avatar } from 'flowbite-react'

export default function AvatarStack() {
  return (
    <div className='flex flex-wrap gap-2'>
      <Avatar.Group>
        <Avatar img='/images/people/profile-picture-1.jpg' rounded stacked />
        <Avatar img='/images/people/profile-picture-2.jpg' rounded stacked />
        <Avatar img='/images/people/profile-picture-3.jpg' rounded stacked />
        <Avatar img='/images/people/profile-picture-4.jpg' rounded stacked />
        <Avatar img='/images/people/profile-picture-5.jpg' rounded stacked />
      </Avatar.Group>
    </div>
  )
}
