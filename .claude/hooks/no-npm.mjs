#!/usr/bin/env node
// PreToolUse guard: this monorepo standardises on pnpm.
// Deny any Bash command that invokes bare `npm` or `npx` as a command.
// Word/command-boundary matching means `pnpm` and `pnpm dlx` pass through untouched.
//
// Wired in .claude/settings.json as a PreToolUse hook on the Bash tool.
// Runs via the hook exec form (`"command":"node","args":[...]`) so no shell
// quoting is involved — portable across git-bash and PowerShell on Windows.

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let cmd = '';
  try {
    cmd = JSON.parse(raw || '{}')?.tool_input?.command ?? '';
  } catch {
    // Unparseable payload — don't block; let the tool proceed.
    process.exit(0);
  }

  // Match npm/npx only when it stands as a command token:
  // at the start of the line/pipeline or right after a shell separator
  // (whitespace, ; & | ( ) { }). The preceding-char rule excludes `pnpm`,
  // since the `p` before `npm` is not a separator.
  const offender = /(^|[\s;&|(){}])(npm|npx)([\s;&|(){}]|$)/i.test(cmd);

  if (offender) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          'This monorepo standardises on pnpm (see CLAUDE.md). Use `pnpm` instead of `npm`, ' +
          'and `pnpm exec <bin>` or `pnpm dlx <pkg>` instead of `npx`. ' +
          'e.g. `pnpm build`, `pnpm exec tsc --noEmit`, `pnpm dlx vite build`.',
      },
    }));
  }
  process.exit(0);
});
