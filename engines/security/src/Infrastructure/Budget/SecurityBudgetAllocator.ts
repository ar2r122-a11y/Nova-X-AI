import type { ISecurityEngine } from "../../Contracts";
import { SecurityBudgetDto } from "../../Application/DTO";

export class SecurityBudgetAllocator {
    private budget: SecurityBudgetDto;
    private cryptoOpsCount = 0;
    private lastResetTime = Date.now();
    private tokenCacheSize = 0;

    constructor(budget: SecurityBudgetDto) {
        this.budget = budget;
    }

    updateBudget(budget: SecurityBudgetDto): void {
        this.budget = budget;
    }

    checkCryptoBudget(): { allowed: boolean; reason?: string } {
        const now = Date.now();
        if (now - this.lastResetTime >= 1000) {
            this.cryptoOpsCount = 0;
            this.lastResetTime = now;
        }

        this.cryptoOpsCount++;
        if (this.cryptoOpsCount > this.budget.maxCryptoOpsPerSec) {
            return { allowed: false, reason: "crypto_budget_exceeded" };
        }

        return { allowed: true };
    }

    checkTokenCache(sizeBytes: number): { allowed: boolean; reason?: string } {
        this.tokenCacheSize += sizeBytes;
        if (this.tokenCacheSize > this.budget.tokenCacheLimitBytes) {
            return { allowed: false, reason: "token_cache_limit_exceeded" };
        }
        return { allowed: true };
    }

    resetTokenCache(): void {
        this.tokenCacheSize = 0;
    }

    getBudget(): SecurityBudgetDto {
        return this.budget;
    }
}
