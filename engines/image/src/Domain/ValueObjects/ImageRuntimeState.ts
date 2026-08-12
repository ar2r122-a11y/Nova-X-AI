
export enum ImageRuntimeState {
    Initializing = "Initializing",
    WaitingForPrompt = "WaitingForPrompt",
    PromptOrchestration = "PromptOrchestration",
    QueuingGPUJob = "QueuingGPUJob",
    Rendering = "Rendering",
    PostProcessing = "PostProcessing",
    GeneratingThumbnails = "GeneratingThumbnails",
    SavingAsset = "SavingAsset",
    StreamingImage = "StreamingImage",
    Idle = "Idle",
    Paused = "Paused",
    Completed = "Completed",
    Failed = "Failed",
    Recovering = "Recovering",
    Cancelled = "Cancelled"
}

export const ImageRuntimeStateTransitions: Record<string, string[]> = {
    [ImageRuntimeState.Initializing]: [ImageRuntimeState.Initializing, ImageRuntimeState.WaitingForPrompt, ImageRuntimeState.Rendering, ImageRuntimeState.Failed],
    [ImageRuntimeState.WaitingForPrompt]: [ImageRuntimeState.Initializing, ImageRuntimeState.WaitingForPrompt, ImageRuntimeState.PromptOrchestration, ImageRuntimeState.Rendering, ImageRuntimeState.Completed, ImageRuntimeState.Failed, ImageRuntimeState.Paused],
    [ImageRuntimeState.PromptOrchestration]: [ImageRuntimeState.Initializing, ImageRuntimeState.QueuingGPUJob, ImageRuntimeState.Failed, ImageRuntimeState.Paused],
    [ImageRuntimeState.QueuingGPUJob]: [ImageRuntimeState.Initializing, ImageRuntimeState.Rendering, ImageRuntimeState.Failed, ImageRuntimeState.Paused],
    [ImageRuntimeState.Rendering]: [ImageRuntimeState.Initializing, ImageRuntimeState.PostProcessing, ImageRuntimeState.Completed, ImageRuntimeState.Failed, ImageRuntimeState.Paused],
    [ImageRuntimeState.PostProcessing]: [ImageRuntimeState.Initializing, ImageRuntimeState.GeneratingThumbnails, ImageRuntimeState.Completed, ImageRuntimeState.Failed],
    [ImageRuntimeState.GeneratingThumbnails]: [ImageRuntimeState.Initializing, ImageRuntimeState.SavingAsset, ImageRuntimeState.Failed],
    [ImageRuntimeState.SavingAsset]: [ImageRuntimeState.Initializing, ImageRuntimeState.StreamingImage, ImageRuntimeState.Completed, ImageRuntimeState.Failed],
    [ImageRuntimeState.StreamingImage]: [ImageRuntimeState.Initializing, ImageRuntimeState.Completed, ImageRuntimeState.Failed],
    [ImageRuntimeState.Idle]: [ImageRuntimeState.Initializing, ImageRuntimeState.Failed],
    [ImageRuntimeState.Paused]: [ImageRuntimeState.Initializing, ImageRuntimeState.Rendering, ImageRuntimeState.Failed, ImageRuntimeState.WaitingForPrompt],
    [ImageRuntimeState.Completed]: [ImageRuntimeState.Idle],
    [ImageRuntimeState.Failed]: [ImageRuntimeState.Initializing, ImageRuntimeState.Idle, ImageRuntimeState.Recovering],
    [ImageRuntimeState.Recovering]: [ImageRuntimeState.Initializing, ImageRuntimeState.Rendering, ImageRuntimeState.Failed],
    [ImageRuntimeState.Cancelled]: [ImageRuntimeState.Initializing]
};
