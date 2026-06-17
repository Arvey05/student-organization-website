"use client";

import * as React from "react";
import Image from "next/image";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type OfficerImageUploadProps = {
  bucket: "activity-images" | "announcement-images";
  hiddenInputName: string;
  label?: string;
  currentImageUrl?: string | null;
};

export function OfficerImageUpload({
  bucket,
  hiddenInputName,
  label = "Cover Image",
  currentImageUrl,
}: OfficerImageUploadProps) {
  const [previewUrl, setPreviewUrl] = React.useState(currentImageUrl ?? "");
  const [error, setError] = React.useState<string | null>(null);
  const objectUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    if (!file) {
      setPreviewUrl(currentImageUrl ?? "");
      setError(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      event.target.value = "";
      setPreviewUrl(currentImageUrl ?? "");
      setError("Upload a JPG, PNG, WebP, or GIF image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      event.target.value = "";
      setPreviewUrl(currentImageUrl ?? "");
      setError("Image must be 10 MB or smaller.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setError(null);
  }

  return (
    <div className="mt-4">
      <input
        type="hidden"
        name={hiddenInputName}
        defaultValue={currentImageUrl ?? ""}
      />
      <label className="block">
        <span className="text-sm font-semibold text-slate-200">{label}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          data-officer-image-input
          data-bucket={bucket}
          data-current-image-url={currentImageUrl ?? ""}
          onChange={handleFileChange}
          className="mt-2 w-full rounded-md border border-white/10 bg-black px-4 py-3 text-sm text-slate-200 outline-none transition file:mr-4 file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-bold file:text-slate-950 focus:border-blue-300/60"
        />
        <span className="mt-2 block text-xs text-slate-500">
          JPG, PNG, WebP, or GIF. Maximum file size is 10 MB.
        </span>
      </label>

      {error ? (
        <p className="mt-3 border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
          {error}
        </p>
      ) : null}

      {previewUrl ? (
        <div className="relative mt-4 aspect-video overflow-hidden rounded-md border border-white/10 bg-black">
          <Image
            src={previewUrl}
            alt="Selected cover preview"
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            unoptimized={previewUrl.startsWith("blob:")}
          />
        </div>
      ) : null}
    </div>
  );
}
