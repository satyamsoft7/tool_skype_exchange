# CloudTrim Pro | Unified M365 & Azure Waste Auditor

A zero-access FinOps & license optimization tool for Microsoft 365 and Azure administrators with built-in interactive in-app onboarding.

## 🚀 Key Integrated Features

1. **Interactive In-App Export Wizard (No Manuals Needed):**
   * **1-Click Portal Helper:** Visual 3-step guide embedded directly above the upload zone.
   * **1-Click PowerShell Runner:** Embedded copy button for instant local data collection (`.\Export-CloudTrimData.ps1`).
   * **Interactive Automation Scheduler:** Visual radio pills to toggle between **Weekly** and **Monthly** schedules, automatically updating and generating the customized Windows Task Scheduler command.
2. **Zero-Access / In-Browser Security:**
   * Parses M365 `ActiveUsers.csv` and Azure Cost CSVs 100% in local browser memory via the HTML5 File API. Zero external servers, zero tenant credentials stored.
3. **Tenant Health Score (0–100):**
   * Dynamic visual gauge indicating tenant optimization efficiency.
4. **"What-If" License Downgrade ROI Simulator:**
   * Interactive slider to model annual savings from downgrading under-utilized E5 licenses.
5. **1-Click Parameterized PowerShell Remediation Generator:**
   * Auto-generates customized `Set-MgUserLicense` and `Remove-AzDisk` scripts to resolve detected leaks in under 2 minutes.

## 📁 Project Structure

* `index.html` — The complete, self-contained single-page web app with embedded Chart.js graphs, interactive in-app wizard, and printable executive PDF styling.
* `Export-CloudTrimData.ps1` — The 1-click PowerShell collector script that queries Microsoft Graph and Azure Resource Manager locally.
* `Schedule-CloudTrimAudit.ps1` — The automation script that registers recurring Weekly or Monthly Windows Scheduled Tasks.
* `EXPORT_AND_AUTOMATION_GUIDE.md` — Complete reference guide for administrators and MSPs.

## 🛠️ How to Test & Run Locally

Open `index.html` directly in your browser:
`file:///Users/dell/tool_skype_exchange/index.html`

## 🌐 How to Deploy to `tools.skypeexchange4u.com` (₹0 Cost)

1. Push this folder to [GitHub](https://github.com).
2. Connect the repository to [Vercel](https://vercel.com) and deploy.
3. In Vercel Project Settings > Domains, add `tools.skypeexchange4u.com`.
4. Add a `CNAME` record in your DNS pointing `tools` to `cname.vercel-dns.com`.
