import React, { Dispatch, SetStateAction } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GoVerified } from 'react-icons/go'
import { BiCommentX } from 'react-icons/bi'

import useAuthStore from '../store/authStore'
import NoResults from './NoResults'
import { IPostedBy, IUser } from '../types'
import AccountItem from './AccountItem'

interface IProps {
    isPostingComment: boolean;
    comment: string;
    setComment: Dispatch<SetStateAction<string>>;
    addComment: (e: React.FormEvent) => void;
    comments: IComment[];
}

interface IComment {
    comment: string;
    length?: number;
    _key: string;
    postedBy: IPostedBy;
}

const Comment = ({ comment, setComment, addComment, comments, isPostingComment }: IProps) => {
    const { userProfile, allUsers } = useAuthStore();

    return (
        <div className='border-t-2 border-gray-200 pt-4 px-6 bg-[#F8F8F8] border-b-2 lg:pb-0 pb-[100px]'>
            <div className='overflow-scroll lg:h-[475px]'>
                { comments?.length ? (
                    comments.map((item, idx) => (
                        <>
                            {allUsers.map((user: IUser) => (
                                user._id === item.postedBy._id && (
                                    <div className='p-2 items-center border-b-2 border-gray-200' key={item.postedBy._id}>
                                        <AccountItem key={idx} comment={item.comment} user={{ ...item.postedBy, image: user.image, userName: user.userName }}/>
                                    </div>
                                )
                            ))}
                        </>
                    ))
                ) : (
                    <NoResults icon={<BiCommentX />} text='No comments yet!'/>
                )}
            </div>

            { userProfile && (
                <div className='absolute bottom-0 left-0 pb-6 px-2 md:px-10'>
                    <form onSubmit={addComment} className='flex gap-4'>
                        <input 
                            value={comment}
                            onChange={(e) => {setComment(e.target.value)}}
                            placeholder='Add comment...'
                            className='bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg'
                        />
                        <button className='px-4 text-md text-gray-400 hover:bg-gray-300 hover:text-white rounded-2xl' onClick={addComment}>
                            { isPostingComment ? 'Commenting...' : 'Comment' }
                        </button>
                    </form>
                </div>
            )}
        </div>
  )
}

export default Comment