import http from "http";
import https from "https";
import fs from "fs";
import _url from "url";
import _path from "path";

interface Response {
  url: string;
  file: string;
  size?: number;
  message: string;
}

export const fetch = (url: string, path?: string) => {
  return new Promise<Response>((resolve, reject) => {
    const { href, protocol } = _url.parse(url);
    const lib = protocol === "https:" ? https : http;
    const filePath = _path.resolve(path ?? url.split("/").at(-1) ?? "file");

    const request = lib.get(href, (response) => {
      if (response.statusCode !== 200) {
        reject(response.statusCode);
      }

      const contentLength = response.headers["content-length"]
        ? parseInt(response.headers["content-length"])
        : undefined;

      if (contentLength && fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (contentLength === stats.size) {
          resolve({
            url: url,
            file: filePath,
            size: contentLength,
            message: "Already existed",
          });
        }
      }

      const file = fs.createWriteStream(filePath);
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
};
