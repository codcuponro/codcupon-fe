import Link from 'next/link'
import React from 'react'
import { LuMapPin } from "react-icons/lu";
import { AiOutlinePhone } from "react-icons/ai";
import { FaRegEnvelope } from "react-icons/fa6";
import { FiFacebook } from "react-icons/fi";
import { TbWorldWww } from "react-icons/tb";
import { formatDate, getActiveAndDisabledCoupons, getCurrentMonthYear, getSortedData, getUniqueCategories } from '@/utils';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import TOC from "../../templates/stores/toc"
import IconImage from "../../components/icon-image"
import PopularSearch from "../../templates/stores/popular-search"

import CouponList from '@/components/card/coupon-list'
import CategoryButton from '@/components/card/category-button'
import Faqs from '@/components/faqs/faqs'
import Breadcrumb from '@/components/breadcrumb'
import Rating from '@/components/rating'


const CouponSingle = async ({singleStore, param}) => {

    const { activeCoupon, disableCoupon } = await getActiveAndDisabledCoupons(singleStore?.coupons_and_deals)
    const sortedCoupon = getSortedData(activeCoupon)
    const dateLateUpdate = formatDate(sortedCoupon[0]?.publishedAt || singleStore?.updatedAt)

    const categories = getUniqueCategories(singleStore?.coupons_and_deals)
    const currentYear = new Date().getFullYear();

    const breadcrumbPath = [
      {
        label: 'Magazine',
        href: '/magazine'
      },
      {
        label: param?.replace(/-/g, ' '),
        href: `/${param}`
      }
    ]

    const faqsList = [
      {
        question: `Cate vouchere si oferte sunt disponibile pentru ${singleStore?.Name}?`,
        answer: `In acest moment, sunt active ${activeCoupon?.length} vouchere si oferte pe care le puteti folosi pe site-ul celor de la ${singleStore?.Name}.`
      },
      {
        question: `Cum folosesc codul de reducere ${singleStore?.Name}?`,
        answer: `Pentru a folosi codul de reducere ${singleStore?.Name}, adauga produsele dorite in cos, apoi apasa pe cosul de cumparaturi sau butonul de checkout. Copiaza codul de reducere din aceasta pagina si adauga-l in campul Cod promotional si apasa pe butonul Aplica.`
      },
      {
        question: `De ce codul de reducere ${singleStore?.Name} nu functioneaza?`,
        answer: `De regula, pe <a href="/">CodCupon.ro</a> veti gasi doar coduri de reducere active, insa in cazul in care comerciantul a dezactivat acest cod, el nu va functiona. `
      },
      {
        question: `Cand o sa fie ${singleStore?.Name} Black Friday ${currentYear}?`,
        answer: `In mod obisnuit, ${singleStore?.Name} Black Friday are loc in ultima vineri din luna Noiembrie, dar aceasta nu este o regula bine definita, ${singleStore?.Name} poate decide sa inceapa Black Friday mai devreme. Aboneaza-te la newsletetter-ul nostru si vei fi primul care va afla cand are loc ${singleStore?.Name} Black Friday.`
      },
    ]

    const events = activeCoupon?.map((item) => {
      return {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": item?.Title,
        "startDate": "2025-11-29T09:00:00+02:00",
        "endDate": "2025-11-30T23:59:00+02:00",
        "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "VirtualLocation",
          "url": "https://codcupon.ro/"
        },
        "image": [
          singleStore?.Icon?.url
        ],
        "description": item?.Title,
        "organizer": {
          "@type": "Organization",
          "name": "codcupon",
          "url": "https://codcupon.ro"
        },
        "performer": {
          "@type": "Organization",
          "name": singleStore?.Name
        },
        "offers": {
          "@type": "Offer",
          "url": `https://codcupon.ro/${singleStore?.Slug}`,
          "price": "0",
          "priceCurrency": "RON",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-11-29T09:00"
        }
      }
    })

    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://codcupon.ro/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "magazine",
            "item": "https://codcupon.ro/magazine"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": singleStore?.Name,
            "item": `https://codcupon.ro/${singleStore?.Slug}`
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": singleStore?.Name,
        "description": singleStore?.Excerpt,
        "brand": {
          "@type": "Organization",
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": singleStore?.Rating || 5,
          "reviewCount": 187
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Coupons and Offers",
          "itemListElement": singleStore?.coupons_and_deals?.map(coupon => ({
            "@type": "Offer",
            "name": singleStore?.Name,
            "description": coupon.Title,
            "url": `https://www.codcupon.ro/${singleStore?.Slug}`,
            "priceCurrency": "RON",
            "price": "0",
            "availability": "https://schema.org/InStock",
            "validThrough": "2025-12-31"
          }))
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqsList.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]

    if (events?.length) {
      jsonLd.push(...events);
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <section className='container mx-auto px-4 lg:px-0 mt-5 mb:my-[50px]'>
          <div className='flex flex-row items-start gap-2 sm:gap-[30px]'>
            <IconImage singleStore={singleStore} />
            <div className='max-w-[70%]'>
              <h1 className='text-dark font-semibold text-xl md:text-[28px]'>Cod reducere {singleStore?.Name}, Vouchere si Oferte <span className='capitalize'>{getCurrentMonthYear()}</span>  </h1>
              {/* <p>{singleStore?.Excerpt}</p> */}
              <p className='mt-[10px] font-medium'>Aici gasesti cele mai noi coduri de reducere {singleStore?.Name}, Vouchere si oferte alese cu grija si verificate de echipa CodCupon.</p>
              <Rating totalRating={singleStore?.Rating} />
              <p className='text-xs font-medium mt-2.5'>Ultima actualizare de <Link href="/despre-noi" className='underline'>{singleStore?.author?.Name}</Link> la <span className='capitalize'>{dateLateUpdate}</span></p>
            </div>
          </div>

          <div className='mt-[30px]'>
            {
              activeCoupon?.length > 0 && <h2 className='text-xl text-dark font-semibold mb-5'>{activeCoupon?.length} Coduri Reducere si Oferte Active</h2>
            }
            <div className='flex flex-col lg:flex-row gap-[50px]'>
              <div className='flex-1'>
                <div className='flex flex-col gap-[25px]'>
                  {
                    activeCoupon?.length > 0 &&
                    sortedCoupon?.map((item, idx) => (
                      <CouponList key={idx} item={item} />
                    ))
                  }
                </div>
                {
                  disableCoupon?.length > 0 && <>
                    <h3 className={`text-xl text-dark font-semibold mb-5 ${activeCoupon?.length > 0 && "mt-10"}`}>{disableCoupon?.length} Coduri Reducere si Oferte Expirate</h3>
                    <div className='flex flex-col gap-[25px]'>
                      {
                        disableCoupon?.map((item, idx) => (
                          <CouponList key={idx} disabled item={item} />
                        ))
                      }
                    </div>
                  </>
                }

                <div className='single_store_content mt-10'>
                  {
                    singleStore &&
                    <BlocksRenderer content={singleStore?.Content} />
                  }
                </div>

                <Faqs name={singleStore?.Name} coupon={activeCoupon} allCoupon={singleStore?.coupons_and_deals} />
              </div>

              <aside className='w-[286px]'>
                <p className='text-xl text-dark font-semibold mb-5 '>Categorii</p>
                <div
                  style={{ marginTop: '10px' }}
                  className='flex flex-wrap gap-2.5'
                >
                  {
                    categories?.map((item, idx) => (
                      <CategoryButton key={idx} data={item} small />
                    ))
                  }
                </div>
                <div className='mt-[30px]'>
                  <h3 className='text-xl text-dark font-semibold mb-5 '>Contact</h3>
                  <ul>
                    {
                      singleStore?.Social?.Address &&
                      <li className='text-sm !flex gap-1'>
                        <i>
                          <LuMapPin className='w-4' />
                        </i>
                        <address className='-mt-1'>{singleStore?.Social?.Address}</address>
                      </li>
                    }

                    {
                      singleStore?.Social?.Telephone &&
                      <li className='text-sm !flex gap-1 mt-2'>
                        <i>
                          <AiOutlinePhone className='w-4' />
                        </i>
                        <span className='-mt-[3px]'>Telefon: <a href={`tel:${singleStore?.Social?.Telephone}`} target='_blank' className='underline'>{singleStore?.Social?.Telephone}</a></span>
                      </li>
                    }
                    {
                      singleStore?.Social?.Email &&
                      <li className='text-sm !flex gap-1 mt-2'>
                        <i>
                          <FaRegEnvelope className='w-4' />
                        </i>
                        <span className='-mt-[3px]'>Email: <a href={`mailto:${singleStore?.Social?.Email}`} target='_blank' className='underline'>{singleStore?.Social?.Email}</a></span>
                      </li>
                    }
                    {
                      singleStore?.Social?.Website &&
                      <li className='text-sm !flex gap-1 mt-2'>
                        <i>
                          <TbWorldWww className='w-4' />
                        </i>
                        <span className='-mt-[3px]'>Website: <a href={`https://${singleStore?.Social?.Website}`} target='_blank' className='underline'>{singleStore?.Social?.Website}</a></span>
                      </li>
                    }
                    {
                      singleStore?.Social?.Facebook &&
                      <li className='text-sm !flex gap-1 mt-2'>
                        <i>
                          <FiFacebook className='w-4' />
                        </i>
                        <span className='-mt-[3px]'>Facebook: <a href={`https://facebook.com${singleStore?.Social?.Facebook}`} target='_blank' className='underline'>{singleStore?.Social?.Facebook}</a></span>
                      </li>
                    }
                  </ul>
                </div>
                <PopularSearch />
                <TOC />
              </aside>
            </div>
          </div>
          <div className='mt-16 mb-10'>
            <Breadcrumb path={breadcrumbPath} />
          </div>
        </section>
      </>
    )
}

export default CouponSingle