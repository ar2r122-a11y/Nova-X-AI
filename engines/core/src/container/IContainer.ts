/**
 * Nova X AI
 * Nova Core
 * Dependency Injection Container Contract
 */

export interface IContainer {
    registerSingleton<T>(
        token: symbol,
        implementation: new (...args: any[]) => T
    ): void;

    registerTransient<T>(
        token: symbol,
        implementation: new (...args: any[]) => T
    ): void;

    registerScoped<T>(
        token: symbol,
        implementation: new (...args: any[]) => T
    ): void;

    registerInstance<T>(
        token: symbol,
        instance: T
    ): void;

    isRegistered(token: symbol): boolean;

    resolve<T>(token: symbol): T;

    remove(token: symbol): void;

    clear(): void;

    createScope(): IContainer;

    getRegisteredServices(): symbol[];
}