import { MemberPageHeader } from "@/components/member/page-header";
import { getCurrentMemberProfile } from "@/lib/member/profile";
import { updateProfile } from "@/app/member/actions";

export default async function EditProfilePage() {
  const { profile, user } = await getCurrentMemberProfile();
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
      <div className="mx-auto max-w-6xl">
        <MemberPageHeader
          eyebrow="Edit profile"
          title="Update your member information"
          description="Modify your school, contact, personal, and guardian information. Profile picture upload will be connected with Supabase Storage in a later phase."
        />

        <form
          action={updateProfile}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map(({ name, label, value }) => (
              <label key={name} className="block">
                <span className="text-sm font-semibold text-slate-700">
                  {label}
                </span>
                <input
                  name={name}
                  defaultValue={value ?? ""}
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
            >
              Save Profile
            </button>
            <button
              type="reset"
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
