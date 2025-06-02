'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";

const ConfirmDialog = ({ 
  triggerText, 
  iconTrigger, 
  title, 
  onConfirm, 
  onCancel, 
  confirmText = "Yes", 
  cancelText = "Cancel", 
  ButtonStyle 
}) => {
  const [openModal, setOpenModal] = useState(false)
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        {iconTrigger ? ( 
          <span className="cursor-pointer">{iconTrigger}</span>
        ) : (
          <Button variant="outline" className={ButtonStyle}>{triggerText}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-center items-center bg-white dark:bg-gray-900 dark:text-white backdrop-blur-lg rounded-xl shadow-lg border border-white/30">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row gap-4 justify-center items-center mt-4">
          <Button 
            onClick={() => setOpenModal(false)} 
            variant="outline" 
            className="px-4 py-2 text-gray-600 border-gray-300 hover:bg-gray-100 transition-all rounded-lg dark:bg-gray-600 dark:text-white outline-none border-none"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={() => { setOpenModal(false); onConfirm && onConfirm(); }}  
            className="px-4 py-2 text-white bg-gray-800 border-gray-300 transition-all rounded-lg outline-none border-none hover:bg-gray-800"
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
