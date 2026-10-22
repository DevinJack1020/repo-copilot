"use client";

import { CircleUserRound, Settings2 } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  type AnalysisTask,
  createDemoAnalysis,
} from "@/lib/repositories/analysis";
import { validateGitHubRepositoryUrl } from "@/lib/repositories/ingestion";
import { AnalysisPanel } from "./analysis-panel";
import { EvidencePanel } from "./evidence-panel";
import { RepositoryPanel } from "./repository-panel";
import styles from "./workspace.module.css";

const DEFAULT_QUESTION = "检查仓库导入边界是否存在 SSRF 或敏感文件泄露风险";
const MAX_ZIP_SIZE = 15 * 1024 * 1024;

export function RepoWorkspace() {
  const [task, setTask] = useState<AnalysisTask>("review");
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [analysis, setAnalysis] = useState(() =>
    createDemoAnalysis("review", DEFAULT_QUESTION)
  );
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [importMessage, setImportMessage] = useState(
    "支持公开仓库；不会执行导入的代码。"
  );

  const handleAnalyze = useCallback(() => {
    try {
      setAnalysis(createDemoAnalysis(task, question));
      toast.success("分析完成，已生成 2 条代码引用");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "分析失败，请重试");
    }
  }, [question, task]);

  const handleImport = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        const normalized = validateGitHubRepositoryUrl(repositoryUrl);
        setImportMessage(
          `已通过安全校验：${normalized}（演示模式未发起网络下载）`
        );
        toast.success("仓库地址校验通过");
      } catch (error) {
        setImportMessage(
          error instanceof Error ? error.message : "仓库地址无效"
        );
      }
    },
    [repositoryUrl]
  );

  const handleUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (
      !(file.name.toLowerCase().endsWith(".zip") && file.size <= MAX_ZIP_SIZE)
    ) {
      setImportMessage("请选择不超过 15 MB 的 ZIP 文件");
      return;
    }
    setImportMessage(
      `已选择 ${file.name}；演示模式仅完成本地校验，不上传内容。`
    );
  }, []);

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className={styles.brandMark}>
            R/
          </span>
          <div>
            <p className="font-semibold tracking-tight">Repo Copilot</p>
            <p className={`${styles.muted} text-xs`}>
              让每条 AI 结论回到代码现场
            </p>
          </div>
        </div>
        <nav
          aria-label="主导航"
          className="flex items-center gap-1 overflow-x-auto"
        >
          {[
            ["工作台", true],
            ["分析记录", false],
            ["质量看板", false],
          ].map(([label, active]) => (
            <button
              className={`${styles.tab} ${active ? styles.tabActive : ""} px-3 py-2 text-sm`}
              key={String(label)}
              type="button"
            >
              {String(label)}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-teal-100 text-xs">
            <span aria-hidden="true" className={styles.statusDot} />
            演示服务正常
          </span>
          <button
            aria-label="设置"
            className={`${styles.secondaryAction} p-2`}
            type="button"
          >
            <Settings2 aria-hidden="true" size={17} />
          </button>
          <button
            aria-label="用户账户"
            className={`${styles.secondaryAction} p-2`}
            type="button"
          >
            <CircleUserRound aria-hidden="true" size={17} />
          </button>
        </div>
      </header>

      <div className={styles.workspaceGrid}>
        <RepositoryPanel
          importMessage={importMessage}
          onImport={handleImport}
          onUpload={handleUpload}
          repositoryUrl={repositoryUrl}
          setRepositoryUrl={setRepositoryUrl}
        />
        <AnalysisPanel
          analysis={analysis}
          onAnalyze={handleAnalyze}
          question={question}
          setQuestion={setQuestion}
          setTask={setTask}
          task={task}
        />
        <EvidencePanel analysis={analysis} />
      </div>
    </div>
  );
}
