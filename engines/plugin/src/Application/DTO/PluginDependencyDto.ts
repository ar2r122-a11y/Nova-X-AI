export interface PluginDependencyDto {
    name: string;
    version: string;
    resolved: boolean;
    conflicts: string[];
}
