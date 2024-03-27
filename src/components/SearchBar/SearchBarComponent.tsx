'use client'

import React from 'react'
import "./SearchBarComponent.css"
import Image from 'next/image'; 
import searchIcon from "@/assets/MagnifyingGlass.png";


const SearchBarComponent = () => {
    return (
        <div className="flex justify-center items-center w-[700px] h-[45px] relative">
            <input type="text" placeholder="Enter a City" className="w-full h-full rounded-full"/>
            <Image src={searchIcon} alt="Search Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8" />
        </div>
    )
}

export default SearchBarComponent