export const after = (timeout: string, callback: () => void) => {
  const timeoutMs = getTimeoutMs(timeout);
  setTimeout(() => callback(), timeoutMs);
};

export const sleep = async (timeout: string): Promise<void> => {
  const timeoutMs = getTimeoutMs(timeout);
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), timeoutMs);
  });
};

export const countdown = (
  seconds: number,
  progress: (secondsLeft: number) => void
): void => {
  progress(seconds);
  if (seconds) {
    setTimeout(() => {
      countdown(seconds - 1, progress);
    }, 1000);
  }
};

export function getTimeoutMs(timeout: string | number): number {
  if (typeof timeout === "number") {
    return timeout;
  }

  const match = timeout.match(/(\d+)(s|ms)/);

  if (!match) {
    throw Error(`Invalid timeout '${timeout}'`);
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  if (unit.endsWith("ms")) {
    return value;
  }

  return value * 1000;
}
