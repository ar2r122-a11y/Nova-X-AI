export interface IImageStreamingWorker {
    startStream(imageId: string, request: { prompt: string; width: number; height: number }): Promise<void>;
    stopStream(imageId: string): Promise<void>;
    isStreaming(imageId: string): boolean;
    getStreamStatus(imageId: string): { status: string; progress: number; chunksReceived: number };
}
