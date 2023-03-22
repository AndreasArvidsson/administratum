import { Path, promptContinue } from ".";

interface Options {
  files: Path[] | string[];
}

type TaskFn = () => void | Promise<void>;
type TaskSkipOnlyFunction = (name: string, fn: TaskFn) => void;

interface TaskFunction {
  (name: string, fn: TaskFn): void;
  only: TaskSkipOnlyFunction;
  skip: TaskSkipOnlyFunction;
}

type FlowFn = (task: TaskFunction) => void | Promise<void>;

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
  await loadFlowFiles(options.files);
  await runFlowFunctions();
  const hasOnly = flows.some((w) => w.only || w.tasks.some((t) => t.only));
  logFlowsAndTasks(hasOnly);
  // await promptContinue();
  await runTaskFunctions(hasOnly);
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

async function loadFlowFiles(files: Path[] | string[]) {
  for (const f of files) {
    await require(new Path(f).path);
  }
}

async function runFlowFunctions(): Promise<void> {
  for (const flow of flows) {
    const taskFn = getTaskFunction(flow);
    await Promise.resolve(flow.fn(taskFn));
  }
}

function logFlowsAndTasks(hasOnly: boolean) {
  const loglines: string[] = [];
  let runningFlows = 0;
  let runningTasks = 0;
  let numTasks = 0;

  for (const flow of flows) {
    const flowLoglines: string[] = [];
    let runFlow = false;

    for (const task of flow.tasks) {
      const runTask = shouldRun(hasOnly, flow, task);
      runFlow = runFlow || runTask;
      numTasks++;
      runningTasks += runTask ? 1 : 0;
      flowLoglines.push(`    ${runTask ? "  " : "- "}${task.name}`);
    }

    runningFlows += runFlow ? 1 : 0;
    loglines.push(`${runFlow ? "  " : "- "}${flow.name}`);
    loglines.push(...flowLoglines);
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
  for (const flow of flows) {
    for (const task of flow.tasks) {
      if (shouldRun(hasOnly, flow, task)) {
        await Promise.resolve(task.fn());
      }
    }
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

function shouldRun(hasOnly: boolean, flow: FlowDesc, task: TaskDesc): boolean {
  return !flow.skip && !task.skip && (!hasOnly || !!flow.only || !!task.only);
}

export { runFlows, flow };
