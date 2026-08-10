
export class RoutineSchedule {
    public readonly timeBlock: string;
    public readonly activity: string;
    public readonly worldCoordinate?: string;

    private constructor(timeBlock: string, activity: string, worldCoordinate?: string) {
        this.timeBlock = timeBlock;
        this.activity = activity;
        this.worldCoordinate = worldCoordinate;
    }

    public static create(timeBlock: string, activity: string, worldCoordinate?: string): RoutineSchedule {
        if (!timeBlock || timeBlock.trim().length === 0) {
            throw new Error("TimeBlock cannot be empty.");
        }
        if (!activity || activity.trim().length === 0) {
            throw new Error("Activity cannot be empty.");
        }
        return new RoutineSchedule(timeBlock, activity, worldCoordinate);
    }

    public static fromObject(data: { timeBlock: string; activity: string; worldCoordinate?: string }): RoutineSchedule {
        return RoutineSchedule.create(data.timeBlock, data.activity, data.worldCoordinate);
    }

    public getValue(): { timeBlock: string; activity: string; worldCoordinate?: string } {
        return { timeBlock: this.timeBlock, activity: this.activity, worldCoordinate: this.worldCoordinate };
    }

    public equals(other: RoutineSchedule): boolean {
        return this.timeBlock === other.timeBlock && this.activity === other.activity && this.worldCoordinate === other.worldCoordinate;
    }
}
