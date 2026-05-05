import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import { Path } from "./Path.js";

interface Response {
    url: string;
    file: Path;
    size?: number;
    message: string;
}

export function fetch(url: string, path?: Path | string): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
        const parsedUrl = new URL(url);
        const lib = parsedUrl.protocol === "https:" ? https : http;
        const filePath = new Path(path ?? url.split("/").at(-1) ?? "file");

        const request = lib.get(parsedUrl, (response) => {
            if (response.statusCode === 302) {
                if (response.headers.location != null) {
                    fetch(
                        new URL(response.headers.location, parsedUrl).href,
                        path,
                    )
                        .then(resolve)
                        .catch(reject);
                } else {
                    reject(
                        new Error(
                            `Respond code: ${response.statusCode} with no location header`,
                        ),
                    );
                }
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Respond code: ${response.statusCode ?? -1}`));
                return;
            }

            const contentLength =
                response.headers["content-length"] != null
                    ? Number.parseInt(response.headers["content-length"], 10)
                    : undefined;

            if (contentLength != null && filePath.exists()) {
                if (contentLength === filePath.size()) {
                    resolve({
                        url,
                        file: filePath,
                        size: contentLength,
                        message: "Already existed",
                    });
                    response.destroy();
                    return;
                }
            }

            const file = fs.createWriteStream(filePath.path);
            response.pipe(file);

            file.on("finish", () => {
                file.close(() => {
                    resolve({
                        url,
                        file: filePath,
                        size: contentLength,
                        message: "Downloaded",
                    });
                });
            });
        });

        request.on("error", reject);
        request.end();
    });
}
