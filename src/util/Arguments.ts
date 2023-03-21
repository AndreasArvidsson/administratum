type Decrement = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Repeat<S extends string, N extends number> = N extends 0
  ? ""
  : `${S}${Repeat<S, Decrement[N]>}`;

export type Cross<S extends string, N extends number> = N extends 1
  ? `${Repeat<S, N>}`
  : `${Repeat<S, N>}` | `${Cross<S, Decrement[N]>}`;

function isString(data: unknown): data is string {
  return typeof data === "string" || data instanceof String;
}

type OptionsObject<T extends string> = Partial<Record<T, boolean>>;

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
