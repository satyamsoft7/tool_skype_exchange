<#
.SYNOPSIS
    CloudTrim Pro - Automated Weekly & Monthly Audit Scheduler
.DESCRIPTION
    Registers a Windows Scheduled Task on the administrator machine to automatically 
    run Export-CloudTrimData.ps1 on a Weekly or Monthly cadence and send/log notifications.
.EXAMPLE
    .\Schedule-CloudTrimAudit.ps1 -Cadence "Weekly" -DayOfWeek "Monday" -Time "09:00"
    .\Schedule-CloudTrimAudit.ps1 -Cadence "Monthly" -DayOfMonth 1 -Time "09:00"
#>

[CmdletBinding()]
param (
    [ValidateSet("Weekly", "Monthly")]
    [string]$Cadence = "Weekly",
    
    [ValidateSet("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")]
    [string]$DayOfWeek = "Monday",

    [int]$DayOfMonth = 1,

    [string]$Time = "09:00",

    [string]$TaskName = "CloudTrim_Automated_Audit",

    [string]$ScriptPath = "$PSScriptRoot\Export-CloudTrimData.ps1"
)

# 1. Validate script path exists
if (-not (Test-Path $ScriptPath)) {
    Write-Error "Could not find Export-CloudTrimData.ps1 at $ScriptPath"
    return
}

# 2. Configure Trigger
$TriggerTime = [datetime]::ParseExact($Time, "HH:mm", $null)

if ($Cadence -eq "Weekly") {
    $Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek $DayOfWeek -At $TriggerTime
    $FrequencyDescription = "Every $DayOfWeek at $Time"
} else {
    # Monthly trigger on specific day
    $Trigger = New-ScheduledTaskTrigger -Monthly -DaysOfMonth $DayOfMonth -At $TriggerTime
    $FrequencyDescription = "Day $DayOfMonth of every month at $Time"
}

# 3. Configure Action
$Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`""

# 4. Configure Settings
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# 5. Register Task in Windows Task Scheduler
try {
    # Unregister existing task if already present
    if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        Write-Host "[-] Replaced existing scheduled task: $TaskName" -ForegroundColor Yellow
    }

    Register-ScheduledTask -TaskName $TaskName -Trigger $Trigger -Action $Action -Settings $Settings -Description "Runs CloudTrim M365 & Azure automated health audit on a $Cadence cadence."
    
    Write-Host "`n=======================================================" -ForegroundColor Green
    Write-Host " [✓] Scheduled Task Registered Successfully!" -ForegroundColor Green
    Write-Host "     Task Name: $TaskName" -ForegroundColor White
    Write-Host "     Frequency: $FrequencyDescription" -ForegroundColor White
    Write-Host "     Executes:  $ScriptPath" -ForegroundColor White
    Write-Host "=======================================================`n" -ForegroundColor Green
}
catch {
    Write-Error "Failed to register scheduled task. Ensure you are running PowerShell as Administrator: $_"
}
