import Dropdown from "@/app/landing/components/Dropdown";

const companyOptions: string[] = ["Kemly","Vivi","Parker"]

export default function Step2() {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Company Association</h2>
        <p className="text-sm text-gray-400 mb-5">Connect with your company to start posting jobs and managing applications. If your company is already on our platform, simply search for it. If not, you can add it now!</p>
        <div className="grid grid-cols-2 gap-4">
          <input className="border p-2 rounded w-full" placeholder="Company"
          />
          <Dropdown
                        label="I'm studying"
                        placeholder="Type here"
                        options={companyOptions}
                        selected={""}
                        setSelected={""}
                        dropdownHeight="max-h-[200px]"
                        height="h-[10px]"
                        width="w-[300px]"
                      />
          <input className="border p-2 rounded w-full" placeholder="Company Branch" />
          <input className="border p-2 rounded w-full" placeholder="Company Role" />
          <input className="border p-2 rounded w-full" placeholder="Job Title" />
          <input className="border p-2 rounded w-full col-span-2" placeholder="Company Email (if applicable)" />
        </div>
        <div className="flex justify-between mt-6">
        </div>
      </div>
    );
  };

  