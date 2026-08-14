import { PluginException } from "./PluginException";

export class PluginVersionException extends PluginException {
    constructor(message: string) {
        super(message);
        this.name = "PluginVersionException";
    }
}
