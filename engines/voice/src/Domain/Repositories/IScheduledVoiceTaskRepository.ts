import { ScheduledVoiceTaskEntity } from "../../Domain/Entities/ScheduledVoiceTaskEntity";

export interface IScheduledVoiceTaskRepository {
    findById(taskId: string): Promise<ScheduledVoiceTaskEntity | null>;
    findByVoiceId(voiceId: string): Promise<ScheduledVoiceTaskEntity[]>;
    findAll(): Promise<ScheduledVoiceTaskEntity[]>;
    save(task: ScheduledVoiceTaskEntity): Promise<void>;
    delete(taskId: string): Promise<void>;
}
