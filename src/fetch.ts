import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import urllib from "node:url";
import { Path } from ".";

interface Response {
    url: string;
    file: Path;
    size?: number;
    message: string;
}

export const fetch = (url: string, path?: Path | string): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
        const { href, protocol } = urllib.parse(url);
        const lib = protocol === "https:" ? https : http;
        const filePath = new Path(path ?? url.split("/").at(-1) ?? "file");

        const request = lib.get(href, (response) => {
            if (response.statusCode === 302) {
                if (response.headers.location) {
                    fetch(response.headers.location, path).then(resolve).catch(reject);
                } else {
                    reject(Error(`Respond code: ${response.statusCode} with no location header`));
                }
                return;
            }

            if (response.statusCode !== 200) {
                reject(Error(`Respond code: ${response.statusCode ?? -1}`));
                return;
            }

            const contentLength = response.headers["content-length"]
                ? parseInt(response.headers["content-length"])
                : undefined;

            if (contentLength && filePath.exists()) {
                if (contentLength === filePath.size()) {
                    resolve({
                        url: url,
                        file: filePath,
                        size: contentLength,
                        message: "Already existed"
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
                        message: "Downloaded"
                    });
                });
            });
        });

        request.on("error", reject);
        request.end();
    });
};
