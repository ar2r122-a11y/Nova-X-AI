import { describe, it, expect } from "vitest";
import { GetImageQueryHandler } from "../../src/Application/QueryHandlers/ImageQueryHandlers";
import { ListImagesQueryHandler } from "../../src/Application/QueryHandlers/ImageQueryHandlers";
import { GetCandidateQueryHandler } from "../../src/Application/QueryHandlers/ImageQueryHandlers";
import { GetRenderJobQueryHandler } from "../../src/Application/QueryHandlers/ImageQueryHandlers";
import { ListRenderJobsQueryHandler } from "../../src/Application/QueryHandlers/ImageQueryHandlers";
import { GetImageQuery } from "../../src/Application/Queries/GetImageQuery";
import { ListImagesQuery } from "../../src/Application/Queries/ListImagesQuery";
import { GetCandidateQuery } from "../../src/Application/Queries/GetCandidateQuery";
import { GetRenderJobQuery } from "../../src/Application/Queries/GetRenderJobQuery";
import { ListRenderJobsQuery } from "../../src/Application/Queries/ListRenderJobsQuery";
import { ImageAggregate } from "../../src/Domain/Aggregates/ImageAggregate";
import { ImageId } from "../../src/Domain/ValueObjects/ImageId";
import { ResourceBudget } from "../../src/Domain/ValueObjects/ResourceBudget";
import { GenerationType } from "../../src/Domain/ValueObjects/GenerationType";
import { ModelIdentifier } from "../../src/Domain/ValueObjects/ModelIdentifier";
import { ImageDimensions } from "../../src/Domain/ValueObjects/ImageDimensions";
import { ImageStyle } from "../../src/Domain/ValueObjects/ImageStyle";
import { AssetProvenance } from "../../src/Domain/ValueObjects/AssetProvenance";
import { ProviderId } from "../../src/Domain/ValueObjects/ProviderId";
import { SessionId } from "../../src/Domain/ValueObjects/SessionId";

describe("QueryLatency", () => {
    const createAggregate = () => {
        return ImageAggregate.create(
            ImageId.fromString("img-1"),
            SessionId.fromString("ses-1"),
            GenerationType.TEXT_TO_IMAGE,
            "provider-1",
            ModelIdentifier.create("model", "v1"),
            ImageDimensions.create(1024, 768),
            ImageStyle.PHOTOREALISTIC,
            ResourceBudget.create(8192, 16384, 60000, 4096),
            "test",
            AssetProvenance.create("hash", ModelIdentifier.create("model", "v1"), ProviderId.create(), "ses-1")
        );
    };

    it("GetImageQueryHandler should return within target latency", async () => {
        const mockRepo = {
            findById: async () => createAggregate(),
            save: async () => {},
            delete: async () => {},
            exists: async () => false,
            getBySessionId: async () => [],
            getByOwnerId: async () => []
        };
        const handler = new GetImageQueryHandler(mockRepo);
        const query = new GetImageQuery("img-1");
        const start = Date.now();
        const result = await handler.handle(query);
        const elapsed = Date.now() - start;
        expect(result).toBeDefined();
        expect(elapsed).toBeLessThan(100);
    });

    it("ListImagesQueryHandler should return within target latency", async () => {
        const mockRepo = {
            findById: async () => null,
            save: async () => {},
            delete: async () => {},
            exists: async () => false,
            getBySessionId: async () => [],
            getByOwnerId: async () => []
        };
        const handler = new ListImagesQueryHandler(mockRepo);
        const query = new ListImagesQuery("owner-1");
        const start = Date.now();
        const result = await handler.handle(query);
        const elapsed = Date.now() - start;
        expect(result).toEqual([]);
        expect(elapsed).toBeLessThan(100);
    });

    it("GetCandidateQueryHandler should return within target latency", async () => {
        const mockRepo = {
            findById: async () => null,
            save: async () => {},
            delete: async () => {},
            exists: async () => false,
            getByImageId: async () => [],
            getSelectedCandidate: async () => null
        };
        const handler = new GetCandidateQueryHandler(mockRepo);
        const query = new GetCandidateQuery("img-1", "cnd-1");
        const start = Date.now();
        const result = await handler.handle(query);
        const elapsed = Date.now() - start;
        expect(result).toBeNull();
        expect(elapsed).toBeLessThan(100);
    });

    it("GetRenderJobQueryHandler should return within target latency", async () => {
        const mockRepo = {
            findById: async () => null,
            save: async () => {},
            delete: async () => {},
            exists: async () => false,
            getByImageId: async () => [],
            getActiveJobs: async () => []
        };
        const handler = new GetRenderJobQueryHandler(mockRepo);
        const query = new GetRenderJobQuery("ren-1");
        const start = Date.now();
        const result = await handler.handle(query);
        const elapsed = Date.now() - start;
        expect(result).toBeNull();
        expect(elapsed).toBeLessThan(100);
    });

    it("ListRenderJobsQueryHandler should return within target latency", async () => {
        const mockRepo = {
            findById: async () => null,
            save: async () => {},
            delete: async () => {},
            exists: async () => false,
            getByImageId: async () => [],
            getActiveJobs: async () => []
        };
        const handler = new ListRenderJobsQueryHandler(mockRepo);
        const query = new ListRenderJobsQuery("img-1");
        const start = Date.now();
        const result = await handler.handle(query);
        const elapsed = Date.now() - start;
        expect(result).toEqual([]);
        expect(elapsed).toBeLessThan(100);
    });
});
