export class WeatherCondition {
    private readonly temperatureCelsius: number;
    private readonly precipitationMm: number;
    private readonly windSpeedKmh: number;
    private readonly cloudCoverPercent: number;
    private readonly description: string;

    private constructor(
        temperatureCelsius: number,
        precipitationMm: number,
        windSpeedKmh: number,
        cloudCoverPercent: number,
        description: string
    ) {
        this.temperatureCelsius = temperatureCelsius;
        this.precipitationMm = precipitationMm;
        this.windSpeedKmh = windSpeedKmh;
        this.cloudCoverPercent = cloudCoverPercent;
        this.description = description;
    }

    static create(
        temperatureCelsius: number,
        precipitationMm: number,
        windSpeedKmh: number,
        cloudCoverPercent: number,
        description: string
    ): WeatherCondition {
        if (cloudCoverPercent < 0 || cloudCoverPercent > 100) {
            throw new Error("Cloud cover percent must be between 0 and 100.");
        }
        if (precipitationMm < 0) {
            throw new Error("Precipitation cannot be negative.");
        }
        if (windSpeedKmh < 0) {
            throw new Error("Wind speed cannot be negative.");
        }
        if (!description || description.trim().length === 0) {
            throw new Error("Weather description cannot be empty.");
        }
        return new WeatherCondition(temperatureCelsius, precipitationMm, windSpeedKmh, cloudCoverPercent, description.trim());
    }

    static clear(): WeatherCondition {
        return WeatherCondition.create(20.0, 0.0, 5.0, 10.0, "clear");
    }

    static rain(): WeatherCondition {
        return WeatherCondition.create(15.0, 5.0, 15.0, 80.0, "rain");
    }

    getTemperatureCelsius(): number {
        return this.temperatureCelsius;
    }

    getPrecipitationMm(): number {
        return this.precipitationMm;
    }

    getWindSpeedKmh(): number {
        return this.windSpeedKmh;
    }

    getCloudCoverPercent(): number {
        return this.cloudCoverPercent;
    }

    getDescription(): string {
        return this.description;
    }

    isPrecipitating(): boolean {
        return this.precipitationMm > 0;
    }

    isWindy(): boolean {
        return this.windSpeedKmh > 25.0;
    }

    equals(other: WeatherCondition): boolean {
        return (
            this.temperatureCelsius === other.temperatureCelsius &&
            this.precipitationMm === other.precipitationMm &&
            this.windSpeedKmh === other.windSpeedKmh &&
            this.cloudCoverPercent === other.cloudCoverPercent &&
            this.description === other.description
        );
    }
}
