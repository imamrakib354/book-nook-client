"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Button } from "@/components/ui/button";

const slides = [
  {
    image: "/images/slider-1.png",
    label: "THE COMMUNITY BOOK LIBRARY",
    title: "Every story deserves a second reader.",
    description: "Discover inspiring books. Share your own. Borrow with ease.",
  },
  {
    image: "/images/slider-2.png",
    label: "FIND YOUR NEXT FAVORITE",
    title: "Your next great read is waiting.",
    description: "Explore shared books and find a story you will love.",
  },
  {
    image: "/images/slider-3.png",
    label: "READ. SHARE. REPEAT.",
    title: "Let a new chapter begin.",
    description: "Give books a new home and discover your next adventure.",
  },
];

const Banner = () => {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

  return (
    <section aria-label="BookNook featured books" className="bg-background px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
      <div className="site-container relative">
        <Suspense fallback={<div className="h-[380px] rounded-2xl bg-[#07352d]" />}>
          <Swiper
            modules={[Autoplay]}
            loop
            loopPreventsSliding={false}
            speed={1000}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            onSwiper={setSwiper}
            className="overflow-hidden rounded-2xl"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.image}>
                <div className="relative flex min-h-[380px] items-center overflow-hidden bg-[#07352d]">
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(max-width: 640px) 100vw, 1280px"
                    className="object-cover object-[55%_center] sm:object-left"
                  />
                  <div className="absolute inset-0 bg-[#032c26]/40 sm:bg-transparent" />
                  <div className="relative mx-auto max-w-lg px-16 py-12 text-center sm:mr-0 sm:ml-auto sm:w-[55%] sm:max-w-none sm:px-8 sm:text-left lg:px-12">
                    <p className="text-xs font-medium tracking-[0.14em] text-[#e5c58f]">
                      {slide.label}
                    </p>
                    <h1 className="mt-5 font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-[#fffaf1] lg:text-5xl">
                      {slide.title}
                    </h1>
                    <p className="mt-4 text-sm leading-relaxed text-[#e0ebe5] sm:text-base">
                      {slide.description}
                    </p>
                    <Link
                      href="/all-books"
                      className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-[#a9e9cd] px-6 text-sm font-medium text-[#102625] transition-colors hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]"
                    >
                      Browse Books
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Suspense>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Previous slide"
          disabled={!swiper}
          onClick={() => swiper?.slidePrev()}
          className="absolute inset-y-0 left-3 z-10 my-auto size-11 rounded-full border-[#a9e9cd]/60 bg-[#06251f]/60 text-white hover:bg-[#18453a] hover:text-white sm:left-5"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Next slide"
          disabled={!swiper}
          onClick={() => swiper?.slideNext()}
          className="absolute inset-y-0 right-3 z-10 my-auto size-11 rounded-full border-[#a9e9cd]/60 bg-[#06251f]/60 text-white hover:bg-[#18453a] hover:text-white sm:right-5"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </section>
  );
};

export default Banner;
