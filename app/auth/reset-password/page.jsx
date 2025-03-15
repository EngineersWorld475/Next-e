'use client'
import Image from 'next/image'
import React from 'react'

const page = () => {

    const handleResetPassword = (e) => {
        e.preventDefault()
    }
    return (
        <div className='flex flex-col justify-center items-center md:flex-row mt-3'>
            <div className='bg-cover bg-center overflow-hidden w-full md:w-1/2 '>
                <Image src="/images/reset-password-img.jpg" alt="login_image" className='md:rounded-lg' width={600} height={600} />
            </div>
            <div className='w-full md:w-1/2 p-4'>
                <h1 className='text-black text-center mb-2'>Reset Password</h1>
                <form className='flex flex-col space-y-4 text-black' onSubmit={handleResetPassword}>
                    <div>
                        <input type='email' id='EmailID' name='EmailID' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' placeholder='sanjaygnair@gmail.com' disabled />
                    </div>
                    <div>
                        <input type='text' id='oldPassword' name='oldPassword' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' placeholder='Old Password' required />
                    </div>
                    <div>
                        <input type='text' id='newPassword' name='newPassword' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' placeholder='New Password' required />
                    </div>
                    <div>
                        <input type='text' id='reEnterPassword' name='reEnterPassword' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' placeholder='Re-enter Password' required />
                    </div>
                    <button type='submit' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300'>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default page
