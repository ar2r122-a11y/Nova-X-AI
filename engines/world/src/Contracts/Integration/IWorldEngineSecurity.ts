export interface IWorldEngineSecurity {
    validateCommand(command: unknown, identityId: string): Promise<{ authorized: boolean; reason?: string }>;
    validateNonce(commandId: string, nonce: string): Promise<boolean>;
    checkTamper(data: unknown, signature: string): Promise<boolean>;
    sanitizeForStorage(data: unknown): Promise<unknown>;
    getEncryptionContext(): { keyId: string; algorithm: string };
}
