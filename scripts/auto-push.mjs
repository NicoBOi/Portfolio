#!/usr/bin/env node
import { execSync } from "node:child_process";

// Skip in CI environments. Vercel / GitHub Actions / etc. pull from origin
// and build — pushing back from inside the build would loop or fail (the
// CI checkout doesn't have push credentials anyway). Local builds still run
// normally.
if (process.env.CI || process.env.VERCEL || process.env.GITHUB_ACTIONS) {
  console.log("[auto-push] CI build detected, skipping push.");
  process.exit(0);
}

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
