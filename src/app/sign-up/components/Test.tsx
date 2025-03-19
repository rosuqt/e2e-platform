interface TestProps {
    onClose: () => void;
  }
  
  export default function Test({ onClose }: TestProps) {
    return (
      <div className="w-full h-full">
        <h2 className="text-lg font-bold w-full h-full">New Company Form</h2>
        {/* Your form fields here */}
        <div className="flex items-center justify-center h-full">
          <form className="bg-white p-8 rounded shadow-md w-full max-w-md">
            {/* Your form fields here */}
            <button 
              className="mt-4 px-4 py-2 w-full bg-red-500 text-white rounded"
              onClick={onClose}
            >
              Close
            </button>
          </form>
        </div>
      </div>
    );
  }
  