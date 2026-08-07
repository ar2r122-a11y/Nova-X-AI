import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function ensureDirectory(relativePath) {

    const fullPath = path.join(ROOT, relativePath);

    if (!fs.existsSync(fullPath)) {

        fs.mkdirSync(fullPath, {
            recursive: true
        });

        console.log("📁", relativePath);

    }

}

function ensureFile(relativePath, content = "") {

    const fullPath = path.join(ROOT, relativePath);

    if (!fs.existsSync(fullPath)) {

        fs.writeFileSync(fullPath, content, "utf8");

        console.log("📄", relativePath);

    }

}

const ROOT_FOLDERS = [
    ".github/workflows",
    "deployment",
    "docs",
    "engines",
    "examples",
    "infrastructure",
    "packages",
    "sdk",
    "tests",
    "tools"
];

const PACKAGES = [
    "shared-kernel",
    "event-bus",
    "dtoList",
    "errors"
];

const SDKS = [
    "core-sdk",
    "auth-sdk",
    "storage-sdk",
    "streaming-sdk",
    "ai-sdk",
    "character-sdk",
    "memory-sdk",
    "conversation-sdk",
    "voice-sdk",
    "image-sdk",
    "plugin-sdk",
    "analytics-sdk",
    "diagnostics-sdk"
];

const INFRASTRUCTURE = [
    "transport",
    "storage",
    "security",
    "telemetry",
    "config",
    "cloud"
];

const TOOLS = [
    "eslint-plugin-nova",
    "codegen",
    "arch-validator"
];

const EXAMPLES = [
    "electron-app",
    "pwa-client",
    "node-microservice"
];

const TESTS = [
    "unit",
    "integration",
    "contract",
    "e2e",
    "performance"
];

const ENGINES = [
    "core",
    "ai-router",
    "character",
    "memory",
    "emotion",
    "relationship",
    "conversation",
    "story",
    "world",
    "voice",
    "image",
    "analytics",
    "security",
    "storage",
    "plugin",
    "diagnostics",
    "deployment-operations"
];

const ENGINE_STRUCTURE = [
    "src/Domain/Aggregates",
    "src/Domain/Entities",
    "src/Domain/ValueObjects",
    "src/Domain/Events",
    "src/Domain/Repositories",
    "src/Domain/Policies",

    "src/Application/Commands",
    "src/Application/Queries",
    "src/Application/Handlers",
    "src/Application/Services",
    "src/Application/Projections",

    "src/Infrastructure/Persistence",
    "src/Infrastructure/Workers",
    "src/Infrastructure/Schedulers",

    "src/Presentation/Controllers",

    "src/Contracts/DTOs",
    "src/Contracts/CommandContracts",
    "src/Contracts/QueryContracts",

    "tests/unit",
    "tests/integration",
    "tests/fsm"
];

const ENGINE_FILES = [
    "package.json",
    "tsconfig.json",
    "README.md"
];

console.log();
console.log("========================================");
console.log("      Nova X AI Project Generator");
console.log("========================================");
console.log();
