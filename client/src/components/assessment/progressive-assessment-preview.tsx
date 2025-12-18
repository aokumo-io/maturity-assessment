import React from "react";

interface ProgressiveAssessmentPreviewProps {
  onClose: () => void;
}

export function ProgressiveAssessmentPreview({ onClose }: ProgressiveAssessmentPreviewProps) {
  return (
    <div>
      <p>Progressive Assessment (under development)</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

