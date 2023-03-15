import http from "http";
import https from "https";
import fs from "fs";
import _url from "url";
import _path from "path";

export const fetch = (url: string, path?: string) => {
  return new Promise<string>((resolve, reject) => {
    const { href, protocol } = _url.parse(url);
    const lib = protocol === "https:" ? https : http;
    const destination = _path.resolve(path ?? url.split("/").at(-1) ?? "file");
    const file = fs.createWriteStream(destination);

    const request = lib.get(href, (response) => {
      if (response.statusCode !== 200) {
        reject(response.statusCode);
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close();
        resolve(destination.toString());
      });
    });

    request.on("error", reject);
    request.end();
  });
};
