"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "#/lib/supabase/server";

export type State = {
  error?: string;
  success: boolean;
  redirect_url?: string;
  email?: string;
  return_uri?: string;
};

export async function login(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const returnUri = (formData.get("return_uri") as string) ?? "/";

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      success: false,
      error: "Invalid Credentials",
      email: data.email,
    };
  }

  revalidatePath("/", "layout");

  return {
    success: true,
    redirect_url: returnUri.length === 0 ? "/" : returnUri,
  };
}
