/** Shape returned by OpenAI and sent to the frontend. */
export interface SlideCode {
  html: string;
  css: string;
}

/** Body of POST /api/transform-slide. */
export interface TransformSlideRequest {
  html: string;
  css: string;
  prompt: string;
}

/** Successful response of POST /api/transform-slide. */
export type TransformSlideResponse = SlideCode;
