export class PlotStateDto {
    storyId: string;
    currentPlotPointId: string | null;
    plotPoints: string[];
    flags: Record<string, unknown>;

    constructor(
        storyId: string,
        currentPlotPointId: string | null,
        plotPoints: string[],
        flags: Record<string, unknown>
    ) {
        this.storyId = storyId;
        this.currentPlotPointId = currentPlotPointId;
        this.plotPoints = plotPoints;
        this.flags = flags;
    }
}
