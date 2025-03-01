'use client';

import React, { useState } from 'react';

const UserProfile = () => {
    const [openEdit, setOpenEdit] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>
            <div className="relative bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
                {/* Edit Button */}
                {!openEdit && (
                    <button 
                        className="absolute top-4 right-4 px-3 py-1.5 bg-gray-700 text-white rounded-lg text-sm hover:bg-black transition"
                        onClick={() => setOpenEdit(true)}
                    >
                        Edit
                    </button>
                )}

                {/* Profile Display */}
                <div className="grid grid-cols-2 gap-y-5 text-gray-700">
                    <p className="font-semibold">Username:</p>
                    <p className="text-gray-600">Sanjay G Nair</p>

                    <p className="font-semibold">Email:</p>
                    <p className="text-gray-600">sanjaygnair777@gmail.com</p>

                    <p className="font-semibold">Education:</p>
                    <p className="text-gray-600">BCA (Bachelor of Computer Application)</p>

                    <p className="font-semibold">Blood Group:</p>
                    <p className="text-gray-600">B +ve</p>

                    <p className="font-semibold">Gender:</p>
                    <p className="text-gray-600">Male</p>
                </div>
            </div>

            {/* Edit Form Modal */}
            {openEdit && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
                        
                        <div className="space-y-4">
                            <input type="text" defaultValue="Sanjay G Nair" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500" onChange={handleChange} />
                            <input type="text" defaultValue="sanjaygnair777@gmail.com" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500" onChange={handleChange} />
                            <input type="text" defaultValue="BCA (Bachelor of Computer Application)" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500" onChange={handleChange} />
                            <input type="text" defaultValue="B +ve" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500" onChange={handleChange} />
                            <input type="text" defaultValue="Male" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500" onChange={handleChange} />
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button 
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                                onClick={() => setOpenEdit(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                onClick={() => setOpenEdit(false)}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
