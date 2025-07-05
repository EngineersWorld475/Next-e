'use client'
import React, { useCallback, useMemo, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Users } from "lucide-react";
import { Badge } from '../ui/badge';
import { Loader2, Trash } from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';
import useUserId from '@/hooks/useUserId';
import { addNewEmail, deleteEmail, deleteGroup, getGroupsByUserId } from '@/store/group-slice';
import { useCustomToast } from '@/hooks/useCustomToast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import ConfirmDialog from '@/common/ConfirmDialog';

const GroupCard = React.memo(({ groupName, emails, count, groupId, setIsMounting, listOfGroups, setListOfGroups }) => {
    const dispatch = useDispatch();
    const userId = useUserId();
    const { user } = useSelector((state) => state.auth)
    const { error } = useSelector((state) => state.group)
    const { showToast } = useCustomToast()
    const [newEmail, setNewEmail] = useState('');
    const [isAddingEmail, setIsAddingEmail] = useState(false)

    const handleChange = useCallback((e) => {
        setNewEmail(e.target.value)
    }, [])

    const groupData = useMemo(() => {
        return listOfGroups.find(item => item.GroupId === groupId);
    }, [listOfGroups, groupId]);

    const existingEmails = useMemo(() => {
        return groupData?.Groupmails?.map(item => item.Email) || [];
    }, [groupData]);

    // Adding Email to the existing group
    const handleAddEmail = useCallback(async () => {
        setIsAddingEmail(true)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(newEmail)) {
            showToast({
                title: "Invalid Email",
                description: "Please enter a valid email address.",
                variant: "warning",
            });
            setIsAddingEmail(false)
            return;
        }

        // checking if the currently adding email is already in the group
        if (existingEmails.includes(newEmail)) {
            showToast({
                title: "Duplicate Email",
                description: "This email is already in the group.",
                variant: "warning",
            });
            setIsAddingEmail(false);
            return;
        }

        setIsMounting(false)

        try {
            const result = await dispatch(addNewEmail({ userId, email: newEmail, groupId, authToken: user?.token })).unwrap();

            if (result === true) {
                await dispatch(getGroupsByUserId({ userId, authToken: user?.token }));
                showToast({
                    title: "Email Added",
                    description: "The email was successfully added to the group.",
                    variant: "success",
                });
            } else {
                throw new Error(error || "Failed to add email.");
            }
            setIsAddingEmail(false)
        } catch (err) {
            showToast({
                title: "Failed to Add Email",
                description: err.message || "Something went wrong while adding the email.",
                variant: "error",
            });
        }

        setNewEmail('');
        setIsAddingEmail(false)
    }, [dispatch, userId, newEmail, groupId, user?.token, showToast, setIsMounting, existingEmails])

    // DELETE GROUP FUNCTION
    const handleDeleteGroup = useCallback(async () => {
        try {
            setIsMounting(false);
            const result = await dispatch(deleteGroup({ userId, groupId, authToken: user?.token })).unwrap();
            if (result === true) {
                setListOfGroups((prev) => prev.filter(group => group.GroupId !== groupId));
                await dispatch(getGroupsByUserId({ userId, authToken: user?.token }));
                showToast({ title: "Group Deleted", description: "Successfully deleted.", variant: "success" });
            } else {
                throw new Error("Could not delete group.");
            }
        } catch (error) {
            showToast({
                title: "Error",
                description: error?.message || "Something went wrong",
                variant: "error",
            });
        }
    }, [dispatch, userId, groupId, user?.token, showToast, setIsMounting, setListOfGroups]);

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
                    title: "Email Deleted",
                    description: "The email was removed from the group.",
                    variant: "success",
                });
            } else {
                showToast({
                    title: "Delete Failed",
                    description: "Could not delete the email. Please try again.",
                    variant: "error",
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
        <div className="group">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="card-1" className="border-none">
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                        <CardHeader className="p-3 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b border-blue-100 dark:border-blue-800/50">
                            <AccordionTrigger className="w-full text-left hover:no-underline group/trigger">
                                <CardTitle className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                        <div className="relative p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg group-hover/trigger:bg-blue-200 dark:group-hover/trigger:bg-blue-800/70 transition-colors duration-200">
                                            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                                            {/* Mobile badge - positioned on top-left of icon */}
                                            <Badge
                                                variant="secondary"
                                                className="absolute -top-1 -left-2 bg-red-400 dark:bg-gray-900 text-white border-0 px-1 py-0 rounded-full font-medium shadow-sm text-xs h-4 w-4 flex items-center justify-center min-w-4 sm:hidden"
                                            >
                                                {count}
                                            </Badge>
                                        </div>
                                        <span className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 group-hover/trigger:text-blue-700 dark:group-hover/trigger:text-blue-300 transition-colors duration-200 truncate">
                                            {groupName}
                                        </span>
                                    </div>
                                    {/* Desktop badge - positioned on the right */}
                                    <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                                        <Badge
                                            variant="secondary"
                                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 px-3 py-1 rounded-full font-medium shadow-sm text-sm"
                                        >
                                            {count} {count === 1 ? 'member' : 'members'}
                                        </Badge>
                                    </div>
                                </CardTitle>
                            </AccordionTrigger>
                        </CardHeader>

                        <AccordionContent className="overflow-hidden">
                            <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                                {/* Email List */}
                                {emails && emails.length > 0 && (
                                    <div className="space-y-2 sm:space-y-3">
                                        <h4 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                            Group Members
                                        </h4>
                                        <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
                                            {emails.map((item, index) => (
                                                <div
                                                    key={item?.GroupEmailId}
                                                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200 group/email"
                                                >
                                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium truncate">
                                                            {item?.Email}
                                                        </span>
                                                    </div>
                                                    <ConfirmDialog
                                                        iconTrigger={
                                                            <div className="p-1.5 sm:p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors duration-200 sm:opacity-0 sm:group-hover/email:opacity-100 flex-shrink-0">
                                                                <Trash className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 hover:text-red-600 cursor-pointer" />
                                                            </div>
                                                        }
                                                        title="Are you sure you want to delete this email?"
                                                        onConfirm={() => handleDeleteEmail(item)}
                                                        onCancel={() => console.log("Cancelled")}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Add Email Section */}
                                <div className="space-y-3 sm:space-y-4">
                                    <h4 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                        Add New Member
                                    </h4>
                                    <div className="flex flex-col gap-2 sm:gap-3">
                                        <div className="w-full">
                                            <Input
                                                disabled={isAddingEmail}
                                                type="email"
                                                placeholder="Enter email address..."
                                                value={newEmail}
                                                onChange={handleChange}
                                                className="h-10 sm:h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleAddEmail}
                                            disabled={newEmail === '' || isAddingEmail}
                                            className="h-10 sm:h-11 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto sm:min-w-[100px] text-sm sm:text-base"
                                            aria-busy={isAddingEmail}
                                        >
                                            {isAddingEmail ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                    <span>Adding...</span>
                                                </div>
                                            ) : (
                                                'Add Member'
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Delete Group Section */}
                                <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-center sm:justify-end">
                                        <ConfirmDialog
                                            triggerText="Delete Group"
                                            title="Are you sure you want to delete this group?"
                                            onConfirm={handleDeleteGroup}
                                            onCancel={() => console.log("Cancelled")}
                                            ButtonStyle="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 px-4 sm:px-6 py-2 text-sm sm:text-base w-full sm:w-auto"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>
            </Accordion>
        </div>
    )
})

export default GroupCard