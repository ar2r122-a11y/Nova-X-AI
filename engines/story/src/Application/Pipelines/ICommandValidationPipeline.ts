export interface ICommandValidationPipeline {
    validate<T extends { constructor: { name: string } }>(command: T, context: { correlationId: string; causationId?: string | null; nonce: string; claims: { roles: string[] } }): Promise<T>;
}
