export default function Step1() {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Personal Details</h2>
        <p className="text-sm text-gray-400 mb-5">Provide your personal details to complete your profile. This information helps ensure a seamless and personalized experience.</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="border p-2 rounded w-full" placeholder="First name" />
          <input className="border p-2 rounded w-full" placeholder="Last name" />
          <input className="border p-2 rounded w-full col-span-2" placeholder="Phone Number" />
          <input className="border p-2 rounded w-full col-span-2" placeholder="Personal email" />
          <input type="password" className="border p-2 rounded w-full" placeholder="Password" />
          <input type="password" className="border p-2 rounded w-full" placeholder="Confirm Password" />
        </div>
      </div>
    );
  };

  