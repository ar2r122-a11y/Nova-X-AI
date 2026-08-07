export interface IRuntimeStateRepository {

    saveState(
        key: string,
        state: object
    ): Promise<void>;

    getState<T>(
        key: string
    ): Promise<T | null>;

}