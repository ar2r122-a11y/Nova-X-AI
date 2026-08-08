export interface IHealthCheckProvider {

    check(): Promise<boolean>;

}