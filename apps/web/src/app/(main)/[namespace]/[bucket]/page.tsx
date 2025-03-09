import { redirect } from "next/navigation";

export type PageProps = {
  params: Promise<{ namespace: string; bucket: string }>;
};

export default async function Page(props: PageProps) {
  const { bucket, namespace } = await props.params;
  redirect(`/${namespace}/${bucket}/tree`);
}
