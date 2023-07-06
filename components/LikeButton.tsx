import React, { useState, useEffect } from 'react'
import { MdFavorite } from 'react-icons/md'

import useAuthStore from '../store/authStore'

interface IProps {
    handleLike: () => void;
    handleDislike : () => void;
    likes: any[];
}

const LikeButton = ({ likes, handleLike, handleDislike }: IProps) => {
    const [alreadyLike, setAlreadyLike] = useState(false);
    const { userProfile }: any = useAuthStore();
    const filterLikes = likes?.filter((item) => item._ref === userProfile?._id)

    useEffect(() => {
        if(filterLikes?.length > 0) {
            setAlreadyLike(true);
        }
        else {
            setAlreadyLike(false);
        }
    }, [filterLikes, likes])
    
    return (
        <div className='flex gap-6'>
            <div className='flex mt-4 justify-center items-center cursor-pointer mb-4'>
                { alreadyLike ? (
                    <div className='bg-primary rounded-full p-2 md:p-4 text-[#F51997]'>
                        <MdFavorite className='text-md md:text-2xl' onClick={handleDislike}/>
                    </div>
                ) : (
                    <div className='bg-primary rounded-full p-2 md:p-4'>
                        <MdFavorite className='text-md md:text-2xl' onClick={handleLike}/>
                    </div>
                ) }
                <p className='ml-2 text-md font-semibold'>{likes?.length | 0}</p>
            </div>
        </div>
    )
}

export default LikeButton