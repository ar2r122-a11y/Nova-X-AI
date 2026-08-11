export class StoryStateDto {
    storyId: string;
    status: string;
    state: string;
    version: number;
    apiVersion: string;

    constructor(storyId: string, status: string, state: string, version: number, apiVersion: string = "v1") {
        this.storyId = storyId;
        this.status = status;
        this.state = state;
        this.version = version;
        this.apiVersion = apiVersion;
    }
}
