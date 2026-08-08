import { ServiceLifetime } from "./ServiceLifetime";

/**
 * Nova X AI
 * Nova Core
 * Service Descriptor
 */

export interface ServiceDescriptor<T = unknown> {

    readonly token: symbol;

    readonly implementation: new (...args: any[]) => T;

    readonly lifetime: ServiceLifetime;

    instance?: T;

}