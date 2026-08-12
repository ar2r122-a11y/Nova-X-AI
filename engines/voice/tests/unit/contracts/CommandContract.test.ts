import { describe, it, expect } from "vitest";
import { SynthesizeSpeechCommand } from "../../../src/Application/Commands/SynthesizeSpeechCommand";
import { InterruptCommand } from "../../../src/Application/Commands/InterruptCommand";
import { PauseCommand } from "../../../src/Application/Commands/PauseCommand";
import { ResumeCommand } from "../../../src/Application/Commands/ResumeCommand";
import { CancelStreamCommand } from "../../../src/Application/Commands/CancelStreamCommand";
import { RegenerateAudioCommand } from "../../../src/Application/Commands/RegenerateAudioCommand";
import { RetryUtteranceCommand } from "../../../src/Application/Commands/RetryUtteranceCommand";
import { CreateVoiceProfileCommand } from "../../../src/Application/Commands/CreateVoiceProfileCommand";
import { UpdateVoiceProfileCommand } from "../../../src/Application/Commands/UpdateVoiceProfileCommand";
import { DeleteVoiceProfileCommand } from "../../../src/Application/Commands/DeleteVoiceProfileCommand";
import { ScheduleVoiceTaskCommand } from "../../../src/Application/Commands/ScheduleVoiceTaskCommand";

describe("CommandContract", () => {
    it("SynthesizeSpeechCommand implements ICommand", () => {
        const cmd = new SynthesizeSpeechCommand("voice-1", "hello", "profile-1", "default", "c1", "ca1");
        expect(cmd).toBeInstanceOf(SynthesizeSpeechCommand);
        expect(cmd.correlationId).toBe("c1");
        expect(cmd.causationId).toBe("ca1");
        expect(cmd.claims).toEqual({ roles: [], permissions: [] });
    });

    it("InterruptCommand implements ICommand", () => {
        const cmd = new InterruptCommand("voice-1", "req-1", "timeout", "c1", "ca1");
        expect(cmd).toBeInstanceOf(InterruptCommand);
        expect(cmd.correlationId).toBe("c1");
    });

    it("PauseCommand implements ICommand", () => {
        const cmd = new PauseCommand("voice-1", "c1", "ca1");
        expect(cmd).toBeInstanceOf(PauseCommand);
    });

    it("ResumeCommand implements ICommand", () => {
        const cmd = new ResumeCommand("voice-1", "c1", "ca1");
        expect(cmd).toBeInstanceOf(ResumeCommand);
    });

    it("CancelStreamCommand implements ICommand", () => {
        const cmd = new CancelStreamCommand("stream-1", "c1", "ca1");
        expect(cmd).toBeInstanceOf(CancelStreamCommand);
    });

    it("RegenerateAudioCommand implements ICommand", () => {
        const cmd = new RegenerateAudioCommand("voice-1", "hello", "profile-1", "default", "c1", "ca1");
        expect(cmd).toBeInstanceOf(RegenerateAudioCommand);
    });

    it("RetryUtteranceCommand implements ICommand", () => {
        const cmd = new RetryUtteranceCommand("voice-1", "c1", "ca1");
        expect(cmd).toBeInstanceOf(RetryUtteranceCommand);
    });

    it("CreateVoiceProfileCommand implements ICommand", () => {
        const cmd = new CreateVoiceProfileCommand("char-1", "voice-1", "en-US", "c1", "ca1");
        expect(cmd).toBeInstanceOf(CreateVoiceProfileCommand);
    });

    it("UpdateVoiceProfileCommand implements ICommand", () => {
        const cmd = new UpdateVoiceProfileCommand("profile-1", 1.1, undefined, undefined, undefined, undefined, "c1", "ca1");
        expect(cmd).toBeInstanceOf(UpdateVoiceProfileCommand);
    });

    it("DeleteVoiceProfileCommand implements ICommand", () => {
        const cmd = new DeleteVoiceProfileCommand("profile-1", "c1", "ca1");
        expect(cmd).toBeInstanceOf(DeleteVoiceProfileCommand);
    });

    it("ScheduleVoiceTaskCommand implements ICommand", () => {
        const cmd = new ScheduleVoiceTaskCommand("voice-1", "hello", "profile-1", Date.now(), 1, 3, "c1", "ca1");
        expect(cmd).toBeInstanceOf(ScheduleVoiceTaskCommand);
    });
});
