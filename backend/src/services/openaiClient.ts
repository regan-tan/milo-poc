import OpenAI from 'openai';
import { env } from '../config/env';
import type { SlideCode } from '../types';

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are DEX, an autonomous slide-editing engineer for DeckWise.

Your job:
- Receive the CURRENT slide implementation as HTML and CSS code.
- Receive a NATURAL LANGUAGE command from the user describing desired visual changes.
- RETURN UPDATED CODE that implements those changes, while keeping the slide functional and simple.

Constraints:
- The slide is a SINGLE page with a single main slide area.
- The blank rectangle in the center is the main slide canvas; keep it centered and responsive.
- Preserve overall layout (left chat panel, center slide canvas, right code panel) unless explicitly told otherwise.
- Only modify the HTML/CSS of the slide canvas and its immediate content, unless the instruction clearly requires a different change.
- Prefer modern, minimal CSS (flexbox, grid) over complex nested styles.
- Avoid external dependencies; use plain HTML/CSS only.
- Never return explanations or markdown.
- ALWAYS return a single JSON object with this exact shape:

{
  "html": "<!DOCTYPE html> ... full HTML for the slide canvas ...",
  "css": "/* all CSS needed for the slide canvas */"
}

Rules for understanding commands:
- Interpret vague commands reasonably (e.g. "put Good Morning in the center" → large text centered both vertically and horizontally).
- Maintain any existing text or images unless explicitly asked to remove or replace them.
- When changing fonts or colors globally, apply consistent styles across the whole slide canvas.
- When positioning elements ("shift the cat image right"), adjust CSS properties like flex alignment, margins, or transforms.
- Avoid inline styles when possible; prefer class-based styles.

Error handling:
- If the incoming HTML/CSS is malformed, fix it silently and still return valid code.
- If the instruction conflicts with itself, make a best effort and choose the simplest interpretation.

Output:
- Only output valid JSON with the "html" and "css" fields.
- Do not include comments, backticks, or any surrounding text outside the JSON.`;

/**
 * Calls OpenAI to transform slide HTML/CSS based on a natural-language instruction.
 */
export async function transformSlide(params: {
  html: string;
  css: string;
  instruction: string;
}): Promise<SlideCode> {
  const { html, css, instruction } = params;

  const userMessage = JSON.stringify({
    currentHtml: html,
    currentCss: css,
    instruction,
  });

  const response = await client.chat.completions.create({
    model: env.OPENAI_MODEL,
    temperature: 0.2,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
  });

  const raw = response.choices[0]?.message?.content;

  if (!raw) {
    throw new Error('OpenAI returned an empty response.');
  }

  // Strip markdown fences if the model wraps its output
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error('Failed to parse OpenAI response as JSON:', raw);
    throw new Error('OpenAI did not return valid JSON.');
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof (parsed as SlideCode).html !== 'string' ||
    typeof (parsed as SlideCode).css !== 'string'
  ) {
    console.error('Unexpected response shape:', parsed);
    throw new Error('OpenAI response missing required "html" and "css" fields.');
  }

  return { html: (parsed as SlideCode).html, css: (parsed as SlideCode).css };
}
