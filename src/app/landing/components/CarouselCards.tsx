import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import Link from "next/link";

type Company = {
  name: string;
  description: string;
  rating: number;
};

const AutoScrollingCarousel = ({ companies }: { companies: Company[] }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollAmount = 1; 
    let interval: NodeJS.Timeout;

    const startScrolling = () => {
      interval = setInterval(() => {
        if (!isPaused && scrollContainer) {
          if (
            scrollContainer.scrollLeft >=
            scrollContainer.scrollWidth - scrollContainer.clientWidth
          ) {
            scrollContainer.scrollLeft = 0; 
          } else {
            scrollContainer.scrollLeft += scrollAmount;
          }
        }
      }, 30); 
    };

    startScrolling();
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="relative mt-10 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        ref={scrollRef}
        className="flex space-x-5 overflow-x-auto  p-10 "
      >
        {companies.map((company, index) => (
          <motion.div
            key={index}
            className="bg-darkBlue p-6 rounded-lg shadow-lg w-[420px] h-[240px] flex-shrink-0 flex flex-col space-y-3 mt-10 "
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
              <h3 className="text-2xl text-white font-bold">{company.name}</h3>
            </div>
            <p className="text-gray-300 text-lg">{company.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 mt-3">

              <div className="bg-customYellow text-white px-3 py-1 rounded-lg text-lg font-bold">
                  {company.rating.toFixed(1)}
                </div>
                <div className="flex text-yellow-400">

                  {/* Rating logic */}
                  {Array.from({ length: 5 }, (_, i) => (
                    <span className="text-2xl" key={i}>
                      {i < Math.round(company.rating) ? "★" : "☆"}
                    </span>
                  ))}
                </div>

                
              </div>
              <Link href="/sign-in">
              <button className="bg-white text-darkBlue px-6 py-2 mt-7 rounded flex items-center space-x-2">
                <Bookmark className="w-5 h-5" />
                
                <span className="font-bold">Save</span>
              </button></Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AutoScrollingCarousel;
