export type ExecuteDenoRunOptions = Omit<ExecuteDenoCommand, 'args'> & {
  file: string;
  permissions?: Deno.PermissionOptionsObject;
};

export async function executeDenoRun(
  options: ExecuteDenoRunOptions,
): Promise<Deno.CommandOutput> {
  const {file, permissions, ...cmdOptions} = options;

  return await executeDenoCommand({
    args: ['run', ...permissionObjectToFlags(permissions ?? {}), file],
    ...cmdOptions,
  });
}

export type ExecuteDenoCommand = Deno.CommandOptions;

export async function executeDenoCommand(
  options: ExecuteDenoCommand,
): Promise<Deno.CommandOutput> {
  const cmd = new Deno.Command(Deno.execPath(), {
    stdout: 'inherit',
    stderr: 'inherit',
    ...options,
  });

  return await cmd.output();
}

export function permissionObjectToFlags(
  options: Deno.PermissionOptionsObject,
): string[] {
  return Object.entries(options).reduce((acc, [name, value]) => {
    if (value === false || value === 'inherit') {
      return acc;
    }

    if (value === true) {
      return [...acc, `--allow-${name}`];
    }

    if (Array.isArray(value)) {
      return [...acc, `--allow-${name}=${value.join(',')}`];
    }

    return acc;
  }, [] as string[]);
}
