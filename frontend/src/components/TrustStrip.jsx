import { motion } from "framer-motion";

const itemVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

export default function TrustStrip() {
  return (
    <section className="bg-[#f7efe6] border-t border-[#e6d6c3]">
      <motion.div
        className="max-w-6xl mx-auto px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-80px" }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.18,
            },
          },
        }}
      >
        <motion.div variants={itemVariant}>
          🪔
          <br />
          Pure Materials
        </motion.div>

        <motion.div variants={itemVariant}>
          🛠
          <br />
          Trusted Local Shop
        </motion.div>

        <motion.div variants={itemVariant}>
          🏺
          <br />
          Traditional Craftsmanship
        </motion.div>

        <motion.div variants={itemVariant}>
          🛡
          <br />
          Quality Assured
        </motion.div>
      </motion.div>
    </section>
  );
}
