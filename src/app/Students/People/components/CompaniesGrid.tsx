import React, { useState, useEffect } from "react";
import Company from "../Student_Data/Companies.json"; 
import { X } from "lucide-react"; 

type Company = {
  name: string;
  avatar: string;
  industry: string;
};

export default function CompaniesGrid() {
  const [comp, setCompany] = useState<Company[]>([]);

  useEffect(() => {
    setCompany(Company as Company[]);
  }, []);

  const handleRemove = (index: number) => {
    const updated = [...comp];
    updated.splice(index, 1);
    setCompany(updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-blue-100 max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-blue-800 font-semibold text-sm">
          Companies
        </h2>
        <a href="#" className="text-xs text-blue-600 hover:underline">
          View All
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {comp.map((cp, index) => (
                  <div
                    key={index}
                    className="relative border rounded-xl shadow-sm p-4 text-center bg-white"
                  >
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      onClick={() => handleRemove(index)}
                    >
                      <X size={16} />
                    </button>
                    <img
                      src={cp.avatar}
                      alt={cp.name}
                      className="w-16 h-16 rounded-full mx-auto object-cover mb-2"
                    />
                    <p className="font-semibold text-sm">{cp.name}</p>                                             
                    <p className="text-[10px] mt-1 mb-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded inline-block">
                      {cp.industry}
                    </p>
                    <button className="border border-blue-500 text-blue-500 text-xs px-3 py-1 rounded hover:bg-blue-100">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        }
