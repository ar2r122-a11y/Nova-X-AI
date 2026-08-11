export class StoryAuthorizationPolicy {
    static canStartStory(userId: string, claims: { roles: string[] }): boolean {
        return claims.roles.includes("story:write") || claims.roles.includes("admin");
    }

    static canAdvanceScene(userId: string, claims: { roles: string[] }): boolean {
        return claims.roles.includes("story:write") || claims.roles.includes("admin");
    }

    static canSelectChoice(userId: string, claims: { roles: string[] }): boolean {
        return claims.roles.includes("story:write") || claims.roles.includes("admin");
    }

    static canCompleteStory(userId: string, claims: { roles: string[] }): boolean {
        return claims.roles.includes("story:write") || claims.roles.includes("admin");
    }

    static canFailStory(userId: string, claims: { roles: string[] }): boolean {
        return claims.roles.includes("story:write") || claims.roles.includes("admin");
    }

    static canUpdateQuest(userId: string, claims: { roles: string[] }): boolean {
        return claims.roles.includes("story:write") || claims.roles.includes("admin");
    }
}
