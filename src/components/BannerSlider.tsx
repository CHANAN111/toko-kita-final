// src/components/BannerSlider.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { type EmblaCarouselType } from "embla-carousel"; // <-- Ambil tipe dari sini
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

// (Tipe Banner dan BannerSliderProps tidak berubah)
type Banner = {
  id: number;
  image_url: string;
  link_url: string;
};
type BannerSliderProps = {
  banners: Banner[];
};

export default function BannerSlider({ banners }: BannerSliderProps) {
  // 2. Inisialisasi plugin Autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4000 })] // Berjalan otomatis setiap 4 detik
  );

  // 3. State untuk menyimpan dan menampilkan titik navigasi
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fungsi untuk scroll ke slide yang dipilih (saat titik diklik)
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  // Dengarkan event 'select' dari Embla untuk tahu slide mana yang aktif
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = (emblaApi: EmblaCarouselType) => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    // Pastikan kita juga set index saat pertama kali load
    onSelect(emblaApi);

    // Cleanup listener saat komponen dibongkar
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (banners.length === 0) {
    return null;
  }

  return (
    // 4. Kita tambahkan 'relative' di wrapper agar bisa menaruh titik di atasnya
    <div className="relative rounded-lg overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div
              className="relative flex-[0_0_100%] h-64 md:h-96"
              key={banner.id}
            >
              <Link href={banner.link_url}>
                <Image
                  src={banner.image_url}
                  alt={`Promo banner ${banner.id}`}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Render Titik Navigasi (Dots) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-3 w-3 rounded-full ${
              index === selectedIndex ? "bg-white" : "bg-white/50"
            } transition-all`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
