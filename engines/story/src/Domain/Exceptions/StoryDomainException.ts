export class StoryDomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "StoryDomainException";
    }
}
