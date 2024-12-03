import { PropsWithChildren, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Provider(props: PropsWithChildren): JSX.Element {
  const [client] = useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  );
}
