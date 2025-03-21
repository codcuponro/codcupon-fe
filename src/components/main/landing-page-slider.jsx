"use client"
import Image from 'next/image';
import React from 'react'
import Slider from "react-slick";
import { LuChevronRight, LuChevronLeft } from "react-icons/lu";
import Link from 'next/link';

const LandingPageSlider = ({ data }) => {
    const slider = React.useRef(null);
    return (
        <main className='my-7 md:my-[10px] md:mb-8 max-w-[2200px] relative mx-auto'>
            <Slider {...settings} ref={slider} key={1}>
                {
                    data?.map((item, idx) => (
                        <div className='px-1 sm:px-2 lg:p-[15px]'>
                            <div key={idx} className='border border-[#DEE2E6] rounded-[20px] overflow-hidden'>
                                <a href={`/magazine/`+item?.store?.Slug || "#"}>
                                    <Image src={item?.Feature_image?.url} alt="" width={575} height={265} className='w-full h-[265px] 3xl:h-[460px] object-cover cImg' />
                                </a>
                                <div className='p-2 lg:p-6 pt-2 lg:pt-4 flex gap-4'>
                                    <div>
                                        <a href={`/magazine/`+item?.store?.Slug || "#"} className='flex flex-col justify-center outline-none -mt-7 w-20 h-20 lg:w-[130px] lg:h-[130px] lg:-mt-12 border rounded-xl lg:rounded-[20px] overflow-hidden bg-pure border-[#DEE2E6]'>
                                            <Image src={item?.Icon?.url || item?.store?.Icon?.url} alt='' width={130} height={130} className=' w-full lg:w-[130px] ' />
                                        </a>
                                    </div>
                                    <div>
                                        <Link href={`/magazine/`+item?.store?.Slug || "#"} className='font-bold text-[#111928] text-sm mb-1'>
                                            <p>{item?.CouponsType === "Promotion" ? "Promotion" : "Coupon"}{" "}{item?.store?.Name}</p>
                                        </Link>
                                        <p className='text-[#111928] font-medium sm:text-xl lg:text-2xl line-clamp-2'>
                                            <Link href={`/magazine/`+item?.store?.Slug || "#"}>{item?.Title}</Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </Slider>
            <div className='flex justify-center text-xl gap-2.5 mt-5'>
                <button className='p-[8.3px] border rounded-full hover:bg-primary hover:text-white' onClick={() => slider?.current?.slickPrev()}>
                    <LuChevronLeft />
                </button>
                <button className='p-[8.3px] border rounded-full hover:bg-primary hover:text-white' onClick={() => slider?.current?.slickNext()}>
                    <LuChevronRight />
                </button>
            </div>
            <div className='bg-gradient-to-r from-white/50 via-white/30 to-transparent w-10 sm:w-24 lg:w-[180px] h-full absolute top-0 left-0' />
            <div className='bg-gradient-to-l from-white/50 via-white/30 to-transparent w-10 sm:w-24 lg:w-[180px] h-full absolute top-0 right-0' />
        </main>
    )
}

export default LandingPageSlider



const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "160px",
    slidesToShow: 2,
    speed: 500,
    arrows: false,
    // autoplay: true,
    responsive: [
        {
            breakpoint: 1600,
            settings: {
                slidesToShow: 2
            }
        },
        {
            breakpoint: 1280,
            settings: {
                slidesToShow: 2,
                centerPadding: "100px",
            }
        },
        {
            breakpoint: 1000,
            settings: {
                slidesToShow: 1,
                centerPadding: "60px",
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                centerPadding: "20px",
            }
        },
    ]
};


const sliderData = [

]