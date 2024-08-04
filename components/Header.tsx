"use client";

import fetchSuggestion from "@/lib/fetchSuggestionFunc";
import { useBoardStore } from "@/store/BoardStore";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import logo from "../app/assests/Trello_logo.svg.png";
import { ThemeSwitcher } from "./ThemeSwitcher";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    if (board.columns.size === 0) return;

    setLoading(true);

    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };
    // fetchSuggestionFunc();
  }, [board]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5  bg-gray-500/10 rounded-b-2xl">
        <div
          className={`gradient absolute top-0 left-0 w-full h-full
            -z-50
            rounded-md
            filter
            blur-2xl
            opacity-50
            max-h-[60vh]
            `}
        />
        <Image
          src={logo}
          alt="Trello Logo"
          width={300}
          height={100}
          // className="w-44 md:w-56 pb-10 md:pb-0 object-contain filter brightness-100  "
          className="w-44 md:w-56 pb-5 md:pb-0 object-contain filter brightness-100"
        />

        <div className="flex  items-center space-x-5 flex-1 justify-end w-full">
          {/* Search Box */}
          <form className="flex items-center space-x-5 bg-white dark:bg-[#3B3B3B]  rounded-md p-2 shadow-md flex-1 md:flex-initial transition">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              className="flex-1 outline-none p-2 bg-transparent"
              placeholder="Serach"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>

          {/* Ternary operator for session */}

          {/* Avatar */}
         
        </div>
        {/* {session && session.user ? (
          <>
            <button
              onClick={() => signOut()}
              className="text-red-600  hover:text-red-800 font-semibold px-3 py-2 border border-red-600 ease-in-out w-fit p-2 m-4 h-full rounded-full hover:scale-105 transition-transform duration-200 bg-blue-500 dark:bg-gray-900"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button className=" hover:bg-blue-600 text-white font-semibold px-4 py-2 ease-in-out w-fit p-2 m-2 h-full rounded-full hover:scale-105 transition-transform duration-200 bg-blue-500 dark:bg-gray-900">
            <Link href="/login">Login</Link>
          </button>
        )} */}
        <div className="flex items-center space-x-5">
            {/* Ternary operator for session */}
            {session && session.user ? (
              <>
                {console.log("🚀 ~ file: Header.tsx:78 ~ Header ~ session:", session)}
                {/* <Avatar
                  round
                  className="h-12 w-12 border-2 border-blue-500"
                  color="#0055D1"
                  size="50"
                  name={session?.user?.name || " "}
                /> */}
                <button
                  onClick={() => signOut()}
                  className="text-white hover:text-red-800 font-semibold px-3 py-2 border border-red-600 ease-in-out w-fit p-2 m-4 h-full rounded-full hover:scale-105 transition-transform duration-200 bg-blue-500 dark:bg-gray-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              // <button className="hover:bg-blue-600 text-white font-semibold px-4 py-2 ease-in-out w-fit p-2 m-2 h-full rounded-full hover:scale-105 transition-transform duration-200 bg-blue-500 dark:bg-gray-900">
              // </button>
                <Link className="hover:bg-blue-600 text-white font-semibold px-4 py-2 ease-in-out w-fit p-2 m-2 h-full rounded-full hover:scale-105 transition-transform duration-200 bg-blue-500 dark:bg-gray-900" href="/login">Login</Link>
            )}
          </div>
        <ThemeSwitcher />
      </div>
      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex items-center text-sm font-light p-5 pr-5 shadow-xl rounded-xl w-fit bg-white dark:bg-gray italic max-w-xl text-[#0055D1]">
          <UserCircleIcon
            className={`inline-block h-10 w-10 mr-1 text-[#0055D1] ${
              loading && "animate-spin"
            }`}
          />
          {suggestion && !loading
            ? suggestion
            : "GPT is summarizing your tasks for the day..."}
        </p>
      </div>
    </header>
  );
};

export default Header;
