import { MemberPageHeader } from "@/components/member/page-header";
import { ProfileEditForm } from "@/components/member/profile-edit-form";
import { getCurrentMemberProfile } from "@/lib/member/profile";
import { updateProfile } from "@/app/member/actions";

const errorMessages: Record<string, string> = {
  profile_picture_type:
    "Only JPG, PNG, or WebP profile pictures are accepted.",
  profile_picture_size: "Profile picture must be 1 MB or smaller.",
  profile_picture_upload: "Profile picture upload failed. Please try again.",
  invalid_college_program_major:
    "The college, program, or major selection is invalid.",
  invalid_year_level: "The selected year level is invalid.",
  invalid_gender: "The selected gender is invalid.",
  invalid_birthdate: "Please enter a valid birthdate.",
  update_failed: "Profile update failed. Please try again.",
  profile_setup_failed: "Profile setup failed. Please try again.",
};

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ profile, user }, params] = await Promise.all([
    getCurrentMemberProfile(),
    searchParams,
  ]);
  const errorMessage = params.error ? (errorMessages[params.error] ?? null) : null;

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
          encType="multipart/form-data"
          className="mt-8 border-y border-white/10 bg-[#02040a] p-6"
        >
          <ProfileEditForm
            profile={profile}
            userEmail={user.email}
            errorMessage={errorMessage}
          />
        </form>
      </div>
    </main>
  );
}
