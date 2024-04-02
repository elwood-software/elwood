const EnvNameMap: Record<string, string | undefined> = {
  IsPlatform: process.env.ELWOOD_IS_PLATFORM,
  PublicSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  PublicSupabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export type EnvName = keyof typeof EnvNameMap;
export const EnvValue: Record<EnvName, string | undefined> = Object.keys(
  EnvNameMap,
).reduce((acc, key) => {
  return {
    ...acc,
    [key]: EnvNameMap[key],
  };
}, {});
