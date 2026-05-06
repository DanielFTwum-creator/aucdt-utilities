# MP4 Export Test Suite

Comprehensive test coverage for TechBridge Poster Studio's MP4 video export functionality using Playwright.

## Test Files

### `mp4-export.spec.ts` — End-to-End Browser Tests
Integration tests that simulate user interactions and validate the complete MP4 export workflow.

**Test Cases:**
- ✅ MP4 button visibility and state
- ✅ VideoEncoder API detection
- ✅ Progress tracking during encoding
- ✅ MP4 file download and validation
- ✅ Error handling and recovery
- ✅ All 5 aspect ratios (Story, Portrait, Square, Landscape, Cinema)
- ✅ Concurrent export handling
- ✅ Retry after failed export

### `video-export.unit.spec.ts` — Unit Tests
Low-level tests for video encoding primitives and canvas rendering.

**Test Cases:**
- ✅ VideoEncoder availability
- ✅ VideoFrame creation and cleanup
- ✅ MP4 Muxer initialization
- ✅ Dimension validation (must be even)
- ✅ Timestamp calculations
- ✅ Keyframe spacing (every 2 seconds)
- ✅ Encoder flush patterns
- ✅ Bitrate sanity checks
- ✅ Error handling

### `test-utils.ts` — Testing Utilities
Helper functions for MP4 validation and test reporting.

**Utilities:**
- `isValidMp4()` — Check MP4 file structure
- `hasMoovBox()` — Verify file is playable
- `getMp4SizeMb()` — Get file size in MB
- `generateTestReport()` — Create test summary
- `cleanupTestOutputs()` — Remove old test files

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Only MP4 Export Tests
```bash
npx playwright test mp4-export
```

### Run Only Unit Tests
```bash
npx playwright test video-export.unit
```

### Run Single Test
```bash
npx playwright test -g "should download MP4 file"
```

### Run Tests in UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run Tests with Headed Browser (See What's Happening)
```bash
npx playwright test mp4-export --headed
```

### Debug Mode
```bash
npx playwright test mp4-export --debug
```

### Generate HTML Report
```bash
npx playwright test
npx playwright show-report
```

## Test Output

### Downloaded Files
Test downloads are saved to `test-outputs/`:
```
test-outputs/
├── techbridge-poster-*.mp4
├── STORY-*.mp4
├── PORTRAIT-*.mp4
├── SQUARE-*.mp4
├── LANDSCAPE-*.mp4
└── CINEMA-*.mp4
```

### Test Reports
Playwright generates detailed reports:
```bash
# View HTML report
npx playwright show-report
```

## Browser Support

| Browser | MP4 Support | Note |
|---------|------------|------|
| Chromium | ✅ | Full VideoEncoder support |
| Chrome | ✅ | Full VideoEncoder support |
| Firefox | ❌ | No WebCodecs API |
| Safari | ❌ | No WebCodecs API (use native QuickTime instead) |

**Tests automatically skip MP4 tests on unsupported browsers.**

## Performance Benchmarks

### Expected Encoding Time
- **5-second video @ 30fps = 150 frames**
- **Low bitrate (2.5M):** ~60-90 seconds
- **Normal bitrate (3.5M):** ~90-120 seconds
- **High bitrate (4M):** ~120-150 seconds

### File Sizes (Approximate)
| Quality | Bitrate | 5-Second Size |
|---------|---------|---------------|
| Low | 2.5M | 1.2 - 1.6 MB |
| Medium | 3.5M | 1.7 - 2.1 MB |
| High | 4M | 2.0 - 2.5 MB |

## Debugging Failed Tests

### Issue: "MP4 button disabled"
**Cause:** VideoEncoder not available on this browser
**Solution:** Tests automatically skip on Firefox/Safari

### Issue: "Download timeout"
**Cause:** Encoding took too long (>90 seconds)
**Solution:** 
- Run test with `--headed` to watch progress
- Check browser console for errors
- Reduce poster complexity (simpler logo)

### Issue: "Invalid MP4 file"
**Cause:** File missing `ftyp` signature or too small
**Solution:**
- Check `test-outputs/` for partial file
- Run with `--debug` to see frame-by-frame encoding
- Check for CORS errors on logo/video URLs

### Issue: "Frame 20 encoding failed"
**Cause:** Memory pressure during encoding
**Solution:** Check `video-export.ts` for partial save
- Partial video automatically downloads on crash
- Check for `PARTIAL-*.mp4` files in downloads

## Test Configuration

### Playwright Config (`playwright.config.ts`)
```typescript
{
  testDir: './tests',
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120000,
  },
  timeout: 120000,          // 2 minutes per test
  expect: { timeout: 5000 },
  retries: 1,               // Retry failed tests once
  workers: 1,               // Run tests serially (MP4 is memory-intensive)
}
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: MP4 Export Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test -- mp4-export
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-outputs
          path: test-outputs/
```

## Manual Testing Checklist

Before shipping an MP4 export update:

- [ ] Export MP4 on Chrome (main browser)
- [ ] Export MP4 on Edge (Chromium alternative)
- [ ] Test all 5 aspect ratios
- [ ] Test with external logo URL (with CORS)
- [ ] Verify file plays in VLC/QuickTime
- [ ] Check file size is reasonable (<3MB)
- [ ] Test error recovery (invalid logo URL)
- [ ] Run automated test suite
- [ ] Check browser console for warnings
- [ ] Monitor memory usage during export

## Troubleshooting Guide

### Tests Hang During MP4 Encoding
```bash
# Set longer timeout
npx playwright test mp4-export --timeout=300000
```

### Memory Issues on CI
```bash
# Run tests sequentially to avoid memory spike
npx playwright test --workers=1
```

### CORS Errors with Logo
Make sure logo URL has proper CORS headers:
```bash
curl -i https://your-logo-url.com/logo.png
# Check for: Access-Control-Allow-Origin: *
```

### VP8/VP9 Codec Issues
Current config uses H.264 (AVC1) which is widely supported.
If you need VP8/VP9, update `video-export.ts` line 100:
```typescript
codec: 'vp8' or 'vp9'  // Instead of 'avc1.4d4028'
```

## Future Improvements

- [ ] Add audio track support
- [ ] Implement 60fps export option
- [ ] Add custom bitrate setting
- [ ] Support for VP8/VP9 codecs
- [ ] Async worker threads for parallel encoding
- [ ] Hardware acceleration detection
- [ ] Performance profiling dashboard

## References

- [Web Codecs API](https://www.w3.org/TR/webcodecs/)
- [MP4 Box Format](https://en.wikipedia.org/wiki/ISO/IEC_base_media_file_format)
- [Playwright Testing](https://playwright.dev/)
- [VideoEncoder MDN](https://developer.mozilla.org/en-US/docs/Web/API/VideoEncoder)
