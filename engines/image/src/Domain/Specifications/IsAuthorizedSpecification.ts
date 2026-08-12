
export class IsAuthorizedSpecification {
    private readonly allowedRoles: string[];

    constructor(allowedRoles: string[]) {
        this.allowedRoles = allowedRoles;
    }

    public isSatisfiedBy(roles: string[]): boolean {
        return roles.some((role) => this.allowedRoles.includes(role));
    }
}
