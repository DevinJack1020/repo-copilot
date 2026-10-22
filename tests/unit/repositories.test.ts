import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateQualityMetrics,
  createDemoAnalysis,
} from "../../lib/repositories/analysis";
import {
  chunkSource,
  isIgnoredRepositoryPath,
  validateGitHubRepositoryUrl,
} from "../../lib/repositories/ingestion";

describe("validateGitHubRepositoryUrl", () => {
  it("normalizes an HTTPS GitHub repository URL", () => {
    assert.equal(
      validateGitHubRepositoryUrl("https://github.com/vercel/next.js.git"),
      "https://github.com/vercel/next.js"
    );
  });

  it("rejects non-GitHub hosts and embedded credentials", () => {
    assert.throws(() =>
      validateGitHubRepositoryUrl("https://github.example.com/acme/repo")
    );
    assert.throws(() =>
      validateGitHubRepositoryUrl("https://user:token@github.com/acme/repo")
    );
  });
});

describe("repository file filtering", () => {
  it("filters secrets, dependencies, builds, and binary assets", () => {
    for (const path of [
      ".env",
      "config/prod.pem",
      "node_modules/react/index.js",
      "dist/server.js",
      "public/logo.png",
    ]) {
      assert.equal(isIgnoredRepositoryPath(path), true, path);
    }
    assert.equal(isIgnoredRepositoryPath("src/app.ts"), false);
  });
});

describe("chunkSource", () => {
  it("preserves one-based line ranges", () => {
    const chunks = chunkSource(
      "src/math.ts",
      [
        "export function add(a: number, b: number) {",
        "  return a + b;",
        "}",
        "",
        "export const version = 1;",
      ].join("\n"),
      3
    );

    assert.deepEqual(
      chunks.map(({ startLine, endLine }) => ({ endLine, startLine })),
      [
        { endLine: 3, startLine: 1 },
        { endLine: 5, startLine: 4 },
      ]
    );
  });
});

describe("demo analysis", () => {
  it("returns a Chinese answer with file and line citations", () => {
    const result = createDemoAnalysis("review", "检查输入校验");

    assert.match(result.answer, /演示模式/);
    assert.equal(result.citations.length > 0, true);
    assert.match(result.citations[0].path, /\.(ts|tsx)$/);
    assert.equal(result.citations[0].startLine > 0, true);
  });

  it("calculates dashboard rates without dividing by zero", () => {
    assert.deepEqual(
      calculateQualityMetrics({
        citedAnswers: 7,
        positiveFeedback: 4,
        responses: 10,
        successfulRuns: 8,
        totalRuns: 10,
      }),
      {
        citationCoverage: 70,
        positiveFeedbackRate: 40,
        successRate: 80,
      }
    );
    assert.deepEqual(
      calculateQualityMetrics({
        citedAnswers: 0,
        positiveFeedback: 0,
        responses: 0,
        successfulRuns: 0,
        totalRuns: 0,
      }),
      {
        citationCoverage: 0,
        positiveFeedbackRate: 0,
        successRate: 0,
      }
    );
  });
});
