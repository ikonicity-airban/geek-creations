import { motion } from "framer-motion";
import Image from "next/image";

export function Logo() {
  return (
    <motion.div
      initial={{ scale: 0.1, y: 1, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 20 }}
      className="text-center flex items-center justify-center rounded-full w-12 h-12 md:w-14 md:h-14 "
    >
      <Image
        src="/logo-christmas.png"
        alt="Geek Creations"
        width={100}
        height={100}
      />
    </motion.div>
  );
}
