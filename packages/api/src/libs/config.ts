import { existsSync, readFileSync } from "node:fs";
import { extname, isAbsolute, join } from "node:path";
import { z } from "zod";

export const configProviderSchema = z.string().or(
  z.object({
    name: z.string(),
    module: z.function().returns(z.any()),
  }),
);

export const configNamespaceSchema = z.object({
  name: z.string(),
  display_name: z.string().optional(),
  providers: z.array(
    z.tuple([z.string(), z.string(), z.record(z.string(), z.any())]),
  ),
});

export const schema = z.object({
  providers: z.array(configProviderSchema),
  namespaces: z.array(configNamespaceSchema),
});

export type Configuration = z.infer<typeof schema>;
export type ConfigurationProvider = z.infer<typeof configProviderSchema>;
export type ConfigurationNamespace = z.infer<typeof configNamespaceSchema>;

export type FullConfiguration = Required<Configuration>;

export type LoadConfigInput = string | Partial<Configuration> | undefined;

export async function load(
  input: LoadConfigInput,
  cwd = process.cwd(),
): Promise<FullConfiguration> {
  if (!input) {
    return {
      providers: [],
      namespaces: [],
    };
  }

  if (typeof input === "string") {
    return await loadFromFile(input, cwd);
  }

  return {
    providers: input.providers ?? [],
    namespaces: input.namespaces ?? [],
  };
}

export async function loadFromFile(filePath_: string, cwd = process.cwd()) {
  const filePath = isAbsolute(filePath_) ? filePath_ : join(cwd, filePath_);

  // wildcard means search for any extension we can handle
  if (filePath.includes("*")) {
    for (const possibleFileName of [
      filePath.replace("*", "json"),
      filePath.replace("*", "js"),
    ]) {
      if (existsSync(possibleFileName)) {
        return await loadFromFile(possibleFileName);
      }
    }

    return await load(undefined);
  }

  switch (extname(filePath)) {
    case ".js": {
      const mod = await import(filePath);
      return mod.default ?? mod;
    }
    case ".json": {
      return JSON.parse(readFileSync(filePath).toString());
    }

    default: {
      throw new Error(`Unable to parse config file "${filePath}"`);
    }
  }
}
