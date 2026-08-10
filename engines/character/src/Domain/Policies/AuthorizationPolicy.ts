
export class AuthorizationPolicy {
    public canUpdateTraits(
        requesterId: string,
        characterOwnerId: string,
        userRoles: string[]
    ): boolean {
        const isAdmin = userRoles.includes("admin");
        const isOwner = requesterId === characterOwnerId;

        return isAdmin || isOwner;
    }

    public canUpdateProfile(
        requesterId: string,
        characterOwnerId: string,
        userRoles: string[]
    ): boolean {
        return this.canUpdateTraits(requesterId, characterOwnerId, userRoles);
    }

    public canEvolveCharacter(
        requesterId: string,
        characterOwnerId: string,
        userRoles: string[]
    ): boolean {
        const isAdmin = userRoles.includes("admin");
        const isOwner = requesterId === characterOwnerId;

        return isAdmin || isOwner;
    }
}
