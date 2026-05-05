import type { Path } from "./Path.js";
import { promptContinue } from "./prompt.js";
import { readFile } from "./readFile.js";

interface Properties {
    get: (key: string, def?: string) => string | undefined;
}

type TaskFn = () => void | Promise<void>;

interface FlowFnProps {
    task: (name: string, fn: TaskFn) => void;
    properties: Properties;
}

export interface Flow {
    name: string;
    run: (props: FlowFnProps) => void | Promise<void>;
}

interface Options {
    flows: Flow[];
    propertiesFile?: Path | string;
    skipPrompt?: boolean;
}

interface TaskDesc {
    name: string;
    fn: TaskFn;
}

interface FlowDesc {
    flow: Flow;
    tasks: TaskDesc[];
}

export async function runFlows(options: Options): Promise<void> {
    const properties = loadProperties(options.propertiesFile);

    const flows: FlowDesc[] = options.flows.map((flow) => ({
        flow,
        tasks: [],
    }));

    await runFlowFunctions(flows, properties);

    logFlowsAndTasks(flows);

    if (!options.skipPrompt) {
        await promptContinue();
    }

    const t1 = Date.now();

    await runTaskFunctions(flows);

    const t2 = Date.now();
    const duration = formatDuration(t1, t2);
    console.log(`\n\n[ All flows completed @ ${duration} ]`);
}

function loadProperties(propertiesFile: Path | string | undefined): Properties {
    const properties: Record<string, string | undefined> = {};
    if (propertiesFile != null) {
        const lines = readFile(propertiesFile).split("\n");
        for (const line of lines) {
            if (line.trim() === "") {
                continue;
            }
            const parts = line.split("=").map((s) => s.trim());
            if (parts.length !== 2) {
                throw new Error(`Incorrect properties line '${line}'`);
            }
            properties[parts[0]] = parts[1];
        }
    }
    return {
        get(key: string, def?: string) {
            return properties[key] ?? def ?? undefined;
        },
    };
}

async function runFlowFunctions(
    flows: FlowDesc[],
    properties: Properties,
): Promise<void> {
    for (const flow of flows) {
        const task = (name: string, fn: TaskFn) => {
            flow.tasks.push({ name, fn });
        };
        await Promise.resolve(flow.flow.run({ task, properties }));
    }
}

function logFlowsAndTasks(flows: FlowDesc[]): void {
    const loglines: string[] = [];
    let runningFlows = 0;
    let runningTasks = 0;
    let numTasks = 0;

    for (const { flow, tasks } of flows) {
        runningFlows++;
        loglines.push(`  ${flow.name}`);

        for (const task of tasks) {
            numTasks++;
            runningTasks++;
            loglines.push(`    ${task.name}`);
        }

        loglines.push("");
    }

    console.log(
        runningFlows === flows.length
            ? `Flows: ${runningFlows}`
            : `Flows: ${runningFlows} / ${flows.length}`,
    );
    console.log(
        runningTasks === numTasks
            ? `Tasks: ${runningTasks}`
            : `Tasks: ${runningTasks} / ${numTasks}`,
    );
    console.log("");
    console.log(loglines.join("\n"));
}

async function runTaskFunctions(flows: FlowDesc[]): Promise<void> {
    for (let i = 0; i < flows.length; ++i) {
        const { flow, tasks } = flows[i];
        const prefix = i > 0 ? "\n\n" : "";
        console.log(`${prefix}========== ${flow.name} [Start] ==========`);
        const t1 = Date.now();

        for (let j = 0; j < tasks.length; ++j) {
            const task = tasks[j];
            const prefix = j > 0 ? "\n" : "";
            console.log(`${prefix}* ${task.name}`);
            await Promise.resolve(task.fn());
        }

        const t2 = Date.now();
        const duration = formatDuration(t1, t2);
        console.log(
            `========== ${flow.name} [Completed @ ${duration}] ==========`,
        );
    }
}

function formatDuration(t1: number, t2: number): string {
    const delta = t2 - t1;
    return delta < 1000 ? `${delta}ms` : `${delta / 1000}s`;
}
