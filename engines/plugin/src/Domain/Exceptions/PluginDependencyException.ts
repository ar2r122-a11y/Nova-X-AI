import { PluginException } from "./PluginException";

export class PluginDependencyException extends PluginException {
    constructor(message: string) {
        super(message);
        this.name = "PluginDependencyException";
    }
}
