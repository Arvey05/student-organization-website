import { MemberPageHeader } from "@/components/member/page-header";
import { MemberAvatar } from "@/components/member/member-avatar";
import { getCurrentMemberProfile } from "@/lib/member/profile";
import { updateProfile } from "@/app/member/actions";

const errorMessages: Record<string, string> = {
  profile_picture_type: "Upload a JPG, PNG, WebP, or GIF profile picture.",
  profile_picture_size: "Profile picture must be 5 MB or smaller.",
  profile_picture_upload: "Profile picture upload failed. Please try again.",
};

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ profile, user, displayName }, params] = await Promise.all([
    getCurrentMemberProfile(),
    searchParams,
  ]);
  const errorMessage = params.error ? errorMessages[params.error] : null;
  const fields: Array<{
    name: string;
    label: string;
    value: string | null | undefined;
  }> = [
    { name: "msc_id_code", label: "MSC ID Code", value: profile?.msc_id_code },
    {
      name: "school_id_code",
      label: "School ID Code",
      value: profile?.school_id_code,
    },
    { name: "last_name", label: "Last Name", value: profile?.last_name },
    { name: "first_name", label: "First Name", value: profile?.first_name },
    { name: "middle_name", label: "Middle Name", value: profile?.middle_name },
    { name: "extension", label: "Extension", value: profile?.extension },
    { name: "college", label: "College", value: profile?.college },
    { name: "program", label: "Program", value: profile?.program },
    { name: "major", label: "Major", value: profile?.major },
    { name: "year_level", label: "Year", value: profile?.year_level },
    { name: "section", label: "Section", value: profile?.section },
    { name: "phone", label: "Contact Number", value: profile?.phone },
    {
      name: "personal_email",
      label: "Personal Email",
      value: profile?.personal_email ?? user.email,
    },
    { name: "bulsu_email", label: "BulSU Email", value: profile?.bulsu_email },
    {
      name: "social_media_url",
      label: "Facebook Profile Link",
      value: profile?.social_media_url,
    },
    { name: "address", label: "Current Address", value: profile?.address },
    { name: "date_of_birth", label: "Birthdate", value: profile?.date_of_birth },
    { name: "gender", label: "Gender", value: profile?.gender },
    {
      name: "guardian_name",
      label: "Name of Guardian",
      value: profile?.guardian_name,
    },
    {
      name: "guardian_relationship",
      label: "Relationship to Guardian",
      value: profile?.guardian_relationship,
    },
    {
      name: "guardian_phone",
      label: "Guardian Contact Number",
      value: profile?.guardian_phone,
    },
    {
      name: "guardian_address",
      label: "Guardian Address",
      value: profile?.guardian_address,
    },
  ];

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[96rem]">
        <MemberPageHeader
          eyebrow="Edit profile"
          title="Update your member information"
          description="Modify your school, contact, personal, guardian, and profile picture information."
        />

        <form
          action={updateProfile}
<<<<<<< Updated upstream
          className="mt-8 border-y border-white/10 bg-[#02040a] p-6"
=======
          encType="multipart/form-data"
          className="mt-8 border-y border-white/10 bg-[#02001f] p-6"
>>>>>>> Stashed changes
        >
          <div className="mb-6 flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <MemberAvatar
                displayName={displayName}
                imageUrl={profile?.profile_picture_url}
                size={72}
              />
              <div>
                <p className="text-sm font-bold text-white">Profile picture</p>
                <p className="mt-1 text-sm text-slate-500">
                  JPG, PNG, WebP, or GIF. Maximum file size is 5 MB.
                </p>
              </div>
            </div>
            <label className="inline-flex h-11 cursor-pointer items-center justify-center border border-white/15 px-4 text-sm font-semibold text-white transition hover:border-blue-300/40 hover:text-blue-100">
              Change Picture
              <input
                name="profile_picture"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
              />
            </label>
          </div>

          {errorMessage ? (
            <p className="mb-5 border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
              {errorMessage}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map(({ name, label, value }) => (
              <label key={name} className="block">
                <span className="text-sm font-semibold text-slate-200">
                  {label}
                </span>
                <input
                  name={name}
                  defaultValue={value ?? ""}
                  className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60"
                />
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
            >
              Save Profile
            </button>
            <button
              type="reset"
              className="inline-flex h-11 items-center justify-center border border-white/15 px-5 text-sm font-semibold text-white transition hover:border-blue-300/40 hover:text-blue-100"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
