export interface IPluginManifestValidator {
    validate(manifest: Record<string, unknown>): boolean;
}
