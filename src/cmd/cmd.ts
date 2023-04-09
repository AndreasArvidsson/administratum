import childProcess from "node:child_process";
import onExit from "signal-exit";
import { getStream, Options, parseCommand, parseOptions } from "./args";
import { createError } from "./error";
import {
    EventListener,
    EventListenerState,
    OnEventBuilder,
    OnEventCallback,
    runEventListeners
} from "./eventListeners";

function cmdSync(cmd: string, options?: Options): string;
function cmdSync(file: string, args: string[], options?: Options): string;
function cmdSync(cmdOrFile: string, optArgs?: string[] | Options, optOptions?: Options): string {
    const { file, args } = parseCommand(cmdOrFile, optArgs);
    const { shell, cwd, encoding, stdin, stdout, stderr, env, timeout } = parseOptions(
        optArgs,
        optOptions
    );

    const stdinStream = stdin === "stdin" ? "inherit" : getStream(stdin);
    const stdoutStream = getStream(stdout);
    const stderrStream = getStream(stderr);

    const result = childProcess.spawnSync(file, args, {
        shell,
        cwd,
        env,
        timeout,
        encoding,
        stdio: [stdinStream, stdoutStream, stderrStream]
    });

    if (result.error != null || result.status !== 0 || result.signal != null) {
        throw createError({
            file,
            args,
            error: result.error,
            exitCode: result.status,
            signal: result.signal,
            stdout: result.stdout,
            stderr: result.stderr
        });
    }

    return result.stdout;
}

function cmdAsync(cmd: string, options?: Options): Promise<string>;
function cmdAsync(file: string, args: string[], options?: Options): Promise<string>;
function cmdAsync(
    cmdOrFile: string,
    optArgs?: string[] | Options,
    optOptions?: Options
): Promise<string> {
    return cmdAsyncInternal(cmdOrFile, optArgs, optOptions);
}

function cmdAsyncOn(
    cmdOrFile: string,
    optArgs?: string[] | Options,
    optOptions?: Options
): OnEventBuilder {
    const eventListeners: EventListener[] = [];
    return {
        on: function (regex: RegExp, callback: OnEventCallback) {
            eventListeners.push({ regex, callback });
            return this;
        },
        run: () => {
            return cmdAsyncInternal(cmdOrFile, optArgs, optOptions, eventListeners);
        }
    };
}

export { cmdSync as $ };
export { cmdAsync as $$ };
export { cmdAsyncOn as $on };

function cmdAsyncInternal(
    cmdOrFile: string,
    optArgs?: string[] | Options,
    optOptions?: Options,
    eventListeners?: EventListener[]
): Promise<string> {
    return new Promise((resolve, reject) => {
        const { file, args } = parseCommand(cmdOrFile, optArgs);
        const { cwd, encoding, stdin, stdout, stderr, shell, env, timeout } = parseOptions(
            optArgs,
            optOptions
        );

        const child = childProcess.spawn(file, args, {
            shell,
            cwd,
            env,
            timeout
        });

        child.stdout.setEncoding(encoding);
        child.stderr.setEncoding(encoding);

        const stdoutBuffer: string[] = [];
        const stderrBuffer: string[] = [];

        const stdinStream = getStream(stdin, child.stdin);
        const stdoutStream = getStream(stdout, child.stdin);
        const stderrStream = getStream(stderr, child.stdin);

        const eventListenersState: EventListenerState = {
            eventListeners: eventListeners ?? [],
            stdoutBuffer,
            bufferIndex: 0,
            bufferLength: 0,
            kill: () => child.kill(),
            write: (data: string) => child.stdin.write(data)
        };

        if (stdinStream != null) {
            process.stdin.pipe(stdinStream);
        }
        if (stdoutStream != null) {
            child.stdout.pipe(stdoutStream);
        }
        if (stderrStream != null) {
            child.stderr.pipe(stderrStream);
        }

        child.stdout.on("data", (data: string) => {
            stdoutBuffer.push(data);

            if (eventListenersState.eventListeners.length !== 0) {
                eventListenersState.bufferLength += data.length;
                runEventListeners(eventListenersState);
            }
        });
        child.stderr.on("data", (data: string) => {
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
                        stderr: stdoutBuffer.join("")
                    })
                );
            }

            resolve(stdoutBuffer.join("").trimEnd());
        });

        child.on("error", (error) => {
            removeExitHandler();

            reject(
                createError({
                    file,
                    args,
                    error,
                    stderr: stdoutBuffer.join(""),
                    stdout: stderrBuffer.join("")
                })
            );
        });
    });
}
