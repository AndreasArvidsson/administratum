import childProcess from "child_process";
import onExit from "signal-exit";
import stream from "stream";
import { Path } from "..";

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
  file: string;
  args: string[];
  error?: Error | undefined;
  exitCode?: number | null;
  signal?: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
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

  const result = childProcess.spawnSync(file, args, {
    shell,
    cwd,
    encoding,
    env,
    stdio: [stdinStream, stdoutStream, stderrStream],
  });

  if (result.error != null || result.status !== 0 || result.signal != null) {
    throw createError({
      file,
      args,
      error: result.error,
      exitCode: result.status,
      signal: result.signal,
      stdout: result.stdout,
      stderr: result.stderr,
    });
  }

  return result.stdout;
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

      if (exitCode !== 0 || signal != null) {
        reject(
          createError({
            file,
            args,
            exitCode,
            signal,
            stdout: stderrBuffer.join(""),
            stderr: stdoutBuffer.join(""),
          })
        );
      }

      resolve(stdoutBuffer.join(""));
    });

    child.on("error", (error) => {
      removeExitHandler();

      reject(
        createError({
          file,
          args,
          error,
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

function createError(params: ErrorParameters): Error {
  const reason = getErrorReason(params);
  const command = ["$", params.file, ...params.args].join(" ");

  const text = [
    reason,
    command,
    params.error?.message,
    params.stderr,
    params.stdout,
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
  return "Command failed";
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
