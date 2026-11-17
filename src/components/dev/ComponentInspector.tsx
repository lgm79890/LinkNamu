"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { INSPECTABLE, isInspectableName, type InspectableName } from "@/lib/inspectable";

// 개발 모드 전용: 화면의 구성요소를 표시하고, 클릭한 구성요소를 프롬프트로 수정 요청한다.

type Box = { el: Element; name: InspectableName; top: number; left: number; width: number; height: number };
type Status =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "done"; message: string }
  | { kind: "error"; message: string };

const SELECTOR = "[data-inspect]";

function findInspectable(target: EventTarget | null): HTMLElement | SVGElement | null {
  if (!(target instanceof Element)) return null;
  if (target.closest("[data-inspector-ui]")) return null;
  const el = target.closest(SELECTOR);
  return el instanceof HTMLElement || el instanceof SVGElement ? el : null;
}

function toBox(el: Element): Box | null {
  const name = el.getAttribute("data-inspect");
  if (!isInspectableName(name)) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return null;
  return { el, name, top: r.top, left: r.left, width: r.width, height: r.height };
}

export default function ComponentInspector() {
  const [active, setActive] = useState(false);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [hovered, setHovered] = useState<Element | null>(null);
  const [selected, setSelected] = useState<Element | null>(null);
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 켜져 있는 동안 구성요소 위치를 계속 갱신 (스크롤·크기 변경·HMR 반영)
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const tick = () => {
      const next: Box[] = [];
      document.querySelectorAll(SELECTOR).forEach((el) => {
        const box = toBox(el);
        if (box) next.push(box);
      });
      setBoxes(next);
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [active]);

  const close = useCallback(() => {
    setSelected(null);
    setPrompt("");
    setStatus({ kind: "idle" });
  }, []);

  // 마우스 위치 추적과 클릭 가로채기 (켜져 있을 때 링크가 열리지 않게)
  useEffect(() => {
    if (!active) return;

    const onMove = (e: MouseEvent) => setHovered(findInspectable(e.target));
    const onClick = (e: MouseEvent) => {
      const el = findInspectable(e.target);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      setSelected(el);
      setPrompt("");
      setStatus({ kind: "idle" });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selected) close();
      else setActive(false);
    };

    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [active, selected, close]);

  useEffect(() => {
    if (selected) textareaRef.current?.focus();
  }, [selected]);

  const selectedName = selected?.getAttribute("data-inspect");
  const selectedBox = selected?.isConnected ? toBox(selected) : null;

  async function submit() {
    if (!isInspectableName(selectedName) || !prompt.trim()) return;
    setStatus({ kind: "running" });
    try {
      const res = await fetch("/api/dev/edit-component", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ component: selectedName, prompt: prompt.trim() }),
      });
      const data = (await res.json()) as { ok: boolean; message: string };
      setStatus(data.ok ? { kind: "done", message: data.message } : { kind: "error", message: data.message });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }

  // 편집 상자 위치: 선택한 요소 아래, 화면 밖으로 나가지 않게
  const panelWidth = 320;
  const panelStyle: React.CSSProperties = (() => {
    if (!selectedBox || typeof window === "undefined") {
      return { left: 16, bottom: 72 };
    }
    const left = Math.min(
      Math.max(8, selectedBox.left),
      Math.max(8, window.innerWidth - panelWidth - 8),
    );
    const below = selectedBox.top + selectedBox.height + 8;
    const top = below + 220 > window.innerHeight ? Math.max(8, selectedBox.top - 228) : below;
    return { left, top };
  })();

  return (
    <div data-inspector-ui style={{ fontFamily: "system-ui, sans-serif" }}>
      {active &&
        boxes.map((box, i) => {
          const isHover = box.el === hovered || box.el === selected;
          return (
            <div
              key={`${box.name}-${i}`}
              aria-hidden
              style={{
                position: "fixed",
                top: box.top,
                left: box.left,
                width: box.width,
                height: box.height,
                pointerEvents: "none",
                zIndex: 9998,
                outline: isHover ? "2px solid #2563eb" : "1px dashed rgba(37,99,235,0.55)",
                background: isHover ? "rgba(37,99,235,0.08)" : "transparent",
                borderRadius: 4,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: box.top < 18 ? 0 : -18,
                  left: 0,
                  padding: "1px 6px",
                  fontSize: 11,
                  lineHeight: "16px",
                  whiteSpace: "nowrap",
                  color: "#fff",
                  background: isHover ? "#2563eb" : "rgba(37,99,235,0.75)",
                  borderRadius: 3,
                }}
              >
                {INSPECTABLE[box.name].label} · {box.name}
              </span>
            </div>
          );
        })}

      {active && selected && isInspectableName(selectedName) && (
        <div
          role="dialog"
          aria-label={`${INSPECTABLE[selectedName].label} 수정 요청`}
          style={{
            position: "fixed",
            zIndex: 10000,
            width: panelWidth,
            maxWidth: "calc(100vw - 16px)",
            padding: 12,
            borderRadius: 12,
            background: "#ffffff",
            color: "#111827",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            border: "1px solid #e5e7eb",
            ...panelStyle,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            {INSPECTABLE[selectedName].label}{" "}
            <span style={{ fontWeight: 400, color: "#6b7280" }}>({selectedName})</span>
          </div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
            {INSPECTABLE[selectedName].file}
          </div>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
            }}
            disabled={status.kind === "running"}
            placeholder="예: 배경을 연한 노란색으로 바꿔줘"
            rows={3}
            style={{
              marginTop: 8,
              width: "100%",
              resize: "vertical",
              padding: 8,
              fontSize: 13,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              color: "#111827",
              background: "#fff",
            }}
          />
          {status.kind === "running" && (
            <p style={{ fontSize: 12, color: "#2563eb", marginTop: 6 }}>
              Claude가 수정하는 중… (보통 수십 초 걸려요)
            </p>
          )}
          {status.kind === "done" && (
            <p style={{ fontSize: 12, color: "#047857", marginTop: 6, whiteSpace: "pre-wrap", maxHeight: 120, overflow: "auto" }}>
              ✓ {status.message}
            </p>
          )}
          {status.kind === "error" && (
            <p style={{ fontSize: 12, color: "#b91c1c", marginTop: 6, whiteSpace: "pre-wrap", maxHeight: 120, overflow: "auto" }}>
              ⚠ {status.message}
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <button
              type="button"
              onClick={close}
              style={{ fontSize: 13, padding: "6px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", color: "#111827" }}
            >
              닫기
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={status.kind === "running" || !prompt.trim()}
              style={{
                fontSize: 13,
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                background: status.kind === "running" || !prompt.trim() ? "#93c5fd" : "#2563eb",
                color: "#fff",
              }}
            >
              {status.kind === "running" ? "수정 중…" : "수정 요청"}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setActive((v) => !v);
          close();
        }}
        aria-pressed={active}
        title="구성요소를 클릭해 수정 요청 (Esc로 끄기)"
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 10001,
          padding: "8px 14px",
          fontSize: 13,
          fontWeight: 600,
          borderRadius: 999,
          border: "none",
          color: "#fff",
          background: active ? "#2563eb" : "#111827",
          boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          cursor: "pointer",
        }}
      >
        {active ? "구성요소 편집 끄기" : "구성요소 편집"}
      </button>
    </div>
  );
}
