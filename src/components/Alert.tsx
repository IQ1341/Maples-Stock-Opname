// src/components/Alert.tsx
import Swal from "sweetalert2";

interface AlertProps {
  title: string;
  text: string;
  icon?: "success" | "error" | "warning" | "info" | "question";
  confirmButtonText?: string;
  confirmButtonColor?: string;
  width?: string;
  height?: string;
}

const Alert = ({
  title,
  text,
  icon = "info",
  confirmButtonText = "OK",
  confirmButtonColor = "#242c38",
  width ="400px"
}: AlertProps) => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    confirmButtonColor,
    width,
  });
};

export default Alert;
