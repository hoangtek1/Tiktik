import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';

import { BASE_URL } from '../../utils';
import useAuthStore from '../../store/authStore';
import NoResults from '../../components/NoResults'
import VideoCard from '../../components/VideoCard';
import SuggestedAccountItem from '../../components/SuggestedAccountItem';
import { IUser, Video } from '../../types';

import { BiVideoOff } from 'react-icons/bi';
import { FaUserXmark } from 'react-icons/fa6';

const Search = ({ videos }: {videos: Video[]}) => {
    const [isAccounts, setIsAccounts] = useState(false);
    const router = useRouter();
    const { searchTerm }: any = router.query;
    const { allUsers } = useAuthStore();

    const searchedAccounts = allUsers.filter((user: IUser) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className='w-full'>
        <div className='flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full'>
          <p 
            className={`text-xl font-bold cursor-pointer mt-2 ${isAccounts ? 'border-b-2 border-black' : 'text-gray-400'}`} 
            onClick={() => setIsAccounts(true)}>Accounts</p>
          <p 
            className={`text-xl font-bold cursor-pointer mt-2 ${!isAccounts ? 'border-b-2 border-black' : 'text-gray-400'}`} 
            onClick={() => setIsAccounts(false)}>Videos</p>
        </div>
        { isAccounts ? (
            <div className='md:mt-8'>
                { searchedAccounts.length ? (
                    searchedAccounts.map((user: IUser) => (
                        <SuggestedAccountItem search user={user}/>
                    ))
                ) : <NoResults icon={<FaUserXmark />} text={`No accounts result for "${searchTerm}"`}/>}
            </div>
        ) : (
            <div className='md:mt-8 flex flex-wrap gap-6 md:justify-start'>
                { videos.length ? (
                    videos.map((video: Video) => (
                        <VideoCard post={video} key={video._id}/>
                    ))
                ) : <NoResults icon={<BiVideoOff />} text={`No videos result for "${searchTerm}"`}/>} 
            </div>
        )}
    </div>
  )
}

export const getServerSideProps = async ({ 
    params: { searchTerm } 
  }: { params: { searchTerm: string} }) => {
  const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`);
  
  return {
    props: { videos: res.data }
  }
}

export default Search