import { useMemo } from 'react';
import { useVenture } from '../context/VentureContext';
import { Venture } from '../types';

export function useVentureFilter() {
  const { state } = useVenture();
  const { ventures, filters, sortKey, sortDir } = state;

  const filteredVentures = useMemo(() => {
    let result = [...ventures];

    // Search
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(v => 
        v.name.toLowerCase().includes(term) || 
        v.tagline.toLowerCase().includes(term) ||
        v.problemStatement.toLowerCase().includes(term)
      );
    }

    // Sector
    if (filters.sectors.length > 0) {
      result = result.filter(v => filters.sectors.includes(v.sector));
    }

    // Stage
    if (filters.stages.length > 0) {
      result = result.filter(v => filters.stages.includes(v.stage));
    }

    // G Score
    result = result.filter(v => v.gScore >= filters.gRange[0] && v.gScore <= filters.gRange[1]);

    // M Score
    result = result.filter(v => v.mScore >= filters.mRange[0] && v.mScore <= filters.mRange[1]);

    // ROI
    result = result.filter(v => v.roiProjection >= filters.roiRange[0] && v.roiProjection <= filters.roiRange[1]);

    // Sorting
    result.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      
      const numA = valA as number;
      const numB = valB as number;
      return sortDir === 'asc' ? numA - numB : numB - numA;
    });

    return result;
  }, [ventures, filters, sortKey, sortDir]);

  return { filteredVentures };
}
