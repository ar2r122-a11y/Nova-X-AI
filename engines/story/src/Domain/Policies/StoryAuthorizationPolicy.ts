export class StoryAuthorizationPolicy {
    static canStartStory(_userId: string, claims: { roles: string[] }): boolean {
        return claims.roles.includes("story:write") || claims.roles.includes("admin");
    }

    static canAdvanceScene(_userId: string, claims: { roles: string[] }): boolean {
        return claims.roles.includes("story:write") || claims.roles.includes("admin");
    }

    static canSelectChoice(_userId: string, claims: { roles: string[] }): boolean {
        return claims.roles.includes("story:write") || claims.roles.includes("admin");
    }

    static canCompleteStory(_userId: string, claims: { roles: string[] }): boolean {
        return claims.roles.includes("story:write") || claims.roles.includes("admin");
    }

    static canFailStory(_userId: string, claims: { roles: string[] }): boolean {
        return claims.roles.includes("story:write") || claims.roles.includes("admin");
    }

    static canUpdateQuest(_userId: string, claims: { roles: string[] }): boolean {
        return claims.roles.includes("story:write") || claims.roles.includes("admin");
    }
}
