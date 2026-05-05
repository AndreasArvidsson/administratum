import readline from "node:readline";

export function progressPromises(
    title: string,
    promises: Promise<unknown>[],
    format: (index: number, resolved: boolean, response: unknown) => string,
): Promise<unknown> {
    let first = true;
    let numResolved = 0;
    const isResolved = Array.from({ length: promises.length }, () => false);
    const responses = Array.from(
        { length: promises.length },
        () => null as unknown,
    );

    function print(): void {
        if (first) {
            first = false;
        } else {
            readline.moveCursor(process.stdout, 0, -promises.length - 2);
        }

        console.log(`${title}: ${numResolved} / ${promises.length}`);

        for (let i = 0; i < promises.length; ++i) {
            const resolved = isResolved[i];
            const response = responses[i];
            const f = format(i, resolved, response);
            readline.clearLine(process.stdout, 0);
            console.log(`    [${resolved ? "X" : " "}] ${f}`);
        }

        console.log("");
    }

    print();

    return Promise.all(
        promises.map(
            (promise, i) =>
                new Promise((resolve, reject) => {
                    promise
                        .then((response) => {
                            isResolved[i] = true;
                            responses[i] = response;
                            ++numResolved;
                            print();
                            resolve(response);
                        })
                        .catch(reject);
                }),
        ),
    );
}
