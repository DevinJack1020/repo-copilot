import {
  ArrowUp,
  Bug,
  FileSearch,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";
import type { ChangeEvent, MouseEvent } from "react";
import { useCallback } from "react";
import type { AnalysisTask, DemoAnalysis } from "@/lib/repositories/analysis";
import styles from "./workspace.module.css";

const TASKS: { icon: typeof FileSearch; id: AnalysisTask; label: string }[] = [
  { icon: FileSearch, id: "explain", label: "解释代码" },
  { icon: Bug, id: "debug", label: "定位错误" },
  { icon: ShieldCheck, id: "review", label: "代码审查" },
  { icon: FlaskConical, id: "test", label: "生成测试" },
];

type AnalysisPanelProps = {
  analysis: DemoAnalysis;
  onAnalyze: () => void;
  question: string;
  setQuestion: (value: string) => void;
  setTask: (task: AnalysisTask) => void;
  task: AnalysisTask;
};

export function AnalysisPanel(props: AnalysisPanelProps) {
  const { analysis, onAnalyze, question, setQuestion, setTask, task } = props;
  const handleTaskClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setTask(event.currentTarget.dataset.task as AnalysisTask);
    },
    [setTask]
  );
  const handleQuestionChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setQuestion(event.target.value);
    },
    [setQuestion]
  );
  return (
    <main className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.eyebrow}>Analysis workspace</p>
          <h1 className="mt-1 font-semibold text-lg">仓库分析工作台</h1>
        </div>
        <span className="rounded border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-amber-200 text-xs">
          演示模式
        </span>
      </div>

      <div className="space-y-5 p-4 md:p-6">
        <fieldset
          aria-label="分析任务"
          className="grid grid-cols-2 gap-2 md:grid-cols-4"
        >
          <legend className="sr-only">选择分析任务</legend>
          {TASKS.map(({ icon: Icon, id, label }) => (
            <button
              aria-pressed={task === id}
              className={`${styles.secondaryAction} flex items-center justify-center gap-2 px-3 py-2 text-xs ${task === id ? "border-teal-300 bg-teal-300/10 text-teal-100" : ""}`}
              data-task={id}
              key={id}
              onClick={handleTaskClick}
              type="button"
            >
              <Icon aria-hidden="true" size={15} />
              {label}
            </button>
          ))}
        </fieldset>

        <section className={`${styles.surface} p-4`}>
          <label className="font-medium text-sm" htmlFor="analysis-question">
            你想从代码中确认什么？
          </label>
          <textarea
            className="mt-3 min-h-24 w-full resize-y rounded-md border border-slate-700 bg-slate-950/70 p-3 text-sm outline-none placeholder:text-slate-600 focus:border-teal-300"
            id="analysis-question"
            onChange={handleQuestionChange}
            placeholder="例如：检查仓库导入接口是否存在 SSRF 风险"
            value={question}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className={`${styles.muted} text-xs`}>
              仅检索当前仓库，不执行任何代码
            </p>
            <button
              className={`${styles.action} flex items-center gap-2 px-4 py-2 text-sm`}
              onClick={onAnalyze}
              type="button"
            >
              开始分析
              <ArrowUp aria-hidden="true" size={15} />
            </button>
          </div>
        </section>

        <section aria-live="polite" className={`${styles.surface} p-4 md:p-5`}>
          <div className="flex items-center justify-between gap-3 border-slate-700 border-b pb-3">
            <div>
              <p className={styles.eyebrow}>Answer</p>
              <h2 className="mt-1 font-semibold">带证据的分析结果</h2>
            </div>
            <span className={`${styles.muted} font-mono text-xs`}>
              1.8s · 2 citations
            </span>
          </div>
          <p className="mt-4 whitespace-pre-line text-slate-200 text-sm leading-7">
            {analysis.answer}
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {analysis.citations.map((citation) => (
              <button
                className={`${styles.secondaryAction} p-3 text-left`}
                key={`${citation.path}:${citation.startLine}`}
                type="button"
              >
                <span className="block truncate font-mono text-teal-200 text-xs">
                  {citation.path}
                </span>
                <span
                  className={`${styles.muted} mt-1 block font-mono text-[11px]`}
                >
                  L{citation.startLine}–L{citation.endLine}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
