import { ICoreModule } from "@nova-x-ai/core";
import { IConversationEngine } from "../Contracts/IConversationEngine";

export class ConversationEngineModule implements ICoreModule {
    readonly moduleName = "ConversationEngine";

    constructor(private readonly engine: IConversationEngine) {}

    configureServices(): void {
        // Services are configured via constructor injection in ConversationEngine
    }

    async onInit(): Promise<void> {
        if (!this.engine) {
            throw new Error("ConversationEngine is not initialized.");
        }
    }

    async onDestroy(): Promise<void> {
        if (this.engine) {
            await this.engine.shutdown();
        }
    }

    public getEngine(): IConversationEngine {
        return this.engine;
    }
}
