export class ToolExecutionPolicy {
    private readonly defaultTimeoutMs: number;
    private readonly allowedToolsByRole: Map<string, string[]> = new Map();
    private readonly sandboxConstraints: Map<string, string[]> = new Map();

    public constructor(defaultTimeoutMs: number = 15_000) {
        this.defaultTimeoutMs = defaultTimeoutMs;
    }

    public getAllowedTools(role: string): string[] {
        return this.allowedToolsByRole.get(role) || [];
    }

    public isToolAllowed(role: string, toolName: string): boolean {
        const allowed = this.getAllowedTools(role);
        return allowed.includes(toolName);
    }

    public getDefaultTimeoutMs(): number {
        return this.defaultTimeoutMs;
    }

    public getSandboxConstraints(toolName: string): string[] {
        return this.sandboxConstraints.get(toolName) || [];
    }

    public registerToolPermission(role: string, toolName: string): void {
        const existing = this.allowedToolsByRole.get(role) || [];
        if (!existing.includes(toolName)) {
            existing.push(toolName);
            this.allowedToolsByRole.set(role, existing);
        }
    }

    public registerSandboxConstraint(toolName: string, constraint: string): void {
        const existing = this.sandboxConstraints.get(toolName) || [];
        if (!existing.includes(constraint)) {
            existing.push(constraint);
            this.sandboxConstraints.set(toolName, existing);
        }
    }
}
