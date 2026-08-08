import { describe, it, expect, beforeEach } from "vitest";
import { Container } from "../../src/container/Container";
import { ContainerException } from "../../src/container/ContainerException";

class ServiceA {
    public readonly name = "ServiceA";
}

class ServiceB {
    public readonly name = "ServiceB";
}

describe("Container", () => {

    let container: Container;

    beforeEach(() => {
        container = new Container();
    });

    // -- Registration --

    describe("registerSingleton", () => {

        it("registers a singleton service", () => {
            const token = Symbol("ServiceA");
            container.registerSingleton(token, ServiceA);
            expect(container.isRegistered(token)).toBe(true);
        });

        it("throws ContainerException when registering the same token twice", () => {
            const token = Symbol("ServiceA");
            container.registerSingleton(token, ServiceA);
            expect(() => container.registerSingleton(token, ServiceA))
                .toThrow(ContainerException);
        });

    });

    describe("registerTransient", () => {

        it("registers a transient service", () => {
            const token = Symbol("ServiceA");
            container.registerTransient(token, ServiceA);
            expect(container.isRegistered(token)).toBe(true);
        });

    });

    describe("registerInstance", () => {

        it("registers a pre-existing instance", () => {
            const token = Symbol("ServiceA");
            const instance = new ServiceA();
            container.registerInstance(token, instance);
            expect(container.isRegistered(token)).toBe(true);
        });

        it("resolves the exact instance that was registered", () => {
            const token = Symbol("ServiceA");
            const instance = new ServiceA();
            container.registerInstance(token, instance);
            expect(container.resolve<ServiceA>(token)).toBe(instance);
        });

    });

    // -- Resolution --

    describe("resolve", () => {

        it("resolves a singleton - same instance on every call", () => {
            const token = Symbol("ServiceA");
            container.registerSingleton(token, ServiceA);
            const a = container.resolve<ServiceA>(token);
            const b = container.resolve<ServiceA>(token);
            expect(a).toBe(b);
        });

        it("resolves a transient - new instance on every call", () => {
            const token = Symbol("ServiceA");
            container.registerTransient(token, ServiceA);
            const a = container.resolve<ServiceA>(token);
            const b = container.resolve<ServiceA>(token);
            expect(a).not.toBe(b);
        });

        it("throws ContainerException for an unregistered token", () => {
            const token = Symbol("Unknown");
            expect(() => container.resolve(token))
                .toThrow(ContainerException);
        });

        it("resolved instance is the correct type", () => {
            const token = Symbol("ServiceA");
            container.registerSingleton(token, ServiceA);
            const instance = container.resolve<ServiceA>(token);
            expect(instance).toBeInstanceOf(ServiceA);
            expect(instance.name).toBe("ServiceA");
        });

    });

    // -- isRegistered --

    describe("isRegistered", () => {

        it("returns true for a registered token", () => {
            const token = Symbol("ServiceA");
            container.registerSingleton(token, ServiceA);
            expect(container.isRegistered(token)).toBe(true);
        });

        it("returns false for an unregistered token", () => {
            const token = Symbol("Unknown");
            expect(container.isRegistered(token)).toBe(false);
        });

    });

    // -- Removal / clearing --

    describe("remove", () => {

        it("removes a registered service", () => {
            const token = Symbol("ServiceA");
            container.registerSingleton(token, ServiceA);
            container.remove(token);
            expect(container.isRegistered(token)).toBe(false);
        });

    });

    describe("clear", () => {

        it("removes all registered services", () => {
            const tokenA = Symbol("ServiceA");
            const tokenB = Symbol("ServiceB");
            container.registerSingleton(tokenA, ServiceA);
            container.registerSingleton(tokenB, ServiceB);
            container.clear();
            expect(container.isRegistered(tokenA)).toBe(false);
            expect(container.isRegistered(tokenB)).toBe(false);
        });

    });

    // -- Scope --

    describe("createScope", () => {

        it("returns a new independent container", () => {
            const token = Symbol("ServiceA");
            container.registerSingleton(token, ServiceA);
            const scope = container.createScope();
            expect(scope.isRegistered(token)).toBe(false);
        });

    });

    // -- getRegisteredServices --

    describe("getRegisteredServices", () => {

        it("returns all registered tokens", () => {
            const tokenA = Symbol("ServiceA");
            const tokenB = Symbol("ServiceB");
            container.registerSingleton(tokenA, ServiceA);
            container.registerSingleton(tokenB, ServiceB);
            const services = container.getRegisteredServices();
            expect(services).toContain(tokenA);
            expect(services).toContain(tokenB);
            expect(services).toHaveLength(2);
        });

    });

});
