
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { toCanvas } from 'html-to-image';
import { PosterData } from '../types';
import { getPosterDimensions } from '../constants';

export interface ExportProgress {
  currentFrame: number;
  totalFrames: number;
  status: string;
}

export type VideoExportMethod = 'webcodecs' | 'mediarecorder' | 'none';

function getSupportedMimeType(): string {
  const types = [
    'video/webm;codecs=h264',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];
  return types.find(t => MediaRecorder.isTypeSupported(t)) ?? '';
}

export function getVideoExportMethod(): VideoExportMethod {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) return 'none';
  if (typeof window.VideoEncoder !== 'undefined') return 'webcodecs';
  const canvas = document.createElement('canvas');
  if (typeof canvas.captureStream === 'function' &&
      typeof MediaRecorder !== 'undefined' &&
      getSupportedMimeType()) return 'mediarecorder';
  return 'none';
}

export function canExportVideo(): boolean {
  return getVideoExportMethod() !== 'none';
}

let partialMp4Data: Uint8Array | null = null;

export async function exportToMp4(
  element: HTMLElement | null,
  data: PosterData,
  onProgress?: (progress: ExportProgress) => void
): Promise<Blob> {
  if (!element) {
    throw new Error('Export element not found');
  }

  const rawDimensions = getPosterDimensions(data.aspectRatio);
  const width = rawDimensions.width % 2 === 0 ? rawDimensions.width : rawDimensions.width + 1;
  const height = rawDimensions.height % 2 === 0 ? rawDimensions.height : rawDimensions.height + 1;

  const fps = 15;
  const durationInSeconds = 5;
  const totalFrames = fps * durationInSeconds;

  console.log(`Starting MP4 export: ${width}x${height}, ${totalFrames} frames`);

  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'avc',
      width,
      height
    },
    fastStart: 'in-memory'
  });

  if (!window.VideoEncoder) {
    throw new Error('VideoEncoder API not supported. Please use Chrome, Edge, or another Chromium-based browser.');
  }

  // Asset pre-loading and verification
  onProgress?.({ currentFrame: 0, totalFrames, status: 'Verifying assets...' });

  if (data.logoUrl) {
    try {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          console.log('Logo pre-loaded');
          resolve();
        };
        img.onerror = () => {
          console.warn('Logo CORS issue (continuing with partial render):', data.logoUrl);
          resolve();
        };
        img.src = data.logoUrl;
        setTimeout(() => {
          console.warn('Logo timeout (5s)');
          resolve();
        }, 5000);
      });
    } catch (e) {
      console.warn('Asset verification failed:', e);
    }
  }

  // Wait for DOM and fonts to settle
  await new Promise(r => setTimeout(r, 2000));

  // Pre-warm canvas
  try {
    await toCanvas(element, { cacheBust: true, width, height });
  } catch (e) {
    console.warn('Canvas pre-warm failed, continuing:', e);
  }

  const videoEncoder = new VideoEncoder({
    output: (chunk, metadata) => muxer.addVideoChunk(chunk, metadata),
    error: (e) => {
      console.error('VideoEncoder error:', e);
    }
  });

  try {
    videoEncoder.configure({
      codec: 'avc1.4d4028',
      width,
      height,
      bitrate: 2_500_000,
      framerate: fps
    });
  } catch (e: any) {
    throw new Error(`VideoEncoder config failed: ${e.message}. Try a Chrome-based browser.`);
  }

  try {
    // Capture and process frames with frame-by-frame cleanup
    for (let i = 0; i < totalFrames; i++) {
      onProgress?.({
        currentFrame: i + 1,
        totalFrames,
        status: `Encoding frame ${i + 1}/${totalFrames}...`
      });

      let frame: VideoFrame | null = null;
      try {
        // Render frame to canvas with timeout
        let canvas: HTMLCanvasElement;
        try {
          canvas = await Promise.race([
            toCanvas(element, {
              width,
              height,
              pixelRatio: 1,
              style: {
                transform: 'none',
                left: '0',
                top: '0',
                margin: '0',
                padding: '0',
                visibility: 'visible',
                opacity: '1'
              },
              backgroundColor: '#FAF7F0',
              cacheBust: true,
            }),
            new Promise<HTMLCanvasElement>((_, reject) =>
              setTimeout(() => reject(new Error(`Frame ${i + 1}: canvas render timeout (>10s)`)), 10000)
            )
          ]);
        } catch (renderErr: any) {
          console.error(`Canvas render failed for frame ${i + 1}:`, renderErr.message);
          throw renderErr;
        }

        // Create VideoFrame with precise timestamp
        const timestampInMicroseconds = (i * 1000000) / fps;
        try {
          frame = new VideoFrame(canvas, { timestamp: timestampInMicroseconds });
        } catch (frameErr: any) {
          console.error(`VideoFrame creation failed for frame ${i + 1}:`, frameErr.message);
          throw frameErr;
        }

        // Keyframe every 2 seconds (30 frames at 15fps)
        videoEncoder.encode(frame, { keyFrame: i % 30 === 0 });

        // Log progress checkpoint
        if ((i + 1) % 5 === 0) {
          console.log(`Progress checkpoint: ${i + 1}/${totalFrames} frames encoded successfully`);
        }

        // Flush encoder periodically to prevent buffer buildup
        if ((i + 1) % 3 === 0) {
          try {
            await videoEncoder.flush();
          } catch (flushErr: any) {
            console.error(`Encoder flush failed at frame ${i + 1}:`, flushErr.message);
            throw flushErr;
          }
        }

        // Minimal delay to keep UI responsive
        await new Promise(r => setTimeout(r, 2));

      } catch (err: any) {
        // Ensure frame is closed even on error
        if (frame) {
          try {
            frame.close();
          } catch (e) {
            console.warn('Failed to close frame on error:', e);
          }
        }

        console.error(`Frame ${i + 1} failed:`, err);

        // Try to save partial result
        if (i > 0) {
          try {
            console.log(`Attempting to save partial result from ${i} frames...`);
            try {
              await videoEncoder.flush();
            } catch (flushErr) {
              console.warn('Encoder flush failed during partial save:', flushErr);
            }
            muxer.finalize();
            const { buffer } = muxer.target as ArrayBufferTarget;
            partialMp4Data = new Uint8Array(buffer);

            // Auto-download partial
            const partialBlob = new Blob([partialMp4Data], { type: 'video/mp4' });
            const url = URL.createObjectURL(partialBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `techbridge-poster-PARTIAL-${i}frames-${Date.now()}.mp4`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);

            console.log(`Auto-saved partial video: ${partialBlob.size} bytes (${i}/${totalFrames} frames)`);
          } catch (saveErr) {
            console.error('Failed to save partial video:', saveErr);
          }
        }

        let errorDetail = err.message || String(err);
        throw new Error(
          `Frame ${i + 1} encoding failed: ${errorDetail}\n` +
          `${partialMp4Data ? `Partial video (${partialMp4Data.byteLength} bytes) should have been auto-saved.` : ''}\n` +
          `Try:\n- Reduce logo file size or use a different image\n- Check browser is Chrome/Edge\n- Disable video overlay if enabled`
        );
      } finally {
        // Always close the frame
        if (frame) {
          try {
            frame.close();
          } catch (e) {
            // Frame already closed, ignore
          }
        }
      }
    }

    // Finalize encoding with error handling
    onProgress?.({ currentFrame: totalFrames, totalFrames, status: 'Finalizing video...' });
    try {
      await videoEncoder.flush();
    } catch (finalFlushErr: any) {
      console.error('Final encoder flush failed:', finalFlushErr.message);
      throw new Error(`Encoder finalization failed: ${finalFlushErr.message}`);
    }

    try {
      muxer.finalize();
    } catch (finalizeErr: any) {
      console.error('Muxer finalization failed:', finalizeErr.message);
      throw new Error(`Video muxing finalization failed: ${finalizeErr.message}`);
    }

    const { buffer } = muxer.target as ArrayBufferTarget;
    const finalBlob = new Blob([buffer], { type: 'video/mp4' });

    console.log(`MP4 export complete: ${finalBlob.size} bytes from ${totalFrames} frames`);
    partialMp4Data = null;

    return finalBlob;

  } catch (err) {
    throw err;
  }
}

export function getPartialMp4Data(): Uint8Array | null {
  return partialMp4Data;
}

export async function exportViaMediaRecorder(
  element: HTMLElement,
  data: PosterData,
  onProgress?: (progress: ExportProgress) => void
): Promise<{ blob: Blob; extension: string }> {
  const mimeType = getSupportedMimeType();
  const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
  const { width, height } = getPosterDimensions(data.aspectRatio);
  const fps = 15;
  const durationMs = 5000;
  const totalFrames = Math.ceil(fps * (durationMs / 1000));

  const offscreen = document.createElement('canvas');
  offscreen.width = width % 2 === 0 ? width : width + 1;
  offscreen.height = height % 2 === 0 ? height : height + 1;
  const ctx = offscreen.getContext('2d')!;

  const stream = offscreen.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  onProgress?.({ currentFrame: 0, totalFrames, status: 'Preparing canvas...' });
  await new Promise(r => setTimeout(r, 1000));

  recorder.start(200);

  let frameIndex = 0;
  const frameInterval = 1000 / fps;
  const startTime = Date.now();

  await new Promise<void>((resolve, reject) => {
    const tick = async () => {
      try {
        const elapsed = Date.now() - startTime;
        if (elapsed >= durationMs) {
          recorder.stop();
          resolve();
          return;
        }
        frameIndex++;
        onProgress?.({ currentFrame: frameIndex, totalFrames, status: `Recording frame ${frameIndex}/${totalFrames}...` });
        const canvas = await toCanvas(element, { width: offscreen.width, height: offscreen.height, pixelRatio: 1, cacheBust: false });
        ctx.drawImage(canvas, 0, 0);
        setTimeout(tick, frameInterval);
      } catch (e) { reject(e); }
    };
    setTimeout(tick, 0);
  });

  await new Promise<void>((resolve) => { recorder.onstop = () => resolve(); });
  onProgress?.({ currentFrame: totalFrames, totalFrames, status: 'Finalising video...' });
  return { blob: new Blob(chunks, { type: mimeType }), extension };
}
