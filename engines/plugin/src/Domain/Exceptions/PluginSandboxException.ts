import { PluginException } from "./PluginException";

export class PluginSandboxException extends PluginException {
    constructor(message: string) {
        super(message);
        this.name = "PluginSandboxException";
    }
}
