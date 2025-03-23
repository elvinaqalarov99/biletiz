import { HTMLMotionProps, motion } from "framer-motion";
import { useAnimationStore } from "@/store/animationStore";
import { ReactNode } from "react";

type AnimationProps = Omit<HTMLMotionProps<"div">, "ref"> & {
  children: ReactNode;
};

export const Animation = ({ children, ...props }: AnimationProps) => {
  const { isAnimationReady } = useAnimationStore();

  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isAnimationReady ? 1 : 0,
        y: isAnimationReady ? 0 : 20,
      }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {children}
    </motion.div>
  );
};
