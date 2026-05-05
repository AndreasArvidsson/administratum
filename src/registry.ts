import type { ExecSyncOptionsWithStringEncoding } from "node:child_process";
import childProcess from "node:child_process";

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
const valueRe = new RegExp(`(\\(?.+\\)?)${dataTypesPattern}\\s*(.*)`);

const options: ExecSyncOptionsWithStringEncoding = {
    encoding: "utf8",
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

export function regQueryKey(keyName: string): RegKey | undefined {
    let res;
    try {
        res = childProcess.execSync(`REG QUERY "${keyName}"`, options).trim();
    } catch (error) {
        if (exceptionIsMissingKeyOrValue(error)) {
            return undefined;
        }
        throw error;
    }

    // The key exists but it has no value or children
    if (!res) {
        return {
            name: keyName,
            values: [],
            children: [],
        };
    }

    const lines = res.split("\n").map((l) => l.trim());
    const separatorIndex = lines.indexOf("");
    const valueLines =
        separatorIndex !== -1 ? lines.slice(0, separatorIndex) : lines;
    const childLines =
        separatorIndex !== -1 ? lines.slice(separatorIndex + 1) : [];

    return {
        name: keyName,
        values: getValuesFromKeyLines(keyName, valueLines),
        children: childLines.toSorted(),
    };
}

export function regHasKey(keyName: string): boolean {
    return regQueryKey(keyName) != null;
}

export function regQueryValue(
    keyName: string,
    valueName: string,
): RegValue | undefined {
    let res;
    try {
        res = childProcess.execSync(
            `REG QUERY "${keyName}" /v "${valueName}"`,
            options,
        );
    } catch (error) {
        if (exceptionIsMissingKeyOrValue(error)) {
            return undefined;
        }
        throw error;
    }

    const lines = res
        .trim()
        .split("\n")
        .map((l) => l.trim());
    const values = getValuesFromKeyLines(keyName, lines);

    if (values.length !== 1) {
        throw new Error(`Unexpected registry query return '${res}'`);
    }

    return values[0];
}

export function regHasValue(keyName: string, valueName: string): boolean {
    return regQueryValue(keyName, valueName) != null;
}

export function regAddKey(keyName: string): string {
    return childProcess.execSync(`REG ADD "${keyName}"`, options).trim();
}

export function regAddValue(
    keyName: string,
    valueName: string,
    valueType: ValueType,
    valueData: string,
): string {
    return childProcess
        .execSync(
            `REG ADD "${keyName}" /v "${valueName}" /t "${valueType}" /d "${valueData}"`,
            options,
        )
        .trim();
}

export function regDelKey(keyName: string): string {
    return childProcess.execSync(`REG DELETE "${keyName}" /f`, options).trim();
}

export function regDelValue(keyName: string, valueName: string): string {
    return childProcess
        .execSync(`REG DELETE "${keyName}" /v "${valueName}" /f`, options)
        .trim();
}

function getValuesFromKeyLines(keyName: string, lines: string[]): RegValue[] {
    if (lines[0] !== keyName) {
        throw new Error(
            `Unexpected registry query key name: expected '${keyName}', actual '${lines[0]}'`,
        );
    }

    const values: RegValue[] = [];

    for (let i = 1; i < lines.length; ++i) {
        const match = lines[i].match(valueRe);
        if (match?.length !== 4) {
            console.log(lines[i]);
            console.log(valueRe);
            console.log(match);
            throw new Error(
                `Unexpected registry query return '${lines.join("\n")}'`,
            );
        }
        values.push({
            name: match[1].trim(),
            // oxlint-disable-next-line typescript/no-unsafe-type-assertion
            type: match[2] as ValueType,
            data: match[3],
        });
    }

    return values.toSorted((a, b) => a.name.localeCompare(b.name));
}

function exceptionIsMissingKeyOrValue(ex: unknown): boolean {
    return (
        ex instanceof Error &&
        ex.message.includes(
            "ERROR: The system was unable to find the specified registry key or value.",
        )
    );
}
