# Administratum

All the tools you need to perform your duty to the empire of man

## Examples

These are just a few examples of some of the features Administratum offers

### Run cli commands

```js
$("ls -l");
```

```js
$("echo", ["hello world"]);
```

### Typescript implementation of common bash commands

```js
cp("file.txt", "dir/copy.txt");
```

```js
mv("file.txt", "newName.txt");
```

```js
mkdir("newFolder");
```

```js
find("/dir", /name/);
```

```js
grep(/WARN/, "file.log");
```

### File utilities

```js
readFile("file.txt");
```

```js
Path.temp().join("dir", "file.txt").exists();
```

```js
touch("file.txt");
```

### Download files

```js
await fetch("http://domain.com/setup.zip");
```

### Extract archives

```js
await extract("archive.zip");
```

```js
await extract("archive.tar");
```

### Windows registery utilities

```js
regQueryKey("HKEY_CURRENT_USER\\Software\\Microsoft");
```

```js
regAddValue("HKEY_CURRENT_USER\\Software\\MyApp", "enabled", "REG_DWORD", 1);
```

### Automation pipeline

```js
flow("Create folders", (task) => {
  task("Make applications dir", () => {
    mkdir("applications");
  });
});

flow("Extract archives", (task) => {
  task("Extract DB", async () => {
    await extract("mongodb.zip", "applications");
  });

  task("Extract WF", async () => {
    await extract("wildly.zip", "applications");
  });

  task.skip("Skipped", () => {
    // Skipped
  });
});
```

![Adeptus administratum adept](./images/Imperio_adeptus_administratum_adepto.webp)
