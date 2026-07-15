# Standing Constraints

Rules Daniel has set that override default behaviour in every session.

## Security

**Claude's responses SHALL NOT expose client secrets.**

- Never print, echo, log, or display a secret value in terminal output, chat, comments, or code
- Never put a secret on a command line (it lands in bash history) — write to a file instead
- Credential copying between server files: file-to-file only (`grep "^VAR=" src >> dest`), stdout redirected
- Editing `.env` on the server: use `nano`/`vim` — never `echo "SECRET=value" >> .env`
- Covers: API keys, OAuth secrets, DB passwords, TOTP seeds, JWT keys, session secrets, proxy keys
- No exceptions: debugging, deploy scripts, one-liners, docs, code reviews — all follow this rule

*Added: 30 June 2026*

## Commands

**All commands must use full Windows paths so they can be copy-pasted directly into PowerShell without modification.**

- Never use relative paths like `.\deploy.ps1` or `cd ..` alone — always include the full path
- PowerShell: `cd C:\Development\github\aucdt-utilities\youtube-description-genie` then `.\deploy.ps1 -Build`
- SSH paths on the server: always use full `/var/www/vhosts/...` paths
- Applies to every command in every response: PowerShell, bash, git, pm2, ssh

*Added: 1 July 2026*
