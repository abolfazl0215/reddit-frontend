import { toast } from "sonner";

const showToast = (message, type) => {
  toast(message, {
    type,
    duration: 2000,
    position: "top-center",
    style: {
      background: type === "success" ? "#2ac27c" : "#555555",
      color: "#ffffff",
      borderColor: type === "success" ? "#27ae60" : "#444444",
    },
  });
};
export default showToast;
