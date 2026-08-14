export class PluginException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PluginException";
    }
}
