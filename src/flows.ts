import { Path, promptContinue, readFile } from ".";

interface Options {
    files: Path[] | string[];
    propertiesFile?: Path | string;
    skipPrompt?: boolean;
}

type TaskFn = () => void | Promise<void>;
type TaskSkipOnlyFunction = (name: string, fn: TaskFn) => void;
interface Properties {
    get: (key: string, def?: string) => string;
}

interface TaskFunction {
    (name: string, fn: TaskFn): void;
    only: TaskSkipOnlyFunction;
    skip: TaskSkipOnlyFunction;
}

type FlowFn = (
    task: TaskFunction,
    properties: Properties
) => void | Promise<void>;

interface TaskDesc {
    name: string;
    fn: TaskFn;
    only?: boolean;
    skip?: boolean;
}

interface FlowDesc {
    name: string;
    fn: FlowFn;
    only?: boolean;
    skip?: boolean;
    tasks: TaskDesc[];
}

const flows: FlowDesc[] = [];

const runFlows = async (options: Options): Promise<void> => {
    const properties = loadProperties(options.propertiesFile);
    const files = options.files.map((f) => new Path(f));
    await loadFlowFiles(files);
    await runFlowFunctions(properties);
    const hasOnly = flows.some((w) => w.only || w.tasks.some((t) => t.only));
    logFiles(files);
    logFlowsAndTasks(hasOnly);
    if (!options.skipPrompt) {
        await promptContinue();
    }
    const t1 = Date.now();
    await runTaskFunctions(hasOnly);
    const t2 = Date.now();
    const duration = formatDuration(t1, t2);
    console.log(`\n[ All flows completed @ ${duration} ]`);
};

const flow = (name: string, fn: FlowFn) => {
    flows.push({ name, fn, tasks: [] });
};

flow.only = (name: string, fn: FlowFn) => {
    flows.push({ name, fn, tasks: [], only: true });
};

flow.skip = (name: string, fn: FlowFn) => {
    flows.push({ name, fn, tasks: [], skip: true });
};

function loadProperties(propertiesFile: Path | string | undefined): Properties {
    const properties: Record<string, string> = {};
    if (propertiesFile != null) {
        const lines = readFile(propertiesFile).split("\n");
        for (const line of lines) {
            if (line.trim() === "") {
                continue;
            }
            const parts = line.split("=").map((s) => s.trim());
            if (parts.length !== 2) {
                throw Error(`Incorrect properties line '${line}'`);
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

async function loadFlowFiles(files: Path[]) {
    for (const f of files) {
        await require(f.path);
    }
}

async function runFlowFunctions(properties: Properties): Promise<void> {
    for (const flow of flows) {
        const taskFn = getTaskFunction(flow);
        await Promise.resolve(flow.fn(taskFn, properties));
    }
}

function logFiles(files: Path[]) {
    console.log(`Files: ${files.length}`);
    const cwd = Path.cwd();
    for (const f of files) {
        console.log(cwd.relative(f));
    }
    console.log("");
}

function logFlowsAndTasks(hasOnly: boolean) {
    const loglines: string[] = [];
    let runningFlows = 0;
    let runningTasks = 0;
    let numTasks = 0;

    for (const flow of flows) {
        const runFlow = shouldRun(hasOnly, flow);
        runningFlows += runFlow ? 1 : 0;
        loglines.push(`${runFlow ? "  " : "- "}${flow.name}`);

        for (const task of flow.tasks) {
            const runTask = shouldRun(hasOnly, flow, task);
            numTasks++;
            runningTasks += runTask ? 1 : 0;
            loglines.push(`    ${runTask ? "  " : "- "}${task.name}`);
        }

        loglines.push("");
    }

    console.log(
        runningFlows === flows.length
            ? `Flows: ${runningFlows}`
            : `Flows: ${runningFlows} / ${flows.length}`
    );
    console.log(
        runningTasks === numTasks
            ? `Tasks: ${runningTasks}`
            : `Tasks: ${runningTasks} / ${numTasks}`
    );
    console.log("");
    console.log(loglines.join("\n"));
}

async function runTaskFunctions(hasOnly: boolean) {
    let previousFlowRan = false;

    for (let i = 0; i < flows.length; ++i) {
        const flow = flows[i];

        if (!shouldRun(hasOnly, flow)) {
            const prefix = previousFlowRan ? "\n" : "";
            previousFlowRan = false;
            console.log(
                `${prefix}========== ${flow.name} [SKIPPED] ==========`
            );
            continue;
        }

        const prefix = i > 0 ? "\n" : "";
        previousFlowRan = true;
        console.log(`${prefix}========== ${flow.name} [Start] ==========`);
        const t1 = Date.now();
        let previousTaskRan = false;

        for (let j = 0; j < flow.tasks.length; ++j) {
            const task = flow.tasks[j];

            if (!shouldRun(hasOnly, flow, task)) {
                const prefix = previousTaskRan ? "\n" : "";
                console.log(`${prefix}- ${task.name} [SKIPPED]`);
                previousTaskRan = false;
                continue;
            }

            const prefix = j > 0 ? "\n" : "";
            console.log(`${prefix}- ${task.name}`);
            previousTaskRan = true;
            await Promise.resolve(task.fn());
        }

        const t2 = Date.now();
        const duration = formatDuration(t1, t2);
        console.log(
            `========== ${flow.name} [Completed @ ${duration}] ==========`
        );
    }
}

function getTaskFunction(flow: FlowDesc) {
    const task = (name: string, fn: TaskFn) => {
        flow.tasks.push({ name, fn });
    };
    task.only = (name: string, fn: TaskFn) => {
        flow.tasks.push({ name, fn, only: true });
    };
    task.skip = (name: string, fn: TaskFn) => {
        flow.tasks.push({ name, fn, skip: true });
    };
    return task;
}

function shouldRun(hasOnly: boolean, flow: FlowDesc, task?: TaskDesc): boolean {
    if (!task) {
        return flow.tasks.some((t) => shouldRun(hasOnly, flow, t));
    }
    return !flow.skip && !task.skip && (!hasOnly || !!flow.only || !!task.only);
}

function formatDuration(t1: number, t2: number): string {
    const delta = t2 - t1;
    return delta < 1000 ? `${delta}ms` : `${delta / 1000}s`;
}

export { runFlows, flow };
