import re

f = 'deploy.ps1'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

# Fix em-dash
content = content.replace('â€”', '—')

content = re.sub(
    r'\$scriptPath.*?Remove-Item -Path \$scriptPath -Force',
    '$b64Script = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($serverScript.Replace("`r", "")))\n$executeCmd = "echo $b64Script | base64 -d | bash"\nssh -o StrictHostKeyChecking=no $RemoteHost $executeCmd',
    content,
    flags=re.DOTALL
)

content = content.replace(
    'ssh -o StrictHostKeyChecking=no $RemoteHost "$serverScript"',
    '$b64Script = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($serverScript.Replace("`r", "")))\n$executeCmd = "echo $b64Script | base64 -d | bash"\nssh -o StrictHostKeyChecking=no $RemoteHost $executeCmd'
)

content = content.replace(
    'ssh -o StrictHostKeyChecking=no $RemoteHost "$restartScript"',
    '$b64Restart = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($restartScript.Replace("`r", "")))\n$executeRestart = "echo $b64Restart | base64 -d | bash"\nssh -o StrictHostKeyChecking=no $RemoteHost $executeRestart'
)

with open(f, 'w', encoding='utf-8-sig', newline='\r\n') as file:
    file.write(content)

print("Deploy file fixed successfully.")
