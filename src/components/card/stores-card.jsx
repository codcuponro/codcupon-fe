import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const StoresCard = ({data}) => {
    return (
        <div className='border bg-pure rounded-lg overflow-hidden flex flex-col justify-between'>
            <figure className='overflow-hidden'>
                <a href={`/magazine/${data.Slug}`}>                
                    <Image src={data?.Icon?.url || "/images/fallback.png"} alt="" width="218" height="130" className='w-full h-[150px] object-cover scale-105' />
                </a>
            </figure>
            <div className='p-[15px] flex justify-center'>
                <button className='bg-[#F3F4F6] px-2.5 text-xs text-dark font-bold py-1 rounded-full'>{data?.coupons_and_deals?.length} Coupons and Deals</button>
            </div>
        </div>
    )
}

export default StoresCard