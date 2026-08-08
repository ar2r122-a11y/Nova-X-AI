const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const ROOT = process.cwd();
const SDS_FILE = path.join(ROOT, "SDS_MASTER_REVIEW.md");
const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";

const IGNORED = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".turbo",
]);

const MAX_FILE_SIZE = 120_000;
const MAX_CONTEXT_SIZE = 1_500_000;

function walk(dir, result = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED.has(entry.name)) continue;

    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full, result);
    } else {
      result.push(full);
    }
  }

  return result;
}

function readSafe(file) {
  try {
    const stat = fs.statSync(file);

    if (stat.size > MAX_FILE_SIZE) return null;

    return fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }
}

function getProjectContext() {
  const files = walk(ROOT);
  let context = "";

  for (const file of files) {
    const relative = path.relative(ROOT, file);

    if (relative === "SDS_MASTER_REVIEW.md") continue;

    const content = readSafe(file);

    if (content === null) continue;

    const block = `\n\n===== FILE: ${relative} =====\n${content}`;

    if (context.length + block.length > MAX_CONTEXT_SIZE) break;

    context += block;
  }

  return context;
}

function getSDS() {
  if (!fs.existsSync(SDS_FILE)) {
    throw new Error("SDS_MASTER_REVIEW.md not found.");
  }

  return fs.readFileSync(SDS_FILE, "utf8");
}

async function askLocalAI(task) {
  const sds = getSDS();
  const project = getProjectContext();

  const system = `
You are Nova Coder, a local coding agent dedicated ONLY to the Nova X AI project.

AUTHORITATIVE RULES:

1. The Nova X AI SDS documents are the source of truth.
2. SDS_MASTER_REVIEW.md consolidates the 18 SDS documents.
3. Never invent architecture when the SDS does not specify it.
4. Preserve existing correct code.
5. Do not rewrite unrelated files.
6. Respect the existing Nova X AI project structure.
7. Nova Core is foundational and must respect its documented boundaries.
8. Cross-engine communication must respect the documented contracts and boundaries.
9. If the SDS contains an unresolved contradiction, do not silently resolve it.
10. Only modify files required for the requested task.

Return ONLY valid JSON in this exact shape:

{
  "summary": "short explanation",
  "files": [
    {
      "path": "relative/path/to/file.ts",
      "content": "complete file content"
    }
  ],
  "commands": [
    "npm test"
  ]
}

If no file needs modification, return an empty files array.
Do not use markdown fences.
`;

  const user = `
TASK:
${task}

SDS MASTER REVIEW:
${sds}

CURRENT PROJECT:
${project}
`;

  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.NOVA_MODEL || "qwen2.5-coder:7b",
      stream: false,
      messages: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: user,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Local AI error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  return data.message?.content || "";
}

function extractJSON(text) {
  text = text.trim();

  if (text.startsWith("```")) {
    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "");
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Local AI did not return valid JSON.");
  }

  return JSON.parse(text.slice(start, end + 1));
}

function validatePath(relativePath) {
  if (!relativePath || path.isAbsolute(relativePath)) {
    throw new Error(`Invalid file path: ${relativePath}`);
  }

  const normalized = path.normalize(relativePath);

  if (normalized.startsWith("..")) {
    throw new Error(`Blocked path outside project: ${relativePath}`);
  }

  if (
    normalized.startsWith("node_modules") ||
    normalized.startsWith(".git")
  ) {
    throw new Error(`Blocked protected path: ${relativePath}`);
  }

  return normalized;
}

function applyFiles(files) {
  for (const file of files) {
    const relative = validatePath(file.path);
    const full = path.join(ROOT, relative);

    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, file.content, "utf8");

    console.log(`✍️  ${relative}`);
  }
}

async function run(task, apply = false) {
  console.log("");
  console.log("========================================");
  console.log("        🚀 Nova Coder");
  console.log("========================================");
  console.log("");

  console.log("📖 Reading SDS...");
  getSDS();

  console.log("🔎 Scanning project...");
  const files = walk(ROOT);

  console.log(`📁 Found ${files.length} files`);
  console.log("");

  console.log("🤖 Asking Local AI...");
  const raw = await askLocalAI(task);

  const result = extractJSON(raw);

  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("SUMMARY");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(result.summary || "No summary");

  console.log("");
  console.log("FILES:");

  if (!result.files?.length) {
    console.log("No files requested.");
  } else {
    for (const file of result.files) {
      console.log(`  • ${file.path}`);
    }
  }

  if (result.commands?.length) {
    console.log("");
    console.log("COMMANDS:");
    for (const command of result.commands) {
      console.log(`  > ${command}`);
    }
  }

  if (!apply) {
    console.log("");
    console.log("⚠️  Preview only.");
    console.log("No files were modified.");
    console.log("");
    console.log("To apply the changes:");
    console.log(`node tools/codegen/index.js "${task}" --apply`);
    return;
  }

  console.log("");
  console.log("✍️ Applying changes...");
  applyFiles(result.files || []);

  console.log("");
  console.log("✅ Nova Coder finished.");
  console.log("");
}

function askTask() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Nova Coder > ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  try {
    let task = process.argv.slice(2).join(" ");
    const apply = process.argv.includes("--apply");

    task = task.replace("--apply", "").trim();

    if (!task) {
      task = await askTask();
    }

    if (!task) {
      console.log("No task provided.");
      process.exit(1);
    }

    await run(task, apply);
  } catch (error) {
    console.error("");
    console.error("❌ Nova Coder Error:");
    console.error(error.message);
    console.error("");
    process.exit(1);
  }
}

main();