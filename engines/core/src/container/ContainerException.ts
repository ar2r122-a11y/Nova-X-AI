/**
 * Nova X AI
 * Nova Core
 * Dependency Injection Container Exception
 */

export class ContainerException extends Error {

    constructor(message: string) {

        super(message);

        this.name = "ContainerException";

        Object.setPrototypeOf(
            this,
            ContainerException.prototype
        );

    }

}