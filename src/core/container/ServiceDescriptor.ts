import { ServiceLifetime } from "./ServiceLifetime";

export interface ServiceDescriptor<T = unknown> {
    token: string;
    implementation: new (...args: any[]) => T;
    lifetime: ServiceLifetime;
    instance?: T;
}