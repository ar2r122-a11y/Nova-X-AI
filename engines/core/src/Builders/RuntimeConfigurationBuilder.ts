import { RuntimeConfiguration } from "../runtime/RuntimeConfiguration";

/**
 * Nova X AI
 * Nova Core
 * RuntimeConfigurationBuilder
 *
 * Fluent builder for RuntimeConfiguration.
 * SDS §1: config includes maxBackgroundWorkers: 8 and eventBusQueueLimit: 1000.
 */
export class RuntimeConfigurationBuilder {

    private _applicationName = "nova-x-ai";

    private _version = "0.1.0";

    private _environment = "production";

    private _debug = false;

    private _enableTelemetry = true;

    private _enableDiagnostics = true;

    private _enableAnalytics = true;

    private _maxBackgroundWorkers = 8;

    private _eventBusQueueLimit = 1000;

    public withApplicationName(
        applicationName: string
    ): this {

        this._applicationName = applicationName;

        return this;

    }

    public withVersion(
        version: string
    ): this {

        this._version = version;

        return this;

    }

    public withEnvironment(
        environment: string
    ): this {

        this._environment = environment;

        return this;

    }

    public withDebug(
        debug: boolean
    ): this {

        this._debug = debug;

        return this;

    }

    public withTelemetry(
        enabled: boolean
    ): this {

        this._enableTelemetry = enabled;

        return this;

    }

    public withDiagnostics(
        enabled: boolean
    ): this {

        this._enableDiagnostics = enabled;

        return this;

    }

    public withAnalytics(
        enabled: boolean
    ): this {

        this._enableAnalytics = enabled;

        return this;

    }

    public withMaxBackgroundWorkers(
        maxBackgroundWorkers: number
    ): this {

        this._maxBackgroundWorkers = maxBackgroundWorkers;

        return this;

    }

    public withEventBusQueueLimit(
        eventBusQueueLimit: number
    ): this {

        this._eventBusQueueLimit = eventBusQueueLimit;

        return this;

    }

    public build(): RuntimeConfiguration {

        return Object.freeze({

            applicationName: this._applicationName,

            version: this._version,

            environment: this._environment,

            debug: this._debug,

            enableTelemetry: this._enableTelemetry,

            enableDiagnostics: this._enableDiagnostics,

            enableAnalytics: this._enableAnalytics,

            maxBackgroundWorkers: this._maxBackgroundWorkers,

            eventBusQueueLimit: this._eventBusQueueLimit

        });

    }

}
