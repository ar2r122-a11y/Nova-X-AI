export interface PluginManifestDto {
    pluginId: string;
    name: string;
    version: string;
    description: string;
    author: string;
    capabilities: string[];
    dependencies: { name: string; version: string }[];
    entryPoint: string;
    signature?: string;
}
