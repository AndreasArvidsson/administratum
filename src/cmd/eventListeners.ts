interface OnEvent {
  match: RegExpExecArray;
  deregister: () => void;
  on: (regex: RegExp, callback: OnEventCallback) => void;
  write: (data: string) => void;
  kill: () => void;
}

export type OnEventCallback = (event: OnEvent) => void;

export interface OnEventBuilder {
  on: (regex: RegExp, callback: OnEventCallback) => OnEventBuilder;
  run: () => Promise<string>;
}

export interface EventListener {
  regex: RegExp;
  callback: OnEventCallback;
}

export interface EventListenerState {
  eventListeners: EventListener[];
  stdoutBuffer: string[];
  bufferIndex: number;
  bufferLength: number;
  write: (data: string) => void;
  kill: () => void;
}

export function runEventListeners(state: EventListenerState) {
  const text = getText(state);
  const toRemove: number[] = [];
  const toAdd: EventListener[] = [];
  let offset = 0;

  state.eventListeners.forEach((listener, i) => {
    listener.regex.lastIndex = 0;
    const match = listener.regex.exec(text);
    if (match) {
      listener.callback({
        match,
        write: state.write,
        kill: state.kill,
        deregister: () => {
          toRemove.push(i);
        },
        on: (regex, callback) => {
          toAdd.push({ regex, callback });
        },
      });
      offset = Math.max(offset, match.index + match[0].length);
    }
  });

  if (toRemove.length !== 0) {
    for (let i = toRemove.length - 1; i > -1; --i) {
      state.eventListeners.splice(toRemove[i], 1);
    }
  }

  if (toAdd.length !== 0) {
    state.eventListeners.push(...toAdd);
  }

  state.bufferIndex += offset;
}

function getText(state: EventListenerState): string {
  const parts: string[] = [];
  const maxLength = state.bufferLength - state.bufferIndex;
  let length = 0;

  for (let i = state.stdoutBuffer.length - 1; i > -1; --i) {
    const chunk = state.stdoutBuffer[i];
    if (length + chunk.length > maxLength) {
      parts.push(chunk.slice(chunk.length - (maxLength - length)));
      break;
    } else {
      parts.push(chunk);
      length += chunk.length;
    }
  }

  return parts.reverse().join("");
}
