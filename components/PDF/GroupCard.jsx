'use client'
import React, { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { FaUsers } from "react-icons/fa";
import { Badge } from '../ui/badge';
import { TrashIcon } from 'lucide-react';

import ConfirmDialog from '@/common/ConfirmDialog';
import { useDispatch, useSelector } from 'react-redux';
import useUserId from '@/hooks/useUserId';
import { addNewEmail, deleteGroup, getGroupsByUserId } from '@/store/group-slice';
import { useCustomToast } from '@/hooks/useCustomToast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const GroupCard = ({ groupName, emails, count, groupId, setIsMounting }) => {
    const dispatch = useDispatch();
    const userId = useUserId();
    const { user } = useSelector((state) => state.auth)
    const { showToast } = useCustomToast()
    const [email, setEmail] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value)
    }
    const handleSubmit = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            showToast({
                title: "Invalid email format. Please enter a valid email address.",
                variant: "warning",
            });
            return;
        }
        setIsMounting(false)
        dispatch(addNewEmail({ userId, email, groupId, authToken: user?.token })).then((result) => {
            console.log('...result', result)
            if (result.success) {
                showToast({
                    title: result.message,
                    variant: "success"
                })
            }
        }).catch(() => {
            showToast({
                title: error || "Something went wrong!!! please try again later",
                variant: "error"
            })
        })
        dispatch(getGroupsByUserId({ userId }))
        setEmail('')
    }

    const handleDelete = () => {
        try {
            setIsMounting(false)
            dispatch(deleteGroup({ userId, groupId, authToken: user?.token }));
            dispatch(getGroupsByUserId({ userId })).then(() => {
                showToast({
                    title: "Group deleted successfully",
                    variant: "success"
                })
            })
        } catch (error) {
            showToast({
                title: error || "Something went wrong. Please try again",
                variant: "error"
            })
        }
    }


    return (
        <div>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="card-1">
                    <Card className="shadow border">
                        <CardHeader className="p-4">
                            <AccordionTrigger className="w-full text-left">
                                <CardTitle className="w-full flex flex-row justify-between items-center">
                                    <p>{groupName}</p>
                                    <div className='flex flex-row'>
                                        <FaUsers className='h-5 w-5 mx-2' />
                                        <Badge variant="destructive" className='rounded-full w-3 flex justify-center mr-1'>{count}</Badge>
                                    </div>
                                </CardTitle>
                            </AccordionTrigger>
                        </CardHeader>
                        <AccordionContent>
                            <CardContent className="relative p-4">
                                {emails?.map((email, index) => (
                                    <div key={email || `email-${index}`} className='flex flex-row gap-5 items-center mb-3'>
                                        <p>{email}</p>
                                        <TrashIcon className='h-4 w-4 cursor-pointer' />
                                    </div>
                                ))}

                                <div className='flex flex-col md:flex-row lg:flex-row gap-3 w-full md:w-`/3 lg:w-1/3'>
                                    <Input type="text" placeholder="Enter E-mailId" value={email} onChange={handleChange} />
                                    <Button className="w-1/3" onClick={handleSubmit} disabled={email === ''}>Add</Button>
                                </div>
                                {/* confirm dialog box */}
                                <ConfirmDialog
                                    triggerText="Delete"
                                    title="Are you sure you want to delete this group?"
                                    onConfirm={handleDelete}
                                    onCancel={() => console.log("Cancelled")}
                                    ButtonStyle={'absolute right-0 bottom-0'}
                                />
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default GroupCard
