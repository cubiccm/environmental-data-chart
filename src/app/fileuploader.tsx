import "./fileuploader.scss";
import { useRef, useState } from "react";

export default function FileUploader({
  callback,
  error_message,
}: {
  callback: Function;
  error_message: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const file_input = useRef(null);

  const handleFile = callback;

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement)?.files?.[0];
    file && handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
  };

  const handleUploadButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    (file_input.current as HTMLInputElement | null)?.click();
  };

  return (
    <>
      <div
        className={
          "dragbox" + (isDragging ? " !border-solid bg-slate-300" : "")
        }
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <md-filled-button onClick={handleUploadButtonClick}>
          <md-icon slot="icon">upload</md-icon>
          Choose File
        </md-filled-button>
        <span>or drag & drop your file here</span>
        <span className="!text-red-500">{error_message}</span>
      </div>
      <input type="file" ref={file_input} onChange={handleFileChange} hidden />
    </>
  );
}
