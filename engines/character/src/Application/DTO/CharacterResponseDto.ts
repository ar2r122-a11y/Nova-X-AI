import { CharacterSummaryDto } from "./CharacterSummaryDto";

export class CharacterResponseDto {
    constructor(
        public readonly success: boolean,
        public readonly data: CharacterSummaryDto | null,
        public readonly error: string | null,
        public readonly correlationId: string
    ) {}
}
