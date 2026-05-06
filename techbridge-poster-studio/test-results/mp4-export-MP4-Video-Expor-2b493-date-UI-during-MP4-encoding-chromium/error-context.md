# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mp4-export.spec.ts >> MP4 Video Export - WebCodecs >> should update UI during MP4 encoding
- Location: tests\mp4-export.spec.ts:208:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
TimeoutError: locator.waitFor: Timeout 120000ms exceeded.
Call log:
  - waiting for locator('.fixed.inset-0.z-\\[200\\]') to be hidden
    73 × locator resolved to visible <div class="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">…</div>

```

# Test source

```ts
  131 |     // Wait for download
  132 |     const downloadPromise2 = page.waitForEvent('download').then(async (download) => {
  133 |       const filename = download.suggestedFilename;
  134 |       downloadedFile = path.join(outputDir, filename);
  135 |       await download.saveAs(downloadedFile);
  136 |       console.log('Downloaded:', downloadedFile);
  137 |       return downloadedFile;
  138 |     }).catch(() => null);
  139 | 
  140 |     // Click MP4 button
  141 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  142 |     if (await mp4Button.evaluate((el) => el.disabled)) {
  143 |       console.log('MP4 button disabled, skipping');
  144 |       return;
  145 |     }
  146 | 
  147 |     await mp4Button.click();
  148 | 
  149 |     // Wait for download or timeout
  150 |     const result = await Promise.race([
  151 |       downloadPromise2,
  152 |       new Promise(resolve => setTimeout(() => resolve(null), 100000))
  153 |     ]);
  154 | 
  155 |     if (result) {
  156 |       // Verify file exists and has content
  157 |       expect(fs.existsSync(result)).toBe(true);
  158 | 
  159 |       const stats = fs.statSync(result);
  160 |       console.log(`Downloaded file: ${result}, size: ${stats.size} bytes`);
  161 | 
  162 |       // MP4 files should be at least 1KB
  163 |       expect(stats.size).toBeGreaterThan(1024);
  164 | 
  165 |       // Check for MP4 magic number (0x66 0x74 0x79 0x70 = 'ftyp')
  166 |       const buffer = Buffer.alloc(4);
  167 |       const fd = fs.openSync(result, 'r');
  168 |       fs.readSync(fd, buffer, 0, 4, 4);
  169 |       fs.closeSync(fd);
  170 | 
  171 |       const magic = buffer.toString('hex');
  172 |       expect(magic).toBe('66747970'); // 'ftyp' in hex
  173 |     }
  174 |   });
  175 | 
  176 |   test('should handle MP4 encoding errors gracefully', async ({ page, browserName }) => {
  177 |     if (browserName !== 'chromium') return;
  178 | 
  179 |     test.setTimeout(120000);
  180 | 
  181 |     // Try to export
  182 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  183 |     if (await mp4Button.evaluate((el) => el.disabled)) {
  184 |       console.log('MP4 unavailable on this browser');
  185 |       return;
  186 |     }
  187 | 
  188 |     await mp4Button.click();
  189 | 
  190 |     // Wait for modal to appear (indicates export started)
  191 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  192 |       console.log('Modal did not appear');
  193 |     });
  194 | 
  195 |     // Wait for modal to disappear (indicates export completed, successful or not)
  196 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  197 |       console.log('Modal did not disappear');
  198 |       return;
  199 |     });
  200 | 
  201 |     console.log('Export completed');
  202 | 
  203 |     // Button should be enabled again after export
  204 |     const isEnabled = await mp4Button.evaluate((el) => !el.disabled);
  205 |     expect(isEnabled).toBe(true);
  206 |   });
  207 | 
  208 |   test('should update UI during MP4 encoding', async ({ page, browserName }) => {
  209 |     if (browserName !== 'chromium') return;
  210 | 
  211 |     test.setTimeout(120000);
  212 | 
  213 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  214 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  215 | 
  216 |     // Click export
  217 |     await mp4Button.click();
  218 | 
  219 |     // Wait for modal to appear (indicates encoding started and progress is showing)
  220 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  221 |       console.log('Modal did not appear');
  222 |     });
  223 | 
  224 |     // Modal should show progress, so check if text exists
  225 |     const encodingText = page.locator('text=/Encoding MP4/i');
  226 |     await encodingText.waitFor({ timeout: 10000, state: 'visible' }).catch(() => {
  227 |       console.log('Encoding text not found');
  228 |     });
  229 | 
  230 |     // Wait for completion
> 231 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 });
      |                                                      ^ TimeoutError: locator.waitFor: Timeout 120000ms exceeded.
  232 |   });
  233 | 
  234 |   test('should export valid MP4 from all aspect ratios', async ({ page, browserName }) => {
  235 |     if (browserName !== 'chromium') return;
  236 | 
  237 |     test.setTimeout(300000); // 5 minutes for multiple exports
  238 | 
  239 |     const aspectRatios = ['STORY', 'PORTRAIT', 'SQUARE', 'LANDSCAPE', 'CINEMA'];
  240 |     const outputDir = './test-outputs';
  241 | 
  242 |     if (!fs.existsSync(outputDir)) {
  243 |       fs.mkdirSync(outputDir, { recursive: true });
  244 |     }
  245 | 
  246 |     for (const ratio of aspectRatios) {
  247 |       console.log(`Testing MP4 export for ${ratio}`);
  248 | 
  249 |       // Wait for any modal from previous export to disappear
  250 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  251 |         console.log(`Modal may still be visible for ${ratio}`);
  252 |       });
  253 | 
  254 |       // Click aspect ratio button
  255 |       const ratioButton = page.locator(`button:has-text("${ratio}")`).first();
  256 |       if (await ratioButton.isVisible()) {
  257 |         await ratioButton.click();
  258 |         await page.waitForTimeout(500); // Wait for UI to update
  259 |       }
  260 | 
  261 |       // Attempt export
  262 |       const mp4Button = page.locator('button:has-text("MP4")').first();
  263 |       if (await mp4Button.evaluate((el) => el.disabled)) {
  264 |         console.log(`MP4 disabled for ${ratio}, skipping`);
  265 |         continue;
  266 |       }
  267 | 
  268 |       // Set up download listener
  269 |       const downloadPromise = page.waitForEvent('download').then(async (download) => {
  270 |         const filename = `${ratio}-${Date.now()}.mp4`;
  271 |         const filepath = path.join(outputDir, filename);
  272 |         await download.saveAs(filepath);
  273 |         console.log(`Saved: ${filepath}`);
  274 |         return filepath;
  275 |       }).catch(() => null);
  276 | 
  277 |       // Click export
  278 |       await mp4Button.click();
  279 | 
  280 |       // Wait for modal to appear and then disappear
  281 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  282 |         console.log(`Modal did not appear for ${ratio}`);
  283 |       });
  284 | 
  285 |       await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 }).catch(() => {
  286 |         console.log(`Modal did not disappear for ${ratio}`);
  287 |       });
  288 | 
  289 |       // Wait for download with timeout
  290 |       const result = await Promise.race([
  291 |         downloadPromise,
  292 |         new Promise(resolve => setTimeout(() => resolve(null), 90000))
  293 |       ]) as string | null;
  294 | 
  295 |       if (result && fs.existsSync(result)) {
  296 |         const stats = fs.statSync(result);
  297 |         console.log(`✓ ${ratio}: ${stats.size} bytes`);
  298 |         expect(stats.size).toBeGreaterThan(1024);
  299 |       } else {
  300 |         console.log(`⚠ ${ratio}: No download detected`);
  301 |       }
  302 |     }
  303 |   });
  304 | 
  305 |   test('should handle concurrent MP4 requests', async ({ page, browserName }) => {
  306 |     if (browserName !== 'chromium') return;
  307 | 
  308 |     test.setTimeout(180000);
  309 | 
  310 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  311 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  312 | 
  313 |     // Attempt to click MP4 button twice quickly
  314 |     console.log('Clicking MP4 button...');
  315 |     await mp4Button.click();
  316 | 
  317 |     // Second click should be prevented (button likely disabled during export)
  318 |     await page.waitForTimeout(500);
  319 |     const isDisabled = await mp4Button.evaluate((el) => el.disabled);
  320 |     console.log('Button disabled after first click:', isDisabled);
  321 | 
  322 |     expect(isDisabled).toBe(true); // Should be disabled during export
  323 | 
  324 |     // Wait for completion
  325 |     await Promise.race([
  326 |       page.waitForSelector('text="Export Finalized"').catch(() => null),
  327 |       new Promise(resolve => setTimeout(() => resolve(null), 150000))
  328 |     ]);
  329 |   });
  330 | 
  331 |   test('should recover from encoding errors and allow retry', async ({ page, browserName }) => {
```