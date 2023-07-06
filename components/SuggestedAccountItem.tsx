import { IUser } from '../types'
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import { GoVerified } from 'react-icons/go'

interface IProps {
    user: IUser ;
    search: boolean;
}

const SuggestedAccountItem = ({ user, search = false }: IProps) => {
  return (
    <Link href={`/profile/${user._id}`}>
        { search ? (
            <div className=' flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200'>
            <div>
              <Image width={50} height={50} className='rounded-full' alt='user-profile' src={user.image}/>
            </div>
            <div>
              <div>
                <p className='flex gap-1 items-center text-lg font-bold text-primary'>
                  {user.userName} <GoVerified className='text-blue-400' />
                </p>
                <p className='capitalize text-gray-400 text-sm'>
                  {user.userName}
                </p>
              </div>
            </div>
          </div>
        ) : (
            <div className='flex gap-3 hover:bg-primary p-2 cursor-pointer font-semibold rounded items-center'>
            <div className='w-8 h-8'>
            <Image 
                src={user.image}
                width={34}
                height={34}
                className='rounded-full'
                alt='user profile'
                layout='responsive'
            />
            </div>

            <div className='hidden xl:block '>
                <p className='flex gap-1 items-center text-md font-bold text-primary lowercase'>
                    {user.userName.replaceAll(' ','')}
                    <GoVerified className='text-blue-400'/>
                </p>
                <p className='capitalize text-gray-400 text-xs'>
                    {user.userName}
                </p>
                </div>
            </div>
        )}
        
    </Link>
  )
}

export default SuggestedAccountItem