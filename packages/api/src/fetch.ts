import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./app.js";
import { load as loadConfig, type LoadConfigInput } from "./libs/config.js";
import { createInnerContext, createContext } from "./libs/context.js";
import { type ProviderConstructor } from "./types.js";

import AwsS3Provider from "./providers/aws-s3.js";

const defaultProviders: ProviderConstructor[] = [AwsS3Provider];

export type CreateFetchRequestHandlerOptions = {
  config: LoadConfigInput;
  endpoint: string;
};

export async function createFetchRequestHandler(
  options: CreateFetchRequestHandlerOptions,
) {
  const config = await loadConfig(options.config);
  const innerContext = await createInnerContext(config, defaultProviders);

  return function fetch(request: Request) {
    if (request.method === "HEAD") {
      return new Response();
    }

    return fetchRequestHandler({
      endpoint: options.endpoint,
      req: request,
      router: appRouter,
      createContext: (options) => createContext({ ...innerContext, options }),
    });
  };
}
