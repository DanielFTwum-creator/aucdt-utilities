# Screenshot Generation

The tuc-ai-lab-catalog uses pre-generated screenshots instead of capturing them on-the-fly to keep the deployment lean.

## Local Generation

### Prerequisites
- Playwright is installed (`pnpm install` handles this)
- You have network access to all target URLs

### Generate Screenshots

```bash
cd tuc-ai-lab-catalog
pnpm run generate-screenshots
```

This will:
1. Launch a headless Chromium browser
2. Navigate to each tool's URL
3. Inject authenticated user data (so login screens are bypassed)
4. Hide common popups (cookies, modals, banners)
5. Capture and save screenshots to `public/screenshots/`

### Deployment

1. **Local:** After generating screenshots, commit them:
   ```bash
   git add public/screenshots/*.jpg
   git commit -m "chore: update tool screenshots"
   ```

2. **Build:** The screenshots are included in the dist folder:
   ```bash
   pnpm build
   ```

3. **Deploy:** Standard deploy flow (rsync/scp) will include the screenshot directory.

## Adding New Tools

Edit `scripts/generate-screenshots.ts` and add entries to the `TOOLS` array:

```typescript
const TOOLS: Tool[] = [
  { slug: 'my-tool', title: 'My Tool', url: 'https://my-tool.techbridge.edu.gh' },
  // ... more tools
];
```

Then run `pnpm run generate-screenshots` again.

## Regeneration Schedule

Screenshots should be regenerated when:
- A tool's UI significantly changes
- Branding/theme updates are deployed
- ~Weekly or monthly as part of routine updates

## Server-Side

The `server.ts` serves pre-generated screenshots at `/api/screenshot?slug=<tool-slug>`.

If a screenshot doesn't exist, it returns a 404 with instructions to run the generator.
