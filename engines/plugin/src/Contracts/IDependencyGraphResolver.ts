import type { PluginDependencyDto } from "../Application/DTO";

export interface IDependencyGraphResolver {
    resolve(manifest: any): PluginDependencyDto[];
    checkConflicts(manifest: any): string[];
    detectCircular(manifest: any): string[];
}
