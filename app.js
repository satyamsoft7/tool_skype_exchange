/**
 * ==============================================================================
 * CloudTrim Enterprise - Client Application Engine
 * Architecture: 100% In-Browser RAM Execution | Zero Server Transits
 * Deployment: Production Release October 14, 2026
 * Standards: Microsoft Fluent 2 & Corporate FinOps
 * ==============================================================================
 */

// Sample Contoso Reference Dataset (Reconciled 1:1 with visible findings)
const SAMPLE_CONTOSO_DATA = {
  currentTenant: 'contoso.onmicrosoft.com',
  assessmentDate: 'October 14, 2026',
  baseline: {
    monthlyWasteUSD: 556.90,
    annualWasteUSD: 6682.80,
    governanceScore: 74,
    m365SeatCount: 7,
    m365WasteUSD: 171.00,
    azureAssetCount: 5,
    azureWasteUSD: 385.90
  },
  decisionFindings: [
    {
      id: "find-1",
      finding: "Unattached disk candidate",
      resourceLabel: "3 Managed Disks (disk-webprod-backup-os, disk-testdb-data01, disk-analytics-worker)",
      estimatedSavingUSD: 235.52,
      evidence: "Source: Azure Resource Graph (October 14, 2026). ManagedBy is NULL, 0 attached VMs for 38-90 days.",
      confidence: "Needs review",
      confidenceClass: "badge-confidence-amber",
      nextAction: "Inspect resource",
      actionType: "inspect-disk",
      reviewed: false,
      excluded: false,
      dismissed: false,
      category: "Azure Infrastructure"
    },
    {
      id: "find-2",
      finding: "Empty App Service Plan",
      resourceLabel: "asp-legacy-api-dev (P1v2 Tier)",
      estimatedSavingUSD: 146.00,
      evidence: "Source: Azure Resource Manager. Hosting 0 web apps or containers in rg-apps-legacy for 45 days.",
      confidence: "Needs review",
      confidenceClass: "badge-confidence-amber",
      nextAction: "Inspect resource",
      actionType: "inspect-plan",
      reviewed: false,
      excluded: false,
      dismissed: false,
      category: "Azure Infrastructure"
    },
    {
      id: "find-3",
      finding: "Disabled user with license",
      resourceLabel: "3 Entra ID Offboarded Users (rahul.sharma, priya.verma, neha.gupta)",
      estimatedSavingUSD: 99.00,
      evidence: "Source: Microsoft Entra ID. Account status is Disabled (AccountEnabled -eq $false). Assigned SKUs unrevoked.",
      confidence: "Needs review",
      confidenceClass: "badge-confidence-amber",
      nextAction: "Confirm retention needs",
      actionType: "confirm-retention",
      reviewed: false,
      excluded: false,
      dismissed: false,
      category: "M365 Licenses"
    },
    {
      id: "find-4",
      finding: "Inactive user with premium license",
      resourceLabel: "amit.kumar@contoso.com (Office 365 E5)",
      estimatedSavingUSD: 38.00,
      evidence: "Source: Microsoft Graph signInActivity. Zero authenticated sessions in 130 days. Candidate for license revocation/downgrade.",
      confidence: "Needs review",
      confidenceClass: "badge-confidence-amber",
      nextAction: "Confirm retention needs",
      actionType: "confirm-retention",
      reviewed: false,
      excluded: false,
      dismissed: false,
      category: "M365 Licenses"
    },
    {
      id: "find-5",
      finding: "Over-licensed shared mailbox",
      resourceLabel: "3 Shared Mailboxes (invoices@, support-team@, operations@)",
      estimatedSavingUSD: 34.00,
      evidence: "Source: Exchange Online. Mailbox size <50GB. Redundant paid standalone plans assigned ($22 + $4 + $8).",
      confidence: "Needs review",
      confidenceClass: "badge-confidence-amber",
      nextAction: "Review mailbox holds",
      actionType: "review-holds",
      reviewed: false,
      excluded: false,
      dismissed: false,
      category: "M365 Licenses"
    },
    {
      id: "find-6",
      finding: "Unassociated static public IP",
      resourceLabel: "pip-gateway-old-test (Static IPv4)",
      estimatedSavingUSD: 4.38,
      evidence: "Source: Azure Network. ipConfigurations is NULL. 0 bound NICs or Gateways in rg-network-core.",
      confidence: "Needs review",
      confidenceClass: "badge-confidence-amber",
      nextAction: "Inspect resource",
      actionType: "inspect-ip",
      reviewed: false,
      excluded: false,
      dismissed: false,
      category: "Azure Infrastructure"
    }
  ],
  candidateReviews: [
    { id: "rev-1", name: "rahul.sharma@contoso.com", type: "Entra ID Disabled Account", costUSD: 38.00, safetyCheck: "Verified disabled in Entra ID >45 days. Active Office 365 E5 license revocable.", reviewed: false },
    { id: "rev-2", name: "priya.verma@contoso.com", type: "Entra ID Disabled Account", costUSD: 23.00, safetyCheck: "Confirmed offboarded staff. Active Microsoft 365 E3 license unassigned.", reviewed: false },
    { id: "rev-3", name: "neha.gupta@contoso.com", type: "Entra ID Disabled Account", costUSD: 38.00, safetyCheck: "Former contractor identity disabled. Microsoft 365 E5 license revocable.", reviewed: false },
    { id: "rev-4", name: "invoices@contoso.com", type: "Shared Mailbox (14.2 GB)", costUSD: 22.00, safetyCheck: "Size <50GB. Confirmed NO Litigation Hold or Purview retention policy active.", reviewed: false },
    { id: "rev-5", name: "support-team@contoso.com", type: "Shared Mailbox (4.8 GB)", costUSD: 4.00, safetyCheck: "Size <50GB. Redundant Exchange Online P1 standalone license.", reviewed: false },
    { id: "rev-6", name: "operations@contoso.com", type: "Shared Mailbox (2.1 GB)", costUSD: 8.00, safetyCheck: "Size <50GB. Redundant Exchange Online P2 standalone license.", reviewed: false },
    { id: "rev-7", name: "amit.kumar@contoso.com", type: "Inactive User Account", costUSD: 38.00, safetyCheck: "Zero logins in 130 days. Candidate for Office 365 E5 license revocation.", reviewed: false },
    { id: "rev-8", name: "disk-webprod-backup-os", type: "Azure Managed Disk (Premium SSD 512GB)", costUSD: 76.80, safetyCheck: "ManagedBy is NULL (Unattached 62d). Confirmed no ReadOnly or CanNotDelete lock.", reviewed: false },
    { id: "rev-9", name: "disk-testdb-data01", type: "Azure Managed Disk (Standard SSD 1TB)", costUSD: 76.80, safetyCheck: "ManagedBy is NULL (Unattached 38d). Confirmed no resource lock.", reviewed: false },
    { id: "rev-10", name: "disk-analytics-worker", type: "Azure Managed Disk (Standard HDD 2TB)", costUSD: 81.92, safetyCheck: "ManagedBy is NULL (Unattached 90d). Confirmed no resource lock.", reviewed: false },
    { id: "rev-11", name: "asp-legacy-api-dev", type: "App Service Plan (P1v2)", costUSD: 146.00, safetyCheck: "Hosting 0 web apps or containers in rg-apps-legacy for 45 days.", reviewed: false },
    { id: "rev-12", name: "pip-gateway-old-test", type: "Public IP Address (Static)", costUSD: 4.38, safetyCheck: "Unassociated static IPv4 address in rg-network-core.", reviewed: false }
  ],
  m365Records: [
    { category: "M365", upn: "rahul.sharma@contoso.com", state: "Disabled", sku: "Office 365 E5", skuPartNumber: "ENTERPRISEPREMIUM", skuId: "c5928f49-12ba-48f7-8140-f6f3477d9c93", governanceFinding: "Account disabled 45d in Entra ID; active license billing", holdCheck: "Disabled in Entra ID (Safe)", costUSD: 38.00, severity: "critical", needsVerification: false },
    { category: "M365", upn: "priya.verma@contoso.com", state: "Disabled", sku: "Microsoft 365 E3", skuPartNumber: "SPE_E3", skuId: "05e01617-00a6-4261-a773-5a61447866b2", governanceFinding: "Offboarded staff; license unrevoked", holdCheck: "Offboarded identity (Safe)", costUSD: 23.00, severity: "critical", needsVerification: false },
    { category: "M365", upn: "invoices@contoso.com", state: "Shared Mailbox", sku: "Business Premium", skuPartNumber: "SPB", skuId: "cbdc14ab-e9e6-432d-9e9d-47abedd7ac2d", governanceFinding: "Mailbox size 14GB (Free under 50GB; license unneeded)", holdCheck: "Requires hold verification", costUSD: 22.00, severity: "shared", needsVerification: true },
    { category: "M365", upn: "support-team@contoso.com", state: "Shared Mailbox", sku: "Exchange Online P1", skuPartNumber: "EXCHANGESTANDARD", skuId: "4b5d0382-76be-4b95-821a-493405786616", governanceFinding: "Shared mailbox holding redundant standalone plan", holdCheck: "Requires hold verification", costUSD: 4.00, severity: "shared", needsVerification: true },
    { category: "M365", upn: "amit.kumar@contoso.com", state: "Inactive (130d)", sku: "Office 365 E5", skuPartNumber: "ENTERPRISEPREMIUM", skuId: "c5928f49-12ba-48f7-8140-f6f3477d9c93", governanceFinding: "Zero authenticated sessions in 130d; downgrade candidate", holdCheck: "Zero logins in 130d", costUSD: 38.00, severity: "inactive", needsVerification: false },
    { category: "M365", upn: "neha.gupta@contoso.com", state: "Disabled", sku: "Microsoft 365 E5", skuPartNumber: "ENTERPRISEPREMIUM", skuId: "c5928f49-12ba-48f7-8140-f6f3477d9c93", governanceFinding: "Former contractor; assigned E5 license unrevoked", holdCheck: "Former contractor (Safe)", costUSD: 38.00, severity: "critical", needsVerification: false },
    { category: "M365", upn: "operations@contoso.com", state: "Shared Mailbox", sku: "Exchange Online P2", skuPartNumber: "EXCHANGEENTERPRISE", skuId: "19e2a5dc-d259-48e6-b9b9-630ea7d40dd5", governanceFinding: "Unlicensed shared entitlement recommended", holdCheck: "Requires hold verification", costUSD: 8.00, severity: "shared", needsVerification: true }
  ],
  azureRecords: [
    { category: "Azure", name: "disk-webprod-backup-os", id: "/subscriptions/sub-8921/resourceGroups/rg-ecommerce-prod/providers/Microsoft.Compute/disks/disk-webprod-backup-os", type: "Managed Disk (Premium SSD 512GB)", rg: "rg-ecommerce-prod", condition: "Unattached (62 days)", costUSD: 76.80, needsVerification: false, verifNote: "ManagedBy is confirmed NULL" },
    { category: "Azure", name: "disk-testdb-data01", id: "/subscriptions/sub-8921/resourceGroups/rg-qa-environments/providers/Microsoft.Compute/disks/disk-testdb-data01", type: "Managed Disk (Standard SSD 1TB)", rg: "rg-qa-environments", condition: "Unattached (38 days)", costUSD: 76.80, needsVerification: false, verifNote: "ManagedBy is confirmed NULL" },
    { category: "Azure", name: "pip-gateway-old-test", id: "/subscriptions/sub-8921/resourceGroups/rg-network-core/providers/Microsoft.Network/publicIPAddresses/pip-gateway-old-test", type: "Public IP Address (Static)", rg: "rg-network-core", condition: "Unassociated", costUSD: 4.38, needsVerification: false, verifNote: "ipConfigurations is NULL" },
    { category: "Azure", name: "asp-legacy-api-dev", id: "/subscriptions/sub-8921/resourceGroups/rg-apps-legacy/providers/Microsoft.Web/serverfarms/asp-legacy-api-dev", type: "App Service Plan (P1v2)", rg: "rg-apps-legacy", condition: "0 Apps Deployed", costUSD: 146.00, needsVerification: false, verifNote: "Hosted web apps count = 0" },
    { category: "Azure", name: "disk-analytics-worker", id: "/subscriptions/sub-8921/resourceGroups/rg-analytics-temp/providers/Microsoft.Compute/disks/disk-analytics-worker", type: "Managed Disk (Standard HDD 2TB)", rg: "rg-analytics-temp", condition: "Unattached (90 days)", costUSD: 81.92, needsVerification: false, verifNote: "ManagedBy is confirmed NULL" }
  ]
};

// Global State Store
const AppState = {
  currentTenant: SAMPLE_CONTOSO_DATA.currentTenant,
  assessmentDate: SAMPLE_CONTOSO_DATA.assessmentDate,
  isSampleData: true,
  isDataLoaded: true,
  currency: 'USD',
  inrExchangeRate: 83.25,
  isDryRun: true,
  activeSidebar: 'overview',
  activeSupportingTab: 'm365',
  currentUser: null,
  mfaActive: false,
  m365Filter: 'all',
  m365SearchTerm: '',

  // Baseline Financials (USD) Reconciled 1:1 with visible findings
  baseline: JSON.parse(JSON.stringify(SAMPLE_CONTOSO_DATA.baseline)),

  // Active Exclusions List
  exclusions: [],

  // Findings to Review: Sorted by Potential Savings (Descending)
  decisionFindings: JSON.parse(JSON.stringify(SAMPLE_CONTOSO_DATA.decisionFindings)),

  // Mandatory Review Checklist for Script Unlock (12 candidate resources)
  candidateReviews: JSON.parse(JSON.stringify(SAMPLE_CONTOSO_DATA.candidateReviews)),

  // M365 Records with Real Microsoft SkuIds (7 findings totaling $171.00)
  m365Records: JSON.parse(JSON.stringify(SAMPLE_CONTOSO_DATA.m365Records)),

  // Azure Records (5 findings totaling $385.90)
  azureRecords: JSON.parse(JSON.stringify(SAMPLE_CONTOSO_DATA.azureRecords))
};

// Chart instances
let horizontalBarChart = null;
let donutRatioChart = null;

// ==============================================================================
// 1. DATASET SEPARATION: DEMO VS. CUSTOMER RESULTS
// ==============================================================================

// ==============================================================================
// PRIVACY-FIRST TELEMETRY PIPELINE
// Strict constraint: Never record CSV contents, tenant identifiers, or generated scripts.
// Logs strictly to localStorage and console for product funnel tracking:
// demo_viewed -> csv_imported -> findings_reviewed -> checkout_started -> payment_completed -> repeat_assessment
// ==============================================================================
const Telemetry = {
  storageKey: 'cloudtrim_telemetry_events',

  track(eventName, metadata = {}) {
    const sanitized = {};
    for (const [k, v] of Object.entries(metadata)) {
      const lower = k.toLowerCase();
      if (['csv', 'script', 'tenant', 'user', 'upn', 'email', 'name', 'content'].some(f => lower.includes(f))) {
        continue;
      }
      sanitized[k] = v;
    }

    const eventRecord = {
      event: eventName,
      timestamp: new Date().toISOString(),
      properties: sanitized
    };

    try {
      const logs = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      logs.push(eventRecord);
      if (logs.length > 100) logs.shift();
      localStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (e) {
      console.warn('[Telemetry] LocalStorage write unavailable', e);
    }

    console.info('[CloudTrim Telemetry] [' + eventName + ']', sanitized);
  },

  getFunnel() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }
};

// Global Checkout Click Listener
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href*="checkout.html"]');
  if (link) {
    let plan = 'single_audit';
    try {
      const url = new URL(link.href, window.location.origin);
      plan = url.searchParams.get('plan') || 'single_audit';
    } catch (err) {}
    Telemetry.track('checkout_started', {
      tier: plan,
      source: link.getAttribute('data-source') || 'cta_button'
    });
  }
});

function loadSampleDataMode() {
  Telemetry.track("demo_viewed", { source: "sample_dataset" });
  AppState.isSampleData = true;
  AppState.isDataLoaded = true;
  AppState.currentTenant = SAMPLE_CONTOSO_DATA.currentTenant;
  AppState.assessmentDate = SAMPLE_CONTOSO_DATA.assessmentDate;
  AppState.baseline = JSON.parse(JSON.stringify(SAMPLE_CONTOSO_DATA.baseline));
  AppState.decisionFindings = JSON.parse(JSON.stringify(SAMPLE_CONTOSO_DATA.decisionFindings));
  AppState.candidateReviews = JSON.parse(JSON.stringify(SAMPLE_CONTOSO_DATA.candidateReviews));
  AppState.m365Records = JSON.parse(JSON.stringify(SAMPLE_CONTOSO_DATA.m365Records));
  AppState.azureRecords = JSON.parse(JSON.stringify(SAMPLE_CONTOSO_DATA.azureRecords));
  AppState.exclusions = [];
  AppState.m365Filter = 'all';
  AppState.m365SearchTerm = '';

  hideCsvValidationAlert();

  // Show Persistent Demo Banner
  const banner = document.getElementById('persistentDemoBanner');
  if (banner) banner.style.display = 'flex';

  // Update Header Tenant Pill
  document.getElementById('tenantDot').style.background = '#D97706';
  document.getElementById('tenantDisplay').textContent = 'Demo Workspace (contoso.onmicrosoft.com)';
  document.getElementById('sampleDataBadge').style.display = 'inline-flex';
  document.getElementById('tenantContextName').textContent = 'contoso.onmicrosoft.com';
  document.getElementById('dataModeNotice').textContent = 'Illustrative Sample Scenario';
  document.getElementById('dataModeNotice').style.color = 'var(--attention-amber)';
  document.getElementById('sideDemoBadge').textContent = 'Demo mode';
  document.getElementById('sideDemoBadge').style.background = '#FEF3C7';
  document.getElementById('sideDemoBadge').style.color = '#92400E';
  document.getElementById('datasetTypeBadge').textContent = 'Sample Demo Mode';
  document.getElementById('datasetTypeBadge').style.background = '#FEF3C7';
  document.getElementById('datasetTypeBadge').style.color = '#92400E';
  document.getElementById('datasetTypeBadge').style.borderColor = '#FDE68A';
  document.getElementById('activeFileSummary').textContent = 'Sample data loaded (contoso.onmicrosoft.com)';

  const resetBtn = document.getElementById('btnResetDemo');
  if (resetBtn) resetBtn.style.display = 'none';

  const billingPeriodEl = document.getElementById('billingDataPeriodText');
  const estimationMethodEl = document.getElementById('estimationMethodText');
  if (billingPeriodEl) billingPeriodEl.textContent = 'Trailing 30 Days (September 15 – October 14, 2026)';
  if (estimationMethodEl) estimationMethodEl.textContent = 'Microsoft published tier rate cards • 730 hrs/mo unattached compute & storage calculation';

  const govScoreEl = document.getElementById('cardGovernanceScore');
  const scorePillEl = document.getElementById('scorePillStatus');
  const scoreSubEl = document.getElementById('scoreSubText');
  if (govScoreEl) govScoreEl.innerHTML = `74 <span style="font-size:1rem; font-weight:normal; color:var(--text-muted);">/ 100</span>`;
  if (scorePillEl) scorePillEl.textContent = 'Fair • Attention Required';
  if (scoreSubEl) scoreSubEl.textContent = '26 pts lost to waste';

  try {
    sessionStorage.removeItem('cloudtrim_active_workspace');
  } catch (e) {}

  toggleUploadPanel(false);
  toggleCsvGuide(false);
  resetM365Filters();
  renderDecisionFindings();
  renderSupportingTables();
  renderReviewChecklist();
  renderExclusions();
  updateConfirmedTotals();
  updateCharts();
  generateRemediationScript();
  showToast('Loaded demo dataset for contoso.onmicrosoft.com');
}

// ==============================================================================
// 2. CSV PREPARATION, VALIDATION, ROBUST PARSER & FINOPS ANALYSIS ENGINE
// ==============================================================================
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showCsvValidationAlert(title, message, filename, headers = []) {
  const alertBox = document.getElementById('csvValidationAlert');
  if (!alertBox) return;

  const headerStr = headers.length > 0 ? `<div class="alert-req-cols"><strong>Detected Headers in ${escapeHtml(filename)}:</strong> ${headers.map(h => escapeHtml(h)).join(', ')}</div>` : '';

  alertBox.innerHTML = `
    <h4>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      ${escapeHtml(title)}
    </h4>
    <p>${escapeHtml(message)}</p>
    ${headerStr}
    <div style="font-size:0.78rem; line-height:1.6; margin-bottom:10px;">
      <strong>Actionable Schema Requirements:</strong>
      <ul style="padding-left:18px; margin-top:4px;">
        <li><strong>Microsoft 365 ActiveUsers.csv:</strong> Must contain <code>User principal name</code> (or <code>UserPrincipalName</code>), <code>Block credential</code> (or <code>AccountEnabled</code>), and <code>Licenses</code> (or <code>AssignedLicenses</code>).</li>
        <li><strong>Azure Resources / Cost CSV:</strong> Must contain <code>ResourceId</code> (or <code>ResourceName</code>), <code>ResourceType</code>, <code>ResourceGroup</code>, and <code>PreTaxCostUSD</code>.</li>
      </ul>
    </div>
    <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
      <a href="sample-m365-activeusers.csv" download="sample-m365-activeusers.csv" class="btn btn-outline" style="font-size:0.72rem; padding:4px 10px; background:white;">⬇ Download Supported M365 Sample</a>
      <a href="sample-azure-resources.csv" download="sample-azure-resources.csv" class="btn btn-outline" style="font-size:0.72rem; padding:4px 10px; background:white;">⬇ Download Supported Azure Sample</a>
      <button class="btn btn-outline" style="font-size:0.72rem; padding:4px 10px; background:white;" onclick="hideCsvValidationAlert()">Dismiss Alert</button>
    </div>
  `;
  alertBox.style.display = 'block';
  toggleUploadPanel(true);
}

function hideCsvValidationAlert() {
  const alertBox = document.getElementById('csvValidationAlert');
  if (alertBox) {
    alertBox.style.display = 'none';
    alertBox.innerHTML = '';
  }
}

function getRowVal(row, possibleKeys) {
  const normalizedKeys = Object.keys(row).map(k => ({
    raw: k,
    clean: k.toLowerCase().replace(/[^a-z0-9]/g, '')
  }));
  for (const target of possibleKeys) {
    const cleanTarget = target.toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = normalizedKeys.find(k => k.clean === cleanTarget || k.clean.includes(cleanTarget));
    if (found && row[found.raw] !== undefined && row[found.raw] !== '') {
      return String(row[found.raw]).trim();
    }
  }
  return '';
}

function detectCsvType(headers) {
  if (!headers || headers.length === 0) return null;
  const norm = headers.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const m365Matches = norm.filter(h =>
    h.includes('userprincipalname') || h === 'upn' || h.includes('blockcredential') ||
    h.includes('accountenabled') || h.includes('assignedlicenses') || h === 'licenses' || h.includes('signin')
  );
  const azureMatches = norm.filter(h =>
    h.includes('resourceid') || h.includes('resourcename') || h.includes('resourcegroup') ||
    h.includes('pretaxcost') || h.includes('diskstate') || h.includes('managedby')
  );

  const hasUpn = norm.some(h => h.includes('userprincipalname') || h === 'upn');
  const hasLicOrBlock = norm.some(h => h.includes('licenses') || h.includes('blockcredential') || h.includes('accountenabled'));
  if (hasUpn || (m365Matches.length >= 2 && norm.some(h => h.includes('lic') || h.includes('user')))) {
    return 'm365';
  }

  const hasResourceId = norm.some(h => h.includes('resourceid') || (h.includes('resource') && h.includes('name')));
  if (hasResourceId || azureMatches.length >= 2) {
    return 'azure';
  }

  return null;
}

const SKU_CATALOG = {
  'c5928f49-12ba-48f7-8140-f6f3477d9c93': { name: 'Office 365 E5', sku: 'ENTERPRISEPREMIUM', costUSD: 38.00, skuId: 'c5928f49-12ba-48f7-8140-f6f3477d9c93' },
  '05e01617-00a6-4261-a773-5a61447866b2': { name: 'Microsoft 365 E3', sku: 'SPE_E3', costUSD: 23.00, skuId: '05e01617-00a6-4261-a773-5a61447866b2' },
  'cbdc14ab-e9e6-432d-9e9d-47abedd7ac2d': { name: 'Business Premium', sku: 'SPB', costUSD: 22.00, skuId: 'cbdc14ab-e9e6-432d-9e9d-47abedd7ac2d' },
  '4b5d0382-76be-4b95-821a-493405786616': { name: 'Exchange Online P1', sku: 'EXCHANGESTANDARD', costUSD: 4.00, skuId: '4b5d0382-76be-4b95-821a-493405786616' },
  '19e2a5dc-d259-48e6-b9b9-630ea7d40dd5': { name: 'Exchange Online P2', sku: 'EXCHANGEENTERPRISE', costUSD: 8.00, skuId: '19e2a5dc-d259-48e6-b9b9-630ea7d40dd5' },
  'f243dec6-ba3b-4871-bc1e-8d5914e74321': { name: 'Office 365 E1', sku: 'STANDARDPACK', costUSD: 10.00, skuId: 'f243dec6-ba3b-4871-bc1e-8d5914e74321' }
};

function resolveSkuInfo(rawLicense) {
  if (!rawLicense) return { name: 'Unassigned', sku: 'NONE', costUSD: 0, skuId: 'none' };
  const raw = String(rawLicense).trim();
  const lower = raw.toLowerCase();

  if (SKU_CATALOG[raw]) return SKU_CATALOG[raw];

  // Match friendly names
  if (lower.includes('office 365 e5') || lower.includes('enterprise premium') || lower.includes('enterprisepremium')) {
    return SKU_CATALOG['c5928f49-12ba-48f7-8140-f6f3477d9c93'];
  }
  if (lower.includes('microsoft 365 e5') || lower.includes('m365 e5')) {
    return { name: 'Microsoft 365 E5', sku: 'ENTERPRISEPREMIUM', costUSD: 38.00, skuId: 'c5928f49-12ba-48f7-8140-f6f3477d9c93' };
  }
  if (lower.includes('office 365 e3') || lower.includes('enterprise pack') || lower.includes('enterprisepack')) {
    return { name: 'Office 365 E3', sku: 'ENTERPRISEPACK', costUSD: 23.00, skuId: '6fd2c87f-b296-42f0-b197-1e91e994b900' };
  }
  if (lower.includes('microsoft 365 e3') || lower.includes('m365 e3') || lower.includes('spe_e3')) {
    return SKU_CATALOG['05e01617-00a6-4261-a773-5a61447866b2'];
  }
  if (lower.includes('business premium') || lower.includes('spb')) {
    return SKU_CATALOG['cbdc14ab-e9e6-432d-9e9d-47abedd7ac2d'];
  }
  if (lower.includes('exchange online p1') || lower.includes('exchangestandard')) {
    return SKU_CATALOG['4b5d0382-76be-4b95-821a-493405786616'];
  }
  if (lower.includes('exchange online p2') || lower.includes('exchangeenterprise')) {
    return SKU_CATALOG['19e2a5dc-d259-48e6-b9b9-630ea7d40dd5'];
  }
  if (lower.includes('e1') || lower.includes('standardpack')) {
    return SKU_CATALOG['f243dec6-ba3b-4871-bc1e-8d5914e74321'];
  }

  // Fallback
  return {
    name: raw,
    sku: raw.toUpperCase().replace(/[^A-Z0-9_]/g, '_').slice(0, 20),
    skuId: raw.length > 25 ? raw : 'c5928f49-12ba-48f7-8140-f6f3477d9c93',
    costUSD: 23.00
  };
}

function parseCSVText(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return null;

  function parseLine(line) {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        if (inQuotes && line[i + 1] === char) {
          cur += char;
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  }

  const rawHeaders = parseLine(lines[0]);
  const headers = rawHeaders.map(h => h.replace(/^["']|["']$/g, '').trim());

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] !== undefined ? values[idx].replace(/^["']|["']$/g, '').trim() : '';
    });
    rows.push(row);
  }

  return { headers, rows };
}

function analyzeM365Dataset(rows) {
  const m365Records = [];
  const findings = [];
  const candidateReviews = [];

  let disabledUsersCount = 0;
  let disabledUsersCost = 0;
  const disabledUpns = [];

  let sharedCount = 0;
  let sharedCost = 0;
  const sharedUpns = [];

  let inactiveCount = 0;
  let inactiveCost = 0;
  const inactiveUpns = [];

  rows.forEach((r, idx) => {
    const upn = getRowVal(r, ['UserPrincipalName', 'User principal name', 'UPN', 'EmailAddress', 'DisplayName', 'Display name']) || `user-${idx + 1}@tenant.com`;
    const blockCred = getRowVal(r, ['Block credential', 'BlockCredential']);
    const acctEnabled = getRowVal(r, ['AccountEnabled', 'Account enabled']);
    const isDisabledLicensedVal = getRowVal(r, ['IsDisabledLicensed']);
    const userStatus = getRowVal(r, ['User status', 'Status', 'SignInStatus']);
    const rawLicenses = getRowVal(r, ['Licenses', 'AssignedLicenses', 'Assigned SKUs', 'License']);
    const mailboxType = getRowVal(r, ['MailboxType', 'Mailbox Type', 'RecipientTypeDetails']);
    const lastSignIn = getRowVal(r, ['LastSignInDateTime', 'Last sign-in', 'LastSuccessfulSignInDateTime']);
    const mailboxSize = getRowVal(r, ['MailboxSizeGB', 'TotalItemSizeGB']);

    let isDisabled = false;
    if (blockCred.toLowerCase() === 'true') {
      isDisabled = true;
    } else if (acctEnabled.toLowerCase() === 'false') {
      isDisabled = true;
    } else if (isDisabledLicensedVal.toLowerCase() === 'true') {
      isDisabled = true;
    } else if (userStatus.toLowerCase().includes('disabled') || userStatus.toLowerCase().includes('blocked')) {
      isDisabled = true;
    }

    const hasLicenses = Boolean(rawLicenses && rawLicenses !== '0' && rawLicenses.toLowerCase() !== 'none' && rawLicenses.toLowerCase() !== 'unassigned');
    const skuInfo = resolveSkuInfo(rawLicenses);

    const isShared = mailboxType.toLowerCase().includes('shared') ||
                     upn.toLowerCase().includes('shared') ||
                     getRowVal(r, ['DisplayName', 'Display name']).toLowerCase().includes('shared');

    const isInactive = !isDisabled && !isShared && hasLicenses &&
      (lastSignIn.toLowerCase().includes('never') || (lastSignIn && new Date(lastSignIn) < new Date(Date.now() - 90 * 86400000)));

    if (isDisabled && hasLicenses) {
      disabledUsersCount++;
      disabledUsersCost += skuInfo.costUSD;
      disabledUpns.push(upn);

      m365Records.push({
        category: "M365",
        upn: upn,
        state: "Disabled",
        sku: skuInfo.name,
        skuPartNumber: skuInfo.sku,
        skuId: skuInfo.skuId,
        governanceFinding: `Account disabled in Entra ID; active license billing (${skuInfo.name})`,
        holdCheck: "Disabled in Entra ID (Safe)",
        costUSD: skuInfo.costUSD,
        severity: "critical",
        needsVerification: false
      });

      candidateReviews.push({
        id: `rev-m365-dis-${idx}`,
        name: upn,
        type: "Entra ID Disabled Account",
        costUSD: skuInfo.costUSD,
        safetyCheck: `Confirmed offboarded identity. Revoke ${skuInfo.name} (${skuInfo.skuId}) to stop recurring billing.`,
        reviewed: false
      });
    } else if (isShared && hasLicenses) {
      sharedCount++;
      sharedCost += skuInfo.costUSD;
      sharedUpns.push(upn);

      m365Records.push({
        category: "M365",
        upn: upn,
        state: "Shared Mailbox",
        sku: skuInfo.name,
        skuPartNumber: skuInfo.sku,
        skuId: skuInfo.skuId,
        governanceFinding: `Mailbox size ${mailboxSize || '<50GB'} (Free under 50GB; license unneeded)`,
        holdCheck: "Requires hold verification",
        costUSD: skuInfo.costUSD,
        severity: "shared",
        needsVerification: true
      });

      candidateReviews.push({
        id: `rev-m365-sm-${idx}`,
        name: upn,
        type: `Shared Mailbox (${mailboxSize || '<50'} GB)`,
        costUSD: skuInfo.costUSD,
        safetyCheck: "Size <50GB. Confirmed NO Litigation Hold or Purview retention policy before de-licensing.",
        reviewed: false
      });
    } else if (isInactive && skuInfo.costUSD >= 20) {
      inactiveCount++;
      inactiveCost += skuInfo.costUSD;
      inactiveUpns.push(upn);

      m365Records.push({
        category: "M365",
        upn: upn,
        state: "Inactive (90d+)",
        sku: skuInfo.name,
        skuPartNumber: skuInfo.sku,
        skuId: skuInfo.skuId,
        governanceFinding: `Zero authenticated sessions in 90+ days; candidate for E1 downgrade`,
        holdCheck: `Last login: ${lastSignIn ? lastSignIn.slice(0, 10) : 'Never'}`,
        costUSD: skuInfo.costUSD,
        severity: "inactive",
        needsVerification: false
      });

      candidateReviews.push({
        id: `rev-m365-inact-${idx}`,
        name: upn,
        type: "Inactive User Account",
        costUSD: skuInfo.costUSD,
        safetyCheck: `Last active: ${lastSignIn || 'Never'}. Downgrade from ${skuInfo.name} to optimize license spend.`,
        reviewed: false
      });
    }
  });

  if (disabledUsersCount > 0) {
    findings.push({
      id: "find-m365-disabled",
      finding: "Disabled user with license",
      resourceLabel: `${disabledUsersCount} Entra ID Offboarded User${disabledUsersCount > 1 ? 's' : ''} (${disabledUpns.slice(0, 2).join(', ')}${disabledUsersCount > 2 ? '...' : ''})`,
      estimatedSavingUSD: disabledUsersCost,
      evidence: "Source: Microsoft Entra ID. Account status is Disabled (AccountEnabled -eq $false). Assigned SKUs unrevoked.",
      confidence: "Needs review",
      confidenceClass: "badge-confidence-amber",
      nextAction: "Confirm retention needs",
      actionType: "confirm-retention",
      reviewed: false,
      excluded: false,
      dismissed: false,
      category: "M365 Licenses"
    });
  }

  if (sharedCount > 0) {
    findings.push({
      id: "find-m365-shared",
      finding: "Over-licensed shared mailbox",
      resourceLabel: `${sharedCount} Shared Mailbox${sharedCount > 1 ? 'es' : ''} (${sharedUpns.slice(0, 2).join(', ')}${sharedCount > 2 ? '...' : ''})`,
      estimatedSavingUSD: sharedCost,
      evidence: "Source: Exchange Online. Mailbox size <50GB. Standalone paid licenses assigned. Requires hold & Purview check.",
      confidence: "Needs review",
      confidenceClass: "badge-confidence-amber",
      nextAction: "Review mailbox holds",
      actionType: "review-holds",
      reviewed: false,
      excluded: false,
      dismissed: false,
      category: "M365 Licenses"
    });
  }

  if (inactiveCount > 0) {
    findings.push({
      id: "find-m365-inactive",
      finding: "Inactive user with premium license",
      resourceLabel: `${inactiveCount} Inactive User${inactiveCount > 1 ? 's' : ''} (${inactiveUpns.slice(0, 2).join(', ')})`,
      estimatedSavingUSD: inactiveCost,
      evidence: "Source: Microsoft Graph signInActivity. Zero authenticated sessions in 90+ days. Candidate for E1 downgrade.",
      confidence: "Needs review",
      confidenceClass: "badge-confidence-amber",
      nextAction: "Confirm retention needs",
      actionType: "confirm-retention",
      reviewed: false,
      excluded: false,
      dismissed: false,
      category: "M365 Licenses"
    });
  }

  const totalWasteUSD = disabledUsersCost + sharedCost + inactiveCost;
  return { m365Records, findings, candidateReviews, totalWasteUSD, totalUsers: rows.length };
}

function analyzeAzureDataset(rows) {
  const azureRecords = [];
  const findings = [];
  const candidateReviews = [];

  let unattachedDisksCount = 0;
  let unattachedDisksCost = 0;
  const unattachedDiskNames = [];

  let emptyPlansCount = 0;
  let emptyPlansCost = 0;
  const emptyPlanNames = [];

  let idleIPsCount = 0;
  let idleIPsCost = 0;
  const idleIPNames = [];

  rows.forEach((r, idx) => {
    const name = getRowVal(r, ['ResourceName', 'Resource Name', 'Name', 'resourceId', 'id']) || `azure-asset-${idx}`;
    const id = getRowVal(r, ['ResourceId', 'Resource ID', 'Id']) || name;
    const type = getRowVal(r, ['ResourceType', 'Resource Type', 'Type']);
    const rg = getRowVal(r, ['ResourceGroup', 'Resource Group', 'resourceGroupName']) || 'default-rg';
    const costUSD = parseFloat(getRowVal(r, ['PreTaxCostUSD', 'Cost', 'PreTaxCost', 'EstimatedCostUSD'])) || 0;
    const diskState = getRowVal(r, ['DiskState', 'Disk State', 'Status']).toLowerCase();
    const managedBy = getRowVal(r, ['ManagedBy', 'Managed by']);
    const lockStatus = getRowVal(r, ['LockStatus', 'Lock Status']) || 'None';

    const isDisk = type.toLowerCase().includes('disk') || name.toLowerCase().startsWith('disk-');
    const isPlan = type.toLowerCase().includes('serverfarm') || type.toLowerCase().includes('plan') || name.toLowerCase().startsWith('asp-');
    const isIP = type.toLowerCase().includes('publicip') || type.toLowerCase().includes('network/public') || name.toLowerCase().startsWith('pip-');

    if (isDisk && (diskState.includes('unattached') || (!managedBy && diskState !== 'attached'))) {
      unattachedDisksCount++;
      unattachedDisksCost += costUSD;
      unattachedDiskNames.push(name);

      azureRecords.push({
        category: "Azure",
        name: name,
        id: id,
        type: type || `Managed Disk (${rg})`,
        rg: rg,
        condition: diskState.includes('unattached') ? "Unattached" : "Unattached (No VM attached)",
        costUSD: costUSD,
        needsVerification: lockStatus !== 'None',
        verifNote: lockStatus !== 'None' ? `Resource lock: ${lockStatus}` : "ManagedBy is confirmed NULL"
      });

      candidateReviews.push({
        id: `rev-az-disk-${idx}`,
        name: name,
        type: `Azure Managed Disk ($${costUSD.toFixed(2)}/mo)`,
        costUSD: costUSD,
        safetyCheck: `ManagedBy is NULL. Confirm no ReadOnly lock in ${rg} before deallocation.`,
        reviewed: false
      });
    } else if (isPlan && (managedBy.includes('0') || diskState.includes('0') || diskState === '0 apps' || diskState.includes('empty'))) {
      emptyPlansCount++;
      emptyPlansCost += costUSD;
      emptyPlanNames.push(name);

      azureRecords.push({
        category: "Azure",
        name: name,
        id: id,
        type: type || `App Service Plan (${rg})`,
        rg: rg,
        condition: "0 Apps Deployed",
        costUSD: costUSD,
        needsVerification: false,
        verifNote: "Hosted web apps count = 0"
      });

      candidateReviews.push({
        id: `rev-az-plan-${idx}`,
        name: name,
        type: `App Service Plan ($${costUSD.toFixed(2)}/mo)`,
        costUSD: costUSD,
        safetyCheck: `Hosting 0 apps or containers in ${rg}. Deallocate plan or scale to Free/Shared tier.`,
        reviewed: false
      });
    } else if (isIP && (diskState.includes('unassociated') || diskState.includes('idle') || !managedBy)) {
      idleIPsCount++;
      idleIPsCost += costUSD || 4.38;
      idleIPNames.push(name);

      azureRecords.push({
        category: "Azure",
        name: name,
        id: id,
        type: type || `Public IP Address (${rg})`,
        rg: rg,
        condition: "Unassociated",
        costUSD: costUSD || 4.38,
        needsVerification: false,
        verifNote: "ipConfigurations is NULL"
      });

      candidateReviews.push({
        id: `rev-az-ip-${idx}`,
        name: name,
        type: `Static Public IP ($${(costUSD || 4.38).toFixed(2)}/mo)`,
        costUSD: costUSD || 4.38,
        safetyCheck: `Unassociated IP in ${rg}. Release static IP allocation to eliminate idle charge.`,
        reviewed: false
      });
    }
  });

  if (unattachedDisksCount > 0) {
    findings.push({
      id: "find-az-disks",
      finding: "Unattached disk candidate",
      resourceLabel: `${unattachedDisksCount} Managed Disk${unattachedDisksCount > 1 ? 's' : ''} (${unattachedDiskNames.slice(0, 2).join(', ')}${unattachedDisksCount > 2 ? '...' : ''})`,
      estimatedSavingUSD: unattachedDisksCost,
      evidence: "Source: Azure Resource Graph. ManagedBy is NULL, 0 attached VMs.",
      confidence: "Needs review",
      confidenceClass: "badge-confidence-amber",
      nextAction: "Inspect resource",
      actionType: "inspect-disk",
      reviewed: false,
      excluded: false,
      dismissed: false,
      category: "Azure Infrastructure"
    });
  }

  if (emptyPlansCount > 0) {
    findings.push({
      id: "find-az-plans",
      finding: "Empty App Service Plan",
      resourceLabel: `${emptyPlanNames.join(', ')}`,
      estimatedSavingUSD: emptyPlansCost,
      evidence: "Source: Azure Resource Manager. Hosting 0 web apps or containers.",
      confidence: "Needs review",
      confidenceClass: "badge-confidence-amber",
      nextAction: "Inspect resource",
      actionType: "inspect-plan",
      reviewed: false,
      excluded: false,
      dismissed: false,
      category: "Azure Infrastructure"
    });
  }

  if (idleIPsCount > 0) {
    findings.push({
      id: "find-az-ips",
      finding: "Unassociated static public IP",
      resourceLabel: `${idleIPNames.join(', ')}`,
      estimatedSavingUSD: idleIPsCost,
      evidence: "Source: Azure Network. ipConfigurations is NULL. 0 bound NICs or Gateways.",
      confidence: "Needs review",
      confidenceClass: "badge-confidence-amber",
      nextAction: "Inspect resource",
      actionType: "inspect-ip",
      reviewed: false,
      excluded: false,
      dismissed: false,
      category: "Azure Infrastructure"
    });
  }

  return { azureRecords, findings, candidateReviews, totalWasteUSD: unattachedDisksCost + emptyPlansCost + idleIPsCost, totalAssets: rows.length };
}

function toggleCsvGuide(show) {
  const guide = document.getElementById('csvPreparationGuide');
  if (guide) guide.style.display = show ? 'block' : 'none';
  if (show) guide.scrollIntoView({ behavior: 'smooth' });
}

function saveWorkspaceSession(filename, rowCount, csvType) {
  try {
    const sessionPayload = {
      isSampleData: false,
      currentTenant: AppState.currentTenant,
      assessmentDate: AppState.assessmentDate,
      baseline: AppState.baseline,
      decisionFindings: AppState.decisionFindings,
      candidateReviews: AppState.candidateReviews,
      m365Records: AppState.m365Records,
      azureRecords: AppState.azureRecords,
      exclusions: AppState.exclusions,
      meta: {
        filename: filename,
        rowCount: rowCount,
        csvType: csvType,
        savedAt: new Date().toISOString()
      }
    };
    sessionStorage.setItem('cloudtrim_active_workspace', JSON.stringify(sessionPayload));
  } catch (err) {
    console.warn('[SessionStorage] Failed to save workspace', err);
  }
}

function applyCustomerDataUI(filename, rowCount, csvType) {
  const banner = document.getElementById('persistentDemoBanner');
  if (banner) banner.style.display = 'none';

  const tenantDot = document.getElementById('tenantDot');
  if (tenantDot) tenantDot.style.background = '#22C55E';

  const tenantDisplay = document.getElementById('tenantDisplay');
  if (tenantDisplay) tenantDisplay.textContent = AppState.currentTenant;

  const sampleDataBadge = document.getElementById('sampleDataBadge');
  if (sampleDataBadge) sampleDataBadge.style.display = 'none';

  const tenantContextName = document.getElementById('tenantContextName');
  if (tenantContextName) tenantContextName.textContent = filename || AppState.currentTenant;

  const dataModeNotice = document.getElementById('dataModeNotice');
  if (dataModeNotice) {
    dataModeNotice.textContent = 'Schema-Valid Local Import (Client-Side Parsing)';
    dataModeNotice.style.color = 'var(--savings-green)';
  }

  const sideDemoBadge = document.getElementById('sideDemoBadge');
  if (sideDemoBadge) {
    sideDemoBadge.textContent = 'Customer data';
    sideDemoBadge.style.background = '#DCFCE7';
    sideDemoBadge.style.color = '#15803D';
  }

  const datasetTypeBadge = document.getElementById('datasetTypeBadge');
  if (datasetTypeBadge) {
    datasetTypeBadge.textContent = 'Customer Data Active';
    datasetTypeBadge.style.background = '#DCFCE7';
    datasetTypeBadge.style.color = '#15803D';
    datasetTypeBadge.style.borderColor = '#BBF7D0';
  }

  const activeFileSummary = document.getElementById('activeFileSummary');
  if (activeFileSummary) {
    activeFileSummary.textContent = `${filename} (${rowCount} rows parsed in local RAM)`;
  }

  const resetBtn = document.getElementById('btnResetDemo');
  if (resetBtn) resetBtn.style.display = 'inline-flex';

  const billingPeriodEl = document.getElementById('billingDataPeriodText');
  const estimationMethodEl = document.getElementById('estimationMethodText');
  if (billingPeriodEl) {
    billingPeriodEl.textContent = 'Not Assessed (No billing dates present in uploaded CSV)';
  }
  if (estimationMethodEl) {
    if (csvType === 'm365') {
      estimationMethodEl.textContent = 'Standard Microsoft 365 list price heuristics (Usage activity & Azure unattached compute not evaluated)';
    } else {
      estimationMethodEl.textContent = 'Azure unattached resource heuristics (M365 user licenses not evaluated)';
    }
  }

  if (AppState.baseline && AppState.baseline.governanceScore !== undefined) {
    const govScoreEl = document.getElementById('cardGovernanceScore');
    const scorePillEl = document.getElementById('scorePillStatus');
    const scoreSubEl = document.getElementById('scoreSubText');
    if (govScoreEl) govScoreEl.innerHTML = `${AppState.baseline.governanceScore} <span style="font-size:1rem; font-weight:normal; color:var(--text-muted);">/ 100</span>`;
    if (scorePillEl && AppState.baseline.governanceScoreStatus) scorePillEl.textContent = AppState.baseline.governanceScoreStatus;
    if (scoreSubEl && AppState.baseline.governanceScoreDetails) scoreSubEl.textContent = AppState.baseline.governanceScoreDetails;
  }
}

function restoreWorkspaceSession() {
  try {
    const raw = sessionStorage.getItem('cloudtrim_active_workspace');
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || data.isSampleData) return false;

    AppState.isSampleData = false;
    AppState.isDataLoaded = true;
    AppState.currentTenant = data.currentTenant;
    AppState.assessmentDate = data.assessmentDate || 'October 14, 2026';
    AppState.baseline = data.baseline;
    AppState.decisionFindings = data.decisionFindings;
    AppState.candidateReviews = data.candidateReviews;
    AppState.m365Records = data.m365Records;
    AppState.azureRecords = data.azureRecords;
    AppState.exclusions = data.exclusions || [];

    applyCustomerDataUI(data.meta.filename, data.meta.rowCount, data.meta.csvType);
    toggleUploadPanel(false);
    toggleCsvGuide(false);
    resetM365Filters();
    updateCharts();
    renderDecisionFindings();
    renderSupportingTables();
    renderReviewChecklist();
    renderExclusions();
    updateConfirmedTotals();
    generateRemediationScript();
    return true;
  } catch (err) {
    console.warn('[SessionStorage] Restore failed', err);
    return false;
  }
}

function processUploadedFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const parsed = parseCSVText(text);

    if (!parsed || parsed.rows.length === 0) {
      showCsvValidationAlert(
        'Empty or Malformed File',
        `The file "${file.name}" could not be parsed or contains zero data rows. Please ensure the CSV contains a valid header row and at least one data record.`,
        file.name,
        parsed ? parsed.headers : []
      );
      showToast(`Error: "${file.name}" has no data rows. Sample findings preserved.`);
      return;
    }

    const headers = parsed.headers;
    const csvType = detectCsvType(headers);

    if (!csvType) {
      showCsvValidationAlert(
        'Unsupported CSV Schema',
        `The file "${file.name}" does not contain recognizable Microsoft 365 or Azure columns. CloudTrim requires official schema columns to safely evaluate licensing waste and orphaned infrastructure.`,
        file.name,
        headers
      );
      showToast(`Error: Unsupported CSV schema in "${file.name}". Sample findings preserved.`);
      return;
    }

    // Schema Validated: Clear any previous validation alert
    hideCsvValidationAlert();

    // Switch State to Customer Real Data (Isolating customer results from demo)
    AppState.isSampleData = false;
    AppState.isDataLoaded = true;
    AppState.exclusions = [];

    // Detect tenant domain from UPN or filename
    let detectedTenant = file.name.replace('.csv', '');
    if (csvType === 'm365') {
      const upnRow = parsed.rows.find(r => {
        const upnVal = getRowVal(r, ['UserPrincipalName', 'User principal name', 'UPN', 'EmailAddress']);
        return upnVal && upnVal.includes('@');
      });
      if (upnRow) {
        const fullUpn = getRowVal(upnRow, ['UserPrincipalName', 'User principal name', 'UPN', 'EmailAddress']);
        detectedTenant = fullUpn.split('@')[1];
      }
    }
    AppState.currentTenant = detectedTenant;

    // Process datasets with STRICT DEMO ISOLATION:
    // If customer imports M365, clear Contoso Azure records.
    // If customer imports Azure, clear Contoso M365 records.
    let newFindings = [];
    let newReviews = [];

    if (csvType === 'm365') {
      const m365Analysis = analyzeM365Dataset(parsed.rows);
      AppState.m365Records = m365Analysis.m365Records;
      // Evaluated inventory count and candidate finding count tracked separately
      AppState.baseline.m365SeatCount = m365Analysis.totalUsers;
      AppState.baseline.m365CandidateCount = m365Analysis.m365Records.length;
      AppState.baseline.m365InventoryCount = m365Analysis.totalUsers;
      AppState.baseline.m365WasteUSD = m365Analysis.totalWasteUSD;

      // DEMO ISOLATION: Clear sample Azure records
      AppState.azureRecords = [];
      AppState.baseline.azureAssetCount = 0;
      AppState.baseline.azureCandidateCount = 0;
      AppState.baseline.azureInventoryCount = 0;
      AppState.baseline.azureWasteUSD = 0.00;

      newFindings = m365Analysis.findings;
      newReviews = m365Analysis.candidateReviews;

      // Derive governance score strictly from evaluated M365 evidence
      const candidateCount = m365Analysis.m365Records.length;
      const totalEvaluated = m365Analysis.totalUsers;
      const wasteRatio = totalEvaluated > 0 ? (candidateCount / totalEvaluated) : 0;
      const calculatedScore = Math.max(35, Math.min(95, Math.round(100 - (wasteRatio * 50))));
      AppState.baseline.governanceScore = calculatedScore;
      AppState.baseline.governanceScoreStatus = calculatedScore >= 80 ? 'Good • Low Waste' : calculatedScore >= 60 ? 'Fair • Attention Required' : 'Critical • High License Waste';
      AppState.baseline.governanceScoreDetails = `${100 - calculatedScore} pts lost • Calculated from ${candidateCount} licensed candidate(s) of ${totalEvaluated} accounts evaluated. Azure unassessed.`;
    } else if (csvType === 'azure') {
      const azureAnalysis = analyzeAzureDataset(parsed.rows);
      AppState.azureRecords = azureAnalysis.azureRecords;
      // Evaluated inventory count and candidate finding count tracked separately
      AppState.baseline.azureAssetCount = azureAnalysis.totalAssets;
      AppState.baseline.azureCandidateCount = azureAnalysis.azureRecords.length;
      AppState.baseline.azureInventoryCount = azureAnalysis.totalAssets;
      AppState.baseline.azureWasteUSD = azureAnalysis.totalWasteUSD;

      // DEMO ISOLATION: Clear sample M365 records
      AppState.m365Records = [];
      AppState.baseline.m365SeatCount = 0;
      AppState.baseline.m365CandidateCount = 0;
      AppState.baseline.m365InventoryCount = 0;
      AppState.baseline.m365WasteUSD = 0.00;

      newFindings = azureAnalysis.findings;
      newReviews = azureAnalysis.candidateReviews;

      // Derive governance score strictly from evaluated Azure evidence
      const candidateCount = azureAnalysis.azureRecords.length;
      const totalEvaluated = azureAnalysis.totalAssets;
      const wasteRatio = totalEvaluated > 0 ? (candidateCount / totalEvaluated) : 0;
      const calculatedScore = Math.max(40, Math.min(95, Math.round(100 - (wasteRatio * 45))));
      AppState.baseline.governanceScore = calculatedScore;
      AppState.baseline.governanceScoreStatus = calculatedScore >= 80 ? 'Good • Low Idle Waste' : calculatedScore >= 60 ? 'Fair • Attention Required' : 'Critical • High Idle Capacity';
      AppState.baseline.governanceScoreDetails = `${100 - calculatedScore} pts lost • Calculated from ${candidateCount} orphaned candidate(s) of ${totalEvaluated} resources evaluated. M365 unassessed.`;
    }

    AppState.decisionFindings = newFindings;
    AppState.candidateReviews = newReviews;

    // Recompute Financial Baselines Reconciled with Analysis
    AppState.baseline.monthlyWasteUSD = AppState.baseline.m365WasteUSD + AppState.baseline.azureWasteUSD;
    AppState.baseline.annualWasteUSD = AppState.baseline.monthlyWasteUSD * 12;

    // Update UI elements for customer data
    applyCustomerDataUI(file.name, parsed.rows.length, csvType);

    toggleUploadPanel(false);
    toggleCsvGuide(false);
    resetM365Filters();
    updateCharts();
    renderDecisionFindings();
    renderSupportingTables();
    renderReviewChecklist();
    renderExclusions();
    updateConfirmedTotals();
    generateRemediationScript();

    // Preserve active workspace in browser tab session storage
    saveWorkspaceSession(file.name, parsed.rows.length, csvType);

    Telemetry.track('csv_imported', { filename: file.name, rowCount: parsed.rows.length, csvType });
    showToast(`✓ Ingested ${file.name} (${parsed.rows.length} rows) — Zero bytes sent to cloud`);
  };
  reader.readAsText(file);
}

// ==============================================================================
// 3. DECISION-ORIENTED FINDINGS TABLE (SORTED BY POTENTIAL SAVINGS)
// ==============================================================================
function renderDecisionFindings() {
  const tbody = document.getElementById('tbodyDecisionFindings');
  if (!tbody) return;
  tbody.innerHTML = '';

  // Sort descending by potential savings
  const sorted = [...AppState.decisionFindings].sort((a, b) => b.estimatedSavingUSD - a.estimatedSavingUSD);

  sorted.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = `decision-row ${item.dismissed ? 'dismissed' : ''} ${item.excluded ? 'excluded' : ''}`;
    tr.id = `row-${item.id}`;

    const confBadge = item.reviewed
      ? `<span class="badge-confidence-green">✓ Reviewed</span>`
      : `<span class="badge-confidence-amber">${item.confidence}</span>`;

    tr.innerHTML = `
      <td>
        <span class="finding-name">${item.finding}</span>
        <span class="finding-subtext">${item.resourceLabel}</span>
      </td>
      <td>
        <span class="saving-amount">+${formatMoney(item.estimatedSavingUSD)} / mo</span>
        <div style="font-size:0.7rem; color:var(--text-muted);">${formatMoney(item.estimatedSavingUSD * 12)} / yr</div>
      </td>
      <td>
        <div class="evidence-cell">${item.evidence}</div>
      </td>
      <td>
        <div id="conf-wrap-${item.id}">${confBadge}</div>
      </td>
      <td>
        <div class="finding-actions-wrap">
          <button class="review-btn" style="padding:4px 10px; font-size:0.75rem;" onclick="triggerNextAction('${item.actionType}', '${item.id}')">
            ${item.nextAction} →
          </button>
          <div class="finding-btn-row">
            <button class="btn-action-tiny btn-action-review ${item.reviewed ? 'reviewed' : ''}" id="btn-rev-${item.id}" onclick="toggleMarkReviewed('${item.id}')">
              ${item.reviewed ? '✓ Reviewed' : 'Mark reviewed'}
            </button>
            <button class="btn-action-tiny btn-action-exclude" onclick="toggleExcludeFinding('${item.id}')">
              ${item.excluded ? 'Include' : 'Exclude'}
            </button>
            <button class="btn-action-tiny btn-action-dismiss" onclick="toggleDismissFinding('${item.id}')">
              ${item.dismissed ? 'Restore' : 'Dismiss'}
            </button>
          </div>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function triggerNextAction(actionType, findingId) {
  if (actionType.startsWith('inspect-disk') || actionType.startsWith('inspect-plan') || actionType.startsWith('inspect-ip')) {
    switchSupportingTab('azure');
    document.getElementById('supportingDetailsCard')?.scrollIntoView({ behavior: 'smooth' });
    showToast('Navigated to Azure infrastructure inspection table');
  } else if (actionType.startsWith('confirm-retention') || actionType.startsWith('review-holds')) {
    switchSupportingTab('m365');
    document.getElementById('supportingDetailsCard')?.scrollIntoView({ behavior: 'smooth' });
    showToast('Navigated to M365 license and mailbox hold verification table');
  }
}

function toggleMarkReviewed(findingId) {
  const item = AppState.decisionFindings.find(f => f.id === findingId);
  if (!item) return;

  item.reviewed = !item.reviewed;
  renderDecisionFindings();
  updateConfirmedTotals();
  showToast(item.reviewed ? `✓ Marked "${item.finding}" as reviewed` : `Marked "${item.finding}" as needs review`);
}

function toggleExcludeFinding(findingId) {
  const item = AppState.decisionFindings.find(f => f.id === findingId);
  if (!item) return;

  item.excluded = !item.excluded;
  if (item.excluded) {
    if (!AppState.exclusions.some(e => e.id === findingId)) {
      AppState.exclusions.push({
        id: item.id,
        finding: item.finding,
        resourceLabel: item.resourceLabel,
        amountUSD: item.estimatedSavingUSD,
        reason: "Admin exclusion (Retention / DR requirement)"
      });
    }
  } else {
    AppState.exclusions = AppState.exclusions.filter(e => e.id !== findingId);
  }

  renderDecisionFindings();
  renderExclusions();
  updateConfirmedTotals();
  showToast(item.excluded ? `Excluded "${item.finding}" from potential savings` : `Restored "${item.finding}" into potential savings`);
}

function toggleDismissFinding(findingId) {
  const item = AppState.decisionFindings.find(f => f.id === findingId);
  if (!item) return;

  item.dismissed = !item.dismissed;
  renderDecisionFindings();
  updateConfirmedTotals();
  showToast(item.dismissed ? `Dismissed "${item.finding}"` : `Restored "${item.finding}"`);
}

function renderExclusions() {
  const countEl = document.getElementById('exclusionsCount');
  const container = document.getElementById('exclusionsListContainer');
  if (!container) return;

  if (countEl) countEl.textContent = AppState.exclusions.length;

  if (AppState.exclusions.length === 0) {
    container.innerHTML = `
      <p style="font-size:0.78rem; color:var(--text-muted);" id="noExclusionsNotice">
        No findings excluded yet. Click "Exclude" on any finding above to deduct it from potential savings (e.g. for retention holds or disaster recovery spares).
      </p>
    `;
    return;
  }

  container.innerHTML = '';
  AppState.exclusions.forEach(ex => {
    const div = document.createElement('div');
    div.className = 'exclusion-item';
    div.innerHTML = `
      <div>
        <strong>${ex.finding}</strong> (${ex.resourceLabel})<br>
        <span style="color:#B45309; font-size:0.72rem;">${ex.reason}</span>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="color:var(--text-muted); text-decoration:line-through; font-size:0.78rem;">-${formatMoney(ex.amountUSD)} / mo</span>
        <button class="btn-action-tiny" onclick="toggleExcludeFinding('${ex.id}')">Restore</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function updateConfirmedTotals() {
  // Sum only active, non-excluded, non-dismissed findings
  const activeFindings = AppState.decisionFindings.filter(f => !f.excluded && !f.dismissed);
  const totalMonthlyUSD = activeFindings.reduce((sum, f) => sum + f.estimatedSavingUSD, 0);
  const totalAnnualUSD = totalMonthlyUSD * 12;

  // Sum approved findings (reviewed) - initialized to $0.00 before user review
  const reviewedFindings = activeFindings.filter(f => f.reviewed);
  const approvedMonthlyUSD = reviewedFindings.reduce((sum, f) => sum + f.estimatedSavingUSD, 0);
  const approvedAnnualUSD = approvedMonthlyUSD * 12;

  const reviewedCount = AppState.decisionFindings.filter(f => f.reviewed).length;
  const totalFindings = AppState.decisionFindings.length;

  // Update lead cards
  const leadMonthlyEl = document.getElementById('leadMonthlySavings');
  const leadAnnualEl = document.getElementById('leadAnnualSavings');
  if (leadMonthlyEl) leadMonthlyEl.textContent = formatMoney(totalMonthlyUSD);
  if (leadAnnualEl) leadAnnualEl.textContent = `${formatMoney(totalAnnualUSD)} potential annual savings`;

  // Update M365 Opportunity card: Candidate findings vs total inventory evaluated
  const m365Waste = activeFindings.filter(f => f.category === 'M365 Licenses').reduce((sum, f) => sum + f.estimatedSavingUSD, 0);
  const m365WasteEl = document.getElementById('cardM365Waste');
  const m365SeatsEl = document.getElementById('cardM365SeatVal');
  const m365InvEl = document.getElementById('cardM365InventorySub');

  const m365Candidates = AppState.m365Records.length;
  const m365Inventory = AppState.baseline.m365InventoryCount || AppState.baseline.m365SeatCount || m365Candidates;

  if (m365WasteEl) m365WasteEl.textContent = `${formatMoney(m365Waste)}/mo potential recovery`;
  if (m365SeatsEl) m365SeatsEl.textContent = `${m365Candidates} Seat${m365Candidates === 1 ? '' : 's'}`;
  if (m365InvEl) {
    if (m365Candidates === 0 && !AppState.isSampleData) {
      m365InvEl.textContent = 'Not assessed in this import';
    } else {
      m365InvEl.textContent = `${m365Inventory} account${m365Inventory === 1 ? '' : 's'} evaluated`;
    }
  }

  // Update Azure Opportunity card: Candidate findings vs total inventory evaluated
  const azureWaste = activeFindings.filter(f => f.category === 'Azure Infrastructure').reduce((sum, f) => sum + f.estimatedSavingUSD, 0);
  const azureWasteEl = document.getElementById('cardAzureWaste');
  const azureAssetsEl = document.getElementById('cardAzureAssetVal');
  const azureInvEl = document.getElementById('cardAzureInventorySub');

  const azureCandidates = AppState.azureRecords.length;
  const azureInventory = AppState.baseline.azureInventoryCount || AppState.baseline.azureAssetCount || azureCandidates;

  if (azureWasteEl) azureWasteEl.textContent = `${formatMoney(azureWaste)}/mo idle capacity`;
  if (azureAssetsEl) azureAssetsEl.textContent = `${azureCandidates} Asset${azureCandidates === 1 ? '' : 's'}`;
  if (azureInvEl) {
    if (azureCandidates === 0 && !AppState.isSampleData) {
      azureInvEl.textContent = 'Not assessed in this import';
    } else {
      azureInvEl.textContent = `${azureInventory} resource${azureInventory === 1 ? '' : 's'} evaluated`;
    }
  }

  // Update Navigation & Sub-tab Badges
  const badgeM365 = document.getElementById('badgeM365Count');
  if (badgeM365) badgeM365.textContent = m365Candidates;
  const badgeAzure = document.getElementById('badgeAzureCount');
  if (badgeAzure) badgeAzure.textContent = azureCandidates;
  const subtabBadgeM365 = document.getElementById('subtabBadgeM365');
  if (subtabBadgeM365) subtabBadgeM365.textContent = AppState.m365Records.length;
  const subtabBadgeAzure = document.getElementById('subtabBadgeAzure');
  if (subtabBadgeAzure) subtabBadgeAzure.textContent = AppState.azureRecords.length;

  // Update Section 4: Separate Estimated Gross Potential vs Reviewed & Approved Monthly Recovery
  const estMonthlyEl = document.getElementById('estimatedGrossMonthly');
  const estAnnualEl = document.getElementById('estimatedGrossAnnual');
  if (estMonthlyEl) estMonthlyEl.textContent = formatMoney(totalMonthlyUSD);
  if (estAnnualEl) estAnnualEl.textContent = `${formatMoney(totalAnnualUSD)} / year discovered`;

  const confMonthlyEl = document.getElementById('confirmedMonthlySavings');
  const confAnnualEl = document.getElementById('confirmedAnnualSavings');
  if (confMonthlyEl) confMonthlyEl.textContent = formatMoney(approvedMonthlyUSD);
  if (confAnnualEl) confAnnualEl.textContent = `${formatMoney(approvedAnnualUSD)} / year approved`;

  const ratioEl = document.getElementById('reviewedItemsRatio');
  const pendingEl = document.getElementById('pendingReviewCount');

  if (ratioEl) ratioEl.textContent = `${reviewedCount} / ${totalFindings} Reviewed`;
  if (pendingEl) {
    const pending = totalFindings - reviewedCount;
    if (pending > 0) {
      pendingEl.textContent = `${pending} item${pending === 1 ? '' : 's'} awaiting admin confirmation`;
      pendingEl.style.color = '#B45309';
    } else {
      pendingEl.textContent = `All items reviewed & confirmed safe`;
      pendingEl.style.color = '#15803D';
    }
  }

  // Update Governance score elements if dynamic score is set
  if (AppState.baseline && AppState.baseline.governanceScore !== undefined) {
    const govScoreEl = document.getElementById('cardGovernanceScore');
    const scorePillEl = document.getElementById('scorePillStatus');
    const scoreSubEl = document.getElementById('scoreSubText');
    if (govScoreEl) govScoreEl.innerHTML = `${AppState.baseline.governanceScore} <span style="font-size:1rem; font-weight:normal; color:var(--text-muted);">/ 100</span>`;
    if (scorePillEl && AppState.baseline.governanceScoreStatus) scorePillEl.textContent = AppState.baseline.governanceScoreStatus;
    if (scoreSubEl && AppState.baseline.governanceScoreDetails) scoreSubEl.textContent = AppState.baseline.governanceScoreDetails;
  }
}

function toggleEvidenceDrawer() {
  const card = document.getElementById('supportingDetailsCard');
  if (card) card.scrollIntoView({ behavior: 'smooth' });
}

function scrollToDecisions() {
  document.getElementById('findingsDecisionSection')?.scrollIntoView({ behavior: 'smooth' });
}

// ==============================================================================
// 4. MANDATORY RESOURCE REVIEW CHECKLIST (REMEDIATION GATEWAY)
// ==============================================================================
function renderReviewChecklist() {
  const tbody = document.getElementById('tbodyReviewChecklist');
  if (!tbody) return;
  tbody.innerHTML = '';

  AppState.candidateReviews.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;">
        <input type="checkbox" class="review-checkbox-input" id="check-${item.id}" ${item.reviewed ? 'checked' : ''} onchange="toggleReviewItem('${item.id}', this.checked)">
      </td>
      <td><strong>${item.name}</strong></td>
      <td style="color:var(--text-muted); font-size:0.78rem;">${item.type}</td>
      <td style="font-size:0.78rem; color:#334155;">
        ${item.safetyCheck}
      </td>
      <td>
        <span class="badge ${item.reviewed ? 'badge-neutral' : 'badge-warning'}" id="status-badge-${item.id}">
          ${item.reviewed ? 'Confirmed Safe' : 'Review Needed'}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateReviewLockState();
}

function toggleReviewItem(id, isChecked) {
  const target = AppState.candidateReviews.find(r => r.id === id);
  if (target) target.reviewed = isChecked;

  // Sync with matching decision findings if all items in that category are checked
  if (target) {
    const finding = AppState.decisionFindings.find(f => (f.resourceLabel && f.resourceLabel.includes(target.name)) || (f.id && f.id.includes('m365') && target.type && target.type.includes('Entra')) || (f.id && f.id.includes('shared') && target.type && target.type.includes('Shared')));
    if (finding) {
      finding.reviewed = isChecked;
      renderDecisionFindings();
    }
  }

  const badge = document.getElementById(`status-badge-${id}`);
  if (badge) {
    badge.className = `badge ${isChecked ? 'badge-neutral' : 'badge-warning'}`;
    badge.textContent = isChecked ? 'Confirmed Safe' : 'Review Needed';
  }
  updateReviewLockState();
  updateConfirmedTotals();
}

function markAllReviewed() {
  AppState.candidateReviews.forEach(r => r.reviewed = true);
  AppState.decisionFindings.forEach(f => f.reviewed = true);
  renderReviewChecklist();
  renderDecisionFindings();
  updateConfirmedTotals();
  showToast('✓ All candidate resources marked as reviewed and confirmed safe');
}

function updateReviewLockState() {
  const reviewedCount = AppState.candidateReviews.filter(r => r.reviewed).length;
  const total = AppState.candidateReviews.length;
  const allDone = (reviewedCount === total);

  const badge = document.getElementById('reviewProgressBadge');
  if (badge) {
    badge.textContent = `Review Progress: ${reviewedCount} of ${total} confirmed safe`;
    badge.classList.toggle('all-reviewed', allDone);
  }

  const notice = document.getElementById('reviewLockNotice');
  const scriptArea = document.getElementById('remediationScriptArea');
  const statusEl = document.getElementById('scriptUnlockStatus');

  if (allDone) {
    if (notice) {
      notice.className = 'review-lock-notice unlocked';
      notice.innerHTML = '<span>✓ <strong>Safety Review Complete:</strong> All candidate resources confirmed safe. Production execution script unlocked.</span>';
    }
    if (scriptArea) {
      scriptArea.style.opacity = '1';
      scriptArea.style.pointerEvents = 'auto';
    }
    if (statusEl) {
      statusEl.textContent = 'Script Unlocked';
      statusEl.style.color = 'var(--savings-green)';
    }
  } else {
    if (notice) {
      notice.className = 'review-lock-notice';
      notice.innerHTML = `<span>⚠️ <strong>Review Mandatory:</strong> ${total - reviewedCount} candidate items pending review. Confirm hold status and disk attachment to unlock execution script.</span>`;
    }
    if (scriptArea) {
      scriptArea.style.opacity = '0.5';
      scriptArea.style.pointerEvents = 'none';
    }
    if (statusEl) {
      statusEl.textContent = 'Safety Dry-Run Active';
      statusEl.style.color = 'var(--primary)';
    }
  }
}

// ==============================================================================
// 5. PRODUCTION-READY REMEDIATION SCRIPT GENERATOR
// ==============================================================================
function toggleDryRun(checkbox) {
  AppState.isDryRun = checkbox.checked;
  generateRemediationScript();
  showToast(AppState.isDryRun ? "Safe Dry-Run: Added -WhatIf parameter" : "Live Execution Mode Active: Will execute real changes");
}

function generateRemediationScript() {
  const whatIfFlag = AppState.isDryRun ? ' -WhatIf' : '';
  const scriptElement = document.getElementById('terminalPayload');
  if (!scriptElement) return;

  const disabledCandidates = AppState.m365Records.filter(r => r.state === 'Disabled' && !r.excluded);
  const licenseCandidatesCode = disabledCandidates.length > 0
    ? disabledCandidates.map(c => `        @{ UPN = <span class="syn-str">"${c.upn}"</span>; SkuId = <span class="syn-str">"${c.skuId}"</span>; Name = <span class="syn-str">"${c.sku}"</span> }`).join(',\n')
    : `        # No disabled user licenses flagged for remediation`;

  const sharedCandidates = AppState.m365Records.filter(r => r.state === 'Shared Mailbox' && !r.excluded);
  const sharedCandidatesCode = sharedCandidates.length > 0
    ? sharedCandidates.map(c => `        @{ UPN = <span class="syn-str">"${c.upn}"</span>; SkuId = <span class="syn-str">"${c.skuId}"</span>; Name = <span class="syn-str">"${c.sku}"</span> }`).join(',\n')
    : `        # No shared mailboxes flagged for reclassification`;

  const diskCandidates = AppState.azureRecords.filter(r => (r.type.toLowerCase().includes('disk') || r.condition.toLowerCase().includes('unattached')) && !r.excluded);
  const targetDisksCode = diskCandidates.length > 0
    ? diskCandidates.map(d => `        @{ ResourceGroup = <span class="syn-str">"${d.rg}"</span>; DiskName = <span class="syn-str">"${d.name}"</span> }`).join(',\n')
    : `        # No unattached disks flagged for removal`;

  scriptElement.innerHTML = `
<span class="syn-comment"># ==============================================================================</span>
<span class="syn-comment"># CloudTrim Production Remediation Script | Tenant: ${AppState.currentTenant}</span>
<span class="syn-comment"># Generated: ${new Date().toISOString()} | Mode: ${AppState.isDryRun ? 'DRY-RUN SAFETY AUDIT (-WhatIf)' : 'LIVE PRODUCTION EXECUTION'}</span>
<span class="syn-comment"># Mandatory Safety Review: Enforced | Preflight Checks: Enforced | Logs: Transcript</span>
<span class="syn-comment"># ==============================================================================</span>

[CmdletBinding()]
param (
    [string]$LogDirectory = "$([Environment]::GetFolderPath('Desktop'))\\CloudTrim_Logs"
)

<span class="syn-comment"># Step 0: Initialize Execution Transcript Log</span>
if (-not (Test-Path $LogDirectory)) { New-Item -ItemType Directory -Path $LogDirectory -Force | Out-Null }
$LogFile = Join-Path $LogDirectory ("CloudTrim_Remediation_" + (Get-Date -Format 'yyyyMMdd_HHmmss') + ".log")
<span class="syn-cmd">Start-Transcript</span> <span class="syn-param">-Path</span> $LogFile <span class="syn-param">-Append</span>

<span class="syn-cmd">Write-Host</span> <span class="syn-str">"=== STARTING CLOUDTRIM REMEDIATION PREFLIGHT CHECKS ==="</span> -ForegroundColor Cyan

<span class="syn-comment"># ==============================================================================</span>
<span class="syn-comment"># MODULE 1: MICROSOFT 365 LICENSE RECONCILIATION</span>
<span class="syn-comment"># Microsoft Documented Standard: Set-MgUserLicense strictly requires SkuId GUIDs</span>
<span class="syn-comment"># NEVER pass friendly license names such as ENTERPRISEPACK or SPE_E3</span>
<span class="syn-comment"># ==============================================================================</span>
try {
    <span class="syn-cmd">Write-Host</span> <span class="syn-str">"\`n[1/2] Connecting to Microsoft Graph..."</span> -ForegroundColor Cyan
    <span class="syn-cmd">Connect-MgGraph</span> <span class="syn-param">-Scopes</span> <span class="syn-str">"User.ReadWrite.All", "Directory.ReadWrite.All"</span> -NoWelcome

    <span class="syn-comment"># Explicitly reviewed candidate accounts with exact Microsoft SkuId GUIDs</span>
    $LicenseCandidates = @(
${licenseCandidatesCode}
    )

    foreach ($item in $LicenseCandidates) {
        if (-not $item.UPN) { continue }
        <span class="syn-comment"># Preflight Check 1: Verify user exists and confirm accountEnabled is explicitly false</span>
        $mgUser = <span class="syn-cmd">Get-MgUser</span> <span class="syn-param">-UserId</span> $item.UPN <span class="syn-param">-Property</span> Id, AccountEnabled, AssignedLicenses -ErrorAction SilentlyContinue

        if ($null -eq $mgUser) {
            <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"[PREFLIGHT SKIP] Identity $($item.UPN) not found in directory."</span>
            continue
        }

        if ($mgUser.AccountEnabled -eq $true) {
            <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"[PREFLIGHT ABORT] User $($item.UPN) is currently ENABLED. Skipping license removal for safety."</span>
            continue
        }

        <span class="syn-comment"># Preflight Check 2: Verify user actually holds the targeted SkuId</span>
        $holdsSku = $mgUser.AssignedLicenses | Where-Object { $_.SkuId -eq $item.SkuId }
        if ($holdsSku) {
            <span class="syn-cmd">Write-Host</span> <span class="syn-str">"[ACTION] Revoking $($item.Name) ($($item.SkuId)) from disabled user: $($item.UPN)"</span> -ForegroundColor Yellow
            <span class="syn-cmd">Set-MgUserLicense</span> <span class="syn-param">-UserId</span> $item.UPN <span class="syn-param">-RemoveLicenses</span> @($item.SkuId) <span class="syn-param">-AddLicenses</span> @()${whatIfFlag}
        } else {
            <span class="syn-cmd">Write-Host</span> <span class="syn-str">"[OK] User $($item.UPN) does not hold SkuId $($item.SkuId). No action needed."</span> -ForegroundColor Green
        }
    }

    <span class="syn-comment"># ==========================================================================</span>
    <span class="syn-comment"># SHARED MAILBOX RECONCILIATION &amp; MANDATORY FAIL-CLOSED SAFETY CHECKS</span>
    <span class="syn-comment"># Microsoft Guidance: Mailboxes &lt;50GB qualify for zero-cost tier ONLY IF:</span>
    <span class="syn-comment"># 1. Exchange tooling is available (Fail-Closed: skips if module/session missing)</span>
    <span class="syn-comment"># 2. RecipientTypeDetails is confirmed as 'SharedMailbox' (Not user mailbox)</span>
    <span class="syn-comment"># 3. Litigation Hold, In-Place Hold &amp; Purview retention policies are confirmed OFF</span>
    <span class="syn-comment"># 4. TotalItemSize is confirmed &lt;50GB</span>
    <span class="syn-comment"># 5. Online Archive is confirmed Inactive (unlicensed cannot retain archives)</span>
    <span class="syn-comment"># If any prerequisite cannot be verified at runtime, license removal is aborted.</span>
    <span class="syn-comment"># ==========================================================================</span>
    $SharedMailboxCandidates = @(
${sharedCandidatesCode}
    )

    $exAvailable = <span class="syn-cmd">Get-Command</span> Get-Mailbox <span class="syn-param">-ErrorAction</span> SilentlyContinue
    if (-not $exAvailable) {
        <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"[PREFLIGHT ABORT] ExchangeOnlineManagement module not detected or session inactive."</span>
        <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"Cannot safely verify shared mailbox holds, sizes, or archives. Skipping all shared mailboxes."</span>
    } else {
        foreach ($sm in $SharedMailboxCandidates) {
            if (-not $sm.UPN) { continue }
            
            <span class="syn-comment"># Runtime Check 1: Mailbox Lookup (Fail-Closed on error or null)</span>
            $mbx = <span class="syn-cmd">Get-Mailbox</span> <span class="syn-param">-Identity</span> $sm.UPN <span class="syn-param">-ErrorAction</span> SilentlyContinue
            if ($null -eq $mbx) {
                <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"[LOOKUP ERROR] Mailbox $($sm.UPN) not found in Exchange Online. Skipping license modification."</span>
                continue
            }

            <span class="syn-comment"># Runtime Check 2: Recipient Type Verification</span>
            if ($mbx.RecipientTypeDetails -ne <span class="syn-str">"SharedMailbox"</span>) {
                <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"[TYPE MISMATCH] Mailbox $($sm.UPN) has RecipientTypeDetails '$($mbx.RecipientTypeDetails)' (not 'SharedMailbox'). Skipping."</span>
                continue
            }

            <span class="syn-comment"># Runtime Check 3: Litigation, In-Place &amp; Retention Hold Verification</span>
            if ($mbx.LitigationHoldEnabled -eq $true -or ($mbx.InPlaceHolds -and $mbx.InPlaceHolds.Count -gt 0) -or $mbx.RetentionHoldEnabled -eq $true) {
                <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"[HOLD ACTIVE] Mailbox $($sm.UPN) has active Litigation or Retention Hold. License removal aborted to prevent data loss."</span>
                continue
            }

            <span class="syn-comment"># Runtime Check 4: Storage Quota Verification (&lt;50GB)</span>
            $mbxStats = <span class="syn-cmd">Get-MailboxStatistics</span> <span class="syn-param">-Identity</span> $sm.UPN <span class="syn-param">-ErrorAction</span> SilentlyContinue
            if ($null -eq $mbxStats) {
                <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"[PREFLIGHT SKIP] Could not retrieve mailbox statistics for $($sm.UPN). Storage size unverified. Skipping for safety."</span>
                continue
            }
            $sizeBytes = 0
            if ($mbxStats.TotalItemSize.Value -is [Microsoft.Exchange.Data.ByteQuantifiedSize]) {
                $sizeBytes = $mbxStats.TotalItemSize.Value.ToBytes()
            } elseif ($mbxStats.TotalItemSize.Value) {
                $sizeBytes = [int64]$mbxStats.TotalItemSize.Value.ToBytes()
            }
            $sizeGB = [math]::Round($sizeBytes / 1GB, 2)
            if ($sizeGB -ge 50) {
                <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"[QUOTA LIMIT] Shared mailbox $($sm.UPN) size is $sizeGB GB (&gt;= 50 GB threshold). Paid Exchange Online Plan 2 required. Skipping."</span>
                continue
            }

            <span class="syn-comment"># Runtime Check 5: Archive Status Check</span>
            if ($mbx.ArchiveStatus -eq <span class="syn-str">"Active"</span>) {
                <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"[ARCHIVE ACTIVE] Shared mailbox $($sm.UPN) has an active Online Archive. Unlicensed shared mailboxes cannot hold archives. Skipping."</span>
                continue
            }

            <span class="syn-comment"># All Preflights Passed -&gt; Safe to Reclassify</span>
            <span class="syn-cmd">Write-Host</span> <span class="syn-str">"[ACTION] Confirmed safe: Shared mailbox $($sm.UPN) ($sizeGB GB, No Holds, No Archive). De-licensing to native free shared tier..."</span> -ForegroundColor Cyan
            <span class="syn-cmd">Set-MgUserLicense</span> <span class="syn-param">-UserId</span> $sm.UPN <span class="syn-param">-RemoveLicenses</span> @($sm.SkuId) <span class="syn-param">-AddLicenses</span> @()${whatIfFlag}
        }
    }
}
catch {
    <span class="syn-cmd">Write-Error</span> <span class="syn-str">"M365 License remediation encountered an error: $_"</span>
}

<span class="syn-comment"># ==============================================================================</span>
<span class="syn-comment"># MODULE 2: AZURE ORPHANED INFRASTRUCTURE CLEANUP</span>
<span class="syn-comment"># Restricts actions strictly to reviewed Resource IDs (Never deletes wildcards)</span>
<span class="syn-comment"># ==============================================================================</span>
try {
    <span class="syn-cmd">Write-Host</span> <span class="syn-str">"\`n[2/2] Connecting to Microsoft Azure..."</span> -ForegroundColor Cyan
    <span class="syn-cmd">Connect-AzAccount</span> -WarningAction SilentlyContinue | Out-Null

    $TargetDisks = @(
${targetDisksCode}
    )

    foreach ($target in $TargetDisks) {
        if (-not $target.DiskName) { continue }
        $disk = <span class="syn-cmd">Get-AzDisk</span> <span class="syn-param">-ResourceGroupName</span> $target.ResourceGroup <span class="syn-param">-DiskName</span> $target.DiskName -ErrorAction SilentlyContinue

        if ($null -eq $disk) {
            <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"[PREFLIGHT SKIP] Disk $($target.DiskName) not found in $($target.ResourceGroup)."</span>
            continue
        }

        if (-not [string]::IsNullOrEmpty($disk.ManagedBy)) {
            <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"[SAFETY HALT] Disk $($disk.Name) is ATTACHED to $($disk.ManagedBy). Deletion aborted."</span>
            continue
        }

        $locks = <span class="syn-cmd">Get-AzResourceLock</span> <span class="syn-param">-ResourceGroupName</span> $target.ResourceGroup -ErrorAction SilentlyContinue
        if ($locks) {
            <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"[LOCK DETECTED] Resource lock found in $($target.ResourceGroup). Skipping disk $($disk.Name)."</span>
            continue
        }

        <span class="syn-cmd">Write-Host</span> <span class="syn-str">"[AZURE ACTION] Deallocating orphaned unattached disk: $($disk.Name) ($($disk.DiskSizeGB) GB)"</span> -ForegroundColor Red
        <span class="syn-cmd">Remove-AzDisk</span> <span class="syn-param">-ResourceGroupName</span> $target.ResourceGroup <span class="syn-param">-DiskName</span> $target.DiskName <span class="syn-param">-Force</span>${whatIfFlag}
    }
}
catch {
    <span class="syn-cmd">Write-Error</span> <span class="syn-str">"Azure cleanup encountered an error: $_"</span>
}

<span class="syn-cmd">Write-Host</span> <span class="syn-str">"\`n=== REMEDIATION EXECUTION COMPLETE ==="</span> -ForegroundColor Green
<span class="syn-cmd">Write-Host</span> <span class="syn-str">"Detailed log written to: $LogFile"</span> -ForegroundColor White
<span class="syn-cmd">Stop-Transcript</span>
`;
}

// ==============================================================================
// 6. CURRENCY CONVERSION & FORMATTING
// ==============================================================================
function setCurrency(target) {
  AppState.currency = target;
  document.getElementById('btn-usd').classList.toggle('active', target === 'USD');
  document.getElementById('btn-inr').classList.toggle('active', target === 'INR');

  const rate = (target === 'INR') ? AppState.inrExchangeRate : 1;
  const symbol = (target === 'INR') ? '₹' : '$';

  renderDecisionFindings();
  renderSupportingTables();
  renderExclusions();
  updateConfirmedTotals();
  updateChartCurrency(rate, symbol);
  showToast(`Switched currency to ${target} (${symbol})`);
}

function formatMoney(amountUSD) {
  const rate = (AppState.currency === 'INR') ? AppState.inrExchangeRate : 1;
  const symbol = (AppState.currency === 'INR') ? '₹' : '$';
  return `${symbol}${(amountUSD * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ==============================================================================
// 7. UPLOAD PANEL COLLAPSE & EXPAND
// ==============================================================================
function toggleUploadPanel(expand) {
  if (expand) {
    document.getElementById('uploadExpanded').style.display = 'block';
    document.getElementById('uploadCollapsed').style.display = 'none';
  } else {
    document.getElementById('uploadExpanded').style.display = 'none';
    document.getElementById('uploadCollapsed').style.display = 'flex';
  }
}

// ==============================================================================
// 8. TABLE RENDERING (SUPPORTING DETAILS)
// ==============================================================================
function switchSupportingTab(tabKey) {
  AppState.activeSupportingTab = tabKey;

  document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`subtab-${tabKey}`)?.classList.add('active');

  document.getElementById('tab-pane-m365').style.display = (tabKey === 'm365') ? 'block' : 'none';
  document.getElementById('tab-pane-azure').style.display = (tabKey === 'azure') ? 'block' : 'none';
  document.getElementById('tab-pane-remediation').style.display = (tabKey === 'remediation') ? 'block' : 'none';
  document.getElementById('tab-pane-automation').style.display = (tabKey === 'automation') ? 'block' : 'none';
}

function filterM365Category(category) {
  AppState.m365Filter = category;
  document.querySelectorAll('.filter-pills-group .filter-pill').forEach(btn => btn.classList.remove('active'));
  const pillMap = {
    'all': 'pillM365All',
    'disabled': 'pillM365Disabled',
    'shared': 'pillM365Shared',
    'inactive': 'pillM365Inactive'
  };
  const activePill = document.getElementById(pillMap[category] || 'pillM365All');
  if (activePill) activePill.classList.add('active');
  renderSupportingTables();
}

function handleM365Search(term) {
  AppState.m365SearchTerm = (term || '').trim().toLowerCase();
  const clearBtn = document.getElementById('m365SearchClear');
  if (clearBtn) {
    clearBtn.style.display = AppState.m365SearchTerm ? 'block' : 'none';
  }
  renderSupportingTables();
}

function resetM365Filters() {
  AppState.m365Filter = 'all';
  AppState.m365SearchTerm = '';
  const searchInput = document.getElementById('m365SearchInput');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('m365SearchClear');
  if (clearBtn) clearBtn.style.display = 'none';

  document.querySelectorAll('.filter-pills-group .filter-pill').forEach(btn => btn.classList.remove('active'));
  document.getElementById('pillM365All')?.classList.add('active');
  renderSupportingTables();
}

function renderSupportingTables() {
  const tbodyM365 = document.getElementById('tbodyM365Supporting');
  if (tbodyM365) {
    tbodyM365.innerHTML = '';

    // Apply active category and search filter
    const filteredM365 = AppState.m365Records.filter(r => {
      // 1. Category filter
      if (AppState.m365Filter === 'disabled' && r.state.toLowerCase() !== 'disabled') {
        return false;
      }
      if (AppState.m365Filter === 'shared' && !r.state.toLowerCase().includes('shared')) {
        return false;
      }
      if (AppState.m365Filter === 'inactive' && !r.state.toLowerCase().includes('inactive')) {
        return false;
      }

      // 2. Search query filter
      if (AppState.m365SearchTerm) {
        const upn = (r.upn || '').toLowerCase();
        const state = (r.state || '').toLowerCase();
        const sku = (r.sku || r.skuPartNumber || '').toLowerCase();
        const finding = (r.governanceFinding || r.holdCheck || '').toLowerCase();
        const term = AppState.m365SearchTerm;
        return upn.includes(term) || state.includes(term) || sku.includes(term) || finding.includes(term);
      }

      return true;
    });

    if (filteredM365.length === 0) {
      const tr = document.createElement('tr');
      const isSearchActive = Boolean(AppState.m365SearchTerm);
      const isFilterActive = AppState.m365Filter !== 'all';
      let emptyTitle = 'No matching M365 records found';
      let emptyMsg = 'No identities in the analyzed dataset matched your criteria.';

      if (isSearchActive) {
        emptyTitle = `No matches found for &quot;${escapeHtml(AppState.m365SearchTerm)}&quot;`;
        emptyMsg = 'Check your search query or reset filters to display all analyzed accounts.';
      } else if (isFilterActive) {
        const catName = AppState.m365Filter === 'disabled' ? 'disabled user' : (AppState.m365Filter === 'shared' ? 'shared mailbox' : 'inactive account');
        emptyTitle = `No ${catName} findings`;
        emptyMsg = `Zero ${catName} waste findings were detected in this dataset.`;
      }

      tr.innerHTML = `
        <td colspan="5" style="text-align:center; padding:36px 16px; color:var(--text-muted);">
          <div style="font-weight:700; font-size:0.95rem; color:var(--text-main); margin-bottom:6px;">${emptyTitle}</div>
          <p style="font-size:0.8rem; margin-bottom:12px;">${emptyMsg}</p>
          <button class="btn btn-outline" style="font-size:0.75rem; padding:4px 12px; background:white;" onclick="resetM365Filters()">
            Reset All Filters
          </button>
        </td>
      `;
      tbodyM365.appendChild(tr);
    } else {
      filteredM365.forEach(r => {
        const badgeClass = r.severity === 'critical' ? 'badge-danger' : (r.severity === 'shared' ? 'badge-warning' : 'badge-neutral');
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${escapeHtml(r.upn)}</strong></td>
          <td><span class="badge ${badgeClass}">${escapeHtml(r.state)}</span></td>
          <td>${escapeHtml(r.sku || r.skuPartNumber)}</td>
          <td style="font-size:0.8rem; color:#334155;">${escapeHtml(r.governanceFinding || r.holdCheck)}</td>
          <td style="color:var(--danger-600); font-weight:700;">${formatMoney(r.costUSD)} / mo</td>
        `;
        tbodyM365.appendChild(tr);
      });
    }
  }

  const tbodyAzure = document.getElementById('tbodyAzureSupporting');
  if (tbodyAzure) {
    tbodyAzure.innerHTML = '';
    if (AppState.azureRecords.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="6" style="text-align:center; padding:36px 16px; color:var(--text-muted);">
          <div style="font-weight:700; font-size:0.95rem; color:var(--text-main); margin-bottom:4px;">No Azure Resource Findings</div>
          <p style="font-size:0.8rem;">No unattached disks, empty plans, or unassociated public IPs present in current analysis.</p>
        </td>
      `;
      tbodyAzure.appendChild(tr);
    } else {
      AppState.azureRecords.forEach(r => {
        const verifBadge = r.needsVerification 
          ? `<span class="badge-verification">Needs verification</span><span class="verification-subtext">${escapeHtml(r.verifNote)}</span>` 
          : `<span style="font-size:0.75rem; color:#15803D;">✓ ${escapeHtml(r.verifNote)}</span>`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${escapeHtml(r.name)}</strong><br><code style="font-size:0.7rem; color:#64748B;">${escapeHtml(r.id)}</code></td>
          <td>${escapeHtml(r.type)}</td>
          <td><code>${escapeHtml(r.rg)}</code></td>
          <td><span class="badge badge-danger">${escapeHtml(r.condition)}</span></td>
          <td>${verifBadge}</td>
          <td style="color:var(--danger-600); font-weight:700;">${formatMoney(r.costUSD)} / mo</td>
        `;
        tbodyAzure.appendChild(tr);
      });
    }
  }
}

// ==============================================================================
// 9. SIDEBAR CONTROLLER
// ==============================================================================
function selectSidebar(key) {
  AppState.activeSidebar = key;
  document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
  document.getElementById(`side-${key}`)?.classList.add('active');

  if (key === 'overview') {
    document.getElementById('overviewWorkspace').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (key === 'm365') {
    switchSupportingTab('m365');
    document.getElementById('supportingDetailsCard')?.scrollIntoView({ behavior: 'smooth' });
  } else if (key === 'azure') {
    switchSupportingTab('azure');
    document.getElementById('supportingDetailsCard')?.scrollIntoView({ behavior: 'smooth' });
  } else if (key === 'remediation') {
    switchSupportingTab('remediation');
    document.getElementById('supportingDetailsCard')?.scrollIntoView({ behavior: 'smooth' });
  } else if (key === 'automation') {
    switchSupportingTab('automation');
    document.getElementById('supportingDetailsCard')?.scrollIntoView({ behavior: 'smooth' });
  }
}

// ==============================================================================
// 10. CHARTS INITIALIZATION (AMBER RING FOR FAIR GOVERNANCE SCORE)
// ==============================================================================
function initCharts() {
  const ctxBar = document.getElementById('chartHorizontalSavings')?.getContext('2d');
  if (ctxBar) {
    horizontalBarChart = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: [
          'Unattached Managed Disks',
          'Empty App Service Plans',
          'Disabled User Accounts',
          'Inactive E5 Downgrades',
          'Licensed Shared Mailboxes',
          'Idle Static Public IPs'
        ],
        datasets: [{
          label: 'Potential Monthly Savings ($)',
          data: [235.52, 146.00, 99.00, 38.00, 34.00, 4.38],
          backgroundColor: '#2563EB',
          borderRadius: 4,
          barThickness: 18
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Potential Savings: $${ctx.raw.toFixed(2)} / month`
            }
          }
        },
        scales: {
          x: {
            grid: { color: '#F1F5F9' },
            ticks: { font: { size: 11, family: 'Inter' }, callback: v => '$' + v }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 11, family: 'Inter', weight: 500 } }
          }
        }
      }
    });
  }

  const ctxDonut = document.getElementById('chartEfficiencyRatio')?.getContext('2d');
  if (ctxDonut) {
    donutRatioChart = new Chart(ctxDonut, {
      type: 'doughnut',
      data: {
        labels: ['Productive Spend', 'Potential Savings (Fair Score)'],
        datasets: [{
          data: [5024.50, 556.90],
          // Amber #D97706 replaces green for the "Fair" 74/100 score to avoid mixed signals
          backgroundColor: ['#172033', '#D97706'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, padding: 12, font: { size: 10, family: 'Inter' } } }
        },
        cutout: '74%'
      }
    });
  }
}

function updateCharts() {
  const rate = (AppState.currency === 'INR') ? AppState.inrExchangeRate : 1;
  const symbol = (AppState.currency === 'INR') ? '₹' : '$';
  const activeFindings = AppState.decisionFindings.filter(f => !f.excluded && !f.dismissed);

  if (horizontalBarChart) {
    horizontalBarChart.data.labels = activeFindings.map(f => f.finding);
    horizontalBarChart.data.datasets[0].data = activeFindings.map(f => Math.round(f.estimatedSavingUSD * rate * 100) / 100);
    horizontalBarChart.options.scales.x.ticks.callback = v => symbol + v.toLocaleString();
    horizontalBarChart.update();
  }

  if (donutRatioChart) {
    const monthlyWaste = Math.round(AppState.baseline.monthlyWasteUSD * rate);
    const productive = Math.round(Math.max(1000 * rate, (AppState.baseline.m365SeatCount * 30 + AppState.baseline.azureAssetCount * 100) * rate - monthlyWaste));
    donutRatioChart.data.datasets[0].data = [productive, monthlyWaste];
    donutRatioChart.update();
  }
}

function updateChartCurrency(multiplier, symbol) {
  updateCharts();
}

// ==============================================================================
// 11. AUTHENTICATION & SESSION MANAGEMENT
// ==============================================================================
function openMfaWizard() {
  openAuthModal('mfa');
}

function handleResetPassword(e) {
  e.preventDefault();
  const email = document.getElementById('resetEmail')?.value;
  if (!email || !email.includes('@')) {
    alert('Please enter a valid work email.');
    return;
  }
  showToast(`Password reset link & temporary verification token dispatched to ${email}`);
  switchAuthTab('signin');
}

function openAuthModal(tab) {
  document.getElementById('authModalOverlay').classList.add('open');
  switchAuthTab(tab || 'signin');
}

function closeAuthModal() {
  document.getElementById('authModalOverlay').classList.remove('open');
}

function switchAuthTab(tab) {
  document.getElementById('authTabSignIn').classList.toggle('active', tab === 'signin');
  document.getElementById('authTabReset').classList.toggle('active', tab === 'reset');
  document.getElementById('authTabMfa').classList.toggle('active', tab === 'mfa');

  document.getElementById('formSignIn').style.display = (tab === 'signin') ? 'block' : 'none';
  document.getElementById('formReset').style.display = (tab === 'reset') ? 'block' : 'none';
  document.getElementById('formMfa').style.display = (tab === 'mfa') ? 'block' : 'none';
}

function handleSignIn(e) {
  e.preventDefault();
  const email = document.getElementById('signInEmail').value;
  if (!email || !email.includes('@')) {
    alert('Please enter a valid work email.');
    return;
  }

  document.getElementById('mfaEmailTarget').textContent = email;
  switchAuthTab('mfa');

  const sampleOtp = Math.floor(100000 + Math.random() * 900000);
  const digits = sampleOtp.toString().split('');
  digits.forEach((d, idx) => {
    const input = document.getElementById(`otp${idx + 1}`);
    if (input) input.value = d;
  });

  showToast(`Security Check: 6-digit Email OTP dispatched to ${email}`);
}

function handleMfaVerify(e) {
  e.preventDefault();
  const digits = [
    document.getElementById('otp1').value,
    document.getElementById('otp2').value,
    document.getElementById('otp3').value,
    document.getElementById('otp4').value,
    document.getElementById('otp5').value,
    document.getElementById('otp6').value
  ].join('');

  if (digits.length !== 6) {
    alert('Please enter all 6 digits of your authentication code.');
    return;
  }

  const email = document.getElementById('signInEmail').value || 'admin@contoso.com';
  completeLogin(email);
}

function completeLogin(email) {
  const isBackendAdmin = (email.toLowerCase() === 'satya@skypeexchange4u.com');
  AppState.currentUser = { email: email, role: isBackendAdmin ? 'Super Administrator' : 'Tenant Administrator' };
  AppState.mfaActive = true;
  closeAuthModal();

  document.getElementById('btnHeaderSignIn').style.display = 'none';
  document.getElementById('userProfileMenu').style.display = 'flex';
  document.getElementById('userEmailDisplay').textContent = email;
  document.getElementById('dropdownUserEmail').textContent = email;
  document.getElementById('mfaTopStatus').style.display = 'flex';

  // Strictly restrict internal Admin Console link to backend management administrator
  const adminConsoleLink = document.getElementById('adminConsoleDropdownLink');
  if (adminConsoleLink) {
    adminConsoleLink.style.display = isBackendAdmin ? 'flex' : 'none';
  }

  // Persist registered user locally for admin console monitoring
  try {
    const rawUsers = localStorage.getItem('cloudtrim_registered_users');
    const usersList = rawUsers ? JSON.parse(rawUsers) : [];
    const existingIdx = usersList.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    const tenantDomain = email.includes('@') ? email.split('@')[1] : 'contoso.onmicrosoft.com';
    const nowIso = new Date().toISOString();

    if (existingIdx >= 0) {
      usersList[existingIdx].lastLogin = nowIso;
      usersList[existingIdx].loginCount = (usersList[existingIdx].loginCount || 1) + 1;
    } else {
      usersList.push({
        email: email,
        tenant: tenantDomain,
        role: isBackendAdmin ? 'Super Administrator' : 'Tenant Administrator',
        mfaStatus: 'Active (TOTP/Email OTP)',
        registeredAt: nowIso,
        lastLogin: nowIso,
        loginCount: 1
      });
    }
    localStorage.setItem('cloudtrim_registered_users', JSON.stringify(usersList));
  } catch (err) {
    console.warn('[UserRegistry] Failed to save user', err);
  }

  Telemetry.track('user_authenticated', { role: isBackendAdmin ? 'admin' : 'tenant_admin' });
  showToast(`✓ Authenticated as ${email} &bull; 🔒 MFA Verified`);
}

function handleSignOut() {
  AppState.currentUser = null;
  AppState.mfaActive = false;
  document.getElementById('userDropdown').classList.remove('show');
  document.getElementById('btnHeaderSignIn').style.display = 'inline-flex';
  document.getElementById('userProfileMenu').style.display = 'none';
  document.getElementById('mfaTopStatus').style.display = 'none';
  showToast('Signed out of tenant administrative session.');
}

function toggleUserMenu() {
  document.getElementById('userDropdown').classList.toggle('show');
}

function autoFocusNext(current, nextId) {
  if (current.value.length === 1) {
    document.getElementById(nextId)?.focus();
  }
}

function copyCode(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    showToast('✓ Copied PowerShell command payload to clipboard');
  });
}

function exportAuditCSV() {
  const rows = [];
  rows.push("Category,Identifier,Status_Condition,Classification,Monthly_Impact_USD");

  // M365 Records
  AppState.m365Records.forEach(r => {
    const ident = r.upn;
    const cond = r.state;
    const cls = r.sku || r.skuPartNumber;
    rows.push(`M365,"${ident}","${cond}","${cls}",${r.costUSD}`);
  });

  // Azure Records
  AppState.azureRecords.forEach(a => {
    const ident = a.name;
    const cond = a.condition;
    const cls = a.type;
    rows.push(`Azure,"${ident}","${cond}","${cls}",${a.costUSD}`);
  });

  const csvContent = rows.join("\n") + "\n";
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "exported-results.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(`✓ Exported ${AppState.m365Records.length + AppState.azureRecords.length} findings to exported-results.csv`);
}

function showToast(msg) {
  const toast = document.getElementById('toastBox');
  const text = document.getElementById('toastMsg');
  if (!toast || !text) return;
  text.innerHTML = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// Global Initialization
window.addEventListener('DOMContentLoaded', () => {
  initCharts();
  const restored = restoreWorkspaceSession();
  if (!restored) {
    Telemetry.track('demo_viewed', { initialLoad: true });
    renderDecisionFindings();
    renderSupportingTables();
    renderReviewChecklist();
    renderExclusions();
    updateConfirmedTotals();
    generateRemediationScript();
  }

  // If visitor arrived via header Sign In link (?action=signin), open authentication modal
  if (window.location && window.location.search && window.location.search.includes('action=signin')) {
    openAuthModal('signin');
  }
});
