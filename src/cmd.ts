import childProcess from "child_process";

function cmdSync(cmd: string): string;
function cmdSync(file: string, args: string[]): string;
function cmdSync(cmdOrFile: string, optArgs?: string[]): string {
  const { file, args } = parseCommand(cmdOrFile, optArgs);
  return spawnSync(file, args);
}

function cmdAsync(cmd: string): Promise<string>;
function cmdAsync(file: string, args: string[]): Promise<string>;
function cmdAsync(cmdOrFile: string, optArgs?: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const { file, args } = parseCommand(cmdOrFile, optArgs);
      resolve(spawnSync(file, args));
    } catch (error) {
      reject(error);
    }
  });
}

export { cmdSync as $, cmdAsync as $$ };

function spawnSync(file: string, args: string[]): string {
  const child = childProcess.spawnSync(file, args, {
    encoding: "utf-8",
    shell: true,
  });

  const error = createError(file, args, child);

  if (error) {
    throw error;
  }

  return child.stdout;
}

interface SpawnSyncReturns {
  pid: number;
  stdout: string;
  stderr: string;
  status: number | null;
  signal: NodeJS.Signals | null;
  error?: Error | undefined;
}

function parseCommand(cmdOrFile: string, args?: string[]) {
  if (args) {
    return { file: cmdOrFile, args };
  }
  const parts = cmdOrFile.split(" ");
  return { file: parts[0], args: parts.slice(1) };
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
