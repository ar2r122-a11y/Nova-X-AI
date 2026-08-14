import type { IDependencyGraphResolver } from "../../Contracts/IDependencyGraphResolver";
import { PluginDependencyDto } from "../../Application/DTO/PluginDependencyDto";

export class DependencyGraphResolver implements IDependencyGraphResolver {
    resolve(manifest: any): PluginDependencyDto[] {
        return (manifest.dependencies || []).map((dep: any) => ({
            name: dep.name,
            version: dep.version,
            resolved: true,
            conflicts: []
        }));
    }

    checkConflicts(manifest: any): string[] {
        const conflicts: string[] = [];
        for (const dep of manifest.dependencies || []) {
            if (dep.conflicts) {
                conflicts.push(...dep.conflicts);
            }
        }
        return conflicts;
    }

    detectCircular(manifest: any): string[] {
        const visited = new Set<string>();
        const stack = new Set<string>();
        const graph = new Map<string, string[]>();

        graph.set(manifest.pluginId, (manifest.dependencies || []).map((d: any) => d.name));

        const visit = (node: string): string[] => {
            if (stack.has(node)) return [node];
            if (visited.has(node)) return [];
            visited.add(node);
            stack.add(node);
            const deps = graph.get(node) || [];
            for (const dep of deps) {
                const cycle = visit(dep);
                if (cycle.length > 0) return [node, ...cycle];
            }
            stack.delete(node);
            return [];
        };

        const cycle = visit(manifest.pluginId);
        return cycle.length > 1 ? cycle : [];
    }
}