import { describe, it, expect } from "vitest";
import { InitializeWorldCommand } from "../../../src/Application/Commands/InitializeWorldCommand";
import { AdvanceTimeCommand } from "../../../src/Application/Commands/AdvanceTimeCommand";
import { UpdateWeatherCommand } from "../../../src/Application/Commands/UpdateWeatherCommand";
import { TransitionRegionCommand } from "../../../src/Application/Commands/TransitionRegionCommand";
import { RegisterNpcPresenceCommand } from "../../../src/Application/Commands/RegisterNpcPresenceCommand";
import { SetGlobalVariableCommand } from "../../../src/Application/Commands/SetGlobalVariableCommand";

describe("InitializeWorldCommand", () => {
    it("test_command_created_with_correct_properties", () => {
        const command = new InitializeWorldCommand("world-1", "Test World", { roles: ["admin"], permissions: ["write"] });
        expect(command.worldId).toBe("world-1");
        expect(command.name).toBe("Test World");
        expect(command.claims).toEqual({ roles: ["admin"], permissions: ["write"] });
    });
});

describe("AdvanceTimeCommand", () => {
    it("test_command_created_with_correct_properties", () => {
        const command = new AdvanceTimeCommand("world-1", 3600, { roles: ["user"], permissions: [] });
        expect(command.worldId).toBe("world-1");
        expect(command.secondsToAdvance).toBe(3600);
        expect(command.claims).toEqual({ roles: ["user"], permissions: [] });
    });
});

describe("UpdateWeatherCommand", () => {
    it("test_command_created_with_correct_properties", () => {
        const conditions = {
            temperatureCelsius: 22,
            precipitationMm: 5,
            windSpeedKmh: 15,
            cloudCoverPercent: 80,
            description: "rainy"
        };
        const command = new UpdateWeatherCommand("world-1", "region-1", conditions, { roles: ["admin"], permissions: ["write"] });
        expect(command.worldId).toBe("world-1");
        expect(command.regionId).toBe("region-1");
        expect(command.conditions).toEqual(conditions);
        expect(command.claims).toEqual({ roles: ["admin"], permissions: ["write"] });
    });
});

describe("TransitionRegionCommand", () => {
    it("test_command_created_with_correct_properties", () => {
        const command = new TransitionRegionCommand("world-1", "region-1", "active", { roles: ["admin"], permissions: ["write"] });
        expect(command.worldId).toBe("world-1");
        expect(command.regionId).toBe("region-1");
        expect(command.targetState).toBe("active");
        expect(command.claims).toEqual({ roles: ["admin"], permissions: ["write"] });
    });
});

describe("RegisterNpcPresenceCommand", () => {
    it("test_command_created_with_correct_properties_arrived", () => {
        const command = new RegisterNpcPresenceCommand("world-1", "char-1", "loc-1", "arrived", { roles: ["admin"], permissions: ["write"] });
        expect(command.worldId).toBe("world-1");
        expect(command.characterId).toBe("char-1");
        expect(command.locationId).toBe("loc-1");
        expect(command.action).toBe("arrived");
        expect(command.claims).toEqual({ roles: ["admin"], permissions: ["write"] });
    });

    it("test_command_created_with_correct_properties_departed", () => {
        const command = new RegisterNpcPresenceCommand("world-1", "char-1", "loc-1", "departed", { roles: ["admin"], permissions: ["write"] });
        expect(command.action).toBe("departed");
    });
});

describe("SetGlobalVariableCommand", () => {
    it("test_command_created_with_correct_properties", () => {
        const command = new SetGlobalVariableCommand("world-1", "dayCount", 5, "number", { roles: ["admin"], permissions: ["write"] });
        expect(command.worldId).toBe("world-1");
        expect(command.key).toBe("dayCount");
        expect(command.value).toBe(5);
        expect(command.type).toBe("number");
        expect(command.claims).toEqual({ roles: ["admin"], permissions: ["write"] });
    });
});
