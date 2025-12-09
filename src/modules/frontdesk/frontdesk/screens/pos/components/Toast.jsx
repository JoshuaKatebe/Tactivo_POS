import { motion } from "framer-motion";

export default function Toast({ message, type }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-5 right-5 px-5 py-3 rounded text-white ${
        type === "error" ? "bg-red-500" : "bg-green-600"
      }`}
    >
      {message}
    </motion.div>
  );
}
