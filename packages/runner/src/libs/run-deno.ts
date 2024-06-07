export type ExecuteDenoRunOptions = Omit<ExecuteDenoCommand, 'args'> & {
  file: string;
};

export async function executeDenoRun(
  options: ExecuteDenoRunOptions,
): Promise<Deno.CommandOutput> {
  const {file, ...cmdOptions} = options;

  return await executeDenoCommand({
    args: ['run', file],
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
