import {
  CheckCircle2,
  Clock3,
  GitCommitHorizontal,
  MessageSquareText,
} from "lucide-react";
import type { DemoAnalysis } from "@/lib/repositories/analysis";
import styles from "./workspace.module.css";

type EvidencePanelProps = { analysis: DemoAnalysis };

export function EvidencePanel({ analysis }: EvidencePanelProps) {
  return (
    <aside aria-label="证据与质量指标" className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.eyebrow}>Evidence trail</p>
          <h2 className="mt-1 font-semibold">引用轨迹</h2>
        </div>
        <GitCommitHorizontal
          aria-hidden="true"
          className="text-teal-300"
          size={20}
        />
      </div>
      <div className="space-y-6 p-4">
        <ol className={`${styles.trace} space-y-5`}>
          <li className={`${styles.traceItem} relative`}>
            <p className="font-medium text-sm">检索完成</p>
            <p className={`${styles.muted} mt-1 text-xs`}>
              从 2,481 个代码块命中 12 个候选
            </p>
          </li>
          {analysis.citations.map((citation) => (
            <li
              className={`${styles.traceItem} relative`}
              key={`${citation.path}:${citation.startLine}`}
            >
              <p className="break-all font-mono text-teal-200 text-xs">
                {citation.path}
              </p>
              <p className={`${styles.muted} mt-1 font-mono text-[11px]`}>
                引用 L{citation.startLine}–L{citation.endLine}
              </p>
            </li>
          ))}
          <li className={`${styles.traceItem} relative`}>
            <p className="font-medium text-sm">回答已生成</p>
            <p className={`${styles.muted} mt-1 text-xs`}>
              演示网关 · 未向外部发送代码
            </p>
          </li>
        </ol>

        <section>
          <p className="mb-3 font-medium text-xs">今日质量</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["92%", "任务成功率", CheckCircle2],
              ["1.8s", "P50 响应", Clock3],
              ["87%", "引用覆盖", GitCommitHorizontal],
              ["76%", "正向反馈", MessageSquareText],
            ].map(([value, label, Icon]) => (
              <div className={`${styles.surface} p-3`} key={String(label)}>
                <Icon
                  aria-hidden="true"
                  className="mb-3 text-teal-300"
                  size={16}
                />
                <p className="font-mono font-semibold text-lg">
                  {String(value)}
                </p>
                <p className={`${styles.muted} mt-1 text-[11px]`}>
                  {String(label)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.surface} p-3`}>
          <p className="font-medium text-xs">数据说明</p>
          <p className={`${styles.muted} mt-2 text-xs leading-5`}>
            当前指标来自内置演示数据。连接 PostgreSQL 后将按用户与任务实时聚合。
          </p>
        </section>
      </div>
    </aside>
  );
}
