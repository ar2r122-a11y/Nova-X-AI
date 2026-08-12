export interface ISessionRepository {
    save(session: {
        sessionId: string;
        conversationId: string;
        state: string;
        createdAt: number;
        lastActivityAt: number;
        metadata: Record<string, unknown>;
    }): Promise<void>;
    getById(sessionId: string): Promise<{ sessionId: string; conversationId: string; state: string; createdAt: number; lastActivityAt: number; metadata: Record<string, unknown> } | null>;
    getByConversationId(conversationId: string): Promise<{ sessionId: string; conversationId: string; state: string; createdAt: number; lastActivityAt: number; metadata: Record<string, unknown> }[]>;
    delete(sessionId: string): Promise<void>;
    exists(sessionId: string): Promise<boolean>;
}
