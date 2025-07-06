'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

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
      case "destructive":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />,
          confirmBtn: "bg-red-600 hover:bg-red-700 text-white",
          iconBg: "bg-red-50 dark:bg-red-900/20"
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />,
          confirmBtn: "bg-amber-600 hover:bg-amber-700 text-white",
          iconBg: "bg-amber-50 dark:bg-amber-900/20"
        };
      default:
        return {
          icon: <AlertTriangle className="h-12 w-12 text-blue-500 mx-auto mb-4" />,
          confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white",
          iconBg: "bg-blue-50 dark:bg-blue-900/20"
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
        max-h-[90vh] overflow-y-auto
      `}>

        {/* Content */}
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
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full sm:w-auto px-6 py-3 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg font-medium order-2 sm:order-1"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              className={`
                w-full sm:w-auto px-6 py-3 ${variantStyles.confirmBtn} 
                transition-colors rounded-lg font-medium shadow-sm text-blue-500 border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-800
                order-1 sm:order-2
              `}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;