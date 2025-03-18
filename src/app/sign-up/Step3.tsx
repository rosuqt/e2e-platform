const Step3 = ({ onBack }: { onBack: () => void }) => {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Verification Agreement</h2>
        <p className="text-gray-600 text-sm mb-4">To ensure a secure platform, please agree to the following terms.</p>
        
        <div className="border p-4 rounded h-40 overflow-y-scroll">
          <p className="text-sm">
            1. Provide accurate and up-to-date information.<br />
            2. Use the platform solely for lawful job posting and recruitment.<br />
            3. Ensure job listings comply with labor laws.
          </p>
        </div>
  
        <div className="flex justify-between mt-6">
          <button className="bg-gray-400 text-white py-2 px-4 rounded" onClick={onBack}>
            ← Back
          </button>
          <button className="bg-indigo-600 text-white py-2 px-4 rounded">
            Sign Up
          </button>
        </div>
      </div>
    );
  };
  
  export default Step3;
  