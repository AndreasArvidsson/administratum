import childProcess, { ExecSyncOptionsWithStringEncoding } from "node:child_process";

const dataTypes = [
    "REG_SZ",
    "REG_MULTI_SZ",
    "REG_EXPAND_SZ",
    "REG_DWORD",
    "REG_QWORD",
    "REG_BINARY",
    "REG_NONE"
] as const;

const dataTypesPattern = `(${dataTypes.join("|")})`;
const valueRe = new RegExp(`(\\(?.+\\)?)${dataTypesPattern}\\s*(.*)`);

const options: ExecSyncOptionsWithStringEncoding = {
    encoding: "utf-8"
};

type ValueType = (typeof dataTypes)[number];

interface RegValue {
    name: string;
    type: ValueType;
    data: string;
}

interface RegKey {
    name: string;
    values: RegValue[];
    children: string[];
}

export const regQueryKey = (keyName: string): RegKey | undefined => {
    let res;
    try {
        res = childProcess.execSync(`REG QUERY "${keyName}"`, options).trim();
    } catch (e) {
        if (exceptionIsMissingKeyOrValue(e)) {
            return undefined;
        }
        throw e;
    }

    // The key exists but it has no value or children
    if (!res) {
        return {
            name: keyName,
            values: [],
            children: []
        };
    }

    const lines = res.split("\n").map((l) => l.trim());
    const separatorIndex = lines.indexOf("");
    const valueLines = separatorIndex > -1 ? lines.slice(0, separatorIndex) : lines;
    const childLines = separatorIndex > -1 ? lines.slice(separatorIndex + 1) : [];

    return {
        name: keyName,
        values: getValuesFromKeyLines(keyName, valueLines),
        children: childLines.sort()
    };
};

export const regHasKey = (keyName: string) => {
    return regQueryKey(keyName) != null;
};

export const regQueryValue = (keyName: string, valueName: string): RegValue | undefined => {
    let res;
    try {
        res = childProcess.execSync(`REG QUERY "${keyName}" /v "${valueName}"`, options);
    } catch (e) {
        if (exceptionIsMissingKeyOrValue(e)) {
            return undefined;
        }
        throw e;
    }

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
    return regQueryValue(keyName, valueName) != null;
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
    return childProcess.execSync(`REG DELETE "${keyName}" /v "${valueName}" /f`, options).trim();
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
            console.log(lines[i]);
            console.log(valueRe);
            console.log(match);
            throw Error(`Unexpected registry query return '${lines.join("\n")}'`);
        }
        values.push({
            name: match[1].trim(),
            type: match[2] as ValueType,
            data: match[3]
        });
    }

    return values.sort((a, b) => a.name.localeCompare(b.name));
}

function exceptionIsMissingKeyOrValue(ex: unknown) {
    return (
        ex instanceof Error &&
        ex.message.includes(
            "ERROR: The system was unable to find the specified registry key or value."
        )
    );
}
