import Link from 'next/link';
import React from 'react';
// import { useTheme } from 'next-themes';

const Header = () => {
    // const { theme, setTheme } = useTheme();

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 w-full">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                    Youtube Downloader
                </Link>
                <div className="space-x-8">
                    <Link href="/" className="text-gray-900 dark:text-white hover:underline">
                        History
                    </Link>
                    <Link href="https://github.com/itsOwn3r/next-youtube-downloader" target='_blank' className="text-gray-900 dark:text-white hover:underline">
                        Repo
                    </Link>

                <button
                    // onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="ml-4 p-1 bg-gray-200 dark:bg-gray-700 rounded-full"
                    >
                    {/* {theme === 'light' ? '🌙' : '☀️'} */}☀️
                </button>
                    </div>
            </div>
        </header>
    );
};

export default Header;