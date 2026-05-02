const GEMINI_KEY_STORAGE = "smart-ins-note-gemini-key";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export function getGeminiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(GEMINI_KEY_STORAGE) || "";
}

export function setGeminiKey(key: string) {
  if (typeof window === "undefined") return;
  if (key.trim()) localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  else localStorage.removeItem(GEMINI_KEY_STORAGE);
}

export function hasGeminiKey(): boolean {
  return !!getGeminiKey();
}

async function callGemini(prompt: string): Promise<string> {
  const key = getGeminiKey();
  if (!key) throw new Error("No Gemini API key set. Add it in Settings.");

  const res = await fetch(`${GEMINI_BASE}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  });

  if (!res.ok) {
    const err = await res.json() as { error?: { message?: string } };
    throw new Error(err?.error?.message || `Gemini error ${res.status}`);
  }

  const data = await res.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}

export async function testGeminiKey(key: string): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(`${GEMINI_BASE}?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Say OK" }] }],
        generationConfig: { maxOutputTokens: 5 },
      }),
    });
    if (res.ok) return { ok: true, message: "API key is valid! AI features are now enabled." };
    const err = await res.json() as { error?: { message?: string } };
    return { ok: false, message: err?.error?.message || "Invalid API key." };
  } catch {
    return { ok: false, message: "Could not reach Gemini API. Check your connection." };
  }
}

export async function aiSummarize(content: string): Promise<string> {
  return callGemini(`Summarize the following note concisely in 3-5 sentences:\n\n${content}`);
}

export async function aiImproveWriting(content: string): Promise<string> {
  return callGemini(`Improve the writing quality, clarity, and flow of the following text. Keep the same meaning and return only the improved text:\n\n${content}`);
}

export async function aiGenerateTitle(content: string): Promise<string> {
  return callGemini(`Generate a short, descriptive title (max 8 words) for the following note. Return only the title, no quotes:\n\n${content}`);
}

export async function aiContinueWriting(content: string): Promise<string> {
  return callGemini(`Continue the following text naturally, adding 2-3 more sentences:\n\n${content}`);
}

export async function aiFixGrammar(content: string): Promise<string> {
  return callGemini(`Fix all grammar, spelling, and punctuation errors in the following text. Return only the corrected text:\n\n${content}`);
}

export async function aiMakeShorter(content: string): Promise<string> {
  return callGemini(`Shorten the following text by 40-50% while preserving all key information. Return only the shortened text:\n\n${content}`);
}

export async function aiMakeLonger(content: string): Promise<string> {
  return callGemini(`Expand the following text with more detail and elaboration. Return only the expanded text:\n\n${content}`);
}

export async function aiBrainstorm(content: string): Promise<string> {
  return callGemini(`Based on the following note, brainstorm 5-8 related ideas, questions, or follow-up points. Format as a markdown list:\n\n${content}`);
}

export async function aiFormatMarkdown(content: string): Promise<string> {
  return callGemini(`Format the following text as well-structured markdown with appropriate headings, lists, and emphasis. Return only the formatted markdown:\n\n${content}`);
}

export async function aiTranslate(content: string, targetLang = "English"): Promise<string> {
  return callGemini(`Translate the following text to ${targetLang}. Return only the translation:\n\n${content}`);
}
