import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { flubber } from 'flubber';

// Define the types for your props
interface StatusIndicatorProps {
  status: 'Available for Work' | 'Application in Progress' | 'Hired';
}

// Custom hook for morphing SVG paths
function useFlubberAnimation(fromPath: string, toPath: string) {
  const [flubberPath, setFlubberPath] = useState<string>(fromPath);

  useEffect(() => {
    const interpolate = flubber(fromPath).to(toPath);
    
    const updatePath = () => {
      const newPath = interpolate(0.5); // Adjust the interpolation value for smoothness
      setFlubberPath(newPath);
    };

    // Update path every frame
    const interval = setInterval(updatePath, 10);

    return () => clearInterval(interval);
  }, [fromPath, toPath]);

  return flubberPath;
}

// Main component for rendering the animated SVG
const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const availablePath = "M10,10 C30,10 50,10 70,10"; // Circle
  const idlePath = "M10,10 C20,30 40,40 70,30"; // Crescent
  const dndPath = "M10,10 L50,50 L90,10 Z"; // Stop sign

  // Determine the path based on the status
  let fromPath = availablePath;
  let toPath = availablePath;

  if (status === "Application in Progress") {
    fromPath = availablePath;
    toPath = idlePath;
  } else if (status === "Hired") {
    fromPath = idlePath;
    toPath = dndPath;
  }

  // Use the custom hook to get the animated path
  const animatedPath = useFlubberAnimation(fromPath, toPath);

  return (
    <div>
      {/* SVG with animated path */}
      <motion.svg width="100" height="100">
        <motion.path
          d={animatedPath}
          fill="transparent"
          stroke={status === "Hired" ? "#ff0000" : "#ffa500"}
          strokeWidth="4"
          transition={{ duration: 0.5 }}
        />
      </motion.svg>
    </div>
  );
}

export default StatusIndicator;
