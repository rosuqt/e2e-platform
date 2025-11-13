import { RiRobot2Fill } from "react-icons/ri"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="mb-8">
        <span className="block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
      <RiRobot2Fill className="text-purple-500 w-16 h-16 animate-pulse" />
    </div>
  )
}
