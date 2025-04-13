import React, { useState, useEffect } from 'react';
import mockData from '../Student_Data/Friends.json';

type FriendRequest = {
  name: string;
  school: string;
  course: string;
  image: string;
};

export default function Friends() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    setRequests(mockData as FriendRequest[]);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-blue-700 font-semibold mb-4">Friends</h2>
        <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
           
            </div>
            <div className="space-y-4">
            {requests.map((req, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                    <img src={req.image} alt="profile" className="w-10 h-10 rounded-full" />
                    <div>
                    <p className="font-semibold">{req.name}</p>
                    <p className="text-sm text-gray-500">{req.school}</p>
                    <p className="text-sm text-gray-500">{req.course}</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-100">Message</button>
                </div>
                </div>
            ))}
        </div>
    </div>
</div>
  );
}
