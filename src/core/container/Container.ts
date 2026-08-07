import { ContainerException } from "./ContainerException";
import { IContainer } from "./IContainer";
import { ServiceDescriptor } from "./ServiceDescriptor";
import { ServiceLifetime } from "./ServiceLifetime";

export class Container implements IContainer {

    private readonly services =
        new Map<string, ServiceDescriptor>();

    public register<T>(
        token: string,
        implementation: new (...args: any[]) => T,
        lifetime: ServiceLifetime = ServiceLifetime.Singleton
    ): void {

        this.services.set(token, {
            token,
            implementation,
            lifetime
        });

    }

    public resolve<T>(token: string): T {

        const descriptor = this.services.get(token);

        if (!descriptor) {

            throw new ContainerException(
                `Service '${token}' is not registered.`
            );

        }

        if (descriptor.lifetime === ServiceLifetime.Singleton) {

            if (!descriptor.instance) {

                descriptor.instance =
                    new descriptor.implementation();

            }

            return descriptor.instance as T;

        }

        return new descriptor.implementation() as T;

    }

    public has(token: string): boolean {

        return this.services.has(token);

    }

}