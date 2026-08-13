import { RetentionPeriod } from "../ValueObjects/RetentionPeriod";

export class RetentionService {
    static getDefaultRetention(): RetentionPeriod {
        return RetentionPeriod.create(30, 365);
    }

    static getExpiryThreshold(retention: RetentionPeriod, _type: "raw" | "summary"): number {
        return Date.now() - retention.getRawRetentionMs();
    }
}
