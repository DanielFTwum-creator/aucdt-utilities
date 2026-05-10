import { Venture, CompareSession } from '../types';

export function computeCompareSession(a: Venture, b: Venture): CompareSession {
  const deltaG = a.gScore - b.gScore;
  const deltaM = a.mScore - b.mScore;
  const deltaROI = a.roiProjection - b.roiProjection;
  
  // Custom Dominance weighted score: G + M + (ROI * 10)
  const scoreA = a.gScore + a.mScore + (a.roiProjection * 10);
  const scoreB = b.gScore + b.mScore + (b.roiProjection * 10);
  
  const dominantId = scoreA > scoreB ? a.id : b.id;
  
  const absMax = Math.max(
    Math.abs(deltaG), 
    Math.abs(deltaM), 
    Math.abs(deltaROI * 10)
  );
  
  const spread = absMax < 10 ? 'narrow' : absMax < 25 ? 'moderate' : 'wide';
  
  return { 
    ids: [a.id, b.id], 
    deltaG, 
    deltaM, 
    deltaROI, 
    dominantId, 
    spread 
  };
}
