"use client";

import * as React from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type OfficerImageBucket = "activity-images" | "announcement-images";

type OfficerFormProps = {
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
  className?: string;
};

function getSafeExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && /^[a-z0-9]+$/.test(extension)) {
    return extension;
  }

  return file.type.split("/")[1] ?? "jpg";
}

function getFolder(bucket: OfficerImageBucket) {
  return bucket === "activity-images" ? "events" : "announcements";
}

async function uploadOfficerImage(file: File, bucket: OfficerImageBucket) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Upload a JPG, PNG, WebP, or GIF image.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be 10 MB or smaller.");
  }

  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to upload an image.");
  }

  const extension = getSafeExtension(file);
  const uniquePart =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const path = `${user.id}/${getFolder(bucket)}/${Date.now()}-${uniquePart}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message || "Image upload failed.");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
}

export function OfficerForm({ action, children, className }: OfficerFormProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const imageInput = form.querySelector<HTMLInputElement>(
      "input[data-officer-image-input]",
    );
    const selectedImage = imageInput?.files?.[0] ?? null;
    const existingImageUrl = imageInput?.dataset.currentImageUrl?.trim() ?? "";
    const bucket = imageInput?.dataset.bucket as OfficerImageBucket | undefined;

    try {
      if (selectedImage) {
        if (!bucket) {
          throw new Error("Image upload target is missing.");
        }

        const uploadedImageUrl = await uploadOfficerImage(selectedImage, bucket);

        if (!uploadedImageUrl) {
          throw new Error("Image upload finished without a URL.");
        }

        formData.set("image_url", uploadedImageUrl);
      } else if (existingImageUrl) {
        formData.set("image_url", existingImageUrl);
      } else {
        formData.delete("image_url");
      }

      await action(formData);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save. Please try again.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {error ? (
        <p className="mb-5 border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
          {error}
        </p>
      ) : null}
      <fieldset disabled={isSubmitting} className="contents">
        {children}
      </fieldset>
    </form>
  );
}
