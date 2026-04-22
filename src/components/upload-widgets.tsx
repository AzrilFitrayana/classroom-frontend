import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/contants";
import { UploadWidgetProps, UploadWidgetValue } from "@/types";
import { UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const UploadWidget = ({
  value = null,
  onChange,
  disabled = false,
}: UploadWidgetProps) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);

  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false;

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          folder: "uploads",
          maxFileSize: 5000000,
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            const payload: UploadWidgetValue = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
            };

            setPreview(payload);

            onChangeRef.current?.(payload);
          }
        },
      );

      return true;
    };

    if (initializeWidget()) return;

    const intervalId = window.setInterval(() => {
      if (initializeWidget()) {
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  const openWidget = () => {
    if (!disabled) widgetRef.current?.open();
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="upload-preview">
          <img src={preview.url} alt="Uploaded file" />
        </div>
      ) : (
        <div
          className="upload-dropzone"
          role="button"
          //   tabIndex={0}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onClick={openWidget}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            openWidget();
          }}
        >
          <div className="upload-prompt">
            <UploadIcon className="icon" />
            <div>
              <p>Click to upload</p>
              <p>PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
