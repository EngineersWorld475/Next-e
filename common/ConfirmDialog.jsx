'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import DialogButton from "./DialogButton";

const ConfirmDialog = ({
  triggerText,
  iconTrigger,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  ButtonStyle,
  variant = "default", 
  size = "default" 
}) => {
  const [openModal, setOpenModal] = useState(false);

  const handleConfirm = () => {
    setOpenModal(false);
    onConfirm && onConfirm();
  };

  const handleCancel = () => {
    setOpenModal(false);
    onCancel && onCancel();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "desfault":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-blue-500 mx-auto mb-4" />,
          iconBg: "bg-blue-50 dark:bg-blue-900/20"
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />,
          iconBg: "bg-amber-50 dark:bg-amber-900/20"
        };
      default:
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />,
          iconBg: "bg-red-100 dark:bg-red-900/20"
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "max-w-sm";
      case "lg":
        return "max-w-lg";
      default:
        return "max-w-md";
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        {iconTrigger ? (
          <span className="cursor-pointer hover:opacity-80 transition-opacity">
            {iconTrigger}
          </span>
        ) : (
          <Button variant="outline" className={ButtonStyle}>
            {triggerText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={`
        ${sizeStyles} w-80 sm:w-full p-0 gap-0 
        bg-white dark:bg-gray-900 
        rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700
        max-h-[90vh] overflow-y-auto py-5
      `}> 
        {/* Content*/}
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          {/* Icon */}
          <div className={`${variantStyles.iconBg} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6`}>
            {variantStyles.icon}
          </div>

          {/* Header */}
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              {title}
            </DialogTitle>
            {description && (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            )}
          </DialogHeader>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <DialogButton
              onClick={handleCancel}
              variant={"default"}
              isConfirm={false}
            >
              {cancelText}
            </DialogButton>
            <DialogButton
              onClick={handleConfirm}
              variant={"destructive"}
              isConfirm={true}
            >
              {confirmText}
            </DialogButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;