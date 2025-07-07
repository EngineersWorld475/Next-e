import React, { useState } from 'react';
import { Download, Edit, Globe, Loader2, Trash, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ConfirmDialog from '@/common/ConfirmDialog';
import { useCustomToast } from '@/hooks/useCustomToast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import CustomButton from '@/common/CustomButton';


const PdfCard = ({
  article,
  author,
  pdf,
  doi,
  id,
  pubmedId,
  handleDeleteCollection,
  showActions
}) => {
  const [editFormData, setEditFormData] = useState({
    article: article || '',
    author: author || '',
    doi: doi || '',
    pubmedId: pubmedId || ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openAccess, setOpenAccess] = useState(false);
  const { showToast } = useCustomToast();

  const handleChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsDialogOpen(false);
      showToast({
        title: "Collection updated",
        description: "Your PDF collection details were successfully saved.",
        variant: "success ",
      });
    } catch (error) {
      showToast({
        title: "Update failed",
        description: "Something went wrong while updating the collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePdfClick = () => {
    const pdfUrlEncoded = encodeURIComponent(pdf);
    window.open(`/pdf-viewer/${id}?url=${pdfUrlEncoded}`, '_blank');
  };

  const toggleAccess = () => {
    setOpenAccess(!openAccess);
    showToast({
      title: openAccess ? "Access set to closed" : "Access set to open",
      description: openAccess
        ? "This collection is now marked as Closed Access."
        : "This collection is now marked as Open Access.",
      variant: "info"
    });
  };

  return (
    <Card className="w-full mb-6 hover:shadow-lg  bg-gradient-r from-gray-100 to-gray-200 dark:bg-gray-800 dark:border-white">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Article Information */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Article
                </h3>
                <button
                  onClick={handlePdfClick}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-lg leading-tight hover:underline transition-colors duration-200 text-left"
                >
                  {article}
                </button>
              </div>

              <div className='hidden md:block lg:block'>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Author
                </h3>
                <p className="text-gray-800 dark:text-white font-medium">{author}</p>
              </div>

              <div className="hidden md:flex lg:flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Annotations: 0
                </Badge>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="hidden md:block lg:block lg:col-span-1">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                  PubMed ID
                </h3>
                <p className="text-gray-800 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {pubmedId || 'N/A'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                  DOI Number
                </h3>
                <p className="text-gray-800 font-mono text-sm bg-gray-100 px-2 py-1 rounded break-all">
                  {doi || 'N/A'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Comments
                </h3>
                <p className="text-gray-600 text-sm italic">No comments yet</p>
              </div>
            </div>
          </div>
          {/* collection details mobile view */}
          <Accordion type="single"
            collapsible
            className="block md:hidden lg:hidden w-full"
            >
            <AccordionItem value="item-1">
              <AccordionTrigger className="border border-none">
                Collection Details
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="lg:col-span-1">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Article
                      </h3>
                      <button
                        onClick={handlePdfClick}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-lg leading-tight hover:underline transition-colors duration-200 text-left"
                      >
                        {article}
                      </button>
                    </div>


                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Author
                      </h3>
                      <p className="text-gray-800 dark:text-white font-medium">{author}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Annotations: 0
                      </Badge>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="lg:col-span-1">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                          PubMed ID
                        </h3>
                        <p className="text-gray-800 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {pubmedId || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                          DOI Number
                        </h3>
                        <p className="text-gray-800 font-mono text-sm bg-gray-100 px-2 py-1 rounded break-all">
                          {doi || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Comments
                        </h3>
                        <p className="text-gray-600 text-sm italic">No comments yet</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          {/* Actions & Status */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Access Status
                </h3>
                <Badge
                  variant={openAccess ? "default" : "secondary"}
                  className={`${openAccess
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                    }`}
                >
                  {openAccess ? 'Open Access' : 'Closed Access'}
                </Badge>
              </div>

              {showActions && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Actions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {/* confirm delete dialog */}
                    <ConfirmDialog
                      iconTrigger={<CustomButton
                          variant="outline"
                          size="sm"
                          icon={TrashIcon}
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        />}
                      title="Do you want to delete this collection?"
                      onConfirm={() => handleDeleteCollection(id)}
                      onCancel={() => console.log("Cancelled")}
                      ButtonStyle={"hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"}
                    />

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                          <Edit size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Edit PDF Details</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="pubmedId" className="text-sm font-medium">
                                PubMed ID
                              </Label>
                              <Input
                                id="pubmedId"
                                name="pubmedId"
                                value={editFormData.pubmedId}
                                onChange={handleChange}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="doi" className="text-sm font-medium">
                                DOI Number
                              </Label>
                              <Input
                                id="doi"
                                name="doi"
                                value={editFormData.doi}
                                onChange={handleChange}
                                className="w-full"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="article" className="text-sm font-medium">
                                Article Name
                              </Label>
                              <Input
                                id="article"
                                name="article"
                                value={editFormData.article}
                                onChange={handleChange}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="author" className="text-sm font-medium">
                                Author
                              </Label>
                              <Input
                                id="author"
                                name="author"
                                value={editFormData.author}
                                onChange={handleChange}
                                className="w-full"
                              />
                            </div>
                          </div>

                          <Separator />

                          <div className="flex justify-end gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                              disabled={isSubmitting}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                  Saving...
                                </>
                              ) : (
                                'Save Changes'
                              )}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <CustomButton
                      variant="outline"
                      size="sm"
                      icon={Globe}
                      onClick={toggleAccess}
                      className={`hover:bg-green-50 hover:text-green-600 hover:border-green-200 ${openAccess ? 'text-green-600 border-green-200' : ''}`}
                    />
                    <CustomButton
                      variant="outline"
                      size="sm"
                      icon={Download}
                      className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(PdfCard);
