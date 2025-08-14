"use client"
type PreviewProps = {
  personal: {
    firstName?: string
    lastName?: string
    middleName?: string
    suffix?: string
    code?: string
    phone?: string
    email?: string
  }
  company: {
    companyName?: string
    companyBranch?: string
    jobTitle?: string
    companyRole?: string
    companyEmail?: string
  }
}

export default function Preview({ personal, company }: PreviewProps) {
  return (
    <div className="w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-blue-50 rounded-xl shadow-sm p-6 flex flex-col gap-2 border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-2 h-6 bg-blue-500 rounded-full" />
          <span className="text-lg font-bold text-blue-700 tracking-wide">Personal Information</span>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">First Name</span>
            <span className="font-medium text-gray-800">{personal.firstName || <span className="text-gray-400">-</span>}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Last Name</span>
            <span className="font-medium text-gray-800">{personal.lastName || <span className="text-gray-400">-</span>}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Middle Name</span>
            <span className="font-medium text-gray-800">{personal.middleName || <span className="text-gray-400">-</span>}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Suffix</span>
            <span className="font-medium text-gray-800">{personal.suffix || <span className="text-gray-400">-</span>}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phone</span>
            <span className="font-medium text-gray-800">{personal.code ? `+${personal.code}` : ""} {personal.phone || <span className="text-gray-400">-</span>}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-800">{personal.email || <span className="text-gray-400">-</span>}</span>
          </div>
        </div>
      </div>
      <div className="bg-indigo-50 rounded-xl shadow-sm p-6 flex flex-col gap-2 border border-indigo-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-2 h-6 bg-indigo-500 rounded-full" />
          <span className="text-lg font-bold text-indigo-700 tracking-wide">Company Association</span>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Company Name</span>
            <span className="font-medium text-gray-800">{company.companyName || <span className="text-gray-400">-</span>}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Branch</span>
            <span className="font-medium text-gray-800">{company.companyBranch || <span className="text-gray-400">-</span>}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Job Title</span>
            <span className="font-medium text-gray-800">{company.jobTitle || <span className="text-gray-400">-</span>}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Position</span>
            <span className="font-medium text-gray-800">{company.companyRole || <span className="text-gray-400">-</span>}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Company Email</span>
            <span className="font-medium text-gray-800">{company.companyEmail || <span className="text-gray-400">-</span>}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
