export function after(timeout: string, callback: () => void): void {
    const timeoutMs = getTimeoutMs(timeout);
    setTimeout(() => callback(), timeoutMs);
}

export function sleep(timeout: string): Promise<void> {
    const timeoutMs = getTimeoutMs(timeout);
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), timeoutMs);
    });
}

export function countdown(
    seconds: number,
    progress: (secondsLeft: number) => void,
): void {
    progress(seconds);
    if (seconds) {
        setTimeout(() => {
            countdown(seconds - 1, progress);
        }, 1000);
    }
}

export function getTimeoutMs(timeout: string | number): number {
    if (typeof timeout === "number") {
        return timeout;
    }

    const match = /(\d+)(s|ms)/.exec(timeout);

    if (!match) {
        throw new Error(`Invalid timeout '${timeout}'`);
    }

    const value = Number.parseInt(match[1], 10);
    const unit = match[2];

    if (unit.endsWith("ms")) {
        return value;
    }

    return value * 1000;
}
