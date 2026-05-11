
import { Restaurant, Pantry, Mapping, Location, SearchType } from '../types';

declare const jspdf: any;

// Helper to trigger file download
const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

export const exportToJson = (data: any, fileName: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, `${fileName}.json`, 'application/json');
};

export const exportSearchResultsToPdf = (
  results: Location[], 
  searchType: SearchType, 
  query: string
) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  const title = `Search Results for ${searchType} in "${query}"`;
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  const head = [['Name', 'Address', 'Phone', 'Hours']];
  const body = results.map(item => [
    item.name,
    item.address,
    item.phone,
    item.hours
  ]);

  doc.autoTable({
    startY: 30,
    head,
    body,
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [22, 160, 133] }, // A nice teal color
  });

  doc.save(`community-plates_${searchType}_results.pdf`);
};

export const exportMappingsToPdf = (
  mappings: Mapping[],
  restaurants: Restaurant[],
  pantries: Pantry[]
) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Community Plates - Mapped Connections", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  const head = [['Restaurant', 'Pantry', 'Pantry Contact']];
  const body = mappings.map(mapping => {
    const restaurant = restaurants.find(r => r.id === mapping.restaurantId);
    const pantry = pantries.find(p => p.id === mapping.pantryId);
    return [
      restaurant ? restaurant.name : 'N/A',
      pantry ? pantry.name : 'N/A',
      pantry ? `${pantry.address}, ${pantry.phone}` : 'N/A'
    ];
  });

  doc.autoTable({
    startY: 40,
    head,
    body,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }, // A nice blue color
  });

  doc.save('community-plates_connections.pdf');
};
