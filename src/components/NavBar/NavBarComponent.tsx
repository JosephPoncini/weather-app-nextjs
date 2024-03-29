"use client";

import Image from 'next/image';
import cloudSun from "@/assets/CloudSun.png";
import caretUp from '@/assets/CaretUp.png';
import "./NavBarComponent.css"
import { useState } from 'react';
import FavoriteCityComponent from './FavoriteCityComponent';
import { INavBar } from '@/interfaces/interfaces';

export default function NavBarComponent(props: INavBar) {
    const [isFavorites, setIsFavorites] = useState<boolean>(false);
    const [carotClassName, setCarotClassName] = useState<string>("w-[32px] transform -translate-y-1")

    const handleToggle = () => {
        setIsFavorites(!isFavorites);

        if(isFavorites){
            setCarotClassName("w-[32px] transform -translate-y-1") 
        }else{
            setCarotClassName("w-[32px] transform rotate-180 -translate-y-1 ") 
        }
    }
    
    return (

        <div className='w-screen px-[50px] pb-5 bg-teal ' >
            <div className="bg-teal text-white flex justify-between">
                <div className='flex items-center font-ThabitBold text-[40px]'>
                    <Image className='w-[90px]' src={cloudSun} alt="weather icon" />
                    <div className='transform translate-y-2'>JOES WEATHER FORECAST</div>
                </div>
                <div onClick={handleToggle} className=' font-Thabit text-[24px] self-center flex justify-end transform translate-y-2 cursor-pointer'>
                    <div className=' me-6' >FAVORITES</div>
                    <Image className={carotClassName} src={caretUp} alt="carot"/>
                </div>
            </div>
            {
                isFavorites? <div className="bg-teal  text-white  h-16 p-5 flex overflow-x-auto ">
                    <FavoriteCityComponent searchClickHandle={props.searchClickHandle}/>
                </div> : null             
            }

        </div>


    );
}
