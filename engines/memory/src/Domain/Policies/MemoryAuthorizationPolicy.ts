export class MemoryAuthorizationPolicy {
    static canStore(_requesterId: string, ownerId: string, roles: string[]): boolean {
        if (!roles || roles.length === 0) {
            return false;
        }
        if (_requesterId === ownerId) {
            return true;
        }
        return roles.includes("admin") || roles.includes("memory-write");
    }

    static canPrune(_requesterId: string, roles: string[]): boolean {
        if (!roles || roles.length === 0) {
            return false;
        }
        return roles.includes("admin") || roles.includes("scheduler") || roles.includes("memory-write");
    }

    static canRecall(requesterId: string, ownerId: string, roles: string[]): boolean {
        if (requesterId === ownerId) {
            return true;
        }
        if (!roles || roles.length === 0) {
            return false;
        }
        return roles.includes("admin") || roles.includes("memory-read");
    }

    static canConsolidate(_requesterId: string, roles: string[]): boolean {
        if (!roles || roles.length === 0) {
            return false;
        }
        return roles.includes("admin") || roles.includes("scheduler");
    }
}
