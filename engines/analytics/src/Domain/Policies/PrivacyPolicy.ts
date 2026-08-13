export class PrivacyPolicy {
    static canRecordMetric(optedOut: boolean): boolean {
        return !optedOut;
    }

    static canAccessMetrics(requesterId: string, ownerId: string): boolean {
        return requesterId === ownerId;
    }

    static canPurgeMetrics(requesterId: string, ownerId: string): boolean {
        return requesterId === ownerId;
    }
}
