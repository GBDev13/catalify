import { Variants } from 'framer-motion'

export const fadeAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

export const fadeUpDownVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const fadeAnimProps = {
  initial: "hidden",
  exit: "hidden",
  whileInView: "visible",
  variants: fadeUpDownVariants,
  transition: {
    type: "spring",
  },
  viewport: {
    margin: "-150px"
  }
}

export const fadeLeftRightVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

export const fadeLeftRightAnimProps = {
  initial: "hidden",
  exit: "hidden",
  whileInView: "visible",
  variants: fadeLeftRightVariants,
  transition: {
    type: "spring",
  },
  viewport: {
    margin: "-150px"
  }
}

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { opacity: 1, scale: 1 },
}

export const scaleUpAnimProps = {
  initial: "hidden",
  exit: "hidden",
  whileInView: "visible",
  variants: scaleUpVariants,
  transition: {
    type: "spring",
  },
  viewport: {
    margin: "-150px"
  }
}