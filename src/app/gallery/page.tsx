"use client";

import Image from "next/image";

const imageGroups = {
  "Flash Fiber": [
    "images/Flash Fiber/front brochure.jpg",
    "images/Flash Fiber/back brochure.jpg",
    "images/Flash Fiber/portfolio 1.jpg",
    "images/Flash Fiber/portfolio 2.jpg",
    "images/Flash Fiber/promotion.jpg"
  ],
  Copper: [
    "images/Copper/front brochure.jpg",
    "images/Copper/back brochure.jpg",
    "images/Copper/portfolio 1.jpg",
    "images/Copper/portfolio 2.jpg"
  ],
  Insurance: ["images/Insurance/1.jpg", "images/Insurance/2.jpg"]
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-center flex-1">Package Gallery</h1>
        <button
          onClick={() => (window.location.href = "/form")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium ml-4"
        >
          Back to Form
        </button>
      </div>

      {Object.entries(imageGroups).map(([category, images]) => (
        <section key={category} className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((src, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={`/${src}`}
                  alt={src.split("/").pop() || "Image"}
                  width={800}
                  height={600}
                  className="object-cover w-full h-60"
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
