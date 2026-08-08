import { RuntimeConfiguration } from "../runtime/RuntimeConfiguration";

export class RuntimeConfigurationBuilder {

    private environment = "production";

    private readonly featureFlags =
        new Map<string, boolean>();

    private readonly enabledModules: string[] = [];

    public withEnvironment(
        environment: string
    ): this {

        this.environment = environment;

        return this;

    }

    public setFeatureFlag(
        flag: string,
        enabled: boolean
    ): this {

        this.featureFlags.set(
            flag,
            enabled
        );

        return this;

    }

    public addModule(
        moduleName: string
    ): this {

        if (!this.enabledModules.includes(moduleName)) {

            this.enabledModules.push(
                moduleName
            );

        }

        return this;

    }

    public build(): RuntimeConfiguration {

        return Object.freeze({

            environment: this.environment,

            featureFlags: new Map(
                this.featureFlags
            ),

            enabledModules: [
                ...this.enabledModules
            ]

        });

    }

}