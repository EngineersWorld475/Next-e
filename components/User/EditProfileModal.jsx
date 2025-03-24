'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Pencil } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { getUserDetails, saveUserDetails } from '@/store/user-slice'
import { toast } from 'sonner'

const EditProfileModal = ({ editProfileData }) => {
    const [formData, setFormData] = useState({
        FirstName: editProfileData?.FirstName || '',
        LastName: editProfileData?.LastName || '',
        EmailID: editProfileData?.EmailID || '',
        CurrentLocation: editProfileData?.CurrentLocation || '',
        CurrentPosition: editProfileData?.CurrentPosition || '',
        University: editProfileData?.University || '',
        AreaOfExpertise: editProfileData?.AreaOfExpertise || 'Computer programming' 
    });

    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEditUserProfile = async (e) => {
        e.preventDefault(); 

        try {
            await dispatch(
                saveUserDetails({
                    userid: 23,
                    specializationId: 1,
                    university: formData.University,
                    currentPosition: formData.CurrentPosition,
                    currentLocation: formData.CurrentLocation,
                    firstName: formData.FirstName,
                    lastName: formData.LastName,
                })
            ).unwrap(); 

            dispatch(getUserDetails(23)); 
            setIsOpen(false); 
            toast.success(
                <span className="text-green-500 font-semibold text-center">
                    User updated successfully
                </span>
            )
        } catch (error) {
            toast.error(
                <span className="text-red-500 font-semibold text-center">
                    {error}
                </span>
            )
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-300 ease-in-out hover:bg-green-500 hover:text-white">
                    <Pencil className="w-4 h-4" /> Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditUserProfile} className='flex flex-col gap-3'>
                    <div className='flex flex-row gap-2 w-full'>
                        <div className='w-1/2'>
                            <Label className="mb-3">Firstname</Label>
                            <Input type="text" name="FirstName" placeholder="Enter firstname" value={formData.FirstName} onChange={handleChange} />
                        </div>
                        <div className='w-1/2'>
                            <Label className="mb-3">Lastname</Label>
                            <Input type="text" name="LastName" placeholder="Enter lastname" value={formData.LastName} onChange={handleChange} />
                        </div>
                    </div>
                    <div className='w-full'>
                        <Label className="mb-3">Email</Label>
                        <Input type="email" name="EmailID" placeholder="Enter email" value={formData.EmailID} onChange={handleChange} disabled />
                    </div>
                    <div className='flex flex-row gap-2 w-full'>
                        <div className='w-1/2'>
                            <Label className="mb-3">Location</Label>
                            <Input type="text" name="CurrentLocation" placeholder="Enter current location" value={formData.CurrentLocation} onChange={handleChange} />
                        </div>
                        <div className='w-1/2'>
                            <Label className="mb-3">Current Position</Label>
                            <Input type="text" name="CurrentPosition" placeholder="Enter current position" value={formData.CurrentPosition} onChange={handleChange} />
                        </div>
                    </div>
                    <div className='w-full'>
                        <Label className="mb-3">University</Label>
                        <Input type="text" name="University" placeholder="Enter university" value={formData.University} onChange={handleChange} />
                    </div>
                    <div className='w-full'>
                        <Label className="mb-3">Area of expertise</Label>
                        <Input type="text" name="AreaOfExpertise" placeholder="Enter area of expertise" value={formData.AreaOfExpertise} onChange={handleChange} />
                    </div>

                    <Button type="submit">Save changes</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileModal;
