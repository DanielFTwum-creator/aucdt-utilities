with open("ai-email-drafter/deploy.ps1", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx in [70, 71, 72, 73]:
    if idx < len(lines):
        print(f"Line {idx+1}: {repr(lines[idx])}")
