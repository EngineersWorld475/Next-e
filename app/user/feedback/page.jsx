import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import React from 'react'

const UserFeedback = () => {
  return (
    <div className="relative flex items-center justify-center bg-cover bg-center bg-[#f3f4f6]">
      <div className="flex flex-col justify-center items-center relative w-full md:w-max lg:w-max bg-white p-6 md:rounded-lg shadow-md md:mx-20 lg:mx-20 md:my-10 lg:my-10">
        <div className='flex flex-col md:flex-row mt-3 justify-center items-center gap-7'>
          <div className='bg-cover bg-center overflow-hidden w-full md:w-1/2 '>
            <Image src="/images/feedback-img.svg" alt="login_image" className='md:rounded-lg' width={600} height={600} />
          </div>
          <div className='w-full md:w-1/2 p-4'>
            <h1 className='text-center mb-2 text-gray-600 text-xl md:text-2xl lg:text-2xl'>Feedback</h1>
            <form className='flex flex-col space-y-4 text-black'>
              <div>
                <Input type='text' id='username' name='user' value="Sanjay G Nair" className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2' disabled />
              </div>
              <div>
                <Input type='email' id='email' name='email' value="sanjaygnair@gmail.com" className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2' disabled />
              </div>
              <Textarea placeholder="Message"  className="focus:outline-none focus:ring-0 focus:border-gray-400" />
              <Button type='submit' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300'>Send</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserFeedback
