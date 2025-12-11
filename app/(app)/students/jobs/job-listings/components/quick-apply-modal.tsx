import React from "react"
import { Dialog } from "@headlessui/react"
import Image from "next/image"
import { Mail } from "lucide-react"
import { LuSave } from "react-icons/lu"
import { TbPencilStar } from "react-icons/tb"
import { CgNotes } from "react-icons/cg"
import { BiTimer } from "react-icons/bi"
import { RiResetRightLine } from "react-icons/ri"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function QuickApplyModal({
  open,
  onClose,
  onSubscribe,
}: {
  open: boolean
  onClose: () => void
  onSubscribe: () => void
  jobTitle: string
}) {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          aria-hidden="true"
          style={{ width: "100vw", height: "100vh", top: 0, margin: 0 }}
        />
        <AnimatePresence>
          {open && (
            <Dialog.Panel className="bg-transparent shadow-none max-w-5xl w-full flex justify-center p-0 h-[530px] relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.22, type: "spring", stiffness: 280, damping: 22 }}
                className="bg-white shadow-xl max-w-5xl w-full flex flex-col sm:flex-row p-0 h-[530px] relative"
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-600 transition"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex-1 pr-0 sm:pr-8 bg-white flex flex-col justify-center h-full">
                  <div className="p-8">
                    <Dialog.Title className="text-2xl font-bold mb-2">
                      Let’s Get Your Quick Apply Ready
                    </Dialog.Title>
                    <p className="mb-4 text-gray-600">
                      Complete one normal job application, then you can save your info for quicker applying in the future.
                    </p>
                    <ul className="mb-6 space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <LuSave className="w-5 h-5 mt-1 text-gray-400" />
                        <span>Your info saves after one full application</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TbPencilStar className="w-5 h-5 mt-1 text-gray-400" />
                        <span>Next time, Quick Apply fills everything for you</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CgNotes className="w-5 h-5 mt-1 text-gray-400" />
                        <span>No more typing the same details again</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <BiTimer className="w-5 h-5 mt-1 text-gray-400" />
                        <span>Apply to jobs in seconds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <RiResetRightLine className="w-5 h-5 mt-1 text-gray-400" />
                        <span>Reset it in Settings or normal apply</span>
                      </li>
                    </ul>
                    <div className="flex flex-col gap-3">
                      <button
                        className="bg-blue-600 text-white w-full py-2  hover:bg-blue-600 transition text-md flex items-center justify-center gap-2"
                        onClick={onSubscribe}
                      >
                        <Mail className="w-5 h-5" />
                        Continue with Standard Apply
                      </button>
                      <button
                        className="bg-gray-100 text-gray-700 w-full py-2 font-medium hover:bg-blue-200/30 transition text-md"
                        onClick={onClose}
                      >
                        Not Now
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 relative w-full h-full min-h-[530px] bg-gray-100/45">
                  <Image
                    src="/images/email-modal-removebg-preview.png"
                    alt="Quick Apply Illustration"
                    fill
                    className="object-contain"
                    draggable={false}
                    priority
                    sizes="50vw"
                  />
                </div>
              </motion.div>
            </Dialog.Panel>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  )
}
