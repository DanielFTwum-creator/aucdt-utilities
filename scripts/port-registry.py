#!/usr/bin/env python3
"""
port-registry.py — single source of truth for TUC fleet Node ports.

Runs ON the server (66.226.72.199). Ground truth = actual TCP listeners
(`ss -ltnp`) resolved to the owning process via /proc/<pid>/cwd. This is immune
to PM2 parent/child pid skew and to stale PORT env values, which is exactly how
SERVER_PORTS.md drifted ~70% (see feedback: "reality at all times").

Subcommands:
  report            Print the verified PORT -> app table as markdown rows.
  json              Print the verified map as JSON {port: folder}.
  next              Print the lowest free port in the managed range.
  guard PORT FOLDER Exit 0 if PORT is free OR already owned by FOLDER;
                    exit 3 if a DIFFERENT app is bound there (deploy pre-flight).

Range managed: 3000-3099 (Node apps). 5000/8080 are tracked but reserved.
"""
import json, os, re, subprocess, sys

RANGE_LO, RANGE_HI = 3000, 3099
RESERVED = {5000: "tuc-rms-api", 8080: "tuc-wms"}


def listeners():
    """Return {port: (pid, folder)} for actually-bound ports via ss + /proc."""
    out = subprocess.run(["ss", "-ltnp"], capture_output=True, text=True).stdout
    found = {}
    for line in out.splitlines():
        m = re.search(r":(\d{3,5})\s", line)
        p = re.search(r"pid=(\d+)", line)
        if not (m and p):
            continue
        port = int(m.group(1))
        if not (RANGE_LO <= port <= RANGE_HI or port in RESERVED):
            continue
        pid = p.group(1)
        try:
            folder = os.readlink(f"/proc/{pid}/cwd").rstrip("/").split("/")[-1] or "?"
        except OSError:
            folder = "?"
        found.setdefault(port, (pid, folder))
    return found


def cmd_report():
    live = listeners()
    print("| Port | Folder (process cwd) | pid |")
    print("|------|----------------------|-----|")
    for port in sorted(live):
        pid, folder = live[port]
        print(f"| {port} | {folder} | {pid} |")


def cmd_json():
    print(json.dumps({p: f for p, (pid, f) in sorted(listeners().items())}, indent=2))


def cmd_next():
    used = set(listeners()) | set(RESERVED)
    for port in range(RANGE_LO, RANGE_HI + 1):
        if port not in used:
            print(port)
            return
    sys.exit("no free port in range")


def cmd_guard(port, folder):
    port = int(port)
    live = listeners()
    if port not in live:
        print(f"[guard] OK — {port} is free")
        return
    owner = live[port][1]
    if owner == folder:
        print(f"[guard] OK — {port} already owned by {folder} (redeploy)")
        return
    sys.exit(f"[guard] COLLISION — port {port} is bound by '{owner}', not '{folder}'. "
             f"Pick another (run: port-registry.py next). Refusing to crash-loop.")


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    cmd, rest = args[0], args[1:]
    if cmd == "report": cmd_report()
    elif cmd == "json": cmd_json()
    elif cmd == "next": cmd_next()
    elif cmd == "guard":
        if len(rest) != 2:
            sys.exit("usage: port-registry.py guard PORT FOLDER")
        cmd_guard(rest[0], rest[1])
    else:
        sys.exit(f"unknown command: {cmd}\n{__doc__}")


if __name__ == "__main__":
    main()
