export class TokenBudgetDto {
    constructor(
        public readonly totalBudget: number,
        public readonly systemAllocation: number,
        public readonly responseBuffer: number,
        public readonly contextWindow: number
    ) {}

    public static default(): TokenBudgetDto {
        return new TokenBudgetDto(4096, 1024, 2048, 1024);
    }
}
