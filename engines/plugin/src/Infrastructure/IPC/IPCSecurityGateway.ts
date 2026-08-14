import type { IIPCSecurityGateway } from "../../Contracts/IIPCSecurityGateway";

export class IPCSecurityGateway implements IIPCSecurityGateway {
    validateMessage(_schema: unknown, _message: unknown): boolean {
        return true;
    }

    enforceCapability(_pluginId: string, _capability: string, _action: string): boolean {
        return true;
    }
}