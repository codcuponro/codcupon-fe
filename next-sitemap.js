const fs = require("fs");
const qs = require("qs")

const SITE_URL = "https://www.codcupon.ro";
const Request = async (endpoint, options = {}) => {
    const url = `https://king-prawn-app-tflmf.ondigitalocean.app/api${endpoint}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            next: { revalidate: 60 },
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        });
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
function getFormattedDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const offsetMinutes = now.getTimezoneOffset();
  const sign = offsetMinutes > 0 ? "-" : "+";
  const offsetHours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, "0");
  const offsetMins = String(Math.abs(offsetMinutes) % 60).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMins}`;
}



const categoryParams = qs.stringify({
    pagination: {
        limit: 2000
    }
})

const storeParams = qs.stringify({
    pagination: {
        limit: 2000
    }
})


async function generateSitemap() {

    const stores = await Request(`/stores?${storeParams}`);
    const categories = await Request(`/categories?${categoryParams}`);


    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
          <loc>${SITE_URL}/despre-noi</loc>
          <lastmod>${getFormattedDateTime()}</lastmod>
          <priority>1.00</priority>
      </url>
      <url>
          <loc>${SITE_URL}/</loc>
          <lastmod>${getFormattedDateTime()}</lastmod>
          <priority>1.00</priority>
      </url>
      <url>
          <loc>${SITE_URL}/fisiere-cookies</loc>
          <lastmod>${getFormattedDateTime()}</lastmod>
          <priority>1.00</priority>
      </url>
      <url>
          <loc>${SITE_URL}/politica-confidentialitate</loc>
          <lastmod>${getFormattedDateTime()}</lastmod>
          <priority>1.00</priority>
      </url>
      <url>
          <loc>${SITE_URL}/termeni-si-conditii</loc>
          <lastmod>${getFormattedDateTime()}</lastmod>
          <priority>1.00</priority>
      </url>
      <url>
          <loc>${SITE_URL}/categorii</loc>
          <lastmod>${getFormattedDateTime()}</lastmod>
          <priority>1.00</priority>
      </url>
      <url>
          <loc>${SITE_URL}/magazine</loc>
          <lastmod>${getFormattedDateTime()}</lastmod>
          <priority>1.00</priority>
      </url>
      <url>
          <loc>${SITE_URL}/contact</loc>
          <lastmod>${getFormattedDateTime()}</lastmod>
          <priority>1.00</priority>
      </url>
      <url>
          <loc>${SITE_URL}/top-coduri-reducere</loc>
          <lastmod>${getFormattedDateTime()}</lastmod>
          <priority>1.00</priority>
      </url>
      ${stores?.data?.map((item) => `
        <url>
          <loc>${SITE_URL}/${item?.Slug}</loc>
          <lastmod>${getFormattedDateTime()}</lastmod>
          <priority>0.80</priority>
        </url>
      `).join("")}
      ${categories?.data?.map((item) => `
        <url>
          <loc>${SITE_URL}/categorii/${item?.Slug}</loc>
          <lastmod>${item?.updatedAt}</lastmod>
          <priority>0.80</priority>
        </url>
      `).join("")}
    </urlset>
  `;
    fs.writeFileSync("public/sitemap.xml", sitemap);
}

generateSitemap();


