import { motion } from "framer-motion";

interface ToggleSwitchProps {
  isOn: boolean;
  setIsOn: (state: boolean) => void;
  onToggle?: (state: boolean) => void;
  knobWidth?: number;
  onLabel?: string;
  offLabel?: string;
  className?: string;
}

export default function ToggleSwitch({
  isOn,
  setIsOn,
  onToggle,
  knobWidth = 60,
  onLabel = "On",
  offLabel = "Off",
  className = "",
}: ToggleSwitchProps) {
  const switchWidth = knobWidth * 2.2;
  const knobPosition = isOn ? switchWidth - knobWidth - 8 : 2;

  const handleToggle = () => {
    setIsOn(!isOn);
    if (onToggle) onToggle(!isOn);
  };

  return (
    <div className={`toggle-container ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <div
          className="h-12 flex items-center bg-gray-200 rounded-full p-1 shadow-inner cursor-pointer relative"
          style={{ width: switchWidth }}
          onClick={handleToggle}
        >
          <motion.div
            className="h-10 flex items-center justify-center rounded-full shadow-md font-semibold bg-white text-blue-600"
            style={{ width: knobWidth }}
            animate={{ x: knobPosition }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isOn ? onLabel : offLabel}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
