"use client";

import * as React from "react";
import Image from "next/image";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

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

function getSafeExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && /^[a-z0-9]+$/.test(extension)) {
    return extension;
  }

  return file.type.split("/")[1] ?? "jpg";
}

function getFolder(bucket: OfficerImageUploadProps["bucket"]) {
  return bucket === "activity-images" ? "events" : "announcements";
}

export function OfficerImageUpload({
  bucket,
  hiddenInputName,
  label = "Cover Image",
  currentImageUrl,
}: OfficerImageUploadProps) {
  const [imageUrl, setImageUrl] = React.useState(currentImageUrl ?? "");
  const [previewUrl, setPreviewUrl] = React.useState(currentImageUrl ?? "");
  const [error, setError] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hiddenInputRef = React.useRef<HTMLInputElement>(null);
  const imageUrlRef = React.useRef(currentImageUrl ?? "");

  React.useEffect(() => {
    const form = containerRef.current?.closest("form");

    if (!form) {
      return;
    }

    function handleSubmit(event: SubmitEvent) {
      if (isUploading) {
        event.preventDefault();
        setError("Please wait for the image upload to finish.");
        return;
      }

      if (error) {
        event.preventDefault();
      }
    }

    function handleFormData(event: FormDataEvent) {
      event.formData.set(hiddenInputName, imageUrlRef.current);
    }

    form.addEventListener("submit", handleSubmit);
    form.addEventListener("formdata", handleFormData);

    return () => {
      form.removeEventListener("submit", handleSubmit);
      form.removeEventListener("formdata", handleFormData);
    };
  }, [error, hiddenInputName, isUploading]);

  function setSubmittedImageUrl(nextImageUrl: string) {
    imageUrlRef.current = nextImageUrl;
    setImageUrl(nextImageUrl);

    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = nextImageUrl;
    }
  }

  async function uploadFile(file: File) {
    setError(null);
    setSubmittedImageUrl("");

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setPreviewUrl(currentImageUrl ?? "");
      setError("Upload a JPG, PNG, WebP, or GIF image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setPreviewUrl(currentImageUrl ?? "");
      setError("Image must be 10 MB or smaller.");
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be signed in to upload an image.");
        return;
      }

      const extension = getSafeExtension(file);
      const uniquePart =
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const path = `${user.id}/${getFolder(bucket)}/${Date.now()}-${uniquePart}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        setSubmittedImageUrl(currentImageUrl ?? "");
        setError(uploadError.message || "Image upload failed.");
        setPreviewUrl(currentImageUrl ?? "");
        return;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      setSubmittedImageUrl(data.publicUrl);
      setPreviewUrl(data.publicUrl);
      setError(null);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div ref={containerRef} className="mt-4">
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={hiddenInputName}
        defaultValue={imageUrl}
      />
      <label className="block">
        <span className="text-sm font-semibold text-slate-200">{label}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              void uploadFile(file);
            } else {
              setSubmittedImageUrl(currentImageUrl ?? "");
              setPreviewUrl(currentImageUrl ?? "");
              setError(null);
            }
          }}
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

      {isUploading ? (
        <p className="mt-3 text-sm font-semibold text-blue-100">
          Uploading image...
        </p>
      ) : imageUrl ? (
        <p className="mt-3 text-sm font-semibold text-emerald-100">
          Image uploaded and ready.
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
          />
        </div>
      ) : null}
    </div>
  );
}
