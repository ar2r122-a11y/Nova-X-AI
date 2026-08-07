const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

function mkdir(relativePath) {
    const full = path.join(ROOT, relativePath);

    if (!fs.existsSync(full)) {
        fs.mkdirSync(full, { recursive: true });
        console.log("📁", relativePath);
    }
}

function touch(relativePath) {
    const full = path.join(ROOT, relativePath);

    mkdir(path.dirname(relativePath));

    if (!fs.existsSync(full)) {
        fs.writeFileSync(full, "");
        console.log("📄", relativePath);
    }
}

console.log("");
console.log("==========================================");
console.log("Nova X AI Enterprise Project Generator");
console.log("==========================================");
console.log("");

const ROOT_FOLDERS = [
    ".github/workflows",

    "deployment/docker",
    "deployment/compose",
    "deployment/kubernetes/deployments",
    "deployment/kubernetes/services",
    "deployment/helm/nova-x-chart",
    "deployment/terraform",

    "docs/architecture",
    "docs/api",
    "docs/runbooks",
    "docs/migration",
    "docs/adr",

    "engines",

    "infrastructure/transport",
    "infrastructure/storage",
    "infrastructure/security",
    "infrastructure/telemetry",
    "infrastructure/config",
    "infrastructure/cloud",
    "infrastructure/providers",

    "packages/shared-kernel",
    "packages/event-bus",
    "packages/dtoList",
    "packages/errors",

    "sdk/core-sdk",
    "sdk/auth-sdk",
    "sdk/storage-sdk",
    "sdk/streaming-sdk",
    "sdk/ai-sdk",
    "sdk/character-sdk",
    "sdk/memory-sdk",
    "sdk/conversation-sdk",
    "sdk/voice-sdk",
    "sdk/image-sdk",
    "sdk/plugin-sdk",
    "sdk/analytics-sdk",
    "sdk/diagnostics-sdk",

    "tests/unit",
    "tests/integration",
    "tests/contract",
    "tests/e2e",
    "tests/performance",

    "tools/eslint-plugin-nova",
    "tools/codegen",
    "tools/arch-validator",

    "examples/electron-app",
    "examples/pwa-client",
    "examples/node-microservice"
];

ROOT_FOLDERS.forEach(mkdir);

const ROOT_FILES = [

    ".github/workflows/ci.yml",
    ".github/workflows/cd-docker.yml",
    ".github/workflows/cd-k8s.yml",
    ".github/workflows/security-scan.yml",

    "deployment/docker/Dockerfile.core",
    "deployment/docker/Dockerfile.edge",

    "deployment/compose/docker-compose.yml",

    "deployment/kubernetes/namespace.yaml",
    "deployment/kubernetes/ingress.yaml",

    "deployment/terraform/main.tf",

    "pnpm-workspace.yaml",
    "turbo.json",
    "tsconfig.base.json",
    "package.json"
];

ROOT_FILES.forEach(touch);

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
function createEngine(engine) {

    const base = `engines/${engine}`;

    [
        "src",
        "src/Domain",
        "src/Domain/Entities",
        "src/Domain/ValueObjects",
        "src/Domain/Events",
        "src/Domain/Repositories",
        "src/Domain/Services",

        "src/Application",
        "src/Application/Commands",
        "src/Application/Queries",
        "src/Application/Handlers",
        "src/Application/DTO",
        "src/Application/Validators",

        "src/Infrastructure",
        "src/Infrastructure/Persistence",
        "src/Infrastructure/Adapters",
        "src/Infrastructure/Providers",
        "src/Infrastructure/Configuration",

        "src/Presentation",
        "src/Presentation/API",
        "src/Presentation/Events",

        "src/Contracts",

        "tests",
        "tests/unit",
        "tests/integration"
    ].forEach(folder => mkdir(`${base}/${folder}`));

    [
        "README.md",

        "package.json",
        "tsconfig.json",

        "src/index.ts",

        "src/Domain/index.ts",
        "src/Application/index.ts",
        "src/Infrastructure/index.ts",
        "src/Presentation/index.ts",
        "src/Contracts/index.ts",

        "tests/.gitkeep",
        "tests/unit/.gitkeep",
        "tests/integration/.gitkeep"

    ].forEach(file => touch(`${base}/${file}`));

}
console.log("");
console.log("Generating Engines...");
console.log("");

ENGINES.forEach(createEngine);

console.log("");
console.log("✓ Engines Generated");
console.log("");
function createPackage(name) {

    const base = `packages/${name}`;

    [
        "src",
        "src/contracts",
        "src/events",
        "src/types",
        "src/utils",
        "tests"
    ].forEach(folder => mkdir(`${base}/${folder}`));

    [
        "README.md",
        "package.json",
        "tsconfig.json",

        "src/index.ts",

        "tests/.gitkeep"
    ].forEach(file => touch(`${base}/${file}`));

}

console.log("");
console.log("Generating Packages...");
console.log("");

[
    "shared-kernel",
    "event-bus",
    "dtoList",
    "errors"
].forEach(createPackage);

console.log("✓ Packages Generated");
console.log("");
function createSDK(name) {

    const base = `sdk/${name}`;

    [
        "src",
        "src/client",
        "src/contracts",
        "src/models",
        "examples",
        "tests"
    ].forEach(folder => mkdir(`${base}/${folder}`));

    [
        "README.md",
        "package.json",
        "tsconfig.json",

        "src/index.ts",

        "tests/.gitkeep"
    ].forEach(file => touch(`${base}/${file}`));

}

console.log("");
console.log("Generating SDK...");
console.log("");

[
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
].forEach(createSDK);

console.log("✓ SDK Generated");
console.log("");
function createInfrastructure(name) {

    const base = `infrastructure/${name}`;

    [
        "src",
        "src/adapters",
        "src/providers",
        "src/contracts"
    ].forEach(folder => mkdir(`${base}/${folder}`));

    [
        "README.md",
        "src/index.ts"
    ].forEach(file => touch(`${base}/${file}`));

}

[
    "transport",
    "storage",
    "security",
    "telemetry",
    "config",
    "cloud",
    "providers"
].forEach(createInfrastructure);

console.log("✓ Infrastructure Generated");
console.log("");
function createDocs() {

    [
        "docs/README.md",
        "docs/architecture/README.md",
        "docs/api/README.md",
        "docs/runbooks/README.md",
        "docs/migration/README.md",
        "docs/adr/README.md"
    ].forEach(touch);

}

function createDeployment() {

    [
        "deployment/docker/.gitkeep",
        "deployment/compose/.gitkeep",
        "deployment/kubernetes/deployments/.gitkeep",
        "deployment/kubernetes/services/.gitkeep",
        "deployment/helm/nova-x-chart/Chart.yaml",
        "deployment/terraform/variables.tf",
        "deployment/terraform/outputs.tf"
    ].forEach(touch);

}

function createExamples() {

    [
        "examples/electron-app/README.md",
        "examples/pwa-client/README.md",
        "examples/node-microservice/README.md"
    ].forEach(touch);

}

function createTools() {

    [
        "tools/eslint-plugin-nova/README.md",
        "tools/codegen/README.md",
        "tools/arch-validator/README.md"
    ].forEach(touch);

}

createDocs();
createDeployment();
createExamples();
createTools();

[
    ".editorconfig",
    ".gitignore",
    ".gitattributes",
    ".npmrc",

    "README.md",
    "LICENSE",

    "CHANGELOG.md",

    "CONTRIBUTING.md",

    "CODE_OF_CONDUCT.md",

    "SECURITY.md"

].forEach(touch);

console.log("");
console.log("======================================");
console.log(" Nova X AI Project Generated");
console.log("======================================");
console.log("");
console.log("Top Level      ✔");
console.log("Packages       ✔");
console.log("SDK            ✔");
console.log("Infrastructure ✔");
console.log("Engines        ✔");
console.log("Deployment     ✔");
console.log("Docs           ✔");
console.log("Examples       ✔");
console.log("Tools          ✔");
console.log("");
console.log("🚀 Done.");