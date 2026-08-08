/**
 * Nova X AI
 * Nova Core
 * Module Lifecycle State
 *
 * Represents the lifecycle state of a registered module
 * within the Nova Core runtime.
 */

export enum ModuleState {

    Registered = "Registered",

    Initializing = "Initializing",

    Running = "Running",

    Stopping = "Stopping",

    Stopped = "Stopped",

    Failed = "Failed"

}
