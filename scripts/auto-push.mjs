#!/usr/bin/env node
import { execSync } from "node:child_process";

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf8", ...opts }).trim();
}

const branch = run("git rev-parse --abbrev-ref HEAD");
const status = run("git status --porcelain");

if (status.length > 0) {
  const ts = new Date().toISOString().replace("T", " ").replace(/\..+/, "");
  console.log(`[auto-push] Staging and committing changes on ${branch}`);
  execSync("git add -A", { stdio: "inherit" });
  execSync(`git commit -m "build: auto-commit ${ts}"`, { stdio: "inherit" });
} else {
  console.log(`[auto-push] No changes to commit on ${branch}`);
}

console.log(`[auto-push] Pushing ${branch} to origin`);
execSync(`git push -u origin ${branch}`, { stdio: "inherit" });
