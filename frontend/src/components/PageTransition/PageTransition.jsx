import { motion } from "motion/react"

function PageTransition({ children }) {
  return (
    <motion.div
      style={{ width: '100%', maxWidth: '100vw' }}  // Constrain width
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      { children }
    </motion.div>
  )
}

export default PageTransition;