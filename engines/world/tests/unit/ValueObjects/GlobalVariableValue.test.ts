import { describe, it, expect } from "vitest";
import { GlobalVariableKey } from "../../../src/Domain/ValueObjects/GlobalVariableKey";
import { GlobalVariableValue } from "../../../src/Domain/ValueObjects/GlobalVariableValue";

describe("GlobalVariableKey", () => {
    it("test_creation_succeeds_with_valid_key", () => {
        expect(GlobalVariableKey.create("dayCount").getValue()).toBe("dayCount");
    });

    it("test_creation_throws_with_empty_key", () => {
        expect(() => GlobalVariableKey.create("")).toThrow();
    });

    it("test_creation_throws_with_invalid_identifier", () => {
        expect(() => GlobalVariableKey.create("123invalid")).toThrow();
        expect(() => GlobalVariableKey.create("has-space")).toThrow();
    });

    it("test_equality_works_correctly", () => {
        const a = GlobalVariableKey.create("key1");
        const b = GlobalVariableKey.create("key1");
        const c = GlobalVariableKey.create("key2");
        expect(a.equals(b)).toBe(true);
        expect(a.equals(c)).toBe(false);
    });
});

describe("GlobalVariableValue", () => {
    it("test_string_value_creation_and_access", () => {
        const val = GlobalVariableValue.string("hello");
        expect(val.getValue()).toBe("hello");
        expect(val.getType()).toBe("string");
        expect(val.asString()).toBe("hello");
    });

    it("test_number_value_creation_and_access", () => {
        const val = GlobalVariableValue.number(42);
        expect(val.asNumber()).toBe(42);
    });

    it("test_boolean_value_creation_and_access", () => {
        const val = GlobalVariableValue.boolean(true);
        expect(val.asBoolean()).toBe(true);
    });

    it("test_as_wrong_type_throws", () => {
        const val = GlobalVariableValue.string("hello");
        expect(() => val.asNumber()).toThrow();
    });

    it("test_equality_works_correctly", () => {
        const a = GlobalVariableValue.string("hello");
        const b = GlobalVariableValue.string("hello");
        const c = GlobalVariableValue.string("world");
        expect(a.equals(b)).toBe(true);
        expect(a.equals(c)).toBe(false);
    });
});

