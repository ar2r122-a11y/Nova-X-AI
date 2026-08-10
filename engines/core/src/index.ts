/**
 * Nova X AI
 * Nova Core — Public barrel export
 *
 * Exports the stable public surface of the Nova Core engine.
 * Internal implementation details are NOT re-exported here.
 *
 * SDS §1: Nova Core provides lifecycle, DI, Event Bus, scheduling,
 * and fault isolation for all registered subsystems.
 */

// Runtime
export { NovaCoreRuntime } from "./runtime/NovaCoreRuntime";
export type { INovaCoreRuntime } from "./runtime/INovaCoreRuntime";
export { RuntimeState } from "./runtime/RuntimeState";
export type { RuntimeConfiguration } from "./runtime/RuntimeConfiguration";
export { RuntimeManager } from "./runtime/RuntimeManager";

// Container
export type { IContainer } from "./container/IContainer";
export { Container } from "./container/Container";
export { ServiceLifetime } from "./container/ServiceLifetime";
export { ContainerException } from "./container/ContainerException";

// Application (CQRS)
export * from "./Application";

// Event Bus
export type { IEventBus, IDomainEvent, IEventHandler } from "./events/IEventBus";
export { EventBus } from "./events/EventBus";

// Modules
export type { ICoreModule } from "./modules/ICoreModule";
export { ModuleRegistry } from "./modules/ModuleRegistry";

// Lifecycle
export { ModuleState } from "./lifecycle/ModuleState";
export type { IModuleLifecycleManager } from "./lifecycle/IModuleLifecycleManager";
export { ModuleLifecycleManager } from "./lifecycle/ModuleLifecycleManager";

// Scheduler
export type { IBackgroundScheduler } from "./scheduler/IBackgroundScheduler";
export { BackgroundScheduler } from "./scheduler/BackgroundScheduler";

// Builders
export { RuntimeConfigurationBuilder } from "./Builders/RuntimeConfigurationBuilder";

// Factories
export { ModuleFactory } from "./Factories/ModuleFactory";

// Policies
export { FaultIsolationPolicy } from "./Policies/FaultIsolationPolicy";

// Contracts
export type { IHealthCheckProvider } from "./Contracts/IHealthCheckProvider";
export type { IModuleRepository } from "./Contracts/IModuleRepository";
export type { IRuntimeStateRepository } from "./Contracts/IRuntimeStateRepository";

// Infrastructure
export { ModuleRepository } from "./Infrastructure/Persistence/ModuleRepository";
export { RuntimeStateRepository } from "./Infrastructure/Persistence/RuntimeStateRepository";
