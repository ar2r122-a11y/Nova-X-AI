import { ConversationException } from "./ConversationException";

export class ToolExecutionTimeoutException extends ConversationException {
    constructor(toolName: string, timeoutMs: number) {
        super(`Tool execution timed out for ${toolName} after ${timeoutMs}ms.`);
        this.name = "ToolExecutionTimeoutException";
    }
}
