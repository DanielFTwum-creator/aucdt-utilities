# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mp4-export.spec.ts >> MP4 Video Export - WebCodecs >> should export valid MP4 from all aspect ratios
- Location: tests\mp4-export.spec.ts:234:3

# Error details

```
TypeError: The "path" argument must be of type string. Received function suggestedFilename
```

```
Error: page.waitForTimeout: Test ended.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img "Logo" [ref=e8]
        - generic [ref=e9]:
          - heading "TECHBRIDGE" [level=1] [ref=e10]
          - paragraph [ref=e11]: Poster Studio
      - button [ref=e13]:
        - img [ref=e15]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e20]:
          - img [ref=e21]
          - heading "Layout" [level=2] [ref=e23]
        - generic [ref=e24]:
          - button "SQUARE 1:1" [ref=e26]:
            - generic [ref=e27]: SQUARE
            - generic [ref=e28]: 1:1
          - button "LANDSCAPE 4:3" [ref=e30]:
            - generic [ref=e31]: LANDSCAPE
            - generic [ref=e32]: 4:3
          - button "PORTRAIT 3:4" [ref=e34]:
            - generic [ref=e35]: PORTRAIT
            - generic [ref=e36]: 3:4
          - button "CINEMA 16:9" [ref=e38]:
            - generic [ref=e39]: CINEMA
            - generic [ref=e40]: 16:9
          - button "STORY 9:16" [ref=e42]:
            - generic [ref=e43]: STORY
            - generic [ref=e44]: 9:16
      - generic [ref=e45]:
        - generic [ref=e47]:
          - img [ref=e48]
          - heading "Messaging" [level=2] [ref=e50]
        - generic [ref=e51]:
          - generic [ref=e53]:
            - generic [ref=e54]: Urgency Strip
            - textbox [ref=e55]: JULY 2026 ADMISSIONS OPEN
          - generic [ref=e57]:
            - generic [ref=e58]: Eyebrow
            - textbox [ref=e59]: Limited intake · July 26 cohort
          - generic [ref=e60]:
            - generic [ref=e61]: Headline Content
            - textbox "Line 1" [ref=e63]: Apply now.
            - textbox "Line 2 (Accent)" [ref=e65]: Launch your
            - textbox "Line 3" [ref=e67]: tech career.
            - textbox "Line 4 (Optional)" [ref=e69]
      - generic [ref=e70]:
        - generic [ref=e72]:
          - img [ref=e73]
          - heading "Call to Action" [level=2] [ref=e76]
        - generic [ref=e77]:
          - generic [ref=e79]:
            - generic [ref=e80]: Button Copy
            - textbox [ref=e81]: APPLY NOW →
          - generic [ref=e83]:
            - generic [ref=e84]: Target Link
            - textbox [ref=e85]: https://admissions.techbridge.edu.gh
      - generic [ref=e86]:
        - generic [ref=e88]:
          - img [ref=e89]
          - heading "Brand & Video" [level=2] [ref=e93]
        - generic [ref=e94]:
          - generic [ref=e95]:
            - generic [ref=e96]:
              - text: Video Carousel
              - paragraph [ref=e97]: Interchange logo and tour
            - button [ref=e99]
          - generic [ref=e102]:
            - generic [ref=e103]: Video Source
            - textbox "https://...mp4" [ref=e104]: https://techbridge.edu.gh/static/campus_tour.mp4
          - generic [ref=e106]:
            - generic [ref=e107]: Domain Label
            - textbox [ref=e108]: techbridge.edu.gh
      - generic [ref=e109]:
        - generic [ref=e111]:
          - img [ref=e112]
          - heading "Pillar Statistics" [level=2] [ref=e114]
        - generic [ref=e115]:
          - generic [ref=e116]:
            - generic [ref=e118]:
              - generic [ref=e119]: Value 1
              - textbox [ref=e120]: July 26
            - generic [ref=e122]:
              - generic [ref=e123]: Descriptor 1
              - textbox [ref=e124]: Cohort starts
          - generic [ref=e125]:
            - generic [ref=e127]:
              - generic [ref=e128]: Value 2
              - textbox [ref=e129]: 100%
            - generic [ref=e131]:
              - generic [ref=e132]: Descriptor 2
              - textbox [ref=e133]: Hands-on training
          - generic [ref=e134]:
            - generic [ref=e136]:
              - generic [ref=e137]: Value 3
              - textbox [ref=e138]: Ghana
            - generic [ref=e140]:
              - generic [ref=e141]: Descriptor 3
              - textbox [ref=e142]: Based in Ghana
    - generic [ref=e143]:
      - button "GENERATE PDF" [ref=e145]:
        - img [ref=e146]
        - text: GENERATE PDF
      - generic [ref=e149]:
        - button "MP4" [ref=e151]:
          - img [ref=e152]
          - text: MP4
        - button "PNG" [ref=e155]:
          - img [ref=e156]
          - text: PNG
      - button "HTML" [ref=e161]:
        - img [ref=e162]
        - text: HTML
  - main [ref=e166]:
    - generic [ref=e168]:
      - generic [ref=e169]:
        - heading "Live Production Preview" [level=3] [ref=e170]
        - generic [ref=e173]: Retina Master 2.0
      - generic [ref=e176]:
        - generic [ref=e179]:
          - generic [ref=e180]:
            - generic [ref=e181]:
              - generic [ref=e182]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e183]: ✦
            - generic [ref=e184]:
              - generic [ref=e185]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e186]: ✦
            - generic [ref=e187]:
              - generic [ref=e188]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e189]: ✦
            - generic [ref=e190]:
              - generic [ref=e191]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e192]: ✦
            - generic [ref=e193]:
              - generic [ref=e194]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e195]: ✦
            - generic [ref=e196]:
              - generic [ref=e197]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e198]: ✦
            - generic [ref=e199]:
              - generic [ref=e200]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e201]: ✦
            - generic [ref=e202]:
              - generic [ref=e203]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e204]: ✦
          - generic [ref=e205]:
            - generic [ref=e206]:
              - generic [ref=e207]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e208]: ✦
            - generic [ref=e209]:
              - generic [ref=e210]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e211]: ✦
            - generic [ref=e212]:
              - generic [ref=e213]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e214]: ✦
            - generic [ref=e215]:
              - generic [ref=e216]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e217]: ✦
            - generic [ref=e218]:
              - generic [ref=e219]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e220]: ✦
            - generic [ref=e221]:
              - generic [ref=e222]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e223]: ✦
            - generic [ref=e224]:
              - generic [ref=e225]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e226]: ✦
            - generic [ref=e227]:
              - generic [ref=e228]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e229]: ✦
        - generic [ref=e230]:
          - generic [ref=e231]:
            - generic [ref=e232]:
              - img "Techbridge University College" [ref=e234]
              - generic [ref=e236]: Limited intake · July 26 cohort
            - heading "Apply now. Launch your tech career." [level=1] [ref=e237]:
              - generic [ref=e238]: Apply now.
              - generic [ref=e239]: Launch your
              - generic [ref=e240]: tech career.
            - generic [ref=e241]:
              - link "APPLY NOW → →" [ref=e242] [cursor=pointer]:
                - /url: https://admissions.techbridge.edu.gh
                - generic [ref=e243]: APPLY NOW →
                - generic [ref=e244]: →
              - generic [ref=e245]: techbridge.edu.gh
          - generic [ref=e246]:
            - generic [ref=e247]:
              - generic [ref=e248]: July 26
              - generic [ref=e249]: Cohort starts
            - generic [ref=e251]:
              - generic [ref=e252]: 100%
              - generic [ref=e253]: Hands-on training
            - generic [ref=e255]:
              - generic [ref=e256]: Ghana
              - generic [ref=e257]: Based in Ghana
      - generic [ref=e259]:
        - generic [ref=e262]: CMYK Verified
        - generic [ref=e265]: 300 DPI Export
        - generic [ref=e268]: Retina Scaling
      - generic [ref=e269]:
        - generic [ref=e270]:
          - heading "The 6R Methodology" [level=2] [ref=e271]
          - paragraph [ref=e272]: A disciplined framework for aesthetic enhancement and systemic brand consistency.
        - generic [ref=e273]:
          - generic [ref=e274]:
            - generic [ref=e275]: "01"
            - img [ref=e277]
            - generic [ref=e282]:
              - generic [ref=e283]:
                - heading "Refresh" [level=4] [ref=e284]
                - heading "Kinetic Urgency" [level=3] [ref=e285]
              - paragraph [ref=e286]: Legacy marquees are upgraded with Barlow Condensed and ✦ glyph separators, creating a sophisticated yet urgent rhythm.
          - generic [ref=e287]:
            - generic [ref=e288]: "02"
            - img [ref=e290]
            - generic [ref=e296]:
              - generic [ref=e297]:
                - heading "Recolour" [level=4] [ref=e298]
                - heading "Warm Foundation" [level=3] [ref=e299]
              - paragraph [ref=e300]: The palette shifts from flat white to a premium parchment (#FAF7F0), anchored by deep espresso statistics bars.
          - generic [ref=e301]:
            - generic [ref=e302]: "03"
            - img [ref=e304]
            - generic [ref=e306]:
              - generic [ref=e307]:
                - heading "Retype" [level=4] [ref=e308]
                - heading "Typographic Tension" [level=3] [ref=e309]
              - paragraph [ref=e310]: High-contrast pairing of Libre Baskerville for editorial authority against JetBrains Mono for data-technical fields.
          - generic [ref=e311]:
            - generic [ref=e312]: "04"
            - img [ref=e314]
            - generic [ref=e316]:
              - generic [ref=e317]:
                - heading "Recompose" [level=4] [ref=e318]
                - heading "Architectural Grids" [level=3] [ref=e319]
              - paragraph [ref=e320]: Moving from generic symmetry to aspect-ratio specific structural logic (Cinema 55/45, Story vertical stacks).
          - generic [ref=e321]:
            - generic [ref=e322]: "05"
            - img [ref=e324]
            - generic [ref=e327]:
              - generic [ref=e328]:
                - heading "Refine" [level=4] [ref=e329]
                - heading "Micro-Detail Mastery" [level=3] [ref=e330]
              - paragraph [ref=e331]: "Executing precision details: asymmetric CTA corners (16px/4px), 0.5px vertical dividers, and 2px gold accent rules."
          - generic [ref=e332]:
            - generic [ref=e333]: "06"
            - img [ref=e335]
            - generic [ref=e338]:
              - generic [ref=e339]:
                - heading "Reinforce" [level=4] [ref=e340]
                - heading "Systemic Equity" [level=3] [ref=e341]
              - paragraph [ref=e342]: Strict adherence to the 24px inner-margin grid and brand-locked logo size scales across all five layout variants.
    - link [ref=e345] [cursor=pointer]:
      - /url: /admin/diagnostics
      - img [ref=e346]
    - generic:
      - generic:
        - generic:
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                - generic:
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
                  - generic:
                    - generic: JULY 2026 ADMISSIONS OPEN
                    - generic: ✦
          - generic:
            - generic:
              - generic:
                - generic:
                  - img
                - generic:
                  - generic: Limited intake · July 26 cohort
              - heading [level=1]:
                - generic: Apply now.
                - generic: Launch your
                - generic: tech career.
              - generic:
                - link:
                  - /url: https://admissions.techbridge.edu.gh
                  - generic: APPLY NOW →
                  - generic: →
                - generic: techbridge.edu.gh
            - generic:
              - generic:
                - generic: July 26
                - generic: Cohort starts
              - generic:
                - generic: 100%
                - generic: Hands-on training
              - generic:
                - generic: Ghana
                - generic: Based in Ghana
    - generic [ref=e348]:
      - generic [ref=e349]:
        - generic [ref=e350]: Sync Failure
        - generic [ref=e351]: "Video Export Error: Frame 32 encoding failed: Frame 32: canvas render timeout (>10s) Partial video (159801 bytes) should have been auto-saved. Try: - Reduce logo file size or use a different image - Check browser is Chrome/Edge - Disable video overlay if enabled"
      - button [ref=e352]:
        - img [ref=e353]
```

# Test source

```ts
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
  231 |     await page.locator('.fixed.inset-0.z-\\[200\\]').waitFor({ state: 'hidden', timeout: 120000 });
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
> 258 |         await page.waitForTimeout(500); // Wait for UI to update
      |                    ^ Error: page.waitForTimeout: Test ended.
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
  332 |     if (browserName !== 'chromium') return;
  333 | 
  334 |     test.setTimeout(180000);
  335 | 
  336 |     const mp4Button = page.locator('button:has-text("MP4")').first();
  337 |     if (await mp4Button.evaluate((el) => el.disabled)) return;
  338 | 
  339 |     // First export attempt
  340 |     console.log('First export attempt...');
  341 |     await mp4Button.click();
  342 | 
  343 |     // Wait for modal overlay to appear (indicates export is running)
  344 |     const modalOverlay = page.locator('.fixed.inset-0.z-\\[200\\]');
  345 |     await modalOverlay.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
  346 |       console.log('Modal did not appear');
  347 |     });
  348 | 
  349 |     // Wait for modal to disappear (indicates export completed)
  350 |     try {
  351 |       await modalOverlay.waitFor({ state: 'hidden', timeout: 120000 });
  352 |     } catch (e) {
  353 |       console.log('Modal did not disappear within timeout:', e);
  354 |       return; // Exit early if modal never disappears
  355 |     }
  356 | 
  357 |     // Wait longer for state to update from React
  358 |     await page.waitForTimeout(3000);
```