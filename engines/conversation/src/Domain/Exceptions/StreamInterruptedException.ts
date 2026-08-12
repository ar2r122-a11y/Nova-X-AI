import { ConversationException } from "./ConversationException";

export class StreamInterruptedException extends ConversationException {
    constructor(reason: string) {
        super(`Stream was interrupted: ${reason}.`);
        this.name = "StreamInterruptedException";
    }
}
