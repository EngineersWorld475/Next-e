'use client'
import React, { useCallback, useMemo, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { FaUsers } from "react-icons/fa";
import { Badge } from '../ui/badge';
import { Loader2, TrashIcon } from 'lucide-react';

import ConfirmDialog from '@/common/ConfirmDialog';
import { useDispatch, useSelector } from 'react-redux';
import useUserId from '@/hooks/useUserId';
import { addNewEmail, deleteEmail, deleteGroup, getGroupsByUserId } from '@/store/group-slice';
import { useCustomToast } from '@/hooks/useCustomToast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const GroupCard = React.memo(({ groupName, emails, count, groupId, setIsMounting, listOfGroups, setListOfGroups }) => {
    const dispatch = useDispatch();
    const userId = useUserId();
    const { user } = useSelector((state) => state.auth)
    const { error } = useSelector((state) => state.group)
    const { showToast } = useCustomToast()
    const [newEmail, setNewEmail] = useState('');
    const [addEmail, setAddEmail] = useState(false)


    const handleChange = useCallback((e) => {
        setNewEmail(e.target.value)
    }, [])

    const existingEmails = useMemo(() => {
        return listOfGroups.find((item) => item.GroupId === groupId)?.Groupmails?.map((item) => item.Email) || [];
    }, [listOfGroups, groupId]);

    // Adding Email to the existing group
    const handleAddEmail = useCallback(async () => {
        setAddEmail(true)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(newEmail)) {
            showToast({
                title: "Invalid email format. Please enter a valid email address.",
                variant: "warning",
            });
            setAddEmail(false)
            return;
        }

        // checking if the currently adding email is already in the group
        if (existingEmails.includes(newEmail)) {
            showToast({ title: "Email already exists", variant: "warning" });
            setAddEmail(false);
            return;
        }

        setIsMounting(false)


        try {
            const result = await dispatch(addNewEmail({ userId, email: newEmail, groupId, authToken: user?.token })).unwrap();

            if (result === true) {
                await dispatch(getGroupsByUserId({ userId, authToken: user?.token }));
                showToast({
                    title: "Email added to Group",
                    variant: "success"
                });
            } else {
                throw new Error(error || "Failed to add email.");
            }
            setAddEmail(false)
        } catch (err) {
            showToast({
                title: err.message || "Something went wrong! Please try again later.",
                variant: "error"
            });
        }

        setNewEmail('');
        setAddEmail(false)
    }, [dispatch, userId, newEmail, groupId, user?.token, showToast, setIsMounting, existingEmails])

    // DELETE GROUP FUNCTION
    const handleDeleteGroup = useCallback(() => {
        setIsMounting(false);
        dispatch(deleteGroup({ userId, groupId, authToken: user?.token })).then((result) => {
            if (result?.payload === true) {
                setListOfGroups((prevGroups) => prevGroups.filter(group => group.GroupId !== groupId));
                dispatch(getGroupsByUserId({ userId, authToken: user?.token }))
                showToast({
                    title: "Group deleted successfully",
                    variant: "success"
                })
            } else {
                showToast({
                    title: error || 'Can not delete group',
                    variant: "error"
                });
            }
        }).catch((error) => {
            showToast({
                title: error?.message || "Something went wrong. Please try again",
                variant: "error"
            })
        })
    }, [dispatch, userId, groupId, user?.token, showToast, setIsMounting, setListOfGroups, error])

    // DELETE GROUP EMAIL FUNCTION
    const handleDeleteEmail = useCallback((email) => {
        setIsMounting(false);

        dispatch(deleteEmail({
            userId: userId,
            groupEmailId: email?.GroupEmailId,
            authToken: user?.token,
        })).then((result) => {
            if (result?.payload === false) { // here it is false beacouse the success response from backend is a false(boolean value)
                setListOfGroups((prevGroups) =>
                    prevGroups.map((group) => {
                        if (group.GroupId === groupId) {
                            const updatedEmails = Array.isArray(group.Groupmails)
                                ? group.Groupmails.filter((item) => item.GroupEmailId !== email?.GroupEmailId)
                                : [];

                            return {
                                ...group,
                                Groupmails: updatedEmails.length > 0 ? updatedEmails : []
                            };
                        }
                        return group;
                    })
                );
                dispatch(getGroupsByUserId({ userId, authToken: user?.token }))
                showToast({
                    title: "Email deleted successfully",
                    variant: "success"
                });
            } else {
                showToast({
                    title: error || 'Failed to delete email',
                    variant: "error"
                });
            }
        }).catch((error) => {
            showToast({
                title: error?.message || "Something went wrong. Please try again",
                variant: "error"
            });
        });
    }, [dispatch, userId, user?.token, groupId, showToast, setIsMounting, setListOfGroups, error])



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
                                {emails?.map((item, index) => (
                                    <div key={item?.GroupEmailId} className='flex flex-row gap-5 items-center mb-3'>
                                        <p>{item?.Email}</p>
                                        <ConfirmDialog
                                            iconTrigger={<TrashIcon className='h-4 w-4 cursor-pointer' />}
                                            title="Are you sure you want to delete this email?"
                                            onConfirm={() => handleDeleteEmail(item)}
                                            onCancel={() => console.log("Cancelled")}
                                        />
                                    </div>
                                ))}

                                <div className='flex flex-col md:flex-row lg:flex-row gap-3 w-full md:w-`/3 lg:w-1/3'>
                                    <Input type="text" placeholder="Enter E-mailId" value={newEmail} onChange={handleChange} />
                                    <Button className="w-1/3" onClick={handleAddEmail} disabled={newEmail === '' || addEmail}>
                                        {addEmail ? (
                                            <>
                                                <Loader2 className="animate-spin h-5 w-5 text-center" />
                                            </>
                                        ) : 'Add'}
                                    </Button>
                                </div>
                                {/* confirm dialog box */}
                                <ConfirmDialog
                                    triggerText="Delete"
                                    title="Are you sure you want to delete this group?"
                                    onConfirm={handleDeleteGroup}
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
})

export default GroupCard
