import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

import { BASE_URL } from '../../utils';
import { Video } from '../../types';
import useAuthStore from '../../store/authStore'  ;
import LikeButton from '../../components/LikeButton';
import Comment from '../../components/Comment';
import useMutedStore from '../../store/mutedStore';

import { GoVerified } from 'react-icons/go';
import { MdOutlineCancel } from 'react-icons/md';
import { BsFillPlayFill } from 'react-icons/bs';

interface IProps {
  postDetail: Video
}

const Detail = ({ postDetail }: IProps) => {
  const [post, setPost] = useState(postDetail);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { userProfile }: any = useAuthStore();
  const [comment, setComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const { isMuted} = useMutedStore();

  const onVideoPress = () => {
    videoRef?.current?.play();
    setPlaying(true);
  }

  const handleLike = async (like: boolean) => {
    if(userProfile) {
      const { data } = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like
      })

      setPost({ ...post, likes: data.likes });
    }
  }

  const addComment = async (e) => {
    e.preventDefault();

    if(userProfile && comment) {
      setIsPostingComment(true);

      const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
        userId: userProfile._id,
        comment
      });

      setPost({ ...post, comments: data.comments });
      setComment('');
      setIsPostingComment(false);
    }
  }

  if(!post) return null;

  return (
    <div className='flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap'>
      <div className='relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-blurred-img bg-no-repeat bg-cover bg-center'> 
        <div className='absolute top-6 left-2 lg:left-6 flex gap-6 z-50'>
          <p className='cursor-pointer' onClick={() => router.back()}>
            <MdOutlineCancel 
              className='text-white text-[35px]'
            />
          </p>
        </div>
        <div className='relative'>
          <div className='lg:h-[100vh] h-[60vh]'>
            <video
              controls
              muted={isMuted}
              ref={videoRef}
              src={post.video.asset.url}
              className='h-full cursor-pointer'
              onClick={() => {
                setPlaying((prev) => !prev) 
              }}
            >

            </video>
          </div>

          <div className='absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]'>
            { !playing && (
              <button onClick={onVideoPress}>
                <BsFillPlayFill className='text-white text-6xl lg:text-8xl'/>
              </button>
            ) }
          </div>
        </div>

        {/* <div className='absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer'>
          {isMuted ? (
            <button onClick={unMuted}>
              <HiVolumeOff className='text-white text-2xl lg:text-4xl'/>
            </button>
          ) : (
            <button onClick={muted}>
              <HiVolumeUp className='text-white text-2xl lg:text-4xl'/>
            </button>
          )}
        </div> */}
      </div>

      <div className='relative w-[1000px] md:w-[900px] lg:w-[700px]'>
        <div className='lg:mt-20 mt-10'>
        <Link href={`/profile/${post.postedBy._id}`}>
                <div className='flex gap-4 mb-4 bg-white w-full pl-10 cursor-pointer'>
                  <Image
                    width={60}
                    height={60}
                    alt='user-profile'
                    className='rounded-full'
                    src={post.postedBy.image}
                  />
                  <div>
                    <div className='text-xl font-bold lowercase tracking-wider flex gap-2 items-center justify-center'>
                      {post.postedBy.userName.replace(/\s+/g, '')}{' '}
                      <GoVerified className='text-blue-400 text-xl' />
                    </div>
                    <p className='text-md'> {post.postedBy.userName}</p>
                  </div>
                </div>
              </Link>
              <div className='px-10'>
                <p className=' text-md text-gray-600'>{post.caption}</p>
              </div>
              <div className='mt-10 px-10'>
                {userProfile && 
                <LikeButton
                  likes={post.likes}
                  handleLike={() => handleLike(true)}
                  handleDislike={() => handleLike(false)}
                />}
              </div>

          <Comment
            comment={comment}
            setComment={setComment}
            addComment={addComment}
            isPostingComment={isPostingComment}
            comments={post.comments}
          />
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ params: { id } }: { params:{id:string} }) => {
  const { data } = await axios.get(`${BASE_URL}/api/post/${id}`)

  return { 
    props: { postDetail: data }
   }
}

export default Detail