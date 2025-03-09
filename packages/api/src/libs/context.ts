import { existsSync } from "node:fs";
import { type CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { type FullConfiguration } from "./config.js";
import { Namespace, type NamespaceMap } from "./namespace.js";
import type { ProviderConstructor, ProviderMap } from "../types.js";

export type CreateContextInput = InnerContext & {
  options: CreateHTTPContextOptions;
};

export async function createContext(input: CreateContextInput) {
  const { config, namespaces } = input;

  return {
    config,
    namespaces,
  };
}

export type InnerContext = {
  config: FullConfiguration;
  namespaces: NamespaceMap;
};

export async function createInnerContext(
  config: FullConfiguration,
  defaultProviders: ProviderConstructor[],
): Promise<InnerContext> {
  const providers = new Map<string, ProviderConstructor>();
  const namespaces = new Map<string, Namespace>();

  for (const provider of config.providers) {
    if (typeof provider === "string") {
      for (const defProvider of defaultProviders) {
        if (defProvider.name === provider) {
          providers.set(defProvider.name, defProvider);
        }
      }
      if (existsSync(provider)) {
        const mod_ = await import(provider);
        const mod = (mod_.default ?? mod_) as ProviderConstructor;
        providers.set(mod.name, mod);
      }
    } else {
      providers.set(
        provider.name,
        provider.module as unknown as ProviderConstructor,
      );
    }
  }

  for (const {
    providers: namespaceProviderNames,
    ...namespaceConfig
  } of config.namespaces) {
    const namespaceProviders: ProviderMap = new Map();

    // we need to create providers out of anything provided
    // we'll pull from all of the defined providers, check the options
    // then construct a new instance with those options
    for (const [
      providerId,
      providerName,
      providerOptions,
    ] of namespaceProviderNames) {
      const providerConstructor = providers.get(providerName)!;

      if (providerConstructor.optionsSchema) {
        providerConstructor.optionsSchema.parse(providerOptions);
      }

      namespaceProviders.set(
        providerId,
        await new providerConstructor(providerId, providerOptions).initialize(),
      );
    }

    // set our namespace and pass any providers given
    namespaces.set(
      namespaceConfig.name,
      new Namespace(namespaceConfig, namespaceProviders),
    );
  }

  return { config, namespaces };
}
