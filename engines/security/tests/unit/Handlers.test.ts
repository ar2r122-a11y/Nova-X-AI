import { describe, it, expect } from "vitest";
import { ValidatePermissionsHandler } from "../../src/Application/Handlers/ValidatePermissionsHandler";
import { RevokeTokenHandler } from "../../src/Application/Handlers/RevokeTokenHandler";
import { RotateKeyHandler } from "../../src/Application/Handlers/RotateKeyHandler";
import { SanitizePayloadHandler } from "../../src/Application/Handlers/SanitizePayloadHandler";
import { LockoutIdentityHandler } from "../../src/Application/Handlers/LockoutIdentityHandler";

describe("ValidatePermissionsHandler", () => {
    it("should be instantiable", () => {
        const security = {
            validatePermissions: async () => ({ allowed: true }),
            getEventBus: () => ({ publish: async () => {} })
        } as any;
        const handler = new ValidatePermissionsHandler(security);
        expect(handler).toBeDefined();
    });
});

describe("RevokeTokenHandler", () => {
    it("should be instantiable", () => {
        const security = {
            revokeToken: async () => {},
            getEventBus: () => ({ publish: async () => {} })
        } as any;
        const handler = new RevokeTokenHandler(security);
        expect(handler).toBeDefined();
    });
});

describe("RotateKeyHandler", () => {
    it("should be instantiable", () => {
        const security = {
            rotateKey: async () => {},
            getEventBus: () => ({ publish: async () => {} })
        } as any;
        const handler = new RotateKeyHandler(security);
        expect(handler).toBeDefined();
    });
});

describe("SanitizePayloadHandler", () => {
    it("should be instantiable", () => {
        const security = {
            sanitizePayload: async () => 0,
            getEventBus: () => ({ publish: async () => {} })
        } as any;
        const handler = new SanitizePayloadHandler(security);
        expect(handler).toBeDefined();
    });
});

describe("LockoutIdentityHandler", () => {
    it("should be instantiable", () => {
        const security = {
            lockoutIdentity: async () => {},
            getEventBus: () => ({ publish: async () => {} })
        } as any;
        const handler = new LockoutIdentityHandler(security);
        expect(handler).toBeDefined();
    });
});
