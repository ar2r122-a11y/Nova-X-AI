export interface StoryFeatureFlags {
    readonly ENABLE_REALTIME_COOP: boolean;
    readonly ENABLE_ADVANCED_AI_PROMPTING: boolean;
}

export const DEFAULT_STORY_FEATURE_FLAGS: StoryFeatureFlags = {
    ENABLE_REALTIME_COOP: false,
    ENABLE_ADVANCED_AI_PROMPTING: false,
};

export interface StoryConfiguration {
    readonly featureFlags: StoryFeatureFlags;
    readonly version: string;
}

export const DEFAULT_STORY_CONFIGURATION: StoryConfiguration = {
    featureFlags: DEFAULT_STORY_FEATURE_FLAGS,
    version: "2.0.0",
};
