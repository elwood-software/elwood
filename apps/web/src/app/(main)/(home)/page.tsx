"use client";

import Link from "next/link";

import { useNamespaces } from "#/hooks/use-namespaces";

export default function Page() {
  const { data } = useNamespaces();

  console.log(data);

  return (
    <>
      root app
      {data?.map((item) => {
        return (
          <Link key={item.name} href={`/${item.name}`}>
            {item.displayName}
          </Link>
        );
      })}
    </>
  );
}
