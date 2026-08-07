import { IContainer } from "../container/IContainer";

export interface ICoreModule {

    readonly moduleName: string;

    configureServices(
        container: IContainer
    ): void;

    onInit(): Promise<void>;

    onDestroy(): Promise<void>;
}