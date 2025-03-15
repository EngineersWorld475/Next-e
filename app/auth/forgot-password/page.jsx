import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div className='flex flex-col md:flex-row mt-3'>
            <div className='bg-cover bg-center overflow-hidden w-full md:w-1/2 '>
                <Image src="/images/change-password-img.jpg" alt="login_image" className='md:rounded-lg' width={600} height={600} />
            </div>
            <div className='w-full md:w-1/2 p-4'>
                <h1 className='text-black text-center mb-2'>Forgot Password</h1>
                <form className='flex flex-col space-y-4 text-black' >
                    <div>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
                        <input type='email' id='EmailID' name='EmailID' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' required />
                    </div>
                    <button type='submit' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300'>Send Email</button>
                </form>
                <div className='flex justify-center mt-4 text-blue-500 text-sm'>
                    <Link href='/auth/register' className='mx-2 hover:underline'>Create an Account</Link>
                </div>
                <div className='flex justify-center mt-1 text-blue-500 text-sm'>
                    <p>Already have an account?</p>
                    <Link href='/auth/login' className='mx-2 hover:underline'>Login!</Link>
                </div>
            </div>
        </div>
    )
}

export default page
