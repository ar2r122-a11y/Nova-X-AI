export interface ResourceBudgetState {
    readonly vramUsed: number;
    readonly memoryUsed: number;
    readonly gpuJobTimeout: number;
    readonly renderingTimeout: number;
    readonly queuePosition: number;
    readonly priority: number;
}
