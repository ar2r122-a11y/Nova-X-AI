
import { ImageEngineException } from "./ImageEngineException";

export class CandidateNotFoundException extends ImageEngineException {
    constructor(candidateId: string) {
        super(`Candidate not found: ${candidateId}`);
        this.name = "CandidateNotFoundException";
    }
}
