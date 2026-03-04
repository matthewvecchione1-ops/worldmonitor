# W·I·M — AI Integration Architecture
## Claude & Grok Analyst System

---

## Overview

WIM includes an AI-powered intelligence analyst that can answer natural language questions about the current geopolitical situation. The analyst is context-aware — it knows what's happening in the world right now because WIM injects current intelligence data into every prompt.

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│ FRONTEND                                         │
│                                                  │
│  User types: "How does Hormuz connect to         │
│               the energy crisis?"                │
│                                                  │
│  AnalystChat.tsx → POST /api/analyst/ask          │
│  Streams response → typewriter effect             │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────┴─────────────────────────────┐
│ BACKEND — /api/analyst/ask                       │
│                                                  │
│  1. Receive user question                        │
│  2. Build context payload:                       │
│     - Current threat levels                      │
│     - Active signals (last 24h)                  │
│     - Market data snapshot                       │
│     - Country scores                             │
│     - Focused country dossier (if any)           │
│  3. Construct system prompt + context + question  │
│  4. Route to LLM API                             │
│  5. Stream response back to frontend              │
└────────────────────┬─────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────┴────┐            ┌────┴────┐
    │ Claude  │            │  Grok   │
    │ API     │            │  API    │
    │         │            │         │
    │ Deep    │            │ Real-   │
    │ analysis│            │ time    │
    │ reasoning│           │ social  │
    │ reports │            │ OSINT   │
    └─────────┘            └─────────┘
```

---

## Routing Strategy

| Question Type | Route To | Why |
|--------------|----------|-----|
| Deep analysis ("What are the implications of...") | Claude | Superior reasoning, long-form analysis |
| Current events ("What just happened in...") | Grok | Real-time X/Twitter data access |
| Report generation ("Write a briefing on...") | Claude | Better structured writing |
| Social media signals ("What are people saying about...") | Grok | Native social media analysis |
| Default / ambiguous | Claude | More reliable general-purpose |

**Implementation:** Start with Claude only. Add Grok later. The routing layer is a simple keyword/intent classifier on the backend.

---

## System Prompt Template

This is the system prompt sent to the LLM with every analyst question:

```
You are a senior intelligence analyst at a global monitoring operations center.
You have access to the following real-time intelligence data:

CURRENT THREAT LEVEL: {global_risk_score}/100 ({risk_level})
DATE: {current_date_utc}

ACTIVE CRISIS SUMMARY:
{crisis_summary}

COUNTRY IN FOCUS: {focused_country_name} (Risk: {country_risk_score}/100)
{country_situation_summary}

ACTIVE SIGNALS (Last 24 hours, top 20 by severity):
{signal_list}

MARKET SNAPSHOT:
{market_data}

MILITARY DISPOSITION:
{military_summary}

INSTRUCTIONS:
- Answer the analyst's question using the intelligence data provided above.
- Be specific and cite data points from the context.
- Use probability language (likely, possible, near-certain) with approximate percentages.
- Structure complex answers with clear sections.
- If asked about something not covered in the data, say so clearly.
- Keep responses concise but thorough — aim for 150-300 words.
- Never fabricate intelligence — only reference data from the context provided.
- Use professional intelligence community language and formatting.
```

---

## Context Injection

The backend constructs the context by querying its own database:

```javascript
async function buildAnalystContext(focusedCountry) {
  const [kpis, signals, markets, country] = await Promise.all([
    db.getKPISummary(),
    db.getTopSignals({ limit: 20, hours: 24 }),
    db.getMarketSnapshot(),
    focusedCountry ? db.getCountryDossier(focusedCountry) : null,
  ]);

  return {
    global_risk_score: kpis.globalRisk.value,
    risk_level: kpis.globalRisk.level,
    current_date_utc: new Date().toISOString(),
    crisis_summary: generateCrisisSummary(signals),
    focused_country_name: country?.name || 'None',
    country_risk_score: country?.riskScore || 'N/A',
    country_situation_summary: country?.situation || '',
    signal_list: signals.map(s => `- [${s.severity}] ${s.headline} (${s.source}, ${s.timestamp})`).join('\n'),
    market_data: formatMarketData(markets),
    military_summary: country?.military || 'See global map for disposition',
  };
}
```

---

## API Implementation

### Request

```
POST /api/analyst/ask
Content-Type: application/json

{
  "question": "How does Hormuz connect to the energy crisis?",
  "context": {
    "activeCountry": "iran",
    "currentThreatLevel": 92
  },
  "stream": true
}
```

### Response (Server-Sent Events for streaming)

```
HTTP/1.1 200 OK
Content-Type: text/event-stream

data: {"type": "start", "model": "claude-sonnet-4-5-20250929"}

data: {"type": "delta", "text": "The Strait"}
data: {"type": "delta", "text": " of Hormuz"}
data: {"type": "delta", "text": " handles roughly"}
data: {"type": "delta", "text": " 20% of global"}
...

data: {"type": "done", "totalTokens": 847, "sources": ["AIS tracking", "EIA reports"]}
```

### Backend Pseudocode

```javascript
app.post('/api/analyst/ask', async (req, res) => {
  const { question, context, stream } = req.body;

  // Rate limit: 10 req/min per user
  if (rateLimited(req.user)) return res.status(429).json({ error: 'Rate limited' });

  // Build intelligence context
  const analystContext = await buildAnalystContext(context.activeCountry);

  // Construct prompt
  const systemPrompt = buildSystemPrompt(analystContext);
  const messages = [{ role: 'user', content: question }];

  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
      stream: true,
    });

    for await (const event of response) {
      if (event.type === 'content_block_delta') {
        res.write(`data: ${JSON.stringify({ type: 'delta', text: event.delta.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } else {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    res.json({
      answer: response.content[0].text,
      model: response.model,
      tokens: response.usage.output_tokens,
    });
  }
});
```

---

## Frontend Streaming Implementation

```typescript
// useAnalyst.ts
export function useAnalyst() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [response, setResponse] = useState('');

  async function ask(question: string, activeCountry?: string) {
    setIsStreaming(true);
    setResponse('');

    const res = await fetch('/api/analyst/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        context: { activeCountry, currentThreatLevel: 92 },
        stream: true,
      }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

      for (const line of lines) {
        const data = JSON.parse(line.slice(6));
        if (data.type === 'delta') {
          setResponse(prev => prev + data.text);
        } else if (data.type === 'done') {
          setIsStreaming(false);
        }
      }
    }
  }

  return { ask, response, isStreaming };
}
```

---

## Cost Estimation

| Model | Input Cost | Output Cost | Avg Query Cost |
|-------|-----------|-------------|----------------|
| Claude Sonnet 4.5 | $3/MTok | $15/MTok | ~$0.02-0.04 per query |
| Claude Haiku 4.5 | $0.80/MTok | $4/MTok | ~$0.005-0.01 per query |
| Grok | [TODO: Check xAI pricing] | | |

**Recommendation:** Use Sonnet for quality. At 100 queries/day = ~$3/day. Use Haiku for high-volume, low-complexity queries (search autocomplete, signal classification).

---

## Future Enhancements

1. **Conversation memory** — maintain chat history within a session for follow-up questions
2. **Auto-generated briefs** — scheduled daily digest generated by AI, not just on-demand
3. **Signal classification** — AI categorizes incoming signals by domain/severity
4. **Anomaly detection** — AI flags unusual patterns in signal data
5. **Multi-model routing** — automatically pick the best model based on question type
6. **Grok social OSINT** — real-time X/Twitter signal analysis for breaking events

---

*Start with Claude Sonnet. Get the pipeline working end-to-end. Optimize model selection later.*
