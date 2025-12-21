import { motion } from "framer-motion";
import Image from "next/image";

export function Logo() {
  return (
    <motion.div
      initial={{ scale: 0.1, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 20 }}
      className="text-center"
    >
      <Image
        src="/logo.png"
        alt="Geek Creations"
        width={100}
        height={100}
        objectFit="contain"
        className="w-10 h-10 md:w-14 md:h-14 rounded-full mix-blend-difference drop-shadow-2xl"
      />
    </motion.div>
  );
}
