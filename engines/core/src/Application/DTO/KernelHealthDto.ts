import { RuntimeState } from "../../runtime/RuntimeState";

export class KernelHealthDto {

    constructor(

        public readonly state: RuntimeState,

        public readonly registeredModules: number

    ) {}

}