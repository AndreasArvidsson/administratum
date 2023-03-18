import childProcess from "child_process";
import stream from "stream";
import { Path } from ".";
import onExit from "signal-exit";

type Pipe = "stdin" | "stdout" | "stderr" | "ignore" | stream.Writable;

export interface Options {
  shell?: boolean | string;
  cwd?: Path | string;
  encoding?: BufferEncoding;
  stdin?: Pipe;
  stdout?: Pipe;
  stderr?: Pipe;
  env?: NodeJS.ProcessEnv;
}

type ParsedOptions = Required<Options> & { cwd: string };

interface ErrorParameters {
  stdout: string;
  stderr: string;
  exitCode?: number | null;
  signal?: NodeJS.Signals | string | null;
  error?: Error | undefined;
}

function cmdSync(cmd: string, options?: Options): string;
function cmdSync(file: string, args: string[], options?: Options): string;
function cmdSync(
  cmdOrFile: string,
  optArgs?: string[] | Options,
  optOptions?: Options
): string {
  const { file, args } = parseCommand(cmdOrFile, optArgs);
  const { shell, cwd, encoding, stdin, stdout, stderr, env } = parseOptions(
    optArgs,
    optOptions
  );

  const stdinStream = stdin === "stdin" ? "inherit" : getStream(stdin);
  const stdoutStream = getStream(stdout);
  const stderrStream = getStream(stderr);

  const child = childProcess.spawnSync(file, args, {
    shell,
    cwd,
    encoding,
    env,
    stdio: [stdinStream, stdoutStream, stderrStream],
  });

  const error = createError(file, args, {
    exitCode: child.status,
    signal: child.signal,
    error: child.error,
    stdout: child.stdout,
    stderr: child.stderr,
  });

  if (error != null) {
    throw error;
  }

  return child.stdout;
}

function cmdAsync(cmd: string, options?: Options): Promise<string>;
function cmdAsync(
  file: string,
  args: string[],
  options?: Options
): Promise<string>;
function cmdAsync(
  cmdOrFile: string,
  optArgs?: string[] | Options,
  optOptions?: Options
): Promise<string> {
  return cmdAsyncInternal(cmdOrFile, optArgs, optOptions);
}

function cmdOn(
  cmdOrFile: string,
  optArgs?: string[] | Options,
  optOptions?: Options
): Promise<string> {
  return cmdAsyncInternal(cmdOrFile, optArgs, optOptions);
}

export { cmdSync as $, cmdAsync as $$, cmdOn };

function cmdAsyncInternal(
  cmdOrFile: string,
  optArgs?: string[] | Options,
  optOptions?: Options
): Promise<string> {
  return new Promise((resolve, reject) => {
    const { file, args } = parseCommand(cmdOrFile, optArgs);
    const { cwd, encoding, stdin, stdout, stderr, shell, env } = parseOptions(
      optArgs,
      optOptions
    );

    const child = childProcess.spawn(file, args, {
      shell,
      cwd,
      env,
    });

    child.stdout.setEncoding(encoding);
    child.stderr.setEncoding(encoding);

    const stdoutBuffer: string[] = [];
    const stderrBuffer: string[] = [];

    const stdinStream = getStream(stdin, child.stdin);
    const stdoutStream = getStream(stdout, child.stdin);
    const stderrStream = getStream(stderr, child.stdin);

    if (stdinStream != null) {
      process.stdin.pipe(stdinStream);
    }
    if (stdoutStream != null) {
      child.stdout.pipe(stdoutStream);
    }
    if (stderrStream != null) {
      child.stderr.pipe(stderrStream);
    }

    child.stdout.on("data", (data) => {
      stdoutBuffer.push(data);
    });
    child.stderr.on("data", (data) => {
      stderrBuffer.push(data);
    });

    const removeExitHandler = onExit(() => {
      child.kill();
    });

    child.on("exit", (exitCode, signal) => {
      removeExitHandler();

      const error = createError(file, args, {
        exitCode,
        signal,
        stdout: stderrBuffer.join(""),
        stderr: stdoutBuffer.join(""),
      });

      if (error != null) {
        reject(error);
      }

      resolve(stdoutBuffer.join(""));
    });

    child.on("error", (error) => {
      removeExitHandler();

      reject(
        createError(file, args, {
          error: error,
          stderr: stdoutBuffer.join(""),
          stdout: stderrBuffer.join(""),
        })
      );
    });
  });
}

function parseCommand(cmdOrFile: string, args?: string[] | Options) {
  if (Array.isArray(args)) {
    return { file: cmdOrFile, args };
  }
  const parts = cmdOrFile.split(" ");
  return { file: parts[0], args: parts.slice(1) };
}

function parseOptions(
  optArgs?: string[] | Options,
  optOptions?: Options
): ParsedOptions {
  const { encoding, cwd, stdin, stdout, stderr, shell, env } =
    optArgs != null && !Array.isArray(optArgs) ? optArgs : optOptions ?? {};
  return {
    encoding: encoding ?? "utf-8",
    cwd: new Path(cwd ?? Path.cwd()).path,
    stdin: stdin ?? "stdin",
    stdout: stdout ?? "stdout",
    stderr: stderr ?? "stderr",
    shell: shell ?? true,
    env: Object.assign({}, process.env, env),
  };
}

function createError(
  file: string,
  args: string[],
  child: ErrorParameters
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

function getErrorReason(child: ErrorParameters): string | undefined {
  if (child?.error?.cause != null) {
    return `Command failed with ${child.error.cause}`;
  }
  if (child.signal != null) {
    return `Command was killed with ${child.signal}`;
  }
  if (child.exitCode !== 0) {
    return `Command failed with exit code ${child.exitCode}`;
  }
  return undefined;
}

function getStream(
  pipe: Pipe,
  stdin?: stream.Writable
): stream.Writable | undefined {
  if (pipe === "stdin") {
    return stdin;
  }
  if (pipe === "stdout") {
    return process.stdout;
  }
  if (pipe === "stderr") {
    return process.stderr;
  }
  if (pipe === "ignore") {
    return undefined;
  }
  return pipe;
}
