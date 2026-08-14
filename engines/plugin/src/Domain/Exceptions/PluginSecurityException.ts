import { PluginException } from "./PluginException";

export class PluginSecurityException extends PluginException {
    constructor(message: string) {
        super(message);
        this.name = "PluginSecurityException";
    }
}
