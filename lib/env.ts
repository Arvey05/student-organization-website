type PublicEnv = {
  supabaseUrl: string;
  supabasePublishableKey: string;
};

const DEV_FALLBACKS: Record<string, string> = {
  NEXT_PUBLIC_SUPABASE_URL: "https://placeholder-project.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder-anon-key",
};

function readRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    if (DEV_FALLBACKS[name]) {
      return DEV_FALLBACKS[name];
    }
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(
    url &&
      key &&
      !url.includes("placeholder-project") &&
      !key.includes("placeholder"),
  );
}

export function getPublicEnv(): PublicEnv {
  return {
    supabaseUrl: readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabasePublishableKey: readRequiredEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ),
  };
}
