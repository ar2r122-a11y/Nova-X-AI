import { describe, it, expect } from "vitest";
import { GenerateImageCommandHandler } from "../../src/Application/Handlers/ImageCommandHandlers";
import { SelectCandidateCommandHandler } from "../../src/Application/Handlers/ImageCommandHandlers";
import { CompilePromptCommandHandler } from "../../src/Application/Handlers/ImageCommandHandlers";
import { GetImageQueryHandler } from "../../src/Application/QueryHandlers/ImageQueryHandlers";
import { ListImagesQueryHandler } from "../../src/Application/QueryHandlers/ImageQueryHandlers";
import { GetCandidateQueryHandler } from "../../src/Application/QueryHandlers/ImageQueryHandlers";
import { GenerateImageCommand } from "../../src/Application/Commands/GenerateImageCommand";
import { SelectCandidateCommand } from "../../src/Application/Commands/SelectCandidateCommand";
import { CompilePromptCommand } from "../../src/Application/Commands/CompilePromptCommand";
import { GetImageQuery } from "../../src/Application/Queries/GetImageQuery";
import { ListImagesQuery } from "../../src/Application/Queries/ListImagesQuery";
import { GetCandidateQuery } from "../../src/Application/Queries/GetCandidateQuery";
import { ImageAggregateFactory } from "../../src/Domain/Aggregates/ImageAggregateFactory";

describe("Handlers", () => {
    const baseImageRepo = {
        findById: async () => null as any,
        save: async () => {},
        delete: async () => {},
        exists: async () => false,
        getBySessionId: async () => [],
        getByOwnerId: async () => []
    };

    const baseCandidateRepo = {
        findById: async () => null as any,
        save: async () => {},
        delete: async () => {},
        exists: async () => false,
        getByImageId: async () => [],
        getSelectedCandidate: async () => null
    };

    describe("GenerateImageCommandHandler", () => {
        it("should create new image aggregate", async () => {
            const saved: any[] = [];
            const mockRepo = {
                ...baseImageRepo,
                findById: async () => null,
                save: async (a: any) => { saved.push(a); }
            };
            const handler = new GenerateImageCommandHandler(mockRepo);

            const command = new GenerateImageCommand(
                "ses-1",
                "owner-1",
                "a test prompt",
                "blurry",
                "textToImage",
                "16:9",
                1024,
                768,
                1,
                { roles: ["user"], permissions: ["write"] }
            );

            await handler.handle(command);
            expect(saved.length).toBe(1);
        });
    });

    describe("SelectCandidateCommandHandler", () => {
        it("should select candidate on existing aggregate", async () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            const saved: any[] = [];
            const mockRepo = {
                ...baseImageRepo,
                findById: async () => aggregate,
                save: async (a: any) => { saved.push(a); }
            };
            const handler = new SelectCandidateCommandHandler(mockRepo);

            const command = new SelectCandidateCommand("img-123", "cnd-456", "user-1", { roles: ["user"], permissions: ["write"] });
            await handler.handle(command);
            expect(saved.length).toBe(1);
        });

        it("should throw for missing image", async () => {
            const mockRepo = {
                ...baseImageRepo,
                findById: async () => null
            };
            const handler = new SelectCandidateCommandHandler(mockRepo);

            const command = new SelectCandidateCommand("img-999", "cnd-456", "user-1", { roles: ["user"], permissions: ["write"] });
            await expect(handler.handle(command)).rejects.toThrow("Image not found");
        });
    });

    describe("CompilePromptCommandHandler", () => {
        it("should compile prompt on existing aggregate", async () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            const saved: any[] = [];
            const mockRepo = {
                ...baseImageRepo,
                findById: async () => aggregate,
                save: async (a: any) => { saved.push(a); }
            };
            const handler = new CompilePromptCommandHandler(mockRepo);

            const command = new CompilePromptCommand("img-123", "compile me", "", [], [], [], { roles: ["user"], permissions: ["write"] });
            await handler.handle(command);
            expect(saved.length).toBe(1);
        });
    });

    describe("QueryHandlers", () => {
        it("GetImageQueryHandler should return DTO", async () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            const mockRepo = {
                ...baseImageRepo,
                findById: async () => aggregate
            };
            const handler = new GetImageQueryHandler(mockRepo);

            const query = new GetImageQuery("img-123");
            const result = await handler.handle(query);
            expect(result).toBeDefined();
            expect(result?.imageId).toBe("img-123");
        });

        it("GetImageQueryHandler should return null for missing image", async () => {
            const mockRepo = {
                ...baseImageRepo,
                findById: async () => null
            };
            const handler = new GetImageQueryHandler(mockRepo);

            const query = new GetImageQuery("img-999");
            const result = await handler.handle(query);
            expect(result).toBeNull();
        });

        it("ListImagesQueryHandler should return array", async () => {
            const mockRepo = {
                ...baseImageRepo,
                getByOwnerId: async () => []
            };
            const handler = new ListImagesQueryHandler(mockRepo);

            const query = new ListImagesQuery("owner-1");
            const result = await handler.handle(query);
            expect(result).toEqual([]);
        });

        it("GetCandidateQueryHandler should return null", async () => {
            const mockRepo = {
                ...baseCandidateRepo,
                findById: async () => null
            };
            const handler = new GetCandidateQueryHandler(mockRepo);

            const query = new GetCandidateQuery("img-123", "cnd-1");
            const result = await handler.handle(query);
            expect(result).toBeNull();
        });
    });
});
