import type { IStorageEngine } from "@nova-x-ai/storage";
import { VoiceRepositoryImpl } from "./VoiceRepositoryImpl";
import { VoiceSessionRepositoryImpl } from "./VoiceSessionRepositoryImpl";
import { VoiceProfileRepositoryImpl } from "./VoiceProfileRepositoryImpl";
import { VoiceEventStoreRepositoryImpl } from "./VoiceEventStoreRepositoryImpl";
import { ScheduledVoiceTaskRepositoryImpl } from "./ScheduledVoiceTaskRepositoryImpl";

export class VoiceRepositoryFactory {
    static createRepositories(storageEngine: IStorageEngine) {
        return {
            voiceRepository: new VoiceRepositoryImpl(storageEngine),
            sessionRepository: new VoiceSessionRepositoryImpl(storageEngine),
            profileRepository: new VoiceProfileRepositoryImpl(storageEngine),
            eventStoreRepository: new VoiceEventStoreRepositoryImpl(storageEngine),
            scheduledTaskRepository: new ScheduledVoiceTaskRepositoryImpl(storageEngine)
        };
    }
}
