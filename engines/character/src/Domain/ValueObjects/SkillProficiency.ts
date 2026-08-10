
export class SkillProficiency {
    public readonly skillName: string;
    public readonly level: number;

    private constructor(skillName: string, level: number) {
        this.skillName = skillName;
        this.level = level;
    }

    public static create(skillName: string, level: number): SkillProficiency {
        if (!skillName || skillName.trim().length === 0) {
            throw new Error("Skill name cannot be empty.");
        }
        if (level < 0.0 || level > 1.0) {
            throw new Error("Skill level must be between 0.0 and 1.0.");
        }
        return new SkillProficiency(skillName, level);
    }

    public static fromObject(data: { skillName: string; level: number }): SkillProficiency {
        return SkillProficiency.create(data.skillName, data.level);
    }

    public getValue(): { skillName: string; level: number } {
        return { skillName: this.skillName, level: this.level };
    }

    public equals(other: SkillProficiency): boolean {
        return this.skillName === other.skillName && this.level === other.level;
    }
}
