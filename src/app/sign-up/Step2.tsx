const Step2 = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Company Association</h2>
        <p className="text-gray-600 text-sm mb-4">Connect with your company to start posting jobs and managing applications.</p>
        <div className="grid grid-cols-2 gap-4">
          <input className="border p-2 rounded w-full" placeholder="Company" />
          <input className="border p-2 rounded w-full" placeholder="Company Branch" />
          <input className="border p-2 rounded w-full" placeholder="Company Role" />
          <input className="border p-2 rounded w-full" placeholder="Job Title" />
          <input className="border p-2 rounded w-full col-span-2" placeholder="Company Email (if applicable)" />
        </div>
        <div className="flex justify-between mt-6">
          <button className="bg-gray-400 text-white py-2 px-4 rounded" onClick={onBack}>
            ← Back
          </button>
          <button className="bg-indigo-600 text-white py-2 px-4 rounded" onClick={onNext}>
            Next →
          </button>
        </div>
      </div>
    );
  };
  
  export default Step2;
  