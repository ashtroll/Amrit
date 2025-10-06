import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { WaterSample, ComputedIndices } from '../types';

export const generatePDFReport = (
  samples: WaterSample[],
  computedIndices: ComputedIndices[],
  stats: any
): void => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Heavy Metal Pollution Index Report', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });

  doc.setFontSize(12);
  doc.text('Summary Statistics', 14, 40);

  doc.setFontSize(10);
  doc.text(`Total Samples Analyzed: ${stats.totalSamples}`, 14, 48);
  doc.text(`Average HPI: ${stats.averageHPI?.toFixed(2)}`, 14, 54);
  doc.text(`Average HEI: ${stats.averageHEI?.toFixed(2)}`, 14, 60);
  doc.text(`Safe Samples: ${stats.safeSamples} (${((stats.safeSamples / stats.totalSamples) * 100).toFixed(1)}%)`, 14, 66);
  doc.text(`Moderate Risk: ${stats.moderateRiskSamples} (${((stats.moderateRiskSamples / stats.totalSamples) * 100).toFixed(1)}%)`, 14, 72);
  doc.text(`High Risk: ${stats.highRiskSamples} (${((stats.highRiskSamples / stats.totalSamples) * 100).toFixed(1)}%)`, 14, 78);
  doc.text(`Critical: ${stats.criticalSamples} (${((stats.criticalSamples / stats.totalSamples) * 100).toFixed(1)}%)`, 14, 84);

  const tableData = samples.slice(0, 20).map((sample, index) => {
    const indices = computedIndices[index];
    return [
      sample.sampleId,
      sample.location || 'N/A',
      sample.latitude ?? 'N/A',
      sample.longitude ?? 'N/A',
      indices?.hpi.toFixed(2) || 'N/A',
      indices?.hei.toFixed(2) || 'N/A',
      indices?.cd.toFixed(2) || 'N/A',
      indices?.classification || 'N/A',
    ];
  });

  autoTable(doc, {
    head: [['Sample ID', 'Location', 'Latitude', 'Longitude', 'HPI', 'HEI', 'Cd Index', 'Classification']],
    body: tableData,
    startY: 95,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  if (samples.length > 20) {
    doc.text(`Note: Showing first 20 of ${samples.length} samples`, 14, (doc as any).lastAutoTable.finalY + 10);
  }

  doc.save(`HMPI_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};
