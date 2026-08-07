export class ContainerException extends Error {

    constructor(message: string) {
        super(message);
        this.name = "ContainerException";
    }

}