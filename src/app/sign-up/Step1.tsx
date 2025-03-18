interface Props {
    onNext: () => void;
  }
  
  const Step1 = ({ onNext }: Props) => {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Sign up to hire talent</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="border p-2 rounded w-full" placeholder="First name" />
          <input className="border p-2 rounded w-full" placeholder="Last name" />
          <input className="border p-2 rounded w-full col-span-2" placeholder="Phone Number" />
          <input className="border p-2 rounded w-full col-span-2" placeholder="Personal email" />
          <input type="password" className="border p-2 rounded w-full" placeholder="Password" />
          <input type="password" className="border p-2 rounded w-full" placeholder="Confirm Password" />
        </div>
        <button className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded" onClick={onNext}>
          Next →
        </button>
      </div>
    );
  };
  
  export default Step1;
  