"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Loader, Menu } from 'lucide-react';
import Settings from './Settings';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

  
interface SettingsProps {

    proxy: {
  
      id: number;
  
      protocol: string;
  
      ip: string;
  
      port: number;
  
      isActive: boolean;
  
    } | null;

    quality: string | "360p" | "480p" | "720p" | "1080p";
  
  }

const Header = ({ proxy, quality }: SettingsProps) => {
    
    const { theme, setTheme } = useTheme();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {

        setIsMounted(true);
    },[])

    if (typeof window === 'undefined' || !isMounted){
        // return <Loader className='size-5 animate-spin' />
        return (
            <header className="bg-white dark:bg-gray-800 shadow-md p-4 w-full h-16">
            <div className="container w-full mx-auto flex justify-center items-center">
                <Loader className='size-5 animate-spin' />
            </div>
        </header>
        )
    }

    

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 w-full h-16">
            <div className="flex justify-between mobile md:hidden">
                <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                        YT Downloader
                </Link>
                <Sheet>
                <SheetTrigger><Menu /></SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription asChild>
                    <div className="container mx-auto flex justify-between items-center">

                    <div className="flex items-center flex-col justify-center space-y-8 w-full">
                    <Link href="/" className="font-bold text-gray-900 dark:text-white flex justify-center items-center w-full p-4 m-4 text-xl rounded-lg hover:bg-gray-400">
                        Home
                    </Link>
                        <Link href="/playlists" className="text-gray-900 dark:text-white hover:underline flex justify-center items-center w-full p-4 m-4 text-xl rounded-lg hover:bg-gray-400">
                            Playlists
                        </Link>
                        <Link href="/history" className="text-gray-900 dark:text-white hover:underline flex justify-center items-center w-full p-4 m-4 text-xl rounded-lg hover:bg-gray-400">
                            History
                        </Link>
                        <Link href="https://github.com/itsOwn3r/next-youtube-downloader" target='_blank' className="text-gray-900 dark:text-white hover:underline flex justify-center items-center w-full p-4 m-4 text-xl rounded-lg hover:bg-gray-400">
                            Repo
                        </Link>

                    <button
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className="ml-4 bg-gray-200 dark:bg-gray-700 flex justify-center items-center w-full p-2 m-4 text-xl rounded-lg hover:bg-gray-400"
                        >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    
                    <span className=' flex justify-center items-center w-full p-4 m-4 text-xl rounded-lg hover:bg-gray-400'>
                        <Settings proxy={proxy} defaultQuality={quality} />
                    </span>

                        </div>
                </div>
                    </SheetDescription>
                    </SheetHeader>
                </SheetContent>
                </Sheet>
            </div>

            <div className="container mx-auto justify-between items-center md:flex hidden">
                <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                    YT Downloader
                </Link>
                <div className="flex items-center space-x-8">
                    <Link href="/playlists" className="text-gray-900 dark:text-white hover:underline">
                        Playlists
                    </Link>
                    <Link href="/history" className="text-gray-900 dark:text-white hover:underline">
                        History
                    </Link>
                    <Link href="https://github.com/itsOwn3r/next-youtube-downloader" target='_blank' className="text-gray-900 dark:text-white hover:underline">
                        Repo
                    </Link>

                <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="ml-4 p-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:animate-spin"
                    >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <Settings proxy={proxy} defaultQuality={quality} />
                    </div>
            </div>
        </header>
    );
};

export default Header;