
export class ImageStyle {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): ImageStyle {
        const normalized = value.toLowerCase().trim();
        const valid = [
            "photorealistic",
            "anime",
            "oil-painting",
            "watercolor",
            "pixel-art",
            "3d-render",
            "sketch",
            "digital-art",
            "comic-book",
            "surrealism",
            "impressionism",
            "minimalist"
        ];
        if (!valid.includes(normalized)) {
            throw new Error(`Invalid ImageStyle: ${value}. Must be one of ${valid.join(", ")}.`);
        }
        return new ImageStyle(normalized);
    }

    public static readonly PHOTOREALISTIC = ImageStyle.create("photorealistic");
    public static readonly ANIME = ImageStyle.create("anime");
    public static readonly OIL_PAINTING = ImageStyle.create("oil-painting");
    public static readonly WATERCOLOR = ImageStyle.create("watercolor");
    public static readonly PIXEL_ART = ImageStyle.create("pixel-art");
    public static readonly THREE_D_RENDER = ImageStyle.create("3d-render");
    public static readonly SKETCH = ImageStyle.create("sketch");
    public static readonly DIGITAL_ART = ImageStyle.create("digital-art");
    public static readonly COMIC_BOOK = ImageStyle.create("comic-book");
    public static readonly SURREALISM = ImageStyle.create("surrealism");
    public static readonly IMPRESSIONISM = ImageStyle.create("impressionism");
    public static readonly MINIMALIST = ImageStyle.create("minimalist");

    public getValue(): string {
        return this.value;
    }

    public equals(other: ImageStyle): boolean {
        return this.value === other.value;
    }
}
