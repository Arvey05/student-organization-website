"use client";

import Image from "next/image";

type MemberAvatarProps = {
  displayName: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
};

export function getMemberInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "M";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";

  return `${first}${second}`.toUpperCase();
}

export function MemberAvatar({
  displayName,
  imageUrl,
  size = 40,
  className = "",
}: MemberAvatarProps) {
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-white/[0.03] font-black text-blue-100 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <span className="text-[0.72rem]">{getMemberInitials(displayName)}</span>
      )}
    </span>
  );
}
