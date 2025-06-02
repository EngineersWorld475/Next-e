'use client';
import React, { useCallback, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Upload, FileText, Link, User, Hash, Calendar, ExternalLink } from 'lucide-react';

const UploadPdf = ({
  setFile,
  fileUrl,
  setFileUrl,
  formData,
  setFormData,
  isSubmitting,
  fileInputRef,
  handleUploadCollection,
}) => {
  const [uploadType, setUploadType] = useState('file');
  const [dragActive, setDragActive] = useState(false);

  const isButtonDisabled =
    isSubmitting ||
    !formData?.article?.trim() ||
    !formData?.author?.trim() ||
    !formData?.doi?.trim() ||
    (!formData?.url?.trim() && !formData?.file) ||
    !formData?.pubmedid?.trim();

  const handleFileChange = useCallback(
    (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile && selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setFileUrl(URL.createObjectURL(selectedFile));
        setFormData((prev) => ({
          ...prev,
          file: selectedFile,
          url: '', // Clear URL when selecting a file
        }));
      }
    },
    [setFile, setFileUrl, setFormData],
  );

  const handleChange = useCallback(
    (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    },
    [formData, setFormData],
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile.type === 'application/pdf') {
          setFile(selectedFile);
          setFileUrl(URL.createObjectURL(selectedFile));
          setFormData((prev) => ({
            ...prev,
            file: selectedFile,
            url: '', // Clear URL when dropping a file
          }));
        }
      }
    },
    [setFile, setFileUrl, setFormData],
  );

  const handleUploadTypeChange = useCallback(
    (value) => {
      setUploadType(value);
      setFormData((prev) => ({
        ...prev,
        file: value === 'file' ? prev.file : null, // Clear file when switching to URL
        url: value === 'url' ? prev.url || '' : '', // Ensure url is a string
      }));
      if (value === 'url' && fileUrl) {
        URL.revokeObjectURL(fileUrl);
        setFileUrl('');
        setFile(null);
      }
    },
    [setFormData, fileUrl, setFileUrl, setFile],
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Upload Academic Paper
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Add your research paper with metadata for better organization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs font-medium">
              Step 1 of 2
            </Badge>
            <Separator className="flex-1" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">SOURCE TYPE</span>
              <RadioGroup
                value={uploadType}
                className="flex items-center gap-4"
                onValueChange={handleUploadTypeChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="file-option" className="text-blue-600" />
                  <Label
                    htmlFor="file-option"
                    className="text-sm font-medium cursor-pointer flex items-center gap-1"
                  >
                    <FileText className="h-3 w-3" />
                    File Upload
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="url" id="url-option" className="text-blue-600" />
                  <Label
                    htmlFor="url-option"
                    className="text-sm font-medium cursor-pointer flex items-center gap-1"
                  >
                    <Link className="h-3 w-3" />
                    URL Link
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* File/URL Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Document Source</h3>

            {uploadType === 'file' ? (
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                } ${formData?.file ? 'bg-green-50/50 dark:bg-green-900/20 border-green-300 dark:border-green-600' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center space-y-4">
                  {formData?.file ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-green-700 dark:text-green-300">{formData.file.name}</p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      {fileUrl && (
                        <Button variant="outline" size="sm" asChild className="ml-auto">
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Preview
                          </a>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-fit mx-auto">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                          Drop your PDF here, or{' '}
                          <label
                            htmlFor="fileUpload"
                            className="text-blue-600 hover:text-blue-700 cursor-pointer underline"
                          >
                            browse files
                          </label>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Supports PDF files up to 50MB</p>
                      </div>
                    </>
                  )}
                </div>
                <Input
                  id="fileUpload"
                  type="file"
                  accept="application/pdf"
                  name="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="url-input" className="text-sm font-medium flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Document URL
                </Label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/paper.pdf"
                  name="url"
                  value={formData.url || ''} // Ensure value is always a string
                  onChange={handleChange}
                  className="text-base"
                />
                <p className="text-xs text-gray-500">Enter a direct link to the PDF document</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Metadata Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Paper Metadata</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="article-input" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Article Title *
                </Label>
                <Input
                  id="article-input"
                  type="text"
                  placeholder="Enter the complete article title"
                  name="article"
                  value={formData?.article || ''}
                  onChange={handleChange}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author-input" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Author(s) *
                </Label>
                <Input
                  id="author-input"
                  type="text"
                  placeholder="First Author, Second Author, et al."
                  name="author"
                  value={formData?.author || ''}
                  onChange={handleChange}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doi-input" className="text-sm font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  DOI Number *
                </Label>
                <Input
                  id="doi-input"
                  type="text"
                  placeholder="10.1000/xyz123"
                  name="doi"
                  value={formData?.doi || ''}
                  onChange={handleChange}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pubmed-input" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  PubMed ID *
                </Label>
                <Input
                  id="pubmed-input"
                  type="text"
                  placeholder="12345678"
                  name="pubmedid"
                  value={formData?.pubmedid || ''}
                  onChange={handleChange}
                  className="text-base"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Submit Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">All fields marked with * are required</p>
              {isButtonDisabled && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Please fill in all required fields to continue
                </p>
              )}
            </div>

            <Button
              onClick={handleUploadCollection}
              disabled={isButtonDisabled}
              size="lg"
              className="w-full sm:w-auto min-w-[120px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Paper
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPdf;