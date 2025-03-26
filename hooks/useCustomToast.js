import { toast } from "sonner";

export function useCustomToast() {
  const showToast = ({ title, description, variant }) => {
    switch (variant) {
      case "success":
        toast.success(title, { description,  style: { backgroundColor: "#097969", color:"white", border: "none" } });
        break;
      case "error":
        toast.error(title, { description, style: { backgroundColor: "#D22B2B", color:"white", border: "none" } });
        break;
      case "warning":
        toast.warning(title, { description, style: { backgroundColor: "#D22B2B", color:"white", border: "none" } });
        break;
      case "info":
        toast.info(title, { description });
        break;
      default:
        toast(title, { description });
        break;
    }
  };
  return { showToast };
}
