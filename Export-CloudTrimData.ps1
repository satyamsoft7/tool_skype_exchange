<#
.SYNOPSIS
    CloudTrim Pro - Automated Data Collector for Microsoft 365 & Azure
.DESCRIPTION
    Runs locally on the administrator workstation to query Microsoft Graph and 
    Azure Resource Manager, exporting clean CSV datasets without third-party cloud tools.
.EXAMPLE
    .\Export-CloudTrimData.ps1 -ExportPath "C:\CloudTrim\Exports"
#>

[CmdletBinding()]
param (
    [string]$ExportPath = "$([Environment]::GetFolderPath('Desktop'))\CloudTrim_Exports",
    [switch]$SkipAzure,
    [switch]$SkipM365
)

# 1. Initialize Export Directory
if (-not (Test-Path $ExportPath)) {
    New-Item -ItemType Directory -Path $ExportPath -Force | Out-Null
    Write-Host "[✓] Created export directory at: $ExportPath" -ForegroundColor Green
}

# ==============================================================================
# SECTION A: MICROSOFT 365 LICENSE & MAILBOX EXPORT
# ==============================================================================
if (-not $SkipM365) {
    Write-Host "`n--- [1/2] Connecting to Microsoft 365 / Entra ID ---" -ForegroundColor Cyan
    try {
        # Check if Microsoft.Graph module is available
        if (-not (Get-Module -ListAvailable -Name Microsoft.Graph.Users)) {
            Write-Warning "Microsoft.Graph module not found. Installing Microsoft.Graph.Users..."
            Install-Module Microsoft.Graph.Users -Scope CurrentUser -Force -AllowClobber
        }

        Connect-MgGraph -Scopes "User.Read.All", "Directory.Read.All" -NoWelcome
        Write-Host "[✓] Authenticated to Microsoft Graph successfully." -ForegroundColor Green

        Write-Host "Querying all tenant users and license allocations..." -ForegroundColor Yellow
        $AllUsers = Get-MgUser -All -Property Id, DisplayName, UserPrincipalName, AccountEnabled, AssignedLicenses, SignInActivity

        $UserReport = foreach ($u in $AllUsers) {
            $LicenseCount = ($u.AssignedLicenses | Measure-Object).Count
            $LastSignIn = if ($u.SignInActivity.LastSignInDateTime) { $u.SignInActivity.LastSignInDateTime } else { "Never / Inactive" }
            
            [PSCustomObject]@{
                DisplayName        = $u.DisplayName
                UserPrincipalName  = $u.UserPrincipalName
                AccountEnabled     = $u.AccountEnabled
                AssignedLicenses   = $LicenseCount
                LastSignInDateTime = $LastSignIn
                IsDisabledLicensed = (-not $u.AccountEnabled -and $LicenseCount -gt 0)
            }
        }

        $M365File = Join-Path $ExportPath "M365_Users_Audit.csv"
        $UserReport | Export-Csv -Path $M365File -NoTypeInformation -Encoding UTF8
        Write-Host "[✓] Saved M365 audit data to: $M365File" -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to export M365 data: $_"
    }
}

# ==============================================================================
# SECTION B: AZURE SUBSCRIPTION ORPHANED RESOURCES EXPORT
# ==============================================================================
if (-not $SkipAzure) {
    Write-Host "`n--- [2/2] Connecting to Microsoft Azure ---" -ForegroundColor Cyan
    try {
        if (-not (Get-Module -ListAvailable -Name Az.Compute)) {
            Write-Warning "Az module not found. Installing Az.Compute and Az.Network..."
            Install-Module Az.Compute, Az.Network, Az.Accounts -Scope CurrentUser -Force -AllowClobber
        }

        Connect-AzAccount -WarningAction SilentlyContinue | Out-Null
        Write-Host "[✓] Authenticated to Azure Resource Manager successfully." -ForegroundColor Green

        Write-Host "Scanning for unattached Managed Disks across subscriptions..." -ForegroundColor Yellow
        $Subscriptions = Get-AzSubscription
        $OrphanedDisks = @()
        $OrphanedIPs = @()

        foreach ($sub in $Subscriptions) {
            Set-AzContext -SubscriptionId $sub.Id | Out-Null

            # 1. Unattached Disks
            $Disks = Get-AzDisk | Where-Object { [string]::IsNullOrEmpty($_.ManagedBy) }
            foreach ($d in $Disks) {
                $OrphanedDisks += [PSCustomObject]@{
                    SubscriptionName  = $sub.Name
                    ResourceGroupName = $d.ResourceGroupName
                    ResourceName      = $d.Name
                    ResourceType      = "Managed Disk ($($d.Sku.Name))"
                    DiskSizeGB        = $d.DiskSizeGB
                    Status            = "Unattached (Orphaned)"
                    EstimatedCostUSD  = [math]::Round(($d.DiskSizeGB * 0.15), 2)
                }
            }

            # 2. Unassociated Public IPs
            $PublicIPs = Get-AzPublicIpAddress | Where-Object { [string]::IsNullOrEmpty($_.IpConfiguration.Id) }
            foreach ($ip in $PublicIPs) {
                $OrphanedIPs += [PSCustomObject]@{
                    SubscriptionName  = $sub.Name
                    ResourceGroupName = $ip.ResourceGroupName
                    ResourceName      = $ip.Name
                    ResourceType      = "Public IP ($($ip.PublicIpAllocationMethod))"
                    IPAddress         = $ip.IpAddress
                    Status            = "Unassociated (Idle)"
                    EstimatedCostUSD  = 4.38
                }
            }
        }

        $AzureFile = Join-Path $ExportPath "Azure_Orphaned_Resources.csv"
        ($OrphanedDisks + $OrphanedIPs) | Export-Csv -Path $AzureFile -NoTypeInformation -Encoding UTF8
        Write-Host "[✓] Saved Azure orphaned resources to: $AzureFile" -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to export Azure data: $_"
    }
}

Write-Host "`n=======================================================" -ForegroundColor White
Write-Host " [✓] Export Complete! Drag and drop files from:" -ForegroundColor Green
Write-Host "     $ExportPath" -ForegroundColor Yellow
Write-Host "     into CloudTrim Pro (tools.skypeexchange4u.com) to view report." -ForegroundColor White
Write-Host "=======================================================`n" -ForegroundColor White
