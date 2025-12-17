import { motion } from "framer-motion";
import Image from "next/image";

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-center"
    >
      <Image
        src="/logo.png"
        alt="Geeks Creation"
        width={100}
        height={100}
        objectFit="contain"
        className="w-10 h-10 md:w-14 md:h-14 rounded-full mix-blend-difference drop-shadow-2xl"
      />
    </motion.div>
  );
}
