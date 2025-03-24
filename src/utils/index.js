export const removeProtocol = (url) => {
    if (!url) return "#";
    const u = url.replace(/^(https?:\/\/)/, '');    
    return u.charAt(0).toUpperCase() + u.slice(1);
};



export function isExpired(expireDate) {
    const currentDate = new Date().toISOString().split('T')[0];
    return expireDate < currentDate;
}


export const getUniqueCategories = (coupons) => {
    const uniqueCategories = Array.from(
        new Map(
            coupons?.flatMap(coupon => coupon?.categories)
                ?.map(category => [category.Slug, category])
        ).values()
    );

    return uniqueCategories
}


export const getCurrentMonthYear = () => {
    const date = new Date();
    const options = { month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("ro-RO", options);
    // Capitalize the first letter of the formatted date
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};



export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("ro-RO", options);
    return formattedDate;
};


const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return "th"; // Special case for 11th, 12th, 13th
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
};


export async function getActiveAndDisabledCoupons(coupons) {  
    const { activeCoupon, disableCoupon } = coupons?.reduce(
      (acc, item) => {
        const isExpired = item.ExpireDate < new Date().toISOString().split('T')[0];
        isExpired ? acc.disableCoupon.push(item) : acc.activeCoupon.push(item);
        return acc;
      },
      { activeCoupon: [], disableCoupon: [] }
    );
  
    return { activeCoupon, disableCoupon };
  }


  export const removeQueryParams = () => {
    const url = new URL(window.location);
    url.search = ""; // Clears all query parameters
    window.history.replaceState({}, document.title, url);
  }

