import { INavBar } from '@/interfaces/interfaces';
import { getlocalStorage } from '@/utils/LocalSotrage'
import React from 'react'



const FavoriteCityComponent = (props: INavBar) => {
    let favoritesArray = getlocalStorage();


    return (

        <div className='flex'>
            {(favoritesArray.length > 0) ? <div className='mx-2 whitespace-nowrap'>|</div> : null}
            {
                (favoritesArray.length > 0) ? favoritesArray.map((location, idx) => {
                    return (
                        <div key={idx} className='flex'>
                            <div onClick={()=> props.searchClickHandle(location)} className='mx-2 whitespace-nowrap cursor-pointer'>{location}</div>
                            <div className='mx-2 whitespace-nowrap'>|</div>
                        </div>
                    )
                }) : null
            }
        </div>
    )
}

export default FavoriteCityComponent