export interface PluginStatusDto {
    pluginId: string;
    status: string;
    failureCount: number;
    lastActiveAt: number;
}
