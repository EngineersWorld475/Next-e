import { Button } from "@/components/ui/button";
import React from "react";

const DialogButton = ({ onClick, children, variant, isConfirm }) => {
  return (
    <Button
      onClick={onClick}
      variant={isConfirm && variant === "destructive" ? "destructive" : isConfirm ? "default" : "outline"}
      className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium ${
        isConfirm && variant === "warning" ? "bg-amber-600 hover:bg-amber-700 text-white" : ""
      }`}
    >
      {children}
    </Button>
  );
};

export default DialogButton;