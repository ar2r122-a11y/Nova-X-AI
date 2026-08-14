export class PluginWorkerBootstrapper {
    static bootstrap(port: MessagePort): void {
        port.start();
    }
}
