// scripts/generate-crud.ts
import { generateCrudFiles } from "./generators";
import type { Field, CrudConfig } from "./generators/types";
import * as fs from "fs";
import * as path from "path";

interface FileSystemError extends Error {
  code?: string;
}

const configName: string = process.argv[2];
if (!configName) {
  console.error("Please provide a config name (e.g., w9form, customer)");
  process.exit(1);
}

const baseName: string = configName.replace(".json", "");
const configPath: string = path.join(
  __dirname,
  "crud-config",
  `${baseName}.json`
);

try {
  const config: CrudConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  generateCrudFiles(config.name, config.fields).catch((error: Error) =>
    console.error(error)
  );
} catch (error: unknown) {
  if (error && typeof error === "object" && "code" in error) {
    if ((error as FileSystemError).code === "ENOENT") {
      console.error(`Config file not found: ${configPath}`);
      console.error("Available configs:");
      const files: string[] = fs.readdirSync(
        path.join(__dirname, "crud-config")
      );
      files
        .filter((file: string) => file.endsWith(".json"))
        .forEach((file: string) =>
          console.log("- " + file.replace(".json", ""))
        );
    }
  } else {
    console.error(
      "Error reading config:",
      error instanceof Error ? error.message : error
    );
  }
  process.exit(1);
}
