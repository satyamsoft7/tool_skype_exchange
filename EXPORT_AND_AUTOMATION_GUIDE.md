# CloudTrim Pro: Data Export & Scheduled Automation Guide

This guide details how to export Microsoft 365 and Azure data manually via admin portals, how to use the automated 1-click PowerShell collector, and how to schedule automated weekly or monthly health audits on your local system.

---

## 1. Manual Export Guide (Via Admin Portals)

If you prefer not to run any scripts, you can export your tenant data directly from the official Microsoft portals in under two minutes:

### A. Microsoft 365 User & License Export
1. Log in to the [Microsoft 365 Admin Center](https://admin.microsoft.com).
2. In the left navigation menu, expand **Users** and click **Active users**.
3. In the top action bar above the user table, click **Export users**.
4. The browser will download a file named `ActiveUsers.csv`.
5. Drag and drop `ActiveUsers.csv` directly into the CloudTrim Pro dashboard.

### B. Azure Orphaned Disks & Cost Export
1. Log in to the [Azure Portal](https://portal.azure.com).
2. To find unattached disks: Search for **Disks** in the top search bar.
   * Add a filter: **Disk state == Unattached**.
   * In the top bar, click **Export to CSV**.
3. To export overall cost usage: Search for **Cost Management + Billing** > **Cost analysis**.
   * Select your billing scope and click **Export** > **Generate CSV**.
4. Drop the exported CSV into the CloudTrim Pro dashboard.

---

## 2. 1-Click PowerShell Data Collector (`Export-CloudTrimData.ps1`)

Instead of clicking through multiple web portals, run our automated PowerShell script on your workstation:

```powershell
# Run the collector from your project directory
.\Export-CloudTrimData.ps1
```

### Optional Parameters:
* `-ExportPath "C:\MyExports"`: Specify custom output directory (defaults to Desktop\CloudTrim_Exports).
* `-SkipAzure`: Audit only Microsoft 365 licenses.
* `-SkipM365`: Audit only Azure cloud resources.

### What the script executes:
* Authenticates directly via official `Connect-MgGraph` and `Connect-AzAccount` sessions.
* Collects account enabled status, assigned license count, and last sign-in timestamp.
* Scans all Azure subscriptions for Managed Disks where `ManagedBy == $null` and unassociated Public IPs.
* Exports clean, formatted CSV files ready for drag-and-drop into CloudTrim Pro.

---

## 3. Automated Weekly & Monthly Scheduling (`Schedule-CloudTrimAudit.ps1`)

To automate audits without any manual intervention, use Windows Task Scheduler to run the collector automatically:

### Option A: Schedule a Weekly Audit (Every Monday at 9:00 AM)
```powershell
# Run PowerShell as Administrator:
.\Schedule-CloudTrimAudit.ps1 -Cadence "Weekly" -DayOfWeek "Monday" -Time "09:00"
```

### Option B: Schedule a Monthly Audit (1st of Every Month at 9:00 AM)
```powershell
# Run PowerShell as Administrator:
.\Schedule-CloudTrimAudit.ps1 -Cadence "Monthly" -DayOfMonth 1 -Time "09:00"
```

---

## 4. How to Offer Automated Audits as a Paid Service

This automation workflow enables two lucrative service models for your blog readers and clients:

* **Self-Service Software ($19/mo or $39 one-time):** Clients download the scripts, run them on their own schedules, and drop the output into `tools.skypeexchange4u.com`.
* **Automated MSP / Retainer Service ($99–$199/mo per client):** You configure the scheduled task on client jumpboxes, which automatically generates monthly executive PDF reports showing cost savings—delivering an immediate return on their IT retainer.
