import { describe, it, expect } from "vitest";
import { InitializeWorldCommand } from "../../../src/Application/Commands/InitializeWorldCommand";
import { AdvanceTimeCommand } from "../../../src/Application/Commands/AdvanceTimeCommand";
import { UpdateWeatherCommand } from "../../../src/Application/Commands/UpdateWeatherCommand";
import { TransitionRegionCommand } from "../../../src/Application/Commands/TransitionRegionCommand";
import { RegisterNpcPresenceCommand } from "../../../src/Application/Commands/RegisterNpcPresenceCommand";
import { SetGlobalVariableCommand } from "../../../src/Application/Commands/SetGlobalVariableCommand";
import { InitializeWorldValidator } from "../../../src/Application/Validators/InitializeWorldValidator";
import { AdvanceTimeValidator } from "../../../src/Application/Validators/AdvanceTimeValidator";
import { UpdateWeatherValidator } from "../../../src/Application/Validators/UpdateWeatherValidator";
import { TransitionRegionValidator } from "../../../src/Application/Validators/TransitionRegionValidator";
import { RegisterNpcPresenceValidator } from "../../../src/Application/Validators/RegisterNpcPresenceValidator";
import { SetGlobalVariableValidator } from "../../../src/Application/Validators/SetGlobalVariableValidator";

describe("InitializeWorldValidator", () => {
    const validator = new InitializeWorldValidator();

    it("test_valid_input_passes_validation", () => {
        const command = new InitializeWorldCommand("world-1", "Test World", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("test_empty_world_id_throws_error", () => {
        const command = new InitializeWorldCommand("", "Test World", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("WorldId is required.");
    });

    it("test_whitespace_world_id_throws_error", () => {
        const command = new InitializeWorldCommand("   ", "Test World", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("WorldId is required.");
    });

    it("test_empty_name_throws_error", () => {
        const command = new InitializeWorldCommand("world-1", "", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("World name is required.");
    });

    it("test_name_too_long_throws_error", () => {
        const longName = "a".repeat(101);
        const command = new InitializeWorldCommand("world-1", longName, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("World name exceeds maximum length of 100 characters.");
    });
});

describe("AdvanceTimeValidator", () => {
    const validator = new AdvanceTimeValidator();

    it("test_valid_input_passes_validation", () => {
        const command = new AdvanceTimeCommand("world-1", 3600, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("test_empty_world_id_throws_error", () => {
        const command = new AdvanceTimeCommand("", 3600, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("WorldId is required.");
    });

    it("test_non_positive_seconds_throws_error", () => {
        const command = new AdvanceTimeCommand("world-1", 0, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Seconds to advance must be positive.");
    });

    it("test_negative_seconds_throws_error", () => {
        const command = new AdvanceTimeCommand("world-1", -10, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Seconds to advance must be positive.");
    });
});

describe("UpdateWeatherValidator", () => {
    const validator = new UpdateWeatherValidator();

    const validConditions = {
        temperatureCelsius: 22,
        precipitationMm: 5,
        windSpeedKmh: 15,
        cloudCoverPercent: 80,
        description: "rainy"
    };

    it("test_valid_input_passes_validation", () => {
        const command = new UpdateWeatherCommand("world-1", "region-1", validConditions, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("test_empty_region_id_throws_error", () => {
        const command = new UpdateWeatherCommand("world-1", "", validConditions, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("RegionId is required.");
    });

    it("test_invalid_cloud_cover_throws_error", () => {
        const conditions = { ...validConditions, cloudCoverPercent: -1 };
        const command = new UpdateWeatherCommand("world-1", "region-1", conditions, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Cloud cover percent must be between 0 and 100.");
    });

    it("test_cloud_cover_over_100_throws_error", () => {
        const conditions = { ...validConditions, cloudCoverPercent: 101 };
        const command = new UpdateWeatherCommand("world-1", "region-1", conditions, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Cloud cover percent must be between 0 and 100.");
    });

    it("test_negative_precipitation_throws_error", () => {
        const conditions = { ...validConditions, precipitationMm: -1 };
        const command = new UpdateWeatherCommand("world-1", "region-1", conditions, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Precipitation cannot be negative.");
    });

    it("test_negative_wind_speed_throws_error", () => {
        const conditions = { ...validConditions, windSpeedKmh: -1 };
        const command = new UpdateWeatherCommand("world-1", "region-1", conditions, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Wind speed cannot be negative.");
    });

    it("test_empty_description_throws_error", () => {
        const conditions = { ...validConditions, description: "" };
        const command = new UpdateWeatherCommand("world-1", "region-1", conditions, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Weather description cannot be empty.");
    });
});

describe("TransitionRegionValidator", () => {
    const validator = new TransitionRegionValidator();

    it("test_valid_input_passes_validation", () => {
        const command = new TransitionRegionCommand("world-1", "region-1", "active", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("test_empty_world_id_throws_error", () => {
        const command = new TransitionRegionCommand("", "region-1", "active", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("WorldId is required.");
    });

    it("test_empty_region_id_throws_error", () => {
        const command = new TransitionRegionCommand("world-1", "", "active", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("RegionId is required.");
    });

    it("test_empty_target_state_throws_error", () => {
        const command = new TransitionRegionCommand("world-1", "region-1", "", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("TargetState is required.");
    });

    it("test_invalid_target_state_throws_error", () => {
        const command = new TransitionRegionCommand("world-1", "region-1", "invalid_state", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Invalid target state: invalid_state");
    });
});

describe("RegisterNpcPresenceValidator", () => {
    const validator = new RegisterNpcPresenceValidator();

    it("test_valid_input_passes_validation", () => {
        const command = new RegisterNpcPresenceCommand("world-1", "char-1", "loc-1", "arrived", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("test_empty_world_id_throws_error", () => {
        const command = new RegisterNpcPresenceCommand("", "char-1", "loc-1", "arrived", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("WorldId is required.");
    });

    it("test_empty_character_id_throws_error", () => {
        const command = new RegisterNpcPresenceCommand("world-1", "", "loc-1", "arrived", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("CharacterId is required.");
    });

    it("test_empty_location_id_throws_error", () => {
        const command = new RegisterNpcPresenceCommand("world-1", "char-1", "", "arrived", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("LocationId is required.");
    });

    it("test_invalid_action_throws_error", () => {
        const command = new RegisterNpcPresenceCommand("world-1", "char-1", "loc-1", "invalid" as any, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Action must be 'arrived' or 'departed'.");
    });
});

describe("SetGlobalVariableValidator", () => {
    const validator = new SetGlobalVariableValidator();

    it("test_valid_input_passes_validation", () => {
        const command = new SetGlobalVariableCommand("world-1", "dayCount", 5, "number", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("test_empty_world_id_throws_error", () => {
        const command = new SetGlobalVariableCommand("", "dayCount", 5, "number", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("WorldId is required.");
    });

    it("test_empty_key_throws_error", () => {
        const command = new SetGlobalVariableCommand("world-1", "", 5, "number", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Key is required.");
    });

    it("test_null_value_throws_error", () => {
        const command = new SetGlobalVariableCommand("world-1", "dayCount", null as any, "number", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Value cannot be null or undefined.");
    });

    it("test_undefined_value_throws_error", () => {
        const command = new SetGlobalVariableCommand("world-1", "dayCount", undefined as any, "number", { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Value cannot be null or undefined.");
    });
});
