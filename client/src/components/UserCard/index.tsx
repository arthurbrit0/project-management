import { User } from '@/src/state/api'
import Image from 'next/image'
import React from 'react'

type Props = {
    user: User
}

const UserCard = ({user}: Props) => {
  return (
    <div className="flex items-center rounded border p-4 shadow">
        {user.profilePictureUrl && (
            <Image 
                src={user.profilePictureUrl} 
                alt={`Foto de perfil do usuário ${user.username}`} 
                width={32} 
                height={32} 
                className="rounded-full"
            />
        )}
        <h3>{user.username}</h3>
        <p>{user.email}</p>
    </div>
  )
}

export default UserCard