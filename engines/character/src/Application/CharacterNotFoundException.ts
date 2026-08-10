export class CharacterNotFoundException extends Error {
    constructor(characterId: string) {
        super(`Character with ID "${characterId}" was not found.`);
        this.name = "CharacterNotFoundException";
        Object.setPrototypeOf(this, CharacterNotFoundException.prototype);
    }
}
