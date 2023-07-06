import React, { useState, useEffect, useRef, useCallback } from 'react'
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { BsPlay, BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs'
import { GoVerified } from 'react-icons/go'

import { Video } from '../types'
import AccountItem from './AccountItem';
import useMutedStore from '../store/mutedStore';

interface IProps {
    post: Video;
}

const VideoCard: NextPage<IProps> = ({post}) => {
  const [isHover, setIsHover] = useState(false);
  const [playing, setPlaying] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  const [debugText, setDebugText] = useState<string>("");

  const { isMuted, muted, unMuted } = useMutedStore();

  const onVideoPress = () => {
    if(playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    }
    else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  }

  const handleViewChange = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      for (let entry of entries) {
        if (entry.intersectionRatio > 0.5) {
          if (videoRef?.current) {
            
            // Note: if the user has not interacted with the page, videos that is not muted will not be allowed to play
            // and will throw out an error. Won't crash the app though.

            // Note2: if you want to pause all other videos, the following line would do so.
            document.querySelectorAll("video").forEach((video) => {
              video.pause();
            });
            
            if(!videoRef?.current?.classList.contains("pause")){
              videoRef?.current?.play();
              setPlaying(true);
            }
            setDebugText(
              `intersectionRatio: ${entry.intersectionRatio.toFixed(
                2
              )}, now play.`
            );
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            setDebugText(
              `intersectionRatio: ${entry.intersectionRatio.toFixed(
                2
              )}, now pause.`
            );
          }
        }
      }
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleViewChange, {
      root: null,
      rootMargin: "0px",
      threshold: 0.5
    });
    setObserver(observer);
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [handleViewChange]);

  useEffect(() => {
    const handleTabOutside = () => {
      if (document['hidden']) {
        videoRef?.current?.pause();
      }
    }

    document.addEventListener('visibilitychange', handleTabOutside)

    return () => {
      document.removeEventListener('visibilitychange', handleTabOutside);
    }
  }, [])

  return (
    <div className='flex flex-col border-b-2 border-gray-200 pb-6'>
      <div className='flex relative'>
        <AccountItem user={post.postedBy} />
        <p 
          className='absolute top-[40px] left-[60px] w-[200px] text-md text-black lg:w-[600px] lg:video-captions md:left-[82px] '>{post.caption}</p>
      </div>

      <div className='lg:ml-20 flex gap-4 relative mt-4'>
        <div 
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className='rounded-3xl'
        >
          <Link href={`/detail/${post._id}`}>
            <video
              muted={isMuted}
              // loop
              ref={videoRef}
              className={`lg:w-[600px] lg:h-[528px] h-[400px] w-[300px] md:h-[400px]  rounded-2xl cursor-pointer bg-gray-100 ${playing? '':'pause'}`}
              src={post.video.asset.url}
            >

            </video>
          </Link>

          {isHover && (
            <div className='absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] p-3'>
              {playing ? (
                <button onClick={onVideoPress}>
                  <BsFillPauseFill className='video_interaction_btn'/>
                </button>
              ) : (
                <button onClick={onVideoPress}>
                  <BsFillPlayFill className='video_interaction_btn'/>
                </button>
              )}
              {isMuted ? (
                <button onClick={unMuted}>
                  <HiVolumeOff className='video_interaction_btn'/>
                </button>
              ) : (
                <button onClick={muted}>
                  <HiVolumeUp className='video_interaction_btn'/>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoCard