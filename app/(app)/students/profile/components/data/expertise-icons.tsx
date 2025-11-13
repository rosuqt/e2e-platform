import { FaReact, FaPython, FaJava, FaDatabase, FaCloud, FaMobileAlt, FaGlobeAsia, FaLeaf, FaGavel, FaCalendarAlt, FaLanguage, FaHandshake, FaChartBar, FaClipboard, FaAddressBook, FaBuilding, FaListAlt, FaMoneyBillAlt } from "react-icons/fa";
import { MdSecurity, MdDesignServices, MdFastfood, MdRoomService, MdHealthAndSafety, MdBusinessCenter, MdPeople, MdTravelExplore, MdCode, MdDevices, MdGroup, MdAttachMoney, MdLightbulbOutline, MdRocketLaunch } from "react-icons/md";
import { SiJavascript, SiPhp, SiLinux, SiTestinglibrary, SiGithub, SiOpera, SiPowers } from "react-icons/si";
import { IconType } from "react-icons";

const expertiseIconMap: Record<string, IconType> = {
  // Technology
  "JavaScript": SiJavascript,
  "Python": FaPython,
  "Java": FaJava,
  "SQL": FaDatabase,
  "React": FaReact,
  "Node.js": MdCode,
  "PHP": SiPhp,
  "Git & GitHub": SiGithub,
  "Cybersecurity Basics": MdSecurity,
  "Mobile App Development": FaMobileAlt,
  "Networking Fundamentals": MdDevices,
  "Linux CLI": SiLinux,
  "Software Testing": SiTestinglibrary,
  "UI/UX Design": MdDesignServices,
  "Cloud Computing (e.g., AWS, Azure)": FaCloud,
  "Database Management": FaDatabase,
  "Agile Methodologies": MdGroup,
  // Tourism
  "Tour Guiding Techniques": FaGlobeAsia,
  "Travel Booking Systems (e.g., Amadeus, Galileo)": MdTravelExplore,
  "Itinerary Planning": FaListAlt,
  "Cultural Tourism": FaGlobeAsia,
  "Tourism Law & Ethics": FaGavel,
  "Event Planning": FaCalendarAlt,
  "Ecotourism Practices": FaLeaf,
  "Foreign Language Skills": FaLanguage,
  "Airline Operations": FaBuilding,
  "Customer Service in Tourism": FaHandshake,
  // Hospitality
  "Front Office Operations": FaAddressBook,
  "Bartending & Mixology": MdFastfood,
  "Culinary Arts": MdFastfood,
  "Food & Beverage Services": MdRoomService,
  "Housekeeping Operations": FaClipboard,
  "Hospitality Software (e.g., Opera PMS)": SiOpera,
  "Guest Relations": FaHandshake,
  "Event Coordination": FaCalendarAlt,
  "Hospitality Law": FaGavel,
  "Health & Safety Compliance": MdHealthAndSafety,
  // Business
  "Financial Accounting": MdAttachMoney,
  "Business Analytics (Excel, Power BI)": SiPowers,
  "Marketing Strategy": FaChartBar,
  "Project Management": FaClipboard,
  "E-commerce Operations": FaGlobeAsia,
  "Sales Techniques": FaMoneyBillAlt,
  "Human Resource Management": MdPeople,
  "Entrepreneurship": MdLightbulbOutline,
  "Strategic Management": MdBusinessCenter,
  "Customer Relationship Management (CRM Tools)": FaHandshake,
};

const categoryBg: Record<string, string> = {
  Technology: "bg-blue-600",
  Hospitality: "bg-pink-500",
  Tourism: "bg-yellow-400",
  Business: "bg-purple-600",
  fallback: "bg-green-600"
};

function getCategory(skill: string): string {
  if (
    [
      "JavaScript", "Python", "Java", "SQL", "React", "Node.js", "PHP", "Git & GitHub", "Cybersecurity Basics",
      "Mobile App Development", "Networking Fundamentals", "Linux CLI", "Software Testing", "UI/UX Design",
      "Cloud Computing (e.g., AWS, Azure)", "Database Management", "Agile Methodologies"
    ].includes(skill)
  ) return "Technology";
  if (
    [
      "Front Office Operations", "Bartending & Mixology", "Culinary Arts", "Food & Beverage Services",
      "Housekeeping Operations", "Hospitality Software (e.g., Opera PMS)", "Guest Relations", "Event Coordination",
      "Hospitality Law", "Health & Safety Compliance"
    ].includes(skill)
  ) return "Hospitality";
  if (
    [
      "Tour Guiding Techniques", "Travel Booking Systems (e.g., Amadeus, Galileo)", "Itinerary Planning",
      "Cultural Tourism", "Tourism Law & Ethics", "Event Planning", "Ecotourism Practices", "Foreign Language Skills",
      "Airline Operations", "Customer Service in Tourism"
    ].includes(skill)
  ) return "Tourism";
  if (
    [
      "Financial Accounting", "Business Analytics (Excel, Power BI)", "Marketing Strategy", "Project Management",
      "E-commerce Operations", "Sales Techniques", "Human Resource Management", "Entrepreneurship",
      "Strategic Management", "Customer Relationship Management (CRM Tools)"
    ].includes(skill)
  ) return "Business";
  return "fallback";
}

export function ExpertiseIcon({ name }: { name: string }) {
  const Icon = expertiseIconMap[name] || MdRocketLaunch;
  const category = getCategory(name);
  const bg = categoryBg[category] || categoryBg.fallback;
  return (
    <div className={`w-8 h-8 flex items-center justify-center ${bg} rounded-md`}>
      <Icon className="text-white" size={20} />
    </div>
  );
}

// Example usage in your expertise list component
export function ExpertiseList({ expertise }: { expertise: { skill: string; mastery: number }[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {expertise.map((exp) => (
        <div key={exp.skill} className="flex items-center gap-2">
          <ExpertiseIcon name={exp.skill} />
          <span>{exp.skill}</span>
        </div>
      ))}
    </div>
  );
}
