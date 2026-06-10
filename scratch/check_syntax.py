import subprocess

ps_code = """
$tokens = $null
$errors = $null
[System.Management.Automation.Language.Parser]::ParseFile('tuc-ai-lab-catalog/deploy.ps1', [ref]$tokens, [ref]$errors) | Out-Null
foreach ($e in $errors) {
    Write-Host "ERROR: $($e.Message) at line $($e.Extent.StartLineNumber) col $($e.Extent.StartColumnNumber)"
    Write-Host "TEXT: $($e.Extent.Text)"
    Write-Host "--------------------"
}
"""

res = subprocess.run(["powershell", "-Command", ps_code], capture_output=True, text=True)
print("STDOUT:")
print(res.stdout)
print("STDERR:")
print(res.stderr)
