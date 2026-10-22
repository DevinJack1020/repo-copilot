import { type NextRequest, NextResponse } from "next/server";
import {
  type AnalysisTask,
  createDemoAnalysis,
} from "@/lib/repositories/analysis";

const TASKS = new Set<AnalysisTask>(["explain", "debug", "review", "test"]);

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  if (!(body && typeof body === "object")) {
    return NextResponse.json(
      { error: "请求体必须是 JSON 对象" },
      { status: 400 }
    );
  }

  const { question, task } = body as { question?: unknown; task?: unknown };
  if (!(typeof task === "string" && TASKS.has(task as AnalysisTask))) {
    return NextResponse.json({ error: "不支持的分析任务" }, { status: 400 });
  }
  if (typeof question !== "string" || question.trim().length === 0) {
    return NextResponse.json({ error: "请输入要分析的问题" }, { status: 400 });
  }
  if (question.length > 2000) {
    return NextResponse.json(
      { error: "问题不能超过 2000 个字符" },
      { status: 413 }
    );
  }

  return NextResponse.json(createDemoAnalysis(task as AnalysisTask, question));
}
