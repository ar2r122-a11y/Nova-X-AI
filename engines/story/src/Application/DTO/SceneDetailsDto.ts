import { Scene } from "../../Domain/Entities/Scene";

export class SceneDetailsDto {
    sceneId: string;
    chapterId: string;
    title: string;
    description: string;
    status: string;
    type: string;
    choices: { choiceId: string; text: string; targetSceneId: string; branchId?: string; requiredFlags: Record<string, unknown> }[];
    prerequisites: { sceneId: string; required: boolean }[];
    narrativeFlags: Record<string, unknown>;
    order: number;
    createdAt: number;
    updatedAt: number;

    constructor(
        sceneId: string,
        chapterId: string,
        title: string,
        description: string,
        status: string,
        type: string,
        choices: { choiceId: string; text: string; targetSceneId: string; branchId?: string; requiredFlags: Record<string, unknown> }[],
        prerequisites: { sceneId: string; required: boolean }[],
        narrativeFlags: Record<string, unknown>,
        order: number,
        createdAt: number,
        updatedAt: number
    ) {
        this.sceneId = sceneId;
        this.chapterId = chapterId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.type = type;
        this.choices = choices;
        this.prerequisites = prerequisites;
        this.narrativeFlags = narrativeFlags;
        this.order = order;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromEntity(scene: Scene): SceneDetailsDto {
        const narrativeFlags: Record<string, unknown> = {};
        scene.getNarrativeFlags().forEach((value, key) => {
            narrativeFlags[key] = value;
        });

        return new SceneDetailsDto(
            scene.getSceneId().getValue(),
            scene.getChapterId().getValue(),
            scene.getTitle(),
            scene.getDescription(),
            scene.getStatus().getValue(),
            scene.getType().getValue(),
            scene.getChoices().map((c) => ({ ...c, requiredFlags: { ...c.requiredFlags } })),
            scene.getPrerequisites().map((p) => ({
                sceneId: p.sceneId.getValue(),
                required: p.required,
            })),
            narrativeFlags,
            scene.getOrder(),
            scene.getCreatedAt(),
            scene.getUpdatedAt()
        );
    }
}
