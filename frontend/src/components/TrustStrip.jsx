import { motion } from "framer-motion";
import "../styles/TrustStrip.css";

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
    <section className="trust-strip">
      <motion.div
        className="trust-strip-container"
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
        <motion.div className="trust-item" variants={itemVariant}>
          🪔
          <span>Pure Materials</span>
        </motion.div>

        <motion.div className="trust-item" variants={itemVariant}>
          🛠
          <span>Trusted Local Shop</span>
        </motion.div>

        <motion.div className="trust-item" variants={itemVariant}>
          🏺
          <span>Traditional Craftsmanship</span>
        </motion.div>

        <motion.div className="trust-item" variants={itemVariant}>
          🛡
          <span>Quality Assured</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
