'use client'
import React, { useRef, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const UploadPdf = ({ setFile, fileUrl, setFileUrl, formData, setFormData, isSubmitting, fileInputRef, handleUploadCollection }) => {
    const [uploadType, setUploadType] = useState("file");
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setFileUrl(URL.createObjectURL(selectedFile));

            setFormData(prev => ({
                ...prev,
                file: selectedFile
            }));
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className='flex flex-col gap-3 bg-white dark:bg-gray-900 dark:text-white'>
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
                            <Input id="fileUpload" type="file" accept="application/pdf" name="file" className="cursor-pointer" onChange={handleFileChange} ref={fileInputRef} />
                            {fileUrl && (
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">
                                    Open PDF
                                </a>
                            )}
                        </div>

                    </>
                ) : (
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input type="text" placeholder="Enter URL" name="url" value={formData.url} onChange={handleChange} />
                    </div>
                )}

                <div className='flex flex-row gap-2'>
                    <Input type="text" placeholder="Article Name" name="article" value={formData?.article} onChange={handleChange} />
                </div>
                <div className='flex flex-col gap-3 md:flex-row lg:flew-row justify-center items-center'>
                    <Input type="text" placeholder="DOI Number" name="doi" value={formData?.doi} onChange={handleChange} />
                    <Input type="text" placeholder="Pub Med Id" name="pubmedid" value={formData?.pubmedid} onChange={handleChange} />
                    <Input type="text" placeholder="Author" name="author" value={formData?.author} onChange={handleChange} />
                </div>
                <Button className="text-xs px-2 md:text-base md:px-4 md:py-2 w-full md:w-1/12 lg:w-1/12" onClick={handleUploadCollection} disabled={isSubmitting || formData?.article === '' || formData?.author === '' || formData?.doi === '' || (formData?.url === '' && formData.file === '') || formData?.pubmedid === ''}>
                    {
                        isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 text-center" />
                            </>
                        ) : (
                            'Upload'
                        )
                    }
                </Button>
            </div>
        </div>
    );
};

export default UploadPdf;
