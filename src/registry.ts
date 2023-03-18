import childProcess, { ExecSyncOptionsWithStringEncoding } from "child_process";

const dataTypes = [
  "REG_SZ",
  "REG_MULTI_SZ",
  "REG_EXPAND_SZ",
  "REG_DWORD",
  "REG_QWORD",
  "REG_BINARY",
  "REG_NONE",
] as const;

const dataTypesPattern = `(${dataTypes.join("|")})`;
const valueRe = new RegExp(`(.+)${dataTypesPattern}\\s+(.+)`);

const options: ExecSyncOptionsWithStringEncoding = {
  encoding: "utf-8",
};

type ValueType = typeof dataTypes[number];

interface RegValue {
  name: string;
  type: ValueType;
  data: string;
}

export const regQueryKey = (keyName: string) => {
  const res = childProcess.execSync(`REG QUERY "${keyName}"`, options);
  const lines = res
    .trim()
    .split("\n")
    .map((l) => l.trim());
  const separatorIndex = lines.indexOf("");
  const valueLines = lines.slice(0, separatorIndex);
  const childLines = lines.slice(separatorIndex + 1);

  return {
    name: keyName,
    values: getValuesFromKeyLines(keyName, valueLines),
    children: childLines.sort(),
  };
};

export const regQueryValue = (keyName: string, valueName: string) => {
  const res = childProcess.execSync(
    `REG QUERY "${keyName}" /v "${valueName}"`,
    options
  );
  const lines = res
    .trim()
    .split("\n")
    .map((l) => l.trim());
  const values = getValuesFromKeyLines(keyName, lines);

  if (values.length !== 1) {
    throw Error(`Unexpected registry query return '${res}'`);
  }

  return values[0];
};

export const regHasValue = (keyName: string, valueName: string) => {
  try {
    regQueryValue(keyName, valueName);
    return true;
  } catch (e) {
    return false;
  }
};

export const regAddKey = (keyName: string) => {
  return childProcess.execSync(`REG ADD "${keyName}"`, options).trim();
};

export const regAddValue = (
  keyName: string,
  valueName: string,
  valueType: ValueType,
  valueData: string
) => {
  return childProcess
    .execSync(
      `REG ADD "${keyName}" /v "${valueName}" /t "${valueType}" /d "${valueData}"`,
      options
    )
    .trim();
};

export const regDelKey = (keyName: string) => {
  return childProcess.execSync(`REG DELETE "${keyName}" /f`, options).trim();
};

export const regDelValue = (keyName: string, valueName: string) => {
  return childProcess
    .execSync(`REG DELETE "${keyName}" /v "${valueName}" /f`, options)
    .trim();
};

function getValuesFromKeyLines(keyName: string, lines: string[]): RegValue[] {
  if (lines[0] !== keyName) {
    throw Error(
      `Unexpected registry query key name: expected '${keyName}', actual '${lines[0]}'`
    );
  }

  const values: RegValue[] = [];

  for (let i = 1; i < lines.length; ++i) {
    const match = lines[i].match(valueRe);
    if (match?.length !== 4) {
      throw Error(`Unexpected registry query return '${lines.join("\n")}'`);
    }
    values.push({
      name: match[1].trim(),
      type: match[2] as ValueType,
      data: match[3],
    });
  }

  return values.sort((a, b) => a.name.localeCompare(b.name));
}
