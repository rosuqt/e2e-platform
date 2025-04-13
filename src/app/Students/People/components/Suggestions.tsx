import React, { useState, useEffect } from "react";
import suggestionsData from "../Student_Data/Suggestions.json"; 
import { X } from "lucide-react"; 

type Student = {
  name: string;
  avatar: string;
  school: string;
  course: string;
};

export default function StudentsGrid() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    setStudents(suggestionsData as Student[]);
  }, []);

  const handleRemove = (index: number) => {
    const updated = [...students];
    updated.splice(index, 1);
    setStudents(updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-blue-100 max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-blue-800 font-semibold text-sm">
          Students You May Recognize in Information Technology
        </h2>
        <a href="#" className="text-xs text-blue-600 hover:underline">
          View All
        </a>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span className="mr-2">Sort by</span>
        <select className="text-black font-semibold outline-none bg-transparent">
          <option value="relevance">relevance</option>
          <option value="name">name</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {students.map((student, index) => (
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
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-full mx-auto object-cover mb-2"
            />
            <p className="font-semibold text-sm">{student.name}</p>
            <p className="text-xs text-gray-500">{student.school}</p>
            <p className="text-[10px] mt-1 mb-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded inline-block">
              {student.course}
            </p>
            <button className="border border-blue-500 text-blue-500 text-xs px-3 py-1 rounded hover:bg-blue-100">
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
