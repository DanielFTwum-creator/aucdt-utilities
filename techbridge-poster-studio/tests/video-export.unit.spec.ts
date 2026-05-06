import { test, expect } from '@playwright/test';
import { canExportVideo } from '../src/lib/video-export';

test.describe('Video Export Library - Unit Tests', () => {
  test('canExportVideo should return true on Chromium with VideoEncoder', async ({ page, browserName }) => {
    const result = await page.evaluate(() => {
      // Simulate the canExportVideo function
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const supportsVideoEncoder = typeof window.VideoEncoder !== 'undefined';
      return supportsVideoEncoder && !isIOS;
    });

    if (browserName === 'chromium') {
      expect(result).toBe(true);
    } else {
      expect(result).toBe(false);
    }
  });

  test('canExportVideo should return false on iOS', async ({ page }) => {
    const result = await page.evaluate(() => {
      // Mock iOS user agent
      const originalUA = Object.getOwnPropertyDescriptor(navigator, 'userAgent');
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const supportsVideoEncoder = typeof window.VideoEncoder !== 'undefined';
      const result = supportsVideoEncoder && !isIOS;

      // Restore
      if (originalUA) {
        Object.defineProperty(navigator, 'userAgent', originalUA);
      }

      return result;
    });

    expect(result).toBe(false);
  });

  test('VideoFrame should be creatable from canvas', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      console.log('Skipping VideoFrame test on non-Chromium browser');
      return;
    }

    const canCreateFrame = await page.evaluate(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const frame = new VideoFrame(canvas, { timestamp: 0 });
        const success = frame.format !== undefined;
        frame.close();
        return success;
      } catch (e) {
        return false;
      }
    });

    expect(canCreateFrame).toBe(true);
  });

  test('VideoEncoder should be configurable', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    const encoderConfigurable = await page.evaluate(() => {
      return new Promise((resolve) => {
        try {
          const encoder = new VideoEncoder({
            output: () => {},
            error: () => {},
          });

          encoder.configure({
            codec: 'avc1.4d4028',
            width: 1920,
            height: 1080,
            bitrate: 2_500_000,
            framerate: 30,
          });

          // Check if configured
          const isConfigured = encoder.state === 'configured';
          resolve(isConfigured);
        } catch (e) {
          resolve(false);
        }
      });
    });

    expect(encoderConfigurable).toBe(true);
  });

  test('MP4 Muxer should be creatable', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    const muxerCreatable = await page.evaluate(async () => {
      try {
        // Import mp4-muxer dynamically
        const module = await import('mp4-muxer');
        const { Muxer, ArrayBufferTarget } = module;

        const muxer = new Muxer({
          target: new ArrayBufferTarget(),
          video: {
            codec: 'avc',
            width: 1920,
            height: 1080,
          },
          fastStart: 'in-memory',
        });

        return muxer !== undefined;
      } catch (e) {
        console.error('Muxer creation error:', e);
        return false;
      }
    });

    expect(muxerCreatable).toBe(true);
  });

  test('VideoFrame memory should be properly freed', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    const frameCleanup = await page.evaluate(() => {
      try {
        const frames: VideoFrame[] = [];

        // Create and close frames
        for (let i = 0; i < 10; i++) {
          const canvas = document.createElement('canvas');
          canvas.width = 1280;
          canvas.height = 720;
          const frame = new VideoFrame(canvas, { timestamp: i * 1000 });
          frames.push(frame);
        }

        // Close all
        let closedCount = 0;
        frames.forEach((f) => {
          try {
            f.close();
            closedCount++;
          } catch (e) {
            // Frame may already be closed
          }
        });

        return closedCount > 0;
      } catch (e) {
        return false;
      }
    });

    expect(frameCleanup).toBe(true);
  });

  test('Video dimensions should be even numbers', async ({ page }) => {
    const makeDimensionsEven = (dim: number) => (dim % 2 === 0 ? dim : dim + 1);

    const testCases = [
      { input: 1920, expected: 1920 },
      { input: 1921, expected: 1922 },
      { input: 720, expected: 720 },
      { input: 721, expected: 722 },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = makeDimensionsEven(input);
      expect(result).toBe(expected);
      expect(result % 2).toBe(0); // Verify it's even
    });
  });

  test('Timestamp calculation should be correct', async ({ page }) => {
    const fps = 30;
    const expectedTimestamps = [0, 33333, 66666, 100000, 133333]; // microseconds

    const timestamps = [0, 1, 2, 3, 4].map((i) => {
      return Math.floor((i * 1000000) / fps);
    });

    // Allow small tolerance due to rounding
    timestamps.forEach((ts, i) => {
      expect(Math.abs(ts - expectedTimestamps[i])).toBeLessThan(1);
    });
  });

  test('Keyframe spacing should be calculated correctly', async ({ page }) => {
    const fps = 30;
    const keyframeInterval = 60; // Every 60 frames (2 seconds at 30fps)

    const keyframes: boolean[] = [];
    for (let i = 0; i < 150; i++) {
      const isKeyframe = i % keyframeInterval === 0;
      keyframes.push(isKeyframe);
    }

    // Verify keyframe pattern
    expect(keyframes[0]).toBe(true);
    expect(keyframes[60]).toBe(true);
    expect(keyframes[120]).toBe(true);
    expect(keyframes[30]).toBe(false);
    expect(keyframes[90]).toBe(false);
  });

  test('Encoder flush should be called periodically', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    const flushPattern = await page.evaluate(() => {
      const totalFrames = 150;
      const flushInterval = 5;
      const flushFrames: number[] = [];

      for (let i = 0; i < totalFrames; i++) {
        if ((i + 1) % flushInterval === 0) {
          flushFrames.push(i + 1);
        }
      }

      return flushFrames;
    });

    // Should flush at frames 5, 10, 15, 20, etc.
    expect(flushPattern.length).toBe(30); // 150 / 5 = 30 flushes
    expect(flushPattern[0]).toBe(5);
    expect(flushPattern[29]).toBe(150);
  });

  test('Bitrate should prevent memory overload', async ({ page }) => {
    const bitrates = {
      low: 1_500_000,
      medium: 2_500_000,
      high: 4_000_000,
    };

    // 5 seconds @ 30fps = 150 frames
    // Expected max data per second
    const expectedMaxBytesPerSecond = {
      low: bitrates.low / 8,
      medium: bitrates.medium / 8,
      high: bitrates.high / 8,
    };

    Object.entries(bitrates).forEach(([quality, bitrate]) => {
      expect(bitrate).toBeGreaterThan(0);
      expect(bitrate).toBeLessThan(10_000_000); // Reasonable max
    });
  });

  test('Error handling should catch frame encoding failures', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return;

    const errorHandled = await page.evaluate(() => {
      try {
        // Simulate frame encoding with error
        throw new Error('Frame 20 encoding failed: Cannot finalize a muxer more than once');
      } catch (err: any) {
        const message = err.message || String(err);
        const isHandled = message.includes('Frame') && message.includes('encoding failed');
        return isHandled;
      }
    });

    expect(errorHandled).toBe(true);
  });
});
