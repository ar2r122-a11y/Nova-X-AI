import { IContainer } from "./IContainer";
import { ServiceDescriptor } from "./ServiceDescriptor";
import { ServiceLifetime } from "./ServiceLifetime";
import { ContainerException } from "./ContainerException";

export class Container implements IContainer {

    private readonly services = new Map<symbol, ServiceDescriptor>();

    private readonly parent?: Container;

    constructor(parent?: Container) {
        this.parent = parent;
    }

    registerSingleton<T>(
        token: symbol,
        implementation: new (...args: any[]) => T
    ): void {

        this.register(
            token,
            implementation,
            ServiceLifetime.Singleton
        );

    }

    registerTransient<T>(
        token: symbol,
        implementation: new (...args: any[]) => T
    ): void {

        this.register(
            token,
            implementation,
            ServiceLifetime.Transient
        );

    }

    registerScoped<T>(
        token: symbol,
        implementation: new (...args: any[]) => T
    ): void {

        this.register(
            token,
            implementation,
            ServiceLifetime.Scoped
        );

    }

    registerInstance<T>(
        token: symbol,
        instance: T
    ): void {

        this.services.set(token, {
            token,
            implementation: class {} as any,
            lifetime: ServiceLifetime.Singleton,
            instance
        });

    }

    private register<T>(
        token: symbol,
        implementation: new (...args: any[]) => T,
        lifetime: ServiceLifetime
    ): void {

        if (this.services.has(token)) {
            throw new ContainerException(
                `Service already registered: ${token.toString()}`
            );
        }

        this.services.set(token, {
            token,
            implementation,
            lifetime
        });

    }

    resolve<T>(
        token: symbol
    ): T {

        const descriptor = this.services.get(token);

        if (!descriptor) {
            if (this.parent) {
                return this.parent.resolve<T>(token);
            }

            throw new ContainerException(
                `Service not found: ${token.toString()}`
            );
        }

        switch (descriptor.lifetime) {

            case ServiceLifetime.Singleton:

                if (!descriptor.instance) {
                    descriptor.instance =
                        new descriptor.implementation();
                }

                return descriptor.instance as T;

            case ServiceLifetime.Transient:

                return new descriptor.implementation() as T;

            case ServiceLifetime.Scoped:

                return new descriptor.implementation() as T;

            default:

                throw new ContainerException(
                    "Unsupported service lifetime."
                );

        }

    }

    isRegistered(
        token: symbol
    ): boolean {

        if (this.services.has(token)) {
            return true;
        }

        if (this.parent) {
            return this.parent.isRegistered(token);
        }

        return false;

    }

    remove(
        token: symbol
    ): void {

        this.services.delete(token);

    }

    clear(): void {

        this.services.clear();

    }

    createScope(): IContainer {

        return new Container(this);

    }

    getRegisteredServices(): symbol[] {

        return [...this.services.keys()];

    }

}