import { Metric } from "../Entities/Metric";

export interface IMetricRepository {
    save(metric: Metric): Promise<void>;
    getById(id: string): Promise<Metric | null>;
    getAll(): Promise<Metric[]>;
    getByType(type: string): Promise<Metric[]>;
    getByFeature(feature: string): Promise<Metric[]>;
    getByPerformance(performance: string): Promise<Metric[]>;
    getByTimeRange(start: number, end: number): Promise<Metric[]>;
    delete(id: string): Promise<void>;
    deleteExpired(before: number): Promise<number>;
}
