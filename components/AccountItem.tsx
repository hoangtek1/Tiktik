import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IUser, IPostedBy } from '../types'
import { GoVerified } from 'react-icons/go';

interface IProps {
    user: IUser | IPostedBy;
    comment?: string;
}

const AccountItem = ({ user, comment }: IProps) => {
  return (
    <div>
        <div>
        <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded'>
          <div className='md:w-16 md:h-16 w-10 h-10'>
            <Link href={`/profile/${user._id}`}>
              <div>
                <Image 
                  width={comment ? 30 : 62}
                  height={comment ? 30 : 62}
                  className='rounded-full'
                  src={user.image}
                  alt='profile photo'
                  layout='responsive'
                />
              </div>
            </Link>
          </div>
          <div>
            <Link href={`/profile/${user._id}`}>
              <div className='flex items-center gap-2 hover:underline decoration-1'>
                <p className='flex items-center gap-1 md:text-md text-lg font-bold text-primary'>
                  {user.userName} {` `}
                  <GoVerified className='text-blue-400 text-md'/>
                </p>
                { comment ? ('') :(<p className='capitalize font-medium text-xs text-gray-500 hidden md:block'>{user.userName}</p>) }
              </div>
            </Link>
            <p className='text-primary'>{ comment }</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(AccountItem)