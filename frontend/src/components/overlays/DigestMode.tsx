import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { useLayoutStore } from '../../stores/useLayoutStore';
import { useDigest } from '../../hooks/useDigest';
import type { WatchUrgency, StoryArcSeverity } from '../../types/digest';

// ── Chat constants ────────────────────────────────────────────────────────────

const ANALYST_INITIAL =
  'Intelligence brief loaded. Iran Crisis — Day 2. Threat level CRITICAL (92/100). ' +
  'I have full situational awareness across 247 active signals. What would you like to analyse?';

const ANALYST_HORMUZ_Q =
  'What is the probability of Hormuz closure and what are the key indicators to watch?';

const ANALYST_HORMUZ_A =
  'Hormuz partial closure probability sits at 72% within a 24–72h window. ' +
  'IRGC has three escalation options: (1) Mine-laying operations — most likely, low risk for Iran, ' +
  'maximum disruption; elevated small-craft activity already confirmed at Bandar Abbas depot. ' +
  '(2) FAC swarm harassment — 8 fast attack boats already deployed in current deterrence posture. ' +
  '(3) Shore-to-ship missile targeting — highest escalation risk, would trigger immediate USN response. ' +
  'Even the credible threat alone has rerouted 4 tankers via Cape of Good Hope (+10 days transit). ' +
  'War risk insurance premiums have tripled in 12h. ' +
  'Key watchpoint: if mine-laying vessels depart Bandar Abbas, close probability moves above 95%.';

const ANALYST_CANNED =
  'Analysing current signal traffic… Cross-referencing OSINT, SIGINT patterns, and historical precedent. ' +
  'Assessment updated. Monitor the UNSC emergency session (convening in ~4h) and Omani/Qatari back-channel ' +
  'communications — these are the key diplomatic off-ramps available right now.';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatMsg {
  id: number;
  role: 'sys' | 'usr';
  text: string;
  typewrite: boolean;
}

// ── TypewriterText ────────────────────────────────────────────────────────────

function TypewriterText({ text, startDelay = 400 }: { text: string; startDelay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef   = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const done = displayed.length >= text.length && text.length > 0;

  useEffect(() => {
    setDisplayed('');
    indexRef.current = 0;

    const timer = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        indexRef.current += 1;
        setDisplayed(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 8);
    }, startDelay);

    return () => {
      clearTimeout(timer);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, startDelay]);

  return (
    <>
      {displayed}
      <span
        style={{
          display: 'inline-block',
          width: '0.5em',
          opacity: done ? 0 : 1,
          animation: done ? 'none' : 'blink 1s step-end infinite',
          color: '#00CCFF',
        }}
      >
        ▋
      </span>
    </>
  );
}

// ── Color helpers ─────────────────────────────────────────────────────────────

function probColor(p: number): string {
  if (p >= 0.85) return '#FF2040';
  if (p >= 0.65) return '#FF6020';
  if (p >= 0.45) return '#F5A020';
  return '#4E6480';
}

function probBg(p: number): string {
  if (p >= 0.85) return 'rgba(255,32,64,0.14)';
  if (p >= 0.65) return 'rgba(255,96,32,0.12)';
  if (p >= 0.45) return 'rgba(245,160,32,0.10)';
  return 'rgba(78,100,128,0.10)';
}

function urgencyStyle(u: WatchUrgency): CSSProperties {
  switch (u) {
    case 'IMMINENT':
      return { background: 'rgba(255,32,64,0.15)',  color: '#FF2040', border: '1px solid rgba(255,32,64,0.4)'  };
    case 'HIGH':
      return { background: 'rgba(255,96,32,0.12)',  color: '#FF6020', border: '1px solid rgba(255,96,32,0.35)' };
    case 'ELEVATED':
      return { background: 'rgba(245,160,32,0.10)', color: '#F5A020', border: '1px solid rgba(245,160,32,0.3)' };
    case 'MONITOR':
      return { background: 'rgba(78,100,128,0.10)', color: '#4E6480', border: '1px solid rgba(78,100,128,0.25)' };
  }
}

function arcAccent(severity: StoryArcSeverity): string {
  switch (severity) {
    case 'crit': return '#FF2040';
    case 'high': return '#FF6020';
    case 'eco':  return '#00D878';
    case 'cyb':  return '#CC44FF';
  }
}

// Converts #RRGGBB → rgba(r,g,b,alpha)
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── DigestMode ────────────────────────────────────────────────────────────────

export default function DigestMode() {
  const { setDigestOpen } = useLayoutStore();
  const { data: digest }  = useDigest();

  // ── Chat state ──────────────────────────────────────────────────────────────
  const nextIdRef = useRef(3);
  const chatRef   = useRef<HTMLDivElement>(null);
  const [inputVal,   setInputVal]   = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 0, role: 'sys', text: ANALYST_INITIAL,  typewrite: true  },
    { id: 1, role: 'usr', text: ANALYST_HORMUZ_Q, typewrite: false },
    { id: 2, role: 'sys', text: ANALYST_HORMUZ_A, typewrite: false },
  ]);

  // ESC key + body scroll lock
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDigestOpen(false);
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [setDigestOpen]);

  // Auto-scroll chat on new messages / thinking state
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // ── Send handler ─────────────────────────────────────────────────────────────
  function handleSend() {
    const text = inputVal.trim();
    if (!text || isThinking) return;

    const usrId = nextIdRef.current++;
    const sysId = nextIdRef.current++;

    setMessages((prev) => [...prev, { id: usrId, role: 'usr', text, typewrite: false }]);
    setInputVal('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        { id: sysId, role: 'sys', text: ANALYST_CANNED, typewrite: true },
      ]);
    }, 1200);
  }

  // Loading guard
  if (!digest) return null;

  const { temporal, storyArcs, watchItems } = digest;

  return (
    <div className="dm-overlay" role="dialog" aria-modal="true" aria-label="Intelligence Digest">
      <div className="dm-container">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="dm-head">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="dm-mode-label">◉ INTELLIGENCE DIGEST</div>
            <div className="dm-timestamp">{digest.timestamp}</div>
            <div className="dm-headline">{digest.headline}</div>
            <div className="dm-subline">{digest.subline}</div>
          </div>
          <button
            className="dm-close"
            onClick={() => setDigestOpen(false)}
            title="Close (Esc)"
            aria-label="Close digest"
          >
            ✕
          </button>
        </div>

        {/* ── Threat Level Card ────────────────────────────────────────────── */}
        <div className="dm-threat">
          <div className="dm-threat-num-wrap">
            <div className="dm-threat-num">{digest.threatLevel}</div>
            <div className="dm-threat-lbl">{digest.threatLabel}</div>
          </div>
          <div className="dm-threat-body">
            <div className="dm-threat-text">{digest.threatSummary}</div>
            <div className="dm-threat-metrics">{digest.threatMetrics}</div>
          </div>
        </div>

        {/* ── Temporal Triage ──────────────────────────────────────────────── */}
        <div className="dm-section-title">TEMPORAL TRIAGE</div>
        <div className="dm-temporal">

          {/* PAST */}
          <div className="dt-col">
            <div className="dt-col-head">
              <span className="dt-col-icon">◀</span>
              <span className="dt-col-title">WHAT HAPPENED</span>
            </div>
            <div className="dt-col-body">
              {temporal.past.map((item, i) => (
                <div key={i} className="dt-item">
                  <span className="dt-item-time">{item.time}</span>
                  <span className="dt-item-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* NOW */}
          <div className="dt-col dt-col-now">
            <div className="dt-col-head">
              <span className="dt-col-icon" style={{ color: '#00F080' }}>●</span>
              <span className="dt-col-title" style={{ color: '#00F080' }}>HAPPENING NOW</span>
            </div>
            <div className="dt-col-body">
              {temporal.now.map((item, i) => (
                <div key={i} className="dt-item">
                  {item.isActive && <span className="dt-active-tag">LIVE</span>}
                  <span className="dt-item-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* NEXT */}
          <div className="dt-col dt-col-next">
            <div className="dt-col-head">
              <span className="dt-col-icon" style={{ color: '#00CCFF' }}>▶</span>
              <span className="dt-col-title" style={{ color: '#00CCFF' }}>WHAT COMES NEXT</span>
            </div>
            <div className="dt-col-body">
              {temporal.next.map((item, i) => (
                <div key={i} className="dt-item">
                  <span
                    className="dt-prob"
                    style={{
                      color:      probColor(item.probability ?? 0),
                      background: probBg(item.probability ?? 0),
                      border:     `1px solid ${probColor(item.probability ?? 0)}40`,
                    }}
                  >
                    {Math.round((item.probability ?? 0) * 100)}%
                  </span>
                  <span className="dt-item-text">{item.text}</span>
                  {item.timeframe && (
                    <span className="dt-impact-tag">{item.timeframe}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>{/* /dm-temporal */}

        {/* ── Story Arcs ───────────────────────────────────────────────────── */}
        <div className="dm-section-title">STORY ARCS — CAUSE &amp; EFFECT</div>
        <div className="dm-stories">
          {storyArcs.map((arc, i) => (
            <div key={i} className={`story-card story-card-${arc.severity}`}>

              <div className="story-card-title" style={{ color: arcAccent(arc.severity) }}>
                {arc.title}
              </div>

              {/* Cause → Effect chain */}
              <div className="story-chain">
                {arc.chain.map((node, j) => {
                  const nodeColor = arc.chainColors[j] ?? '#4E6480';
                  return (
                    <span key={j} style={{ display: 'contents' }}>
                      <span
                        className="story-node"
                        style={{
                          color:      nodeColor,
                          background: hexToRgba(nodeColor.length === 7 ? nodeColor : '#4E6480', 0.12),
                          border:     `1px solid ${hexToRgba(nodeColor.length === 7 ? nodeColor : '#4E6480', 0.3)}`,
                        }}
                      >
                        {node}
                      </span>
                      {j < arc.chain.length - 1 && (
                        <span className="story-arrow">→</span>
                      )}
                    </span>
                  );
                })}
              </div>

              <p className="story-body">{arc.body}</p>

              <div className="story-so-what">
                <div className="story-so-what-label">SO WHAT?</div>
                <div className="story-so-what-text">{arc.soWhat}</div>
              </div>

            </div>
          ))}
        </div>

        {/* ── What To Watch ────────────────────────────────────────────────── */}
        <div className="dm-section-title">WHAT TO WATCH</div>
        <div className="dm-pulse">
          {watchItems.map((item) => (
            <div key={item.rank} className="pulse-item">
              <span className="pulse-num">{item.rank}</span>
              <div className="pulse-content">
                <div className="pulse-title">{item.text}</div>
                <div className="pulse-why">{item.rationale}</div>
              </div>
              <span className="pulse-urgency" style={urgencyStyle(item.urgency)}>
                {item.urgency}
              </span>
            </div>
          ))}
        </div>

        {/* ── Ask the Analyst ──────────────────────────────────────────────── */}
        <div className="dm-section-title">ASK THE ANALYST</div>
        <div className="dm-analyst">
          <div className="analyst-box">

            {/* Header */}
            <div className="analyst-hdr">
              <div className="analyst-avatar">AI</div>
              <div>
                <div className="analyst-name">WIM ANALYST</div>
                <div className="analyst-online">● ONLINE · CLEARANCE LEVEL 5</div>
              </div>
            </div>

            {/* Chat history */}
            <div className="analyst-chat" ref={chatRef}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={msg.role === 'sys' ? 'analyst-msg-sys' : 'analyst-msg-usr'}
                >
                  <div className={msg.role === 'sys' ? 'analyst-bubble-sys' : 'analyst-bubble-usr'}>
                    {msg.typewrite
                      ? <TypewriterText text={msg.text} startDelay={msg.id === 0 ? 600 : 200} />
                      : msg.text
                    }
                  </div>
                </div>
              ))}

              {/* Thinking indicator */}
              {isThinking && (
                <div className="analyst-msg-sys">
                  <div className="analyst-bubble-sys analyst-thinking">Analysing…</div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="analyst-input-row">
              <input
                className="analyst-input"
                type="text"
                placeholder="Ask about any aspect of the crisis…"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                disabled={isThinking}
                autoComplete="off"
              />
              <button
                className="analyst-send"
                onClick={handleSend}
                disabled={isThinking || !inputVal.trim()}
              >
                SEND
              </button>
            </div>

          </div>
        </div>

      </div>{/* /dm-container */}
    </div>
  );
}
