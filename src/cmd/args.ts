import type stream from "node:stream";
import { getTimeoutMs } from "../cron.js";
import { Path } from "../Path.js";

type Pipe = "stdin" | "stdout" | "stderr" | "ignore" | stream.Writable;

export interface Options {
    shell?: boolean | string;
    cwd?: Path | string;
    encoding?: BufferEncoding;
    stdin?: Pipe;
    stdout?: Pipe;
    stderr?: Pipe;
    env?: NodeJS.ProcessEnv;
    timeout?: string | number;
}

type ParsedOptions = Required<Options> & {
    cwd: string;
    timeout: number;
};

export function parseCommand(
    cmdOrFile: string,
    args?: string[] | Options,
): { file: string; args: string[] } {
    if (Array.isArray(args)) {
        return { file: cmdOrFile, args };
    }
    const parts = cmdOrFile.split(" ");
    return { file: parts[0], args: parts.slice(1) };
}

export function parseOptions(
    optArgs?: string[] | Options,
    optOptions?: Options,
): ParsedOptions {
    const { encoding, cwd, stdin, stdout, stderr, shell, env, timeout } =
        optArgs != null && !Array.isArray(optArgs)
            ? optArgs
            : (optOptions ?? {});
    return {
        encoding: encoding ?? "utf8",
        cwd: new Path(cwd ?? Path.cwd()).path,
        stdin: stdin ?? "stdin",
        stdout: stdout ?? "stdout",
        stderr: stderr ?? "stderr",
        shell: shell ?? true,
        env: { ...process.env, ...env },
        timeout: timeout != null ? getTimeoutMs(timeout) : 0,
    };
}

export function getStream(
    pipe: Pipe,
    stdin?: stream.Writable,
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
