import { IDomainEvent } from "@nova-x-ai/core";
import { PADCoordinates } from "../ValueObjects/PADCoordinates";
import { EmotionalDelta } from "../ValueObjects/EmotionalDelta";
import { MoodDescriptor } from "../ValueObjects/MoodDescriptor";
import { PrimaryEmotion } from "../ValueObjects/PrimaryEmotion";
import { EmotionalTrigger } from "../ValueObjects/EmotionalTrigger";
import { EmotionalReaction } from "../ValueObjects/EmotionalReaction";
import { EmotionalStimulus } from "../ValueObjects/EmotionalStimulus";
import { EmotionalHistoryEntry } from "../Entities/EmotionalHistoryEntry";
import {
    EmotionalStateChangedEvent,
    MoodShiftedEvent,
    EmotionalBreakpointReachedEvent,
} from "../Events";

export type EmotionalLifecycleState = "baseline" | "activated" | "stressed" | "breakpoint" | "recovery";

export class EmotionAggregate {
    private readonly characterId: string;
    private readonly currentStateId: string;
    private pad: PADCoordinates;
    private primaryEmotion: PrimaryEmotion;
    private intensity: number;
    private lastUpdated: number;
    private currentMood: MoodDescriptor;
    private moodStability: number;
    private moodDuration: number;
    private activeFeelings: string[];
    private sensoryResonance: number;
    private readonly resonantMemoryIds: string[];
    private readonly traumaTriggers: string[];
    private readonly triggers: EmotionalTrigger[];
    private expressionStyle: EmotionalReaction;
    private decayRate: number;
    private halfLifeMs: number;
    private resilienceFactor: number;
    private emotionalMaturity: number;
    private recoveryProtocol: string;
    private stabilityIndex: number;
    private activationThreshold: number;
    private breakpointThreshold: number;
    private totalStimuliProcessed: number;
    private peakArousalRecorded: number;
    private ledgers: EmotionalHistoryEntry[];
    private readonly maxHistoryLedgerSize: number;
    private emotionalState: EmotionalLifecycleState;
    private readonly uncommittedEvents: IDomainEvent[];

    private constructor(props: {
        characterId: string;
        currentStateId: string;
        pad: PADCoordinates;
        primaryEmotion: PrimaryEmotion;
        intensity: number;
        lastUpdated: number;
        currentMood: MoodDescriptor;
        moodStability: number;
        moodDuration: number;
        activeFeelings: string[];
        sensoryResonance: number;
        resonantMemoryIds: string[];
        traumaTriggers: string[];
        triggers: EmotionalTrigger[];
        expressionStyle: EmotionalReaction;
        decayRate: number;
        halfLifeMs: number;
        resilienceFactor: number;
        emotionalMaturity: number;
        recoveryProtocol: string;
        stabilityIndex: number;
        activationThreshold: number;
        breakpointThreshold: number;
        totalStimuliProcessed: number;
        peakArousalRecorded: number;
        ledgers: EmotionalHistoryEntry[];
        emotionalState: EmotionalLifecycleState;
    }) {
        this.characterId = props.characterId;
        this.currentStateId = props.currentStateId;
        this.pad = props.pad;
        this.primaryEmotion = props.primaryEmotion;
        this.intensity = props.intensity;
        this.lastUpdated = props.lastUpdated;
        this.currentMood = props.currentMood;
        this.moodStability = props.moodStability;
        this.moodDuration = props.moodDuration;
        this.activeFeelings = props.activeFeelings;
        this.sensoryResonance = props.sensoryResonance;
        this.resonantMemoryIds = props.resonantMemoryIds;
        this.traumaTriggers = props.traumaTriggers;
        this.triggers = props.triggers;
        this.expressionStyle = props.expressionStyle;
        this.decayRate = props.decayRate;
        this.halfLifeMs = props.halfLifeMs;
        this.resilienceFactor = props.resilienceFactor;
        this.emotionalMaturity = props.emotionalMaturity;
        this.recoveryProtocol = props.recoveryProtocol;
        this.stabilityIndex = props.stabilityIndex;
        this.activationThreshold = props.activationThreshold;
        this.breakpointThreshold = props.breakpointThreshold;
        this.totalStimuliProcessed = props.totalStimuliProcessed;
        this.peakArousalRecorded = props.peakArousalRecorded;
        this.ledgers = props.ledgers;
        this.maxHistoryLedgerSize = 50;
        this.emotionalState = props.emotionalState;
        this.uncommittedEvents = [];
    }

    static create(characterId: string): EmotionAggregate {
        const baseline = PADCoordinates.baseline();
        const now = Date.now();
        return new EmotionAggregate({
            characterId,
            currentStateId: `state-${characterId}-${now}`,
            pad: baseline,
            primaryEmotion: PrimaryEmotion.neutral(),
            intensity: 0.0,
            lastUpdated: now,
            currentMood: MoodDescriptor.neutral(),
            moodStability: 1.0,
            moodDuration: 0,
            activeFeelings: [],
            sensoryResonance: 0.0,
            resonantMemoryIds: [],
            traumaTriggers: [],
            triggers: [],
            expressionStyle: EmotionalReaction.neutral(),
            decayRate: 0.05,
            halfLifeMs: 5000,
            resilienceFactor: 1.0,
            emotionalMaturity: 0.0,
            recoveryProtocol: "natural_decay",
            stabilityIndex: 1.0,
            activationThreshold: 0.3,
            breakpointThreshold: 0.9,
            totalStimuliProcessed: 0,
            peakArousalRecorded: baseline.getArousal(),
            ledgers: [],
            emotionalState: "baseline"
        });
    }

    static reconstitute(snapshot: {
        characterId: string;
        currentStateId: string;
        pad: { pleasure: number; arousal: number; dominance: number };
        primaryEmotion: string;
        intensity: number;
        lastUpdated: number;
        currentMood: { moodName: string; stabilityWeight: number };
        moodStability: number;
        moodDuration: number;
        activeFeelings: string[];
        sensoryResonance: number;
        resonantMemoryIds: string[];
        traumaTriggers: string[];
        triggers: { triggerId: string; triggerType: string; pattern: string; pleasureDelta: number; arousalDelta: number; dominanceDelta: number; weight: number }[];
        expressionStyle: { expressionStyle: string; verbalToneAdjustment: string; physicalDemeanor: string; intensityMultiplier: number };
        decayRate: number;
        halfLifeMs: number;
        resilienceFactor: number;
        emotionalMaturity: number;
        recoveryProtocol: string;
        stabilityIndex: number;
        activationThreshold: number;
        breakpointThreshold: number;
        totalStimuliProcessed: number;
        peakArousalRecorded: number;
        ledgers: { ledgerId: string; timestamp: number; previousPrimaryEmotion: string; newPrimaryEmotion: string; previousPrimaryMood: string; newPrimaryMood: string; previousPAD: { pleasure: number; arousal: number; dominance: number }; newPAD: { pleasure: number; arousal: number; dominance: number }; previousIntensity: number; newIntensity: number; previousStabilityIndex: number; newStabilityIndex: number; stimulusType?: string; stimulusIntensity?: number; stimulusValence?: number }[];
        emotionalState: EmotionalLifecycleState;
    }): EmotionAggregate {
        return new EmotionAggregate({
            characterId: snapshot.characterId,
            currentStateId: snapshot.currentStateId,
            pad: PADCoordinates.create(snapshot.pad.pleasure, snapshot.pad.arousal, snapshot.pad.dominance),
            primaryEmotion: PrimaryEmotion.create(snapshot.primaryEmotion),
            intensity: snapshot.intensity,
            lastUpdated: snapshot.lastUpdated,
            currentMood: MoodDescriptor.create(snapshot.currentMood.moodName as any, snapshot.currentMood.stabilityWeight),
            moodStability: snapshot.moodStability,
            moodDuration: snapshot.moodDuration,
            activeFeelings: snapshot.activeFeelings,
            sensoryResonance: snapshot.sensoryResonance,
            resonantMemoryIds: snapshot.resonantMemoryIds,
            traumaTriggers: snapshot.traumaTriggers,
            triggers: snapshot.triggers.map(t => EmotionalTrigger.create({
                triggerId: t.triggerId,
                triggerType: t.triggerType as any,
                pattern: t.pattern,
                pleasureDelta: t.pleasureDelta,
                arousalDelta: t.arousalDelta,
                dominanceDelta: t.dominanceDelta,
                weight: t.weight
            })),
            expressionStyle: EmotionalReaction.create(snapshot.expressionStyle),
            decayRate: snapshot.decayRate,
            halfLifeMs: snapshot.halfLifeMs,
            resilienceFactor: snapshot.resilienceFactor,
            emotionalMaturity: snapshot.emotionalMaturity,
            recoveryProtocol: snapshot.recoveryProtocol,
            stabilityIndex: snapshot.stabilityIndex,
            activationThreshold: snapshot.activationThreshold,
            breakpointThreshold: snapshot.breakpointThreshold,
            totalStimuliProcessed: snapshot.totalStimuliProcessed,
            peakArousalRecorded: snapshot.peakArousalRecorded,
            ledgers: snapshot.ledgers.map(l => EmotionalHistoryEntry.reconstitute(l)),
            emotionalState: snapshot.emotionalState
        });
    }

    applyStimulus(stimulus: EmotionalStimulus, sensitivity: number): void {
        const previousEmotion = this.primaryEmotion.getValue();
        const previousPAD = this.pad;
        const previousMood = this.currentMood;
        const previousIntensity = this.intensity;
        const previousStabilityIndex = this.stabilityIndex;

        const delta = EmotionalDelta.create(
            stimulus.getValence() * stimulus.getIntensity() * sensitivity,
            stimulus.getIntensity() * 0.5 * sensitivity,
            stimulus.getValence() * 0.2 * sensitivity
        );

        this.pad = this.pad.add(delta);
        this.intensity = Math.min(1.0, Math.max(0.0, stimulus.getIntensity() * sensitivity + this.intensity * 0.3));
        this.lastUpdated = Date.now();
        this.totalStimuliProcessed += 1;

        if (this.pad.getArousal() > this.peakArousalRecorded) {
            this.peakArousalRecorded = this.pad.getArousal();
        }

        const newEmotion = PrimaryEmotion.fromPAD(this.pad.getPleasure(), this.pad.getArousal(), this.pad.getDominance());
        this.primaryEmotion = newEmotion;
        this.updateStabilityIndex();
        this.evaluateStateTransition(stimulus);

        const newMood = MoodDescriptor.fromPAD(this.pad.getPleasure(), this.pad.getArousal());
        if (newMood.getMoodName() !== this.currentMood.getMoodName()) {
            this.currentMood = newMood;
            this.uncommittedEvents.push(new MoodShiftedEvent(
                this.characterId,
                previousMood.getMoodName(),
                newMood.getMoodName(),
                this.moodStability,
                Date.now(),
                ""
            ));
        }

        this.uncommittedEvents.push(new EmotionalStateChangedEvent(
            this.characterId,
            previousEmotion,
            newEmotion.getValue(),
            this.pad.getPleasure(),
            this.pad.getArousal(),
            this.pad.getDominance(),
            Date.now(),
            ""
        ));

        this.recordHistoryEntry({
            previousPrimaryEmotion: previousEmotion,
            newPrimaryEmotion: newEmotion.getValue(),
            previousPrimaryMood: previousMood.getMoodName(),
            newPrimaryMood: newMood.getMoodName(),
            previousPAD: { pleasure: previousPAD.getPleasure(), arousal: previousPAD.getArousal(), dominance: previousPAD.getDominance() },
            newPAD: { pleasure: this.pad.getPleasure(), arousal: this.pad.getArousal(), dominance: this.pad.getDominance() },
            previousIntensity,
            newIntensity: this.intensity,
            previousStabilityIndex,
            newStabilityIndex: this.stabilityIndex,
            stimulusType: stimulus.getStimulusType(),
            stimulusIntensity: stimulus.getIntensity(),
            stimulusValence: stimulus.getValence()
        });
    }

    processDecayTick(elapsedMs: number): void {
        if (elapsedMs <= 0) {
            return;
        }

        const previousEmotion = this.primaryEmotion.getValue();
        const previousPAD = { ...this.pad.toJSON() };
        const previousIntensity = this.intensity;
        const previousStabilityIndex = this.stabilityIndex;

        const decayFactor = Math.exp(-this.decayRate * (elapsedMs / this.halfLifeMs));
        const baseline = PADCoordinates.baseline();

        this.pad = this.pad.interpolateToward(baseline, decayFactor);
        this.intensity = Math.max(0.0, this.intensity * (1.0 - decayFactor));

        this.updateStabilityIndex();

        if (this.emotionalState === "stressed" && this.stabilityIndex > this.activationThreshold) {
            this.emotionalState = "baseline";
        }

        if (this.emotionalState === "recovery") {
            this.pad = this.pad.interpolateToward(baseline, 0.1);
            if (this.pad.distanceFrom(baseline) < 0.1) {
                this.emotionalState = "baseline";
                this.currentMood = MoodDescriptor.neutral();
                this.primaryEmotion = PrimaryEmotion.neutral();
            }
        }

        this.lastUpdated = Date.now();

        const newEmotion = PrimaryEmotion.fromPAD(this.pad.getPleasure(), this.pad.getArousal(), this.pad.getDominance());
        if (!newEmotion.equals(this.primaryEmotion)) {
            this.primaryEmotion = newEmotion;
        }

        const newMood = MoodDescriptor.fromPAD(this.pad.getPleasure(), this.pad.getArousal());
        if (newMood.getMoodName() !== this.currentMood.getMoodName()) {
            const previousMood = this.currentMood;
            this.currentMood = newMood;
            this.uncommittedEvents.push(new MoodShiftedEvent(
                this.characterId,
                previousMood.getMoodName(),
                newMood.getMoodName(),
                this.moodStability,
                Date.now(),
                ""
            ));
        }

        this.recordHistoryEntry({
            previousPrimaryEmotion: previousEmotion,
            newPrimaryEmotion: this.primaryEmotion.getValue(),
            previousPrimaryMood: previousPAD.pleasure > 0 ? "positive" : "negative",
            newPrimaryMood: this.currentMood.getMoodName(),
            previousPAD,
            newPAD: { pleasure: this.pad.getPleasure(), arousal: this.pad.getArousal(), dominance: this.pad.getDominance() },
            previousIntensity,
            newIntensity: this.intensity,
            previousStabilityIndex,
            newStabilityIndex: this.stabilityIndex,
            stimulusType: "decay",
            stimulusIntensity: 0,
            stimulusValence: 0
        });
    }

    resetBaseline(): void {
        const previousEmotion = this.primaryEmotion.getValue();
        const previousMood = this.currentMood.getMoodName();
        const previousPAD = { ...this.pad.toJSON() };
        const previousIntensity = this.intensity;
        const previousStabilityIndex = this.stabilityIndex;

        this.pad = PADCoordinates.baseline();
        this.primaryEmotion = PrimaryEmotion.neutral();
        this.intensity = 0.0;
        this.emotionalState = "baseline";
        this.currentMood = MoodDescriptor.neutral();
        this.activeFeelings = [];
        this.sensoryResonance = 0.0;
        this.stabilityIndex = 1.0;
        this.lastUpdated = Date.now();

        this.uncommittedEvents.push(new EmotionalStateChangedEvent(
            this.characterId,
            previousEmotion,
            this.primaryEmotion.getValue(),
            this.pad.getPleasure(),
            this.pad.getArousal(),
            this.pad.getDominance(),
            Date.now(),
            ""
        ));

        this.recordHistoryEntry({
            previousPrimaryEmotion: previousEmotion,
            newPrimaryEmotion: this.primaryEmotion.getValue(),
            previousPrimaryMood: previousMood,
            newPrimaryMood: this.currentMood.getMoodName(),
            previousPAD,
            newPAD: { pleasure: this.pad.getPleasure(), arousal: this.pad.getArousal(), dominance: this.pad.getDominance() },
            previousIntensity,
            newIntensity: this.intensity,
            previousStabilityIndex,
            newStabilityIndex: this.stabilityIndex,
            stimulusType: "reset",
            stimulusIntensity: 0,
            stimulusValence: 0
        });
    }

    getCharacterId(): string {
        return this.characterId;
    }

    getCurrentStateId(): string {
        return this.currentStateId;
    }

    getPAD(): PADCoordinates {
        return this.pad;
    }

    getPrimaryEmotion(): PrimaryEmotion {
        return this.primaryEmotion;
    }

    getIntensity(): number {
        return this.intensity;
    }

    getLastUpdated(): number {
        return this.lastUpdated;
    }

    getCurrentMood(): MoodDescriptor {
        return this.currentMood;
    }

    getMoodStability(): number {
        return this.moodStability;
    }

    getMoodDuration(): number {
        return this.moodDuration;
    }

    getActiveFeelings(): string[] {
        return this.activeFeelings;
    }

    getSensoryResonance(): number {
        return this.sensoryResonance;
    }

    getResonantMemoryIds(): string[] {
        return this.resonantMemoryIds;
    }

    getTraumaTriggers(): string[] {
        return this.traumaTriggers;
    }

    getTriggers(): EmotionalTrigger[] {
        return this.triggers;
    }

    getExpressionStyle(): EmotionalReaction {
        return this.expressionStyle;
    }

    getDecayRate(): number {
        return this.decayRate;
    }

    getHalfLifeMs(): number {
        return this.halfLifeMs;
    }

    getResilienceFactor(): number {
        return this.resilienceFactor;
    }

    getEmotionalMaturity(): number {
        return this.emotionalMaturity;
    }

    getRecoveryProtocol(): string {
        return this.recoveryProtocol;
    }

    getStabilityIndex(): number {
        return this.stabilityIndex;
    }

    getActivationThreshold(): number {
        return this.activationThreshold;
    }

    getBreakpointThreshold(): number {
        return this.breakpointThreshold;
    }

    getTotalStimuliProcessed(): number {
        return this.totalStimuliProcessed;
    }

    getPeakArousalRecorded(): number {
        return this.peakArousalRecorded;
    }

    getLedgers(): EmotionalHistoryEntry[] {
        return [...this.ledgers];
    }

    getEmotionalState(): EmotionalLifecycleState {
        return this.emotionalState;
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    getSnapshot(): object {
        return {
            characterId: this.characterId,
            currentStateId: this.currentStateId,
            pad: this.pad.toJSON(),
            primaryEmotion: this.primaryEmotion.getValue(),
            intensity: this.intensity,
            lastUpdated: this.lastUpdated,
            currentMood: { moodName: this.currentMood.getMoodName(), stabilityWeight: this.currentMood.getStabilityWeight() },
            moodStability: this.moodStability,
            moodDuration: this.moodDuration,
            activeFeelings: this.activeFeelings,
            sensoryResonance: this.sensoryResonance,
            resonantMemoryIds: this.resonantMemoryIds,
            traumaTriggers: this.traumaTriggers,
            triggers: this.triggers.map(t => t.toSnapshot()),
            expressionStyle: this.expressionStyle.toSnapshot(),
            decayRate: this.decayRate,
            halfLifeMs: this.halfLifeMs,
            resilienceFactor: this.resilienceFactor,
            emotionalMaturity: this.emotionalMaturity,
            recoveryProtocol: this.recoveryProtocol,
            stabilityIndex: this.stabilityIndex,
            activationThreshold: this.activationThreshold,
            breakpointThreshold: this.breakpointThreshold,
            totalStimuliProcessed: this.totalStimuliProcessed,
            peakArousalRecorded: this.peakArousalRecorded,
            ledgers: this.ledgers.map(l => l.toSnapshot()),
            emotionalState: this.emotionalState
        };
    }

    private evaluateStateTransition(stimulus: EmotionalStimulus): void {
        const arousal = this.pad.getArousal();
        const pleasure = this.pad.getPleasure();

        switch (this.emotionalState) {
            case "baseline":
                if (stimulus.getIntensity() >= this.activationThreshold) {
                    this.emotionalState = "activated";
                }
                break;
            case "activated":
                if (arousal > 0.7 && pleasure < -0.3) {
                    this.emotionalState = "stressed";
                }
                break;
            case "stressed":
                if (this.stabilityIndex >= this.breakpointThreshold) {
                    this.emotionalState = "breakpoint";
                    this.uncommittedEvents.push(new EmotionalBreakpointReachedEvent(
                        this.characterId,
                        this.stabilityIndex,
                        this.breakpointThreshold,
                        "initiate_recovery",
                        Date.now(),
                        ""
                    ));
                    this.recoveryProtocol = "active_recovery";
                }
                break;
            case "breakpoint":
                this.emotionalState = "recovery";
                break;
            case "recovery":
                if (this.pad.distanceFrom(PADCoordinates.baseline()) < 0.2) {
                    this.emotionalState = "baseline";
                    this.recoveryProtocol = "natural_decay";
                }
                break;
        }
    }

    private updateStabilityIndex(): void {
        const arousalDelta = Math.abs(this.pad.getArousal() - PADCoordinates.baseline().getArousal());
        const pleasureDelta = Math.abs(this.pad.getPleasure());
        const volatility = (arousalDelta + pleasureDelta) / 2.0;
        this.stabilityIndex = Math.max(0.0, Math.min(1.0, 1.0 - volatility * this.resilienceFactor));
    }

    private recordHistoryEntry(props: {
        previousPrimaryEmotion: string;
        newPrimaryEmotion: string;
        previousPrimaryMood: string;
        newPrimaryMood: string;
        previousPAD: { pleasure: number; arousal: number; dominance: number };
        newPAD: { pleasure: number; arousal: number; dominance: number };
        previousIntensity: number;
        newIntensity: number;
        previousStabilityIndex: number;
        newStabilityIndex: number;
        stimulusType?: string;
        stimulusIntensity?: number;
        stimulusValence?: number;
    }): void {
        const entry = EmotionalHistoryEntry.create({
            ...props,
            ledgerId: undefined,
            timestamp: undefined
        });
        this.ledgers.push(entry);
        if (this.ledgers.length > this.maxHistoryLedgerSize) {
            this.ledgers.shift();
        }
    }
}
