import { IQueryHandler } from "../Queries/IQueryHandler";
import { ListRegisteredModulesQuery } from "../Queries/ListRegisteredModulesQuery";
import { RegisteredModuleDto } from "../DTO/RegisteredModuleDto";

import { INovaCoreRuntime } from "../../runtime/INovaCoreRuntime";

export class ListRegisteredModulesHandler
implements IQueryHandler<
    ListRegisteredModulesQuery,
    readonly RegisteredModuleDto[]
> {

    constructor(
        private readonly runtime: INovaCoreRuntime
    ) {}

    public async handle(
        _query: ListRegisteredModulesQuery
    ): Promise<readonly RegisteredModuleDto[]> {

        return this.runtime
            .getRegisteredModules()
            .map(
                module =>
                    new RegisteredModuleDto(
                        module.moduleName
                    )
            );

    }

}