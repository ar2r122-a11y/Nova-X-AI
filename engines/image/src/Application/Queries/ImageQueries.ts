
export class GetImageQuery {
    constructor(public readonly imageId: string, public readonly requesterId?: string) {}
}

export class ListImagesQuery {
    constructor(
        public readonly sessionId?: string,
        public readonly ownerId?: string,
        public readonly status?: string,
        public readonly mode?: string,
        public readonly limit: number = 50,
        public readonly offset: number = 0
    ) {}
}

export class GetCandidateQuery {
    constructor(public readonly candidateId: string, public readonly requesterId?: string) {}
}

export class GetRenderJobQuery {
    constructor(public readonly jobId: string, public readonly requesterId?: string) {}
}

export class ListRenderJobsQuery {
    constructor(
        public readonly imageId?: string,
        public readonly status?: string,
        public readonly providerId?: string,
        public readonly limit: number = 50,
        public readonly offset: number = 0
    ) {}
}
