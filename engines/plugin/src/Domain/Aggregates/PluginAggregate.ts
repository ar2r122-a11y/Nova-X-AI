import { IDomainEvent } from "@nova-x-ai/core";
import { PluginEntity } from "../Entities/PluginEntity";
import type { PluginDependencyDto } from "../../Application/DTO";

export interface PluginAggregateProps {
    entity: PluginEntity;
    dependencies: PluginDependencyDto[];
}

export class PluginAggregate {
    private readonly props: PluginAggregateProps;
    private readonly uncommittedEvents: IDomainEvent[];

    private constructor(props: PluginAggregateProps) {
        this.props = props;
        this.uncommittedEvents = [];
    }

    static reconstitute(entity: PluginEntity, dependencies: PluginDependencyDto[]): PluginAggregate {
        const aggregate = new PluginAggregate({
            entity,
            dependencies,
        });
        return aggregate;
    }

    getEntity(): PluginEntity {
        return this.props.entity;
    }

    getDependencies(): PluginDependencyDto[] {
        return this.props.dependencies;
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    canActivate(): boolean {
        const unresolved = this.props.dependencies.filter((d) => !d.resolved);
        if (unresolved.length > 0) {
            return false;
        }
        const conflicts = this.props.dependencies.flatMap((d) => d.conflicts);
        if (conflicts.length > 0) {
            return false;
        }
        return true;
    }

    activate(): void {
        if (!this.canActivate()) {
            throw new Error("Plugin cannot be activated due to unresolved dependencies or conflicts.");
        }
        this.props.entity.markActive();
    }

    deactivate(): void {
        this.props.entity.markRecovering();
    }
}
