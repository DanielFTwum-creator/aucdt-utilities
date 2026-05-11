# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mp4-export.spec.ts >> MP4 Video Export - WebCodecs >> should handle MP4 encoding errors gracefully
- Location: tests\mp4-export.spec.ts:176:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
        - button "MP4" [disabled] [ref=e151]:
          - img [ref=e152]
          - text: MP4
        - button "PNG" [disabled] [ref=e158]:
          - img [ref=e159]
          - text: PNG
      - button "HTML" [ref=e164]:
        - img [ref=e165]
        - text: HTML
  - main [ref=e169]:
    - generic [ref=e171]:
      - generic [ref=e172]:
        - heading "Live Production Preview" [level=3] [ref=e173]
        - generic [ref=e176]: Retina Master 2.0
      - generic [ref=e179]:
        - generic [ref=e182]:
          - generic [ref=e183]:
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
              - generic [ref=e206]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e207]: ✦
          - generic [ref=e208]:
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
              - generic [ref=e231]: JULY 2026 ADMISSIONS OPEN
              - generic [ref=e232]: ✦
        - generic [ref=e233]:
          - generic [ref=e234]:
            - generic [ref=e235]:
              - generic [ref=e237]: LIMITED INTAKE · JULY 26 COHORT
              - heading "Apply now. Launch your tech career." [level=1] [ref=e238]:
                - generic [ref=e239]: Apply now.
                - generic [ref=e240]: Launch your
                - generic [ref=e241]: tech career.
              - generic [ref=e243]:
                - generic [ref=e244]: SECURE ADMISSION
                - generic [ref=e245]: admissions.techbridge.edu.gh →
                - link "APPLY NOW →" [ref=e246] [cursor=pointer]:
                  - /url: https://admissions.techbridge.edu.gh
                  - generic [ref=e247]: APPLY NOW →
            - generic [ref=e249]:
              - img "Techbridge University College" [ref=e251]
              - generic [ref=e252]:
                - generic [ref=e253]:
                  - text: TECHBRIDGE
                  - text: UNIVERSITY COLLEGE
                - generic [ref=e254]: techbridge.edu.gh
          - generic [ref=e255]:
            - generic [ref=e256]:
              - generic [ref=e257]: July 26
              - generic [ref=e258]: Cohort starts
            - generic [ref=e260]:
              - generic [ref=e261]: 100%
              - generic [ref=e262]: Hands-on training
            - generic [ref=e264]:
              - generic [ref=e265]: Ghana
              - generic [ref=e266]: Based in Ghana
      - generic [ref=e268]:
        - generic [ref=e271]: CMYK Verified
        - generic [ref=e274]: 300 DPI Export
        - generic [ref=e277]: Retina Scaling
      - generic [ref=e278]:
        - generic [ref=e279]:
          - heading "The 6R Methodology" [level=2] [ref=e280]
          - paragraph [ref=e281]: A disciplined framework for aesthetic enhancement and systemic brand consistency.
        - generic [ref=e282]:
          - generic [ref=e283]:
            - generic [ref=e284]: "01"
            - img [ref=e286]
            - generic [ref=e291]:
              - generic [ref=e292]:
                - heading "Refresh" [level=4] [ref=e293]
                - heading "Kinetic Urgency" [level=3] [ref=e294]
              - paragraph [ref=e295]: Legacy marquees are upgraded with Barlow Condensed and ✦ glyph separators, creating a sophisticated yet urgent rhythm.
          - generic [ref=e296]:
            - generic [ref=e297]: "02"
            - img [ref=e299]
            - generic [ref=e305]:
              - generic [ref=e306]:
                - heading "Recolour" [level=4] [ref=e307]
                - heading "Warm Foundation" [level=3] [ref=e308]
              - paragraph [ref=e309]: The palette shifts from flat white to a premium parchment (#FAF7F0), anchored by deep espresso statistics bars.
          - generic [ref=e310]:
            - generic [ref=e311]: "03"
            - img [ref=e313]
            - generic [ref=e315]:
              - generic [ref=e316]:
                - heading "Retype" [level=4] [ref=e317]
                - heading "Typographic Tension" [level=3] [ref=e318]
              - paragraph [ref=e319]: High-contrast pairing of Libre Baskerville for editorial authority against JetBrains Mono for data-technical fields.
          - generic [ref=e320]:
            - generic [ref=e321]: "04"
            - img [ref=e323]
            - generic [ref=e325]:
              - generic [ref=e326]:
                - heading "Recompose" [level=4] [ref=e327]
                - heading "Architectural Grids" [level=3] [ref=e328]
              - paragraph [ref=e329]: Moving from generic symmetry to aspect-ratio specific structural logic (Cinema 55/45, Story vertical stacks).
          - generic [ref=e330]:
            - generic [ref=e331]: "05"
            - img [ref=e333]
            - generic [ref=e336]:
              - generic [ref=e337]:
                - heading "Refine" [level=4] [ref=e338]
                - heading "Micro-Detail Mastery" [level=3] [ref=e339]
              - paragraph [ref=e340]: "Executing precision details: asymmetric CTA corners (16px/4px), 0.5px vertical dividers, and 2px gold accent rules."
          - generic [ref=e341]:
            - generic [ref=e342]: "06"
            - img [ref=e344]
            - generic [ref=e347]:
              - generic [ref=e348]:
                - heading "Reinforce" [level=4] [ref=e349]
                - heading "Systemic Equity" [level=3] [ref=e350]
              - paragraph [ref=e351]: Strict adherence to the 24px inner-margin grid and brand-locked logo size scales across all five layout variants.
    - link [ref=e354] [cursor=pointer]:
      - /url: /admin/diagnostics
      - img [ref=e355]
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
                  - generic: LIMITED INTAKE · JULY 26 COHORT
                - heading [level=1]:
                  - generic: Apply now.
                  - generic: Launch your
                  - generic: tech career.
                - generic:
                  - generic:
                    - generic: SECURE ADMISSION
                    - generic: admissions.techbridge.edu.gh →
                    - link:
                      - /url: https://admissions.techbridge.edu.gh
                      - generic: APPLY NOW →
              - generic:
                - generic:
                  - generic:
                    - img
                  - generic:
                    - generic: TECHBRIDGE UNIVERSITY COLLEGE
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
    - generic [ref=e358]:
      - generic [ref=e359]:
        - img [ref=e360]
        - generic [ref=e364]: 37%
      - generic [ref=e365]:
        - heading "Encoding MP4" [level=2] [ref=e366]
        - generic [ref=e367]:
          - paragraph [ref=e368]: Status
          - paragraph [ref=e369]: Encoding frame 28/75...
      - paragraph [ref=e371]: Processing 4:3 Aspect Ratio
```

# Test source

```ts
  105 |     // Check console logs for progress
  106 |     const logs = await page.evaluate(() => (window as any).__progressLogs || []);
  107 |     console.log('Progress logs:', logs);
  108 |   });
  109 | 
  110 |   test('should download MP4 file with correct naming', async ({ page, browserName, context }) => {
  111 |     if (browserName !== 'chromium') return;
  112 | 
  113 |     test.setTimeout(120000);
  114 | 
  115 |     // Create output directory
  116 |     const outputDir = './test-outputs';
  117 |     if (!fs.existsSync(outputDir)) {
  118 |       fs.mkdirSync(outputDir, { recursive: true });
  119 |     }
  120 | 
  121 |     // Track downloads
  122 |     let downloadedFile: string | null = null;
  123 |     const downloadPromise = new Promise<void>((resolve) => {
  124 |       context.on('page', (page) => {
  125 |         page.on('popup', async (popup) => {
  126 |           resolve();
  127 |         });
  128 |       });
  129 |     });
  130 | 
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
> 205 |     expect(isEnabled).toBe(true);
      |                       ^ Error: expect(received).toBe(expected) // Object.is equality
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
```