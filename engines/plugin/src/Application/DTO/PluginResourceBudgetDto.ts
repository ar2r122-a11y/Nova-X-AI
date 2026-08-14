export interface PluginResourceBudgetDto {
    pluginId: string;
    maxMemoryBytes: number;
    maxCpuMs: number;
    maxStorageBytes: number;
    usedMemoryBytes: number;
    usedCpuMs: number;
    usedStorageBytes: number;
}
