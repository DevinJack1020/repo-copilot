const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".output",
  ".turbo",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "target",
  "vendor",
]);

const BINARY_EXTENSIONS = new Set([
  ".7z",
  ".avi",
  ".class",
  ".dll",
  ".exe",
  ".gif",
  ".gz",
  ".ico",
  ".jpeg",
  ".jpg",
  ".mov",
  ".mp3",
  ".mp4",
  ".pdf",
  ".png",
  ".so",
  ".tar",
  ".webp",
  ".woff",
  ".woff2",
  ".zip",
]);

const SECRET_FILE_PATTERN =
  /(^|\/)(\.env($|\.)|id_rsa$|id_ed25519$|[^/]+\.(key|pem|p12|pfx)$)/i;

export type SourceChunk = {
  content: string;
  endLine: number;
  path: string;
  startLine: number;
};

export function validateGitHubRepositoryUrl(rawUrl: string): string {
  let url: URL;

  try {
    url = new URL(rawUrl.trim());
  } catch (error) {
    throw new Error("请输入有效的 GitHub 仓库地址", { cause: error });
  }

  if (
    url.protocol !== "https:" ||
    url.hostname.toLowerCase() !== "github.com" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error("仅支持不含凭据的 GitHub HTTPS 仓库地址");
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length !== 2) {
    throw new Error("仓库地址必须是 https://github.com/所有者/仓库名");
  }

  const [owner, repositoryWithSuffix] = segments;
  const repository = repositoryWithSuffix.replace(/\.git$/i, "");
  const validSegment = /^[A-Za-z0-9_.-]+$/;

  if (!(validSegment.test(owner) && validSegment.test(repository))) {
    throw new Error("仓库所有者或名称包含不支持的字符");
  }

  return `https://github.com/${owner}/${repository}`;
}

export function isIgnoredRepositoryPath(rawPath: string): boolean {
  const normalized = rawPath.replaceAll("\\", "/").replace(/^\.\//, "");
  const lowerPath = normalized.toLowerCase();
  const segments = lowerPath.split("/").filter(Boolean);

  if (segments.some((segment) => IGNORED_DIRECTORIES.has(segment))) {
    return true;
  }

  if (SECRET_FILE_PATTERN.test(lowerPath)) {
    return true;
  }

  const dotIndex = lowerPath.lastIndexOf(".");
  const extension = dotIndex >= 0 ? lowerPath.slice(dotIndex) : "";
  return BINARY_EXTENSIONS.has(extension);
}

export function chunkSource(
  path: string,
  source: string,
  maxLines = 80
): SourceChunk[] {
  if (!(Number.isInteger(maxLines) && maxLines > 0)) {
    throw new Error("每个代码块的行数必须是正整数");
  }

  const lines = source.split("\n");
  const chunks: SourceChunk[] = [];

  for (let index = 0; index < lines.length; index += maxLines) {
    const chunkLines = lines.slice(index, index + maxLines);
    chunks.push({
      content: chunkLines.join("\n"),
      endLine: index + chunkLines.length,
      path,
      startLine: index + 1,
    });
  }

  return chunks;
}
