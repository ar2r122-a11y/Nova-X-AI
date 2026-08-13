import { OptOutStatus } from "../ValueObjects/OptOutStatus";
import { RetentionPeriod } from "../ValueObjects/RetentionPeriod";

export interface AnalyticsSettingsProps {
    id: string;
    optOutStatus: OptOutStatus;
    retentionPeriod: RetentionPeriod;
    piiStrippingEnabled: boolean;
    promptTextHashingEnabled: boolean;
    ipAnonymizationEnabled: boolean;
    updatedAt: number;
}

export class AnalyticsSettings {
    private readonly props: AnalyticsSettingsProps;

    private constructor(props: AnalyticsSettingsProps) {
        this.props = props;
    }

    static create(): AnalyticsSettings {
        return new AnalyticsSettings({
            id: "global",
            optOutStatus: OptOutStatus.create(false),
            retentionPeriod: RetentionPeriod.create(30, 365),
            piiStrippingEnabled: true,
            promptTextHashingEnabled: true,
            ipAnonymizationEnabled: true,
            updatedAt: Date.now()
        });
    }

    static reconstitute(props: AnalyticsSettingsProps): AnalyticsSettings {
        return new AnalyticsSettings(props);
    }

    getOptOutStatus(): OptOutStatus {
        return this.props.optOutStatus;
    }

    getRetentionPeriod(): RetentionPeriod {
        return this.props.retentionPeriod;
    }

    isPIIStrippingEnabled(): boolean {
        return this.props.piiStrippingEnabled;
    }

    isPromptTextHashingEnabled(): boolean {
        return this.props.promptTextHashingEnabled;
    }

    isIPAnonymizationEnabled(): boolean {
        return this.props.ipAnonymizationEnabled;
    }

    getUpdatedAt(): number {
        return this.props.updatedAt;
    }

    setOptOut(optedOut: boolean): void {
        this.props.optOutStatus = OptOutStatus.create(optedOut);
        this.props.updatedAt = Date.now();
    }

    toSnapshot(): AnalyticsSettingsProps {
        return { ...this.props };
    }
}
