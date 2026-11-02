export interface SaziMotionController {
  pause(): void;
  resume(): void;
  setReducedMotion(value: boolean): void;
  sync(): void;
  destroy(): void;
  inspect(): {
    state: 'running' | 'paused' | 'reduced';
    active: {drift: number; shine: number; glint: number};
    targetCount: number;
    revealCount: number;
    destroyed: boolean;
  };
}
export function initSaziMotion(root: HTMLElement): SaziMotionController;
