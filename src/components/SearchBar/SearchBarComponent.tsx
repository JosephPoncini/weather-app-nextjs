'use client'

import React from 'react'
import "./SearchBarComponent.css"
import Image from 'next/image'; 
import searchIcon from "@/assets/MagnifyingGlass.png";

interface ISearch {
    onChangeHandle : React.Dispatch<React.SetStateAction<string>>
    value: string
    searchBtnHandle : () => void
}

const SearchBarComponent = (props: ISearch) => {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            props.searchBtnHandle();
        }
    };

    return (
        <div className="flex justify-center items-center w-[300px] lg:w-[700px] h-[45px] relative">
            <input type="text" placeholder="Enter a City" className="w-full h-full rounded-full" onChange={(e)=> props.onChangeHandle(e.target.value)} value={props.value} onKeyDown={handleKeyDown}/>
            <Image onClick={props.searchBtnHandle} src={searchIcon} alt="Search Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 cursor-pointer" />
        </div>
    )
}

export default SearchBarComponent