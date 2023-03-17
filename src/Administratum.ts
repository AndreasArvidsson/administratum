import path from "path";
import readline from "readline";

interface Options {
  files: string[];
}

type Status = "completed" | "skipped";
type Fn = () => unknown;

interface Task {
  name: string;
  callback: Fn;
  only?: boolean;
  skip?: boolean;
  status?: Status;
}

interface Workflow {
  name: string;
  callback: Fn;
  only?: boolean;
  skip?: boolean;
  status?: Status;
  tasks: Task[];
}

const workflows: Workflow[] = [];
let currentWorkflow: Workflow | null = null;

export class Administratum {
  private files: string[];

  constructor(options: Options) {
    this.files = options.files;
  }

  public async run() {
    this.loadFiles();
    await this.runWorkflows();
  }

  private async runWorkflows() {
    const hasOnly = workflows.some((w) => w.only);

    for (const workflow of workflows) {
      if ((hasOnly && !workflow.only) || workflow.skip) {
        workflow.status = "skipped";
        this.printWorkflow(workflow, true);
        continue;
      } else {
        currentWorkflow = workflow;
        await this.done(workflow.callback());
        currentWorkflow = null;
        this.printWorkflow(workflow, true);
        await this.runTasks(workflow);
        workflow.status = "completed";
        this.printWorkflow(workflow);
      }
    }
  }

  private async runTasks(workflow: Workflow) {
    const hasOnly = workflow.tasks.some((t) => t.only);

    for (const task of workflow.tasks) {
      if ((hasOnly && !task.only) || task.skip) {
        task.status = "skipped";
        this.printWorkflow(workflow);
        continue;
      } else {
        await this.done(task.callback());
        task.status = "completed";
        this.printWorkflow(workflow);
      }
    }
  }

  private printWorkflow(workflow: Workflow, first = false) {
    if (!first) {
      readline.moveCursor(process.stdout, 0, -workflow.tasks.length - 1);
    }

    switch (workflow.status) {
      case "skipped":
        console.log(`[-] ${workflow.name}`);
        break;
      case "completed":
        console.log(`[X] ${workflow.name}`);
        break;
      default:
        console.log(`[ ] ${workflow.name}`);
    }

    workflow.tasks.forEach((task) => {
      readline.clearLine(process.stdout, 0);

      switch (task.status) {
        case "skipped":
          console.log(`    [-] ${task.name}`);
          break;
        case "completed":
          console.log(`    [X] ${task.name}`);
          break;
        default:
          console.log(`    [ ] ${task.name}`);
      }
    });
  }

  private loadFiles() {
    this.files.forEach((file) => {
      file = path.resolve(file);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require(file);
    });
  }

  private async done(returnValue: unknown) {
    await Promise.resolve(returnValue);
  }
}

function addTask(task: Task) {
  if (!currentWorkflow) {
    throw Error("Can't add task without workflow");
  }
  currentWorkflow.tasks.push(task);
}

const workflow = (name: string, callback: Fn) => {
  workflows.push({
    name,
    callback,
    tasks: [],
  });
};

workflow.only = (name: string, callback: Fn) => {
  workflows.push({
    name,
    callback,
    only: true,
    tasks: [],
  });
};

workflow.skip = (name: string, callback: Fn) => {
  workflows.push({
    name,
    callback,
    skip: true,
    tasks: [],
  });
};

const task = (name: string, callback: Fn) => {
  addTask({ name, callback });
};

task.only = (name: string, callback: Fn) => {
  addTask({ name, callback, only: true });
};

task.skip = (name: string, callback: Fn) => {
  addTask({ name, callback, skip: true });
};

export { workflow, task };
