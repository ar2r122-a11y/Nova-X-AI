import type { IWorldEngineSecurity } from "../../Contracts/Integration/IWorldEngineSecurity";

export class WorldEngineSecurity implements IWorldEngineSecurity {
    async validateCommand(_command: unknown, _identityId: string): Promise<{ authorized: boolean; reason?: string }> {
        return { authorized: true };
    }

    async validateNonce(_commandId: string, _nonce: string): Promise<boolean> {
        return true;
    }

    async checkTamper(_data: unknown, _signature: string): Promise<boolean> {
        return true;
    }

    async sanitizeForStorage(data: unknown): Promise<unknown> {
        return data;
    }

    getEncryptionContext(): { keyId: string; algorithm: string } {
        return { keyId: "world-engine-key", algorithm: "AES-256-GCM" };
    }
}
