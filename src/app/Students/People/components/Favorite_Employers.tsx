import React, { useEffect, useState } from 'react';
import FavEmp from '../Student_Data/AllFollows.json';
import { Star } from 'lucide-react';

type Employer = {
  id: number;
  name: string;
  title: string;
  company: string;
  avatar: string;
  favorited: boolean;
};

const FavoriteEmployers = () => {
  const [employers, setEmployers] = useState<Employer[]>([]);

  useEffect(() => {
    // Filter only favorited employers
    const favoritedEmployers = FavEmp.filter(emp => emp.favorited);
    setEmployers(favoritedEmployers);
  }, []);

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-2xl p-4 shadow-sm">
      <h3 className="text-blue-600 font-semibold text-sm mb-4">Favorite Employers</h3>
      <div className="divide-y">
        {employers.map((employer) => (
          <div key={employer.id} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <img
                src={employer.avatar}
                alt={employer.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-sm text-gray-900">{employer.name}</span>
                  <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
                </div>
                <p className="text-sm text-gray-500">{employer.title}</p>
                <p className="text-xs text-gray-400">{employer.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="border border-blue-500 text-blue-500 px-4 py-1 rounded-full text-sm hover:bg-blue-50 transition">
                Message
              </button>
              <button className="text-gray-500 text-xl leading-none hover:text-black">⋯</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteEmployers;
