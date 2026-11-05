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
    <section aria-label="BookNook featured books" className="bg-background px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
      <div className="site-container relative min-w-0">
        <Suspense fallback={<div className="h-[28rem] rounded-2xl bg-[#07352d] sm:h-[26rem] lg:h-[27rem]" />}>
          <Swiper
            modules={[Autoplay]}
            loop
            loopPreventsSliding={false}
            speed={1000}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            onSwiper={setSwiper}
            className="h-[28rem] w-full min-w-0 overflow-hidden rounded-2xl sm:h-[26rem] lg:h-[27rem]"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.image}>
                <div className="relative flex h-full min-w-0 items-center overflow-hidden bg-[#07352d]">
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(max-width: 640px) 100vw, 1280px"
                    className="object-cover object-[55%_center] sm:object-left"
                  />
                  <div className="absolute inset-0 bg-[#032c26]/75 sm:bg-[#032c26]/20" />
                  <div className="relative mx-auto flex w-full max-w-lg flex-col items-center px-6 pt-8 pb-24 text-center sm:mr-0 sm:ml-auto sm:w-[60%] sm:max-w-none sm:items-start sm:px-12 sm:py-8 sm:text-left lg:px-14">
                    <p className="flex min-h-8 items-center text-[10px] font-medium tracking-[0.14em] text-[#e5c58f] sm:text-xs">
                      {slide.label}
                    </p>
                    <h1 className="mt-3 flex min-h-[3.6em] items-center font-[family-name:var(--font-dm-serif)] text-[clamp(1.75rem,7vw,2.5rem)] leading-[1.2] text-[#fffaf1] sm:min-h-0 sm:text-3xl lg:text-5xl">
                      {slide.title}
                    </h1>
                    <p className="mt-4 flex min-h-[4.5em] items-center text-sm leading-relaxed text-[#e0ebe5] sm:min-h-0 sm:text-base">
                      {slide.description}
                    </p>
                    <Link
                      href="/all-books"
                      className="mt-5 inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-[#a9e9cd] px-6 text-sm font-medium text-[#102625] transition-colors hover:bg-[#c4f4dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a9e9cd]"
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
          className="absolute bottom-5 left-[calc(50%-3.25rem)] z-10 size-11 rounded-full border-[#a9e9cd]/60 bg-[#06251f]/60 text-white hover:bg-[#18453a] hover:text-white sm:inset-y-0 sm:left-3 sm:my-auto lg:left-5"
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
          className="absolute right-[calc(50%-3.25rem)] bottom-5 z-10 size-11 rounded-full border-[#a9e9cd]/60 bg-[#06251f]/60 text-white hover:bg-[#18453a] hover:text-white sm:inset-y-0 sm:right-3 sm:my-auto lg:right-5"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </section>
  );
};

export default Banner;
