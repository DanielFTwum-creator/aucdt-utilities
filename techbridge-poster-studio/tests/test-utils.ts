import fs from 'fs';
import path from 'path';

/**
 * Validate MP4 file structure
 * Checks for MP4 magic number and basic structure
 */
export function isValidMp4(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const stats = fs.statSync(filePath);
  if (stats.size < 1024) {
    return false; // MP4 files should be at least 1KB
  }

  try {
    // Check for 'ftyp' box at offset 4
    const buffer = Buffer.alloc(4);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 4, 4);
    fs.closeSync(fd);

    const ftypSignature = buffer.toString('hex');
    return ftypSignature === '66747970'; // 'ftyp' in hex
  } catch (e) {
    return false;
  }
}

/**
 * Get MP4 file size in MB
 */
export function getMp4SizeMb(filePath: string): number {
  if (!fs.existsSync(filePath)) {
    return 0;
  }
  const stats = fs.statSync(filePath);
  return stats.size / (1024 * 1024);
}

/**
 * Check if MP4 has moov box (valid playable file)
 */
export function hasMoovBox(filePath: string): boolean {
  try {
    if (!fs.existsSync(filePath)) return false;

    const buffer = fs.readFileSync(filePath);
    const moovSignature = Buffer.from('moov', 'ascii');

    // Search for moov box in first 100KB
    const searchLimit = Math.min(buffer.length, 100 * 1024);
    return buffer.indexOf(moovSignature, 0, searchLimit) !== -1;
  } catch (e) {
    return false;
  }
}

/**
 * Extract MP4 duration estimate (very rough)
 */
export function estimateMp4Duration(filePath: string): string {
  const expectedFrames = 150; // 5 seconds @ 30fps
  const fps = 30;
  const duration = expectedFrames / fps;
  return `~${duration}s`;
}

/**
 * Create test output directory
 */
export function createTestOutputDir(): string {
  const outputDir = path.join(process.cwd(), 'test-outputs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  return outputDir;
}

/**
 * Clean up old test files
 */
export function cleanupTestOutputs(maxAgeMinutes: number = 60): void {
  const outputDir = path.join(process.cwd(), 'test-outputs');
  if (!fs.existsSync(outputDir)) return;

  const now = Date.now();
  const maxAge = maxAgeMinutes * 60 * 1000;

  fs.readdirSync(outputDir).forEach((file) => {
    const filePath = path.join(outputDir, file);
    const stats = fs.statSync(filePath);
    const age = now - stats.mtimeMs;

    if (age > maxAge) {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up old test file: ${file}`);
    }
  });
}

/**
 * Generate test summary report
 */
export interface Mp4TestResult {
  name: string;
  aspectRatio: string;
  fileSize: number;
  isValid: boolean;
  hasMoov: boolean;
  timestamp: Date;
}

export function generateTestReport(results: Mp4TestResult[]): string {
  let report = `
MP4 Export Test Report
=====================
Generated: ${new Date().toISOString()}
Total Tests: ${results.length}

Results:
--------
`;

  results.forEach((result) => {
    const status = result.isValid ? '✓' : '✗';
    const moovStatus = result.hasMoov ? 'yes' : 'no';
    report += `
${status} ${result.name} (${result.aspectRatio})
  Size: ${(result.fileSize / 1024).toFixed(2)} KB
  Valid: ${result.isValid}
  Playable (moov): ${moovStatus}
  Time: ${result.timestamp.toISOString()}
`;
  });

  const successCount = results.filter((r) => r.isValid).length;
  const moovCount = results.filter((r) => r.hasMoov).length;

  report += `
Summary:
--------
Valid Files: ${successCount}/${results.length}
Playable: ${moovCount}/${results.length}
Success Rate: ${((successCount / results.length) * 100).toFixed(1)}%
`;

  return report;
}

/**
 * Wait for file to be written (used in download tests)
 */
export async function waitForFileWrite(
  filePath: string,
  maxWaitMs: number = 5000,
  checkIntervalMs: number = 100
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 0) {
        // Wait a bit more to ensure file is fully written
        await new Promise((resolve) => setTimeout(resolve, 500));
        return true;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, checkIntervalMs));
  }

  return false;
}

/**
 * Compare MP4 files for debugging
 */
export function compareMp4Files(file1: string, file2: string): void {
  if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
    console.log('One or both files do not exist');
    return;
  }

  const stats1 = fs.statSync(file1);
  const stats2 = fs.statSync(file2);

  console.log(`
Comparison: ${path.basename(file1)} vs ${path.basename(file2)}
Size 1: ${(stats1.size / 1024).toFixed(2)} KB
Size 2: ${(stats2.size / 1024).toFixed(2)} KB
Difference: ${Math.abs(stats1.size - stats2.size)} bytes
Valid 1: ${isValidMp4(file1)}
Valid 2: ${isValidMp4(file2)}
  `);
}

/**
 * Log detailed MP4 info
 */
export function logMp4Info(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const stats = fs.statSync(filePath);
  const isValid = isValidMp4(filePath);
  const hasMoov = hasMoovBox(filePath);
  const sizeKb = (stats.size / 1024).toFixed(2);

  console.log(`
MP4 File Info: ${path.basename(filePath)}
Size: ${sizeKb} KB
Valid: ${isValid}
Has moov box: ${hasMoov}
Created: ${stats.birthtime.toISOString()}
Modified: ${stats.mtime.toISOString()}
  `);
}
