export interface StepProps {
  /** 0-based index of this step within the flow */
  index: number;
  /** total number of steps (for the progress header) */
  total: number;
  /** advance to the next step */
  onNext: () => void;
  /** go to the previous step (undefined on the first step) */
  onBack?: () => void;
  /** finish the whole onboarding flow */
  onComplete: () => void;
}
