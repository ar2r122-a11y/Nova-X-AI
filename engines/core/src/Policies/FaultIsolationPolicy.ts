/**
 * Nova X AI
 * Nova Core
 * Fault Isolation Policy
 */

export class FaultIsolationPolicy {

    public async execute(
        operation: () => Promise<void>,
        moduleName: string
    ): Promise<boolean> {

        try {

            await operation();

            return true;

        }
        catch (error) {

            console.error(
                `[NovaCore] Module '${moduleName}' failed.`,
                error
            );

            return false;

        }

    }

}