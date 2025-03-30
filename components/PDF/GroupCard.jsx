'use client'
import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { FaUsers } from "react-icons/fa";
import { Badge } from '../ui/badge';
import { TrashIcon } from 'lucide-react';

import ConfirmDialog from '@/common/ConfirmDialog';

const GroupCard = ({ groupName, emails, count }) => {
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
                                {/* confirm dialog box */}
                                <ConfirmDialog
                                    triggerText="Delete"
                                    title="Are you sure you want to delete this group?"
                                    onConfirm={() => console.log("Deleted")}
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
