import { FileCode2, FileJson2, FolderGit2, Upload } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { useCallback } from "react";
import styles from "./workspace.module.css";

const FILES = [
  ["app/api/demo/analyze/route.ts", "TS"],
  ["components/repo-copilot/workspace.tsx", "TSX"],
  ["lib/repositories/analysis.ts", "TS"],
  ["lib/repositories/ingestion.ts", "TS"],
  ["tests/unit/repositories.test.ts", "TEST"],
] as const;

type RepositoryPanelProps = {
  importMessage: string;
  onImport: (event: FormEvent<HTMLFormElement>) => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  repositoryUrl: string;
  setRepositoryUrl: (value: string) => void;
};

export function RepositoryPanel({
  importMessage,
  onImport,
  onUpload,
  repositoryUrl,
  setRepositoryUrl,
}: RepositoryPanelProps) {
  const handleRepositoryUrlChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRepositoryUrl(event.target.value);
    },
    [setRepositoryUrl]
  );
  return (
    <aside aria-label="仓库导入与文件树" className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.eyebrow}>Repository</p>
          <h2 className="mt-1 font-semibold">当前仓库</h2>
        </div>
        <FolderGit2 aria-hidden="true" className="text-teal-300" size={20} />
      </div>

      <div className="space-y-5 p-4">
        <div className={`${styles.surface} p-3`}>
          <p className="font-medium text-sm">vercel / next.js</p>
          <p className={`${styles.muted} mt-1 text-xs`}>
            演示仓库 · 已索引 2,481 个代码块
          </p>
          <div className="mt-3 flex gap-2 text-xs">
            <span className="rounded bg-teal-300/10 px-2 py-1 text-teal-200">
              TypeScript 81%
            </span>
            <span className="rounded bg-slate-700/50 px-2 py-1 text-slate-300">
              MDX 12%
            </span>
          </div>
        </div>

        <form className="space-y-2" onSubmit={onImport}>
          <label className="font-medium text-xs" htmlFor="repository-url">
            导入公开 GitHub 仓库
          </label>
          <input
            className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none placeholder:text-slate-600 focus:border-teal-300"
            id="repository-url"
            onChange={handleRepositoryUrlChange}
            placeholder="https://github.com/owner/repo"
            value={repositoryUrl}
          />
          <button
            className={`${styles.action} w-full px-3 py-2 text-sm`}
            type="submit"
          >
            校验并导入
          </button>
        </form>

        <label
          className={`${styles.secondaryAction} flex cursor-pointer items-center justify-center gap-2 px-3 py-2 text-sm`}
        >
          <Upload aria-hidden="true" size={16} />
          上传 ZIP（最大 15 MB）
          <input
            accept=".zip,application/zip"
            className="sr-only"
            onChange={onUpload}
            type="file"
          />
        </label>
        <p aria-live="polite" className={`${styles.muted} min-h-5 text-xs`}>
          {importMessage}
        </p>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-medium text-xs">文件树</p>
            <span className={`${styles.muted} font-mono text-[11px]`}>
              128 files
            </span>
          </div>
          <ul className="space-y-1 font-mono text-xs">
            {FILES.map(([path, kind]) => (
              <li
                className="flex items-start gap-2 rounded px-2 py-1.5 hover:bg-slate-800/70"
                key={path}
              >
                {kind === "TSX" ? (
                  <FileJson2
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-sky-300"
                    size={14}
                  />
                ) : (
                  <FileCode2
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-teal-300"
                    size={14}
                  />
                )}
                <span className="break-all text-slate-300">{path}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
