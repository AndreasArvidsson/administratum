interface ErrorParameters {
    file: string;
    args: string[];
    error?: Error | undefined;
    exitCode?: number | null;
    signal?: NodeJS.Signals | null;
    stdout: string;
    stderr: string;
}

export function createError(params: ErrorParameters): Error {
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
    if (child.signal != null) {
        return `Command was killed with ${child.signal}`;
    }
    if (child.exitCode) {
        return `Command failed with exit code ${child.exitCode}`;
    }
    return "Command failed";
}
