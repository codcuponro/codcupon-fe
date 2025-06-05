"use client";

import React, { useState, useMemo } from "react";
import Breadcrumb from "@/components/breadcrumb";
import CouponList from "@/components/card/coupon-list";
import Faqs from "@/components/faqs/faqs";
import { Pagination } from "@mui/material";
import Image from "next/image";

const CategorySingleTemp = ({ params, data, categories, coupons }) => {
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    
    const categoryTitle = params?.replace(/-/g, " ");
    
    const breadcrumbPath = useMemo(() => [
        { label: "Categorii", href: "/categorii" },
        { label: categoryTitle, href: `/categorii/${params}` }
    ], [params, categoryTitle]);


    const totalCoupons = coupons?.length || 0;
    const totalPages = Math.ceil(totalCoupons / itemsPerPage);

    const paginatedCoupons = useMemo(() => (
        coupons?.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    ), [data, page, itemsPerPage]);

    

    return (
        <section className="container mx-auto px-4 lg:px-0 mt-5 md:mb-[50px]">
            <div className="flex flex-col sm:flex-row items-start gap-8">
                <div className="max-w-[634px]">
                    <h2 className="text-dark font-semibold leading-9 mb-[10px] text-[28px]">
                        {data?.Name}
                    </h2>
                    <p className='font-medium'>{data?.Excerpt}</p>
                </div>
            </div>

            {/* Coupon List & Sidebar */}
            <div className="mt-8 flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                    <div className="flex flex-col gap-6">
                        {paginatedCoupons?.map((item, idx) => (
                            <CouponList key={idx} item={item} logo />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalCoupons > itemsPerPage && (
                        <div className="flex justify-center pt-12">
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, newPage) => setPage(newPage)}
                                variant="outlined"
                                shape="rounded"
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        color: "#637381",
                                        borderColor: "#DFE4EA",
                                        width: "34px",
                                        height: "34px",
                                        minWidth: "34px",
                                        borderRadius: "6px",
                                    },
                                    "& .MuiPaginationItem-root:hover": {
                                        backgroundColor: "#6D28D9",
                                        color: "#fff",
                                    },
                                    "& .MuiPaginationItem-root.Mui-selected": {
                                        backgroundColor: "#6D28D9",
                                        color: "#fff",
                                        borderColor: "#6D28D9",
                                    },
                                    "& .MuiPaginationItem-root.Mui-selected:hover": {
                                        backgroundColor: "#0056b3",
                                    },
                                }}
                            />
                        </div>
                    )}

                    {/* FAQs Section */}
                    {/* <div className="mt-12">
                    <Faqs name={data?.Name} />
                    </div> */}
                </div>

                {/* Sidebar */}
                <aside className="w-[286px]">
                    <h3 className="text-xl text-dark font-semibold mb-5">Categorii</h3>
                    <div className="flex flex-wrap gap-2.5 mt-2.5">
                        {categories?.map((item, idx) => (
                            <a key={idx} href={`/categorii/${item?.Slug}`} className="no-underline">
                                <button
                                    className={`font-medium flex text-sm sm:text-base group items-center rounded-full px-2.5 py-[3px] gap-1 
                                        ${item?.Slug === params
                                            ? "bg-[#6D28D9] text-white"
                                            : "hover:bg-[#6D28D9] bg-[#E9EDF4] text-[#637381] hover:text-white"
                                        }`}
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                >
                                    {/* <Image
                                        src={hoveredIdx === idx || item?.Slug === params 
                                            ? "/svg/category.svg" 
                                            : "/svg/category2.svg"}
                                        alt=""
                                        width={15}
                                        height={15}
                                        className="w-[15px]"
                                    /> */}
                                    <Image
                                        src={item?.Icon?.url}
                                        alt=""
                                        width={15}
                                        height={15}
                                        className={`w-[15px] group-hover:invert ${item?.Slug === params && "invert"}`}
                                    />
                                    {item?.Name}
                                </button>
                            </a>
                        ))}
                    </div>

                    <div className="mt-8">
                        <p>{data?.Short_Info}</p>
                    </div>
                </aside>
            </div>

            {/* Breadcrumb */}
            <div className="mt-16 mb-10">
                <Breadcrumb path={breadcrumbPath} />
            </div>
        </section>
    );
};

export default CategorySingleTemp;
