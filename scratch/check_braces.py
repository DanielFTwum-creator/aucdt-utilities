import re

with open("ai-email-drafter/deploy.ps1", "r", encoding="utf-8") as f:
    lines = f.readlines()

brace_stack = []
in_herestring = False
herestring_marker = ""

for i, line in enumerate(lines):
    line_num = i + 1
    # Check for here-string start/end
    if not in_herestring:
        m_start = re.search(r'@(["\'])', line)
        if m_start:
            in_herestring = True
            herestring_marker = m_start.group(1)
            continue
    else:
        # Check for here-string end
        if line.strip() == herestring_marker + "@":
            in_herestring = False
            continue
        # Skip everything in here-strings
        continue

    # Clean comments/strings from the line to avoid false positives
    # (Simplified for checking matching braces)
    for char_idx, char in enumerate(line):
        if char == '{':
            brace_stack.append((line_num, char_idx))
        elif char == '}':
            if not brace_stack:
                print(f"Mismatched closing brace '}}' at line {line_num}, col {char_idx}")
            else:
                brace_stack.pop()

if brace_stack:
    print("Unclosed open braces:")
    for l_num, col in brace_stack:
        print(f"  Line {l_num}, col {col}")
else:
    print("All braces outside here-strings are matched!")
