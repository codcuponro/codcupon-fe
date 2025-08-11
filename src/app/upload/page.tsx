"use client";
import { Request } from "@/config/Axios";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import qs from "qs";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";

const Upload = () => {
  const [data, setData] = useState<any[]>([]);
  console.log("🚀 ~ Upload ~ data:", data);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [responseMessage, setResponseMessage] = useState("");
  const [successList, setSuccessList] = useState<
    { data: any; index: number }[]
  >([]);
  const [errorList, setErrorList] = useState<
    { row: number; error: string; data: any }[]
  >([]);
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt: any) => {
      const bstr = evt.target.result;
      let workbook;

      if (file.name.endsWith(".csv")) {
        // CSV file parsing
        workbook = XLSX.read(bstr, { type: "binary" });
      } else {
        // Excel file parsing
        workbook = XLSX.read(bstr, { type: "binary" });
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setData(jsonData);
      setSuccessList([]);
      setErrorList([]);
      setProgress(0);
      setResponseMessage("");
    };

    // For CSV, read as binary string still works fine with XLSX
    reader.readAsBinaryString(file);
  };

  const uploadToStrapi = async (item: any, index: number) => {
    let store, category;
    if (item?.Store) {
      store = await findOrCreate("stores", item.Store);
    }
    if (item?.Categories) {
      category = await findOrCreate("categories", item.Categories);
    }

    console.log("🚀 ~ uploadToStrapi ~ store, category:", store, category)
    
    try {
      const res = await Request(`/coupons-and-deals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            Title: item?.Title,
            // ShortInfo: item?.ShortInfo,
            Slug: item?.Title?.toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "") // remove special characters
              .replace(/\s+/g, "-") // replace spaces with hyphen
              .replace(/-+/g, "-") // remove multiple hyphens
              .replace(/^-|-$/g, ""), // trim starting/ending hyphen
            // Description: item?.Description,
            CouponsType:
              item?.["Coupon Type"] === "code" ? "Coupon Code" : "Promotion",
            CouponCode: item?.["Coupon Code"],
            // CouponUrl: item?.CouponUrl,
            ExpireDate: formatDateToYMD(item?.Expires), //Accepted Formate: 2026-07-27
            // StartDate: item?.StartDate,
            DiscountValue: item?.["Discount Value"],
            // FavoritesCoupon: item?.FavoritesCoupon,
            NumberOfCouponUsed: item?.["Number Coupon Used"],
            categories: category?.documentId,
            store: store?.documentId,
            // Feature_image: item?.Feature_image,
            // Rating: item?.Rating,
            // Slider: item?.Slider,
          },
        }),
      });
      // ✅ Only return success if data contains ID
      if (!res || !res.data || !res.data.id) {
        return {
          success: false,
          error: "Invalid response structure or missing ID",
          data: item,
          index,
        };
      }
      return { success: true, data: res, index };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Unknown error",
        data: item,
        index,
      };
    }
  };

  const handleUploadAll = async () => {
    if (!data.length) return;
    setUploading(true);
    setProgress(0);
    setSuccessList([]);
    setErrorList([]);
    setResponseMessage("Uploading...");

    const totalItems = data.length;

    for (let i = 0; i < totalItems; i++) {
      const item = data[i];
      const result = await uploadToStrapi(item, i);

      if (result.success) {
        setSuccessList((prev) => [...prev, { data: result.data, index: i }]);
      } else {
        setErrorList((prev) => [
          ...prev,
          {
            row: i + 1,
            error: result.error,
            data: item,
          },
        ]);
      }

      const newProgress = Math.round(((i + 1) / totalItems) * 100);
      setProgress(newProgress);
      setResponseMessage(
        `Uploading... ${newProgress}% complete (${i + 1}/${totalItems}) - ${
          successList.length + (result.success ? 1 : 0)
        } succeeded, ${errorList.length + (result.success ? 0 : 1)} failed`
      );
    }

    setUploading(false);
    setResponseMessage(
      `✅ Upload complete. ${successList.length} succeeded, ${errorList.length} failed.`
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <section className="container mx-auto flex justify-end px-3 pt-20">
        <button onClick={handleLogout} className="underline">
          Logout
        </button>
      </section>

      <section className="container mx-auto px-3 py-20">
        <h2 className="text-xl font-semibold mb-4">Upload Excel Sheet</h2>
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload}
          className="mb-6"
        />

        {data.length > 0 && (
          <>
            <button
              onClick={handleUploadAll}
              disabled={uploading}
              className="px-5 py-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload All Data"}
            </button>

            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            {responseMessage && (
              <p className="mb-6 text-sm">{responseMessage}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-green-700 mb-2">
                  ✅ Successfully Uploaded ({successList.length})
                </h3>
                <div className="bg-green-50 p-3 rounded text-sm max-h-64 overflow-y-auto space-y-2">
                  {successList.length > 0 ? (
                    successList.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-green-100 p-2 rounded border border-green-200"
                      >
                        <strong>Coupon {item?.index + 1}:</strong>{" "}
                        {item?.data.data?.Title}
                        <div className="text-xs text-green-600 mt-1">
                          ID: {item?.data.data?.id}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No successful uploads yet</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-red-700 mb-2">
                  ❌ Failed Uploads ({errorList.length})
                </h3>
                <div className="bg-red-50 p-3 rounded text-sm max-h-64 overflow-y-auto space-y-2">
                  {errorList.length > 0 ? (
                    errorList.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-red-100 p-2 rounded border border-red-200"
                      >
                        <strong>Coupon {item?.row}:</strong> {item?.data.Title}
                        <div className="text-xs text-red-600 mt-1">
                          Error: {item?.error}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No failed uploads yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Parsed Data Preview:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm max-h-64">
                {JSON.stringify(data.slice(0, 5), null, 2)}
              </pre>
              {data.length > 5 && (
                <div className="text-gray-500 mt-2">
                  ... and {data.length - 5} more items
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Upload;

function formatDateToYMD(dateStr: any) {
  const date: any = new Date(dateStr.split("/").reverse().join("-"));
  // Handles DD/MM/YYYY → YYYY-MM-DD
  if (isNaN(date)) {
    throw new Error("Invalid date format");
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const findOrCreate = async (type: any, title: any) => {
  const slug = title
    ?.toLowerCase()
    ?.replace(/[^a-z0-9\s-]/g, "") // remove special chars
    ?.replace(/\s+/g, "-");
  let data;
  const params = qs.stringify({
    filters: {
      Slug: { $eq: slug },
    },
  });
  let res = await Request(`/${type}?${params}`);
  data = res?.data?.[0];
  // If not found, create it
  if (!res?.data?.length) {
    const created = await Request(`/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          Name: title,
          Slug: slug,
        },
      }),
    });
    data = created.data;
  }

  return data;
};
