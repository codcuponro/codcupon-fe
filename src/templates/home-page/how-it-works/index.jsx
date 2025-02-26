import Title from '@/components/title/title'
import { BlocksRenderer } from '@strapi/blocks-react-renderer'
import React from 'react'

const HowItWorks = async ({data}) => {
  return (
    <section className='container mx-auto px-4 lg:px-0 mb-[75px]'>
      <Title
        title="How it works"
      />
      <div
        style={{ marginTop: '35px' }}
        className='gap-[30px] grid md:grid-cols-2 lg:grid-cols-3'
      >
        {
          data?.HowItswork?.map((item, idx) => (
            <div key={idx} className='border p-[42px] rounded-xl'>
              <img src={item?.Icon?.url} width={81} height={74} alt='' />
              <h6 className='mt-[30px] font-semibold text-2xl text-dark'>{idx + 1}. {" "} {item?.Title}</h6>
              <p className='text-text mt-[14px]'>{item?.Caption}</p>
            </div>
          ))
        }
      </div>
      {/* What we do */}

      <div style={{ marginTop: '35px' }}
        className='single_store_content'
      >
        {
          data &&
        <BlocksRenderer content={data?.Content} />
        }
      </div>

    </section>
  )
}

export default HowItWorks