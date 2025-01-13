"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Loader } from 'lucide-react';

const Header = () => {
    
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
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    YT Downloader
                </Link>
                <div className="space-x-3 md:space-x-8">
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
                    </div>
            </div>
        </header>
    );
};

export default Header;