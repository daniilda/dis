import { useCallback, useState, useEffect } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { observer } from "mobx-react-lite";
import { createPortal } from "react-dom";
import { supportedFileTypes, vm } from "@/stores/store";

export const FullWindowFileUpload = observer(() => {
  const [isDraggingOverWindow, setIsDraggingOverWindow] = useState(false);

  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      setIsDraggingOverWindow(true);
    };

    const handleDragLeave = (event: DragEvent) => {
      event.preventDefault();
      setIsDraggingOverWindow(false);
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDragLeave);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDragLeave);
    };
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    vm.uploadFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: supportedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Accept),
  });

  return createPortal(
    <>
      {isDraggingOverWindow && (
        <div className="fixed appear inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-50">
          <div
            {...getRootProps()}
            className={`w-[70vw] h-[70vh] border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 transition-colors ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-muted-foreground"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg text-center mb-2">
              {isDragActive
                ? "А теперь отпустите :)"
                : "Перетащите картинки, документы или архивы сюда..."}
            </p>
            <p className="text-sm text-muted-foreground">
              Поддерживаются .txt, .pdf, .docx, .doc
            </p>
          </div>
        </div>
      )}
    </>,
    document.body,
  );
});
