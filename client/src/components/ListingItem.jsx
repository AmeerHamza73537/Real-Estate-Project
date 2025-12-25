import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
      <Link to={`/listing/${listing._id}`} className="block h-full">
        {/* Image */}
        <div className="h-52 w-full overflow-hidden relative">
          <img
            src={listing.imageUrls[0]}
            alt="listing cover"
            className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
          />

          {/* Type badge */}
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full text-white
            ${listing.type === "rent" ? "bg-blue-600" : "bg-purple-600"}
          `}
          >
            {listing.type === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <p className="text-lg font-bold text-slate-800 truncate">
            {listing.name}
          </p>

          <div className="flex items-center gap-1 text-sm text-slate-600">
            <MdLocationOn className="text-green-700 text-lg" />
            <p className="truncate">{listing.address}</p>
          </div>

          <p className="text-xl font-extrabold text-green-700">
            $
            {(listing.offer
              ? listing.discountPrice
              : listing.regularPrice
            ).toLocaleString("en-US")}
            {listing.type === "rent" && (
              <span className="text-sm text-slate-500"> / month</span>
            )}
          </p>

          <div className="flex justify-between border-t pt-3 mt-2 text-sm text-slate-700 font-semibold">
            <span>🛏 {listing.bedrooms} Beds</span>
            <span>🛁 {listing.bathrooms} Baths</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
