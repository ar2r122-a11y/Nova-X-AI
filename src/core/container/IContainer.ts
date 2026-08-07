import { ServiceLifetime } from "./ServiceLifetime";

export interface IContainer {

    register<T>(
        token: string,
        implementation: new (...args: any[]) => T,
        lifetime?: ServiceLifetime
    ): void;

    resolve<T>(token: string): T;

    has(token: string): boolean;

}