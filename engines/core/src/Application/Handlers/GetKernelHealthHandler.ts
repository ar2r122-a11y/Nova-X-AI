import { IQueryHandler } from "../Queries/IQueryHandler";
import { GetKernelHealthQuery } from "../Queries/GetKernelHealthQuery";
import { KernelHealthDto } from "../DTO/KernelHealthDto";

import { INovaCoreRuntime } from "../../runtime/INovaCoreRuntime";

export class GetKernelHealthHandler
implements IQueryHandler<
    GetKernelHealthQuery,
    KernelHealthDto
> {

    constructor(
        private readonly runtime: INovaCoreRuntime
    ) {}

    public async handle(
        query: GetKernelHealthQuery
    ): Promise<KernelHealthDto> {

        return new KernelHealthDto(

            this.runtime.getState(),

            this.runtime.getRegisteredModules().length

        );

    }

}