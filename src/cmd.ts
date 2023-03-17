import childProcess from "child_process";

function parseCommand(cmdOrFile: string, args?: string[]) {
  if (args) {
    return { file: cmdOrFile, args };
  }
  const parts = cmdOrFile.split(" ");
  return { file: parts[0], args: parts.slice(1) };
}

function $(cmd: string): any;
function $(file: string, args: string[]): any;
function $(cmdOrFile: string, optArgs?: string[]): any {
  const { file, args } = parseCommand(cmdOrFile, optArgs);

  const child = childProcess.spawnSync(file, args, {
    shell: true,
    encoding: "utf-8",
  });

  const error = createError(file, args, child);

  if (error) {
    throw error;
  }

  return child.stdout;
}

export { $ };

interface SpawnSyncReturns {
  pid: number;
  output: Array<T | null>;
  stdout: string;
  stderr: string;
  status: number | null;
  signal: NodeJS.Signals | null;
  error?: Error | undefined;
}

function createError(
  file: string,
  args: string[],
  child: SpawnSyncReturns
): Error | undefined {
  const reason = getErrorReason(child);

  if (!reason) {
    return undefined;
  }

  const command = ["$", file, ...args].join(" ");

  const text = [
    reason,
    command,
    child.error?.message,
    child.stderr,
    child.stdout,
  ]
    .filter(Boolean)
    .join("\n");

  return Error(text);
}

function getErrorReason(child: SpawnSyncReturns): string | undefined {
  if (child?.error?.cause) {
    return `Command failed with ${child.error.cause}`;
  }
  if (child.signal != null) {
    return `Command was killed with ${child.signal}`;
  }
  if (child.status) {
    return `Command failed with exit code ${child.status}`;
  }
  return undefined;
}
