import { spawn } from "node:child_process";
import { INSPECTABLE, isInspectableName } from "@/lib/inspectable";

// 개발 모드 전용: 화면에서 고른 구성요소를 Claude Code(claude -p)로 수정한다.
// - 배포(production)에서는 404
// - 이 컴퓨터(localhost)에서 같은 사이트가 보낸 요청만 받음
// - 등록된 구성요소 파일만 대상으로 하고, Claude에게는 읽기·수정 도구만 허용 (명령 실행 불가)

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);
const MAX_PROMPT = 2000;
const TIMEOUT_MS = 5 * 60 * 1000;

function json(body: { ok: boolean; message: string }, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not Found", { status: 404 });
  }

  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  if (!LOCAL_HOSTS.has(url.hostname) || (origin && new URL(origin).host !== url.host)) {
    return json({ ok: false, message: "로컬 개발 화면에서만 사용할 수 있어요." }, 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "요청 형식이 올바르지 않아요." }, 400);
  }

  const { component, prompt } = (body ?? {}) as { component?: unknown; prompt?: unknown };
  if (!isInspectableName(component)) {
    return json({ ok: false, message: "수정할 수 없는 구성요소예요." }, 400);
  }
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > MAX_PROMPT) {
    return json({ ok: false, message: `요청 내용을 1~${MAX_PROMPT}자로 입력해 주세요.` }, 400);
  }

  const { label, file } = INSPECTABLE[component];
  const instruction = [
    `이 Next.js 프로젝트(링크나무)에서 "${label}" 구성요소(${component})를 수정해 줘.`,
    `대상 파일: ${file}`,
    "",
    "요청:",
    prompt.trim(),
    "",
    "규칙:",
    "- 가능하면 대상 파일만 수정하고, 꼭 필요할 때만 관련 파일을 함께 수정해.",
    "- 기존 Tailwind 색상 토큰(bg-card, text-muted, text-accent 등)과 모바일 우선 스타일을 유지해.",
    "- 수정을 마치면 무엇을 바꿨는지 한국어로 한두 문장만 답해.",
  ].join("\n");

  try {
    const message = await runClaude(instruction);
    return json({ ok: true, message });
  } catch (err) {
    return json({ ok: false, message: err instanceof Error ? err.message : String(err) }, 500);
  }
}

function runClaude(instruction: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const bin = process.env.CLAUDE_BIN || "claude";
    const child = spawn(
      bin,
      [
        "-p",
        "--output-format",
        "json",
        "--permission-mode",
        "acceptEdits",
        "--allowedTools",
        "Read,Edit,Glob,Grep",
        "--disallowedTools",
        "Bash,Write,WebFetch,WebSearch",
      ],
      { cwd: process.cwd(), windowsHide: true },
    );

    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("시간이 너무 오래 걸려서 중단했어요 (5분)."));
    }, TIMEOUT_MS);

    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(
        new Error(
          `Claude Code를 실행하지 못했어요: ${err.message}. claude 명령이 PATH에 있는지 확인하거나 .env.local에 CLAUDE_BIN 경로를 지정해 주세요.`,
        ),
      );
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      try {
        const parsed = JSON.parse(stdout) as { result?: string; is_error?: boolean };
        if (code === 0 && !parsed.is_error) {
          resolve(parsed.result?.trim() || "수정을 마쳤어요.");
          return;
        }
        reject(new Error(parsed.result || stderr.trim() || `Claude Code 종료 코드 ${code}`));
      } catch {
        reject(new Error(stderr.trim() || stdout.trim() || `Claude Code 종료 코드 ${code}`));
      }
    });

    child.stdin.end(instruction);
  });
}
