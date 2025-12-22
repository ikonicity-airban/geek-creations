"use client";

import { motion } from "framer-motion";
import { Shirt, Coffee, Smartphone, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import Image from "next/image";
import { FollowerPointerCard } from "../ui/following-pointer";

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  image?: string;
  count: string;
  handle: string;
  size: "small" | "medium" | "large";
}

export const CategoryGrid = () => {
  const categories: Category[] = [
    {
      id: "1",
      name: "T-Shirts",
      icon: Shirt,
      image: "/img/tshirt.jpg",
      count: "150+ designs",
      handle: "t-shirts",
      size: "large",
    },
    {
      id: "2",
      name: "Hoodies",
      icon: Shirt,
      image: "/img/hoodie.jpg",
      count: "80+ designs",
      handle: "hoodies",
      size: "small",
    },
    {
      id: "3",
      name: "Mugs",
      icon: Coffee,
      image: "/img/mug.jpg",
      count: "60+ designs",
      handle: "mugs",
      size: "medium",
    },
    {
      id: "4",
      name: "Phone Cases",
      icon: Smartphone,
      image: "/img/phone-case.jpg",
      count: "120+ designs",
      handle: "phone-cases",
      size: "small",
    },
    {
      id: "5",
      name: "Tote Bags",
      icon: ShoppingBag,
      image: "/img/tote.jpg",
      count: "40+ designs",
      handle: "tote-bags",
      size: "small",
    },
  ];

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "large":
        return "md:col-span-4 md:row-span-3";
      case "medium":
        return "md:col-span-3 md:row-span-1";
      case "small":
        return "md:col-span-2 md:row-span-1";
      default:
        return "";
    }
  };

  const getIconSize = (size: string) => {
    switch (size) {
      case "large":
        return "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16";
      case "medium":
        return "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12";
      case "small":
        return "w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10";
      default:
        return "w-8 h-8 sm:w-10 sm:h-10";
    }
  };

  return (
    <section className="section-padding bg-background">
      <PageLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 sm:mb-3 text-foreground">
            Shop by Category
          </h1>
          <p className="text-sm sm:text-base md:text-lg px-4 text-muted-foreground">
            Find your perfect product type
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-9 gap-3 sm:gap-4 md:gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, y: -5 }}
              className={getSizeClasses(category.size) + " h-auto"}
            >
              <FollowerPointerCard
                title={
                  <div className="flex items-center gap-2 group">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 overflow-hidden">
                      <Image
                        src={
                          category.image ||
                          "/img/blank_isolated_white_and_black_t_shirt_front_view.png"
                        }
                        alt={category.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="mx-2 sm:mx-4">
                      <p className="text-xs sm:text-sm md:text-base">
                        {category.name}
                      </p>
                    </div>
                  </div>
                }
                className="h-full"
              >
                <Link href={`/collections/${category.handle}`}>
                  <div className="h-full rounded-card overflow-hidden cursor-pointer transition-smooth flex flex-col relative border-hairline bg-card border-border shadow-card hover:shadow-card-hover hover:border-primary">
                    {category.image ? (
                      <div className="relative w-full flex-1 min-h-[100px] sm:min-h-[120px] md:min-h-[140px] overflow-hidden">
                        <Image
                          width={300}
                          height={300}
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    ) : (
                      <div
                        className={`${getIconSize(
                          category.size,
                        )} mb-3 mt-4 mx-auto rounded-btn flex items-center justify-center shadow-card bg-primary`}
                      >
                        <category.icon
                          className={getIconSize(category.size)}
                          style={{ color: "currentColor" }}
                        />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 justify-center bg-card/80 backdrop-blur-sm border-t border-border">
                      <h5 className="text-xs sm:text-sm font-bold text-center text-card-foreground group-hover:text-primary">
                        {category.name}
                      </h5>
                    </div>
                  </div>
                </Link>
              </FollowerPointerCard>
            </motion.div>
          ))}
        </div>
      </PageLayout>
    </section>
  );
};
