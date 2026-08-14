import { PluginException } from "./PluginException";

export class PluginInstallationException extends PluginException {
    constructor(message: string) {
        super(message);
        this.name = "PluginInstallationException";
    }
}
