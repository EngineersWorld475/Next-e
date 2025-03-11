'use client'
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const UploadPdf = () => {
    const [uploadType, setUploadType] = useState("file");
    const [file, setFile] = useState(null)
    const [fileUrl, setFileUrl] = useState(null)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
            setFileUrl(URL.createObjectURL(selectedFile))
        }
    }


    return (
        <div className='flex flex-col gap-3'>
            <h1 className='font-semibold text-blue-600'>Upload PDF</h1>

            <div className='flex flex-row gap-3'>
                <p className='text-xs text-gray-400 font-semibold'>CHOOSE</p>
                <RadioGroup
                    defaultValue="file"
                    value={uploadType}
                    className="flex flex-row items-center text-gray-600 font-semibold gap-2"
                    onValueChange={setUploadType}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="file" id="r1" />
                        <Label htmlFor="r1" className="text-xs">FILE</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="url" id="r2" />
                        <Label htmlFor="r2" className="text-xs">URL</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className='flex flex-col md:flex-row lg:flex-row gap-5 justify-center items-center'>
                {uploadType === "file" ? (
                    <>
                        <div className="flex items-center gap-3">
                            <Input id="fileUpload" type="file" className="cursor-pointer" onChange={handleFileChange} />
                            {fileUrl && (
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">
                                    Open PDF
                                </a>
                            )}
                        </div>

                    </>
                ) : (
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input type="text" placeholder="Enter URL" />
                    </div>
                )}

                <div className='flex flex-row gap-2'>
                    <Input type="text" placeholder="Article Name" />
                    <Button className="text-xs px-2 md:text-base md:px-4 md:py-2">Upload</Button>
                </div>
            </div>
        </div>
    );
};

export default UploadPdf;
