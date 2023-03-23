type Decrement = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Repeat<S extends string, N extends number> = N extends 0
  ? ""
  : `${S}${Repeat<S, Decrement[N]>}`;

type KeyOfStr<T> = Extract<keyof T, string>;
type ValueOf<T> = T[keyof T];

type OptionsObject<LongName extends string> = Partial<
  Record<LongName, boolean>
>;

export type Cross<Flag extends string, N extends number> = N extends 1
  ? `${Repeat<Flag, N>}`
  : `${Repeat<Flag, N>}` | `${Cross<Flag, Decrement[N]>}`;

export type OptionsType<Map extends Record<string, string>, N extends number> =
  | Partial<Record<ValueOf<Map>, boolean>>
  | Cross<KeyOfStr<Map>, N>;

export function getOptions<Flag extends string, LongName extends string>(
  options: OptionsObject<LongName> | string,
  map: { [key in Flag]: LongName }
): OptionsObject<LongName> {
  if (isString(options)) {
    const res: OptionsObject<LongName> = {};
    for (const f of options) {
      const key = map[f as Flag];
      res[key] = true;
    }
    return res;
  }
  return options;
}

function isString(data: unknown): data is string {
  return typeof data === "string" || data instanceof String;
}
