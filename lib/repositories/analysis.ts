export type AnalysisTask = "explain" | "debug" | "review" | "test";

export type Citation = {
  endLine: number;
  path: string;
  startLine: number;
};

export type DemoAnalysis = {
  answer: string;
  citations: Citation[];
  mode: "demo";
  task: AnalysisTask;
};

type QualityMetricInput = {
  citedAnswers: number;
  positiveFeedback: number;
  responses: number;
  successfulRuns: number;
  totalRuns: number;
};

const DEMO_CONTENT: Record<
  AnalysisTask,
  { answer: string; citations: Citation[] }
> = {
  debug: {
    answer:
      "演示模式：请求失败最可能来自导入地址在进入下载层前没有被规范化。建议在边界完成白名单校验，并把超时与用户输入错误分开呈现。",
    citations: [
      { endLine: 44, path: "lib/repositories/ingestion.ts", startLine: 31 },
      {
        endLine: 39,
        path: "app/api/repositories/import/route.ts",
        startLine: 18,
      },
    ],
  },
  explain: {
    answer:
      "演示模式：导入流程先校验 GitHub HTTPS 地址，再生成受配额约束的文件清单；索引时保留文件路径和一基行号，因此分析结果可以回到原始代码。",
    citations: [
      { endLine: 76, path: "lib/repositories/ingestion.ts", startLine: 31 },
      { endLine: 116, path: "lib/repositories/ingestion.ts", startLine: 91 },
    ],
  },
  review: {
    answer:
      "演示模式：当前边界校验拒绝非 GitHub 主机、内嵌凭据、查询参数和异常路径。后续真实下载仍应禁用重定向并限制响应体，防止 SSRF 与资源耗尽。",
    citations: [
      { endLine: 76, path: "lib/repositories/ingestion.ts", startLine: 31 },
      { endLine: 89, path: "lib/repositories/ingestion.ts", startLine: 78 },
    ],
  },
  test: {
    answer:
      "演示模式：建议补充表驱动测试，覆盖大小写主机、尾部 .git、路径穿越、密钥后缀和零行分块等边界；这些测试应验证结果而不是内部调用顺序。",
    citations: [
      { endLine: 36, path: "tests/unit/repositories.test.ts", startLine: 8 },
      { endLine: 65, path: "tests/unit/repositories.test.ts", startLine: 38 },
    ],
  },
};

export function createDemoAnalysis(
  task: AnalysisTask,
  question: string
): DemoAnalysis {
  const prompt = question.trim();
  if (!prompt) {
    throw new Error("请输入要分析的问题");
  }

  const content = DEMO_CONTENT[task];
  return {
    ...content,
    answer: `${content.answer}\n\n你的问题：${prompt}`,
    mode: "demo",
    task,
  };
}

function percentage(numerator: number, denominator: number): number {
  if (denominator <= 0) {
    return 0;
  }
  return Math.round((Math.max(0, numerator) / denominator) * 100);
}

export function calculateQualityMetrics(input: QualityMetricInput) {
  return {
    citationCoverage: percentage(input.citedAnswers, input.responses),
    positiveFeedbackRate: percentage(input.positiveFeedback, input.responses),
    successRate: percentage(input.successfulRuns, input.totalRuns),
  };
}
