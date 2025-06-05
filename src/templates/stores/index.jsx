"use client"
import React from 'react';
import Title from '@/components/title/title';
import Breadcrumb from '@/components/breadcrumb';
import StoresCard from '@/components/card/stores-card'
import StoreList from './StoreList'

const breadcrumbPath = [{ label: 'magazine', href: '/Magazine' }];

const StoresTemp = ({ stores, favStores = [] }) => {
  console.log("🚀 ~ StoresTemp ~ stores:", stores)

  return (
    <>
      <section className="mt-6 mb-10">
        <div className="container mx-auto px-4 lg:px-0">
          <Title title="Magazine populare" />
          {favStores.length > 0 && (
            <div className="mt-9 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-5">
              {favStores.map((item, idx) => (
                <StoresCard key={idx} data={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <StoreList stores={stores} />

      <div className="container mx-auto px-4 lg:px-0 mb-10">
        <Breadcrumb path={breadcrumbPath} />
      </div>
    </>
  );
};

export default StoresTemp;
