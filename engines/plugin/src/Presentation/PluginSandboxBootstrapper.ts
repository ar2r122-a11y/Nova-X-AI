export class PluginWorkerBootstrapper {
    static bootstrap(port: MessagePort): void {
        port.onmessage = (event: MessageEvent) => {
            const msg = event.data;
            if (msg.type === "execute") {
                const result = { result: "executed" };
                port.postMessage(result);
            }
        };
    }
}
