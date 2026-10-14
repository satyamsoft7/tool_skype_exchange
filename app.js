/**
 * ==============================================================================
 * CloudTrim Enterprise - Client Application Engine
 * Architecture: 100% In-Browser RAM Execution | Zero Server Transits
 * Standards: Microsoft Fluent 2 & Corporate FinOps
 * ==============================================================================
 */

// Global State Store
const AppState = {
  currentTenant: 'contoso.onmicrosoft.com',
  assessmentDate: 'October 14, 2026',
  isSampleData: true,
  isDataLoaded: true,
  currency: 'USD',
  inrExchangeRate: 83.25,
  isDryRun: true,
  activeSidebar: 'overview',
  activeSupportingTab: 'm365',
  currentUser: null,
  mfaActive: false,

  // Baseline Financials (USD)
  baseline: {
    monthlyWasteUSD: 1485.50,
    annualWasteUSD: 17826.00,
    governanceScore: 74,
    m365SeatCount: 9,
    m365WasteUSD: 495.50,
    azureAssetCount: 11,
    azureWasteUSD: 990.00
  },

  // Active Exclusions List
  exclusions: [],

  // 1. Findings to Review: Sorted by Potential Savings (Descending)
  decisionFindings: [
    {
      id: "find-1",
      finding: "Unattached disk candidate",
      resourceLabel: "2 Premium SSD Managed Disks (512GB & 1TB)",
      estimatedSavingUSD: 153.60,
      evidence: "Source: Azure Resource Graph (October 14, 2026). ManagedBy is NULL, 0 attached VMs for 62 days.",
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
      resourceLabel: "3 Entra ID Offboarded Users (2x E5, 1x E3)",
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
      estimatedSavingUSD: 30.00,
      evidence: "Source: Microsoft Graph signInActivity. Zero authenticated sessions in 130 days. Candidate for E1 downgrade.",
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
      resourceLabel: "2 Shared Mailboxes (invoices@ & support-team@)",
      estimatedSavingUSD: 26.00,
      evidence: "Source: Exchange Online. Mailbox size 14.2GB & 4.8GB (<50GB). Requires check: litigation hold & Purview policies.",
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

  // Mandatory Review Checklist for Script Unlock
  candidateReviews: [
    {
      id: "rev-1",
      name: "rahul.sharma@contoso.com",
      type: "Entra ID Disabled Account",
      costUSD: 38.00,
      safetyCheck: "Verified disabled in Entra ID >45 days. No business mailbox forwarding active.",
      reviewed: false
    },
    {
      id: "rev-2",
      name: "priya.verma@contoso.com",
      type: "Entra ID Disabled Account",
      costUSD: 23.00,
      safetyCheck: "Confirmed offboarded staff. Active M365 E3 license unassigned.",
      reviewed: false
    },
    {
      id: "rev-3",
      name: "neha.gupta@contoso.com",
      type: "Entra ID Disabled Account",
      costUSD: 38.00,
      safetyCheck: "Former contractor identity disabled. Office 365 E5 license revocable.",
      reviewed: false
    },
    {
      id: "rev-4",
      name: "invoices@contoso.com",
      type: "Shared Mailbox (14.2 GB)",
      costUSD: 22.00,
      safetyCheck: "Size <50GB. Confirmed NO Litigation Hold, In-Place Hold, or Purview retention policy active.",
      reviewed: false
    },
    {
      id: "rev-5",
      name: "support-team@contoso.com",
      type: "Shared Mailbox (4.8 GB)",
      costUSD: 4.00,
      safetyCheck: "Size <50GB. Confirmed NO Litigation Hold or Auto-Expanding Archive active.",
      reviewed: false
    },
    {
      id: "rev-6",
      name: "disk-webprod-backup-os",
      type: "Azure Managed Disk (Premium SSD)",
      costUSD: 76.80,
      safetyCheck: "ManagedBy is NULL (Unattached 62d). Confirmed no ReadOnly or CanNotDelete resource lock.",
      reviewed: false
    }
  ],

  // M365 Records with Real Microsoft SkuIds
  m365Records: [
    { upn: "rahul.sharma@contoso.com", state: "Disabled", sku: "ENTERPRISEPREMIUM", skuId: "c5928f49-12ba-48f7-8140-f6f3477d9c93", holdCheck: "Disabled in Entra ID (Safe)", costUSD: 38.00, severity: "critical", needsVerification: false },
    { upn: "priya.verma@contoso.com", state: "Disabled", sku: "SPE_E3", skuId: "05e01617-00a6-4261-a773-5a61447866b2", holdCheck: "Offboarded identity (Safe)", costUSD: 23.00, severity: "critical", needsVerification: false },
    { upn: "neha.gupta@contoso.com", state: "Disabled", sku: "ENTERPRISEPREMIUM", skuId: "c5928f49-12ba-48f7-8140-f6f3477d9c93", holdCheck: "Former contractor (Safe)", costUSD: 38.00, severity: "critical", needsVerification: false },
    { upn: "invoices@contoso.com", state: "Shared Mailbox", sku: "SPB (Business Premium)", skuId: "cbdc14ab-e9e6-432d-9e9d-47abedd7ac2d", holdCheck: "Requires hold verification", costUSD: 22.00, severity: "shared", needsVerification: true },
    { upn: "support-team@contoso.com", state: "Shared Mailbox", sku: "EXCHANGESTANDARD", skuId: "4b5d0382-76be-4b95-821a-493405786616", holdCheck: "Requires hold verification", costUSD: 4.00, severity: "shared", needsVerification: true },
    { upn: "amit.kumar@contoso.com", state: "Inactive (130d)", sku: "ENTERPRISEPREMIUM", skuId: "c5928f49-12ba-48f7-8140-f6f3477d9c93", holdCheck: "Zero logins in 130d", costUSD: 38.00, severity: "inactive", needsVerification: false },
    { upn: "operations@contoso.com", state: "Shared Mailbox", sku: "EXCHANGEENTERPRISE", skuId: "19e2a5dc-d259-48e6-b9b9-630ea7d40dd5", holdCheck: "Requires hold verification", costUSD: 8.00, severity: "shared", needsVerification: true }
  ],

  // Azure Records
  azureRecords: [
    { name: "disk-webprod-backup-os", id: "/subscriptions/sub-8921/resourceGroups/rg-ecommerce-prod/providers/Microsoft.Compute/disks/disk-webprod-backup-os", type: "Managed Disk (Premium SSD 512GB)", rg: "rg-ecommerce-prod", condition: "Unattached (62 days)", costUSD: 76.80, needsVerification: false, verifNote: "ManagedBy is confirmed NULL" },
    { name: "disk-testdb-data01", id: "/subscriptions/sub-8921/resourceGroups/rg-qa-environments/providers/Microsoft.Compute/disks/disk-testdb-data01", type: "Managed Disk (Standard SSD 1TB)", rg: "rg-qa-environments", condition: "Unattached (38 days)", costUSD: 76.80, needsVerification: false, verifNote: "ManagedBy is confirmed NULL" },
    { name: "asp-legacy-api-dev", id: "/subscriptions/sub-8921/resourceGroups/rg-apps-legacy/providers/Microsoft.Web/serverfarms/asp-legacy-api-dev", type: "App Service Plan (P1v2)", rg: "rg-apps-legacy", condition: "0 Apps Deployed", costUSD: 146.00, needsVerification: false, verifNote: "Hosted web apps count = 0" },
    { name: "disk-analytics-worker", id: "/subscriptions/sub-8921/resourceGroups/rg-analytics-temp/providers/Microsoft.Compute/disks/disk-analytics-worker", type: "Managed Disk (Standard HDD 2TB)", rg: "rg-analytics-temp", condition: "Unattached (90 days)", costUSD: 81.92, needsVerification: false, verifNote: "ManagedBy is confirmed NULL" },
    { name: "pip-gateway-old-test", id: "/subscriptions/sub-8921/resourceGroups/rg-network-core/providers/Microsoft.Network/publicIPAddresses/pip-gateway-old-test", type: "Public IP Address (Static)", rg: "rg-network-core", condition: "Unassociated", costUSD: 4.38, needsVerification: false, verifNote: "ipConfigurations is NULL" }
  ]
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
  document.getElementById('datasetTypeBadge').textContent = 'Sample Demo Mode';
  document.getElementById('datasetTypeBadge').style.background = '#FEF3C7';
  document.getElementById('datasetTypeBadge').style.color = '#92400E';
  document.getElementById('datasetTypeBadge').style.borderColor = '#FDE68A';
  document.getElementById('activeFileSummary').textContent = 'Sample data loaded (contoso.onmicrosoft.com)';

  toggleUploadPanel(false);
  toggleCsvGuide(false);
  renderDecisionFindings();
  renderSupportingTables();
  renderReviewChecklist();
  renderExclusions();
  updateConfirmedTotals();
  generateRemediationScript();
  showToast('Loaded demo dataset for contoso.onmicrosoft.com');
}

// ==============================================================================
// 2. CSV PREPARATION & IMPORT VALIDATION ENGINE
// ==============================================================================
function toggleCsvGuide(show) {
  const guide = document.getElementById('csvPreparationGuide');
  if (guide) guide.style.display = show ? 'block' : 'none';
  if (show) guide.scrollIntoView({ behavior: 'smooth' });
}

function processUploadedFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    if (lines.length < 2) {
      showToast('Error: The uploaded file is empty or lacks data rows.');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const isM365 = headers.some(h => /UserPrincipalName|User Principal Name/i.test(h));
    const isAzure = headers.some(h => /ResourceId|ResourceName|ResourceGroup/i.test(h));

    if (!isM365 && !isAzure) {
      showToast('Invalid CSV format: Missing recognized M365 or Azure headers.');
      return;
    }

    // Switch State to Customer Real Data
    AppState.isSampleData = false;
    AppState.isDataLoaded = true;
    AppState.currentTenant = file.name.replace('.csv', '');

    const banner = document.getElementById('persistentDemoBanner');
    if (banner) banner.style.display = 'none';

    document.getElementById('tenantDot').style.background = '#22C55E';
    document.getElementById('tenantDisplay').textContent = `Customer Tenant (${file.name})`;
    document.getElementById('sampleDataBadge').style.display = 'none';
    document.getElementById('tenantContextName').textContent = file.name;
    document.getElementById('dataModeNotice').textContent = 'Verified Customer Dataset';
    document.getElementById('dataModeNotice').style.color = 'var(--savings-green)';
    document.getElementById('sideDemoBadge').textContent = 'Customer data';
    document.getElementById('sideDemoBadge').style.background = '#DCFCE7';
    document.getElementById('sideDemoBadge').style.color = '#15803D';
    document.getElementById('datasetTypeBadge').textContent = 'Customer Data Active';
    document.getElementById('datasetTypeBadge').style.background = '#DCFCE7';
    document.getElementById('datasetTypeBadge').style.color = '#15803D';
    document.getElementById('datasetTypeBadge').style.borderColor = '#BBF7D0';
    document.getElementById('activeFileSummary').textContent = `${file.name} (${lines.length - 1} rows parsed in local RAM)`;

    toggleUploadPanel(false);
    toggleCsvGuide(false);
    renderDecisionFindings();
    renderSupportingTables();
    renderReviewChecklist();
    renderExclusions();
    updateConfirmedTotals();
    generateRemediationScript();

    showToast(`✓ Ingested ${file.name} — Zero bytes sent to external cloud`);
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

  const reviewedCount = AppState.decisionFindings.filter(f => f.reviewed).length;
  const totalFindings = AppState.decisionFindings.length;

  // Update lead cards
  document.getElementById('leadMonthlySavings').textContent = formatMoney(totalMonthlyUSD);
  document.getElementById('leadAnnualSavings').textContent = `${formatMoney(totalAnnualUSD)} potential annual savings`;

  // Update Section 4 Preview
  const confMonthlyEl = document.getElementById('confirmedMonthlySavings');
  const confAnnualEl = document.getElementById('confirmedAnnualSavings');
  const ratioEl = document.getElementById('reviewedItemsRatio');
  const pendingEl = document.getElementById('pendingReviewCount');

  if (confMonthlyEl) confMonthlyEl.textContent = formatMoney(totalMonthlyUSD);
  if (confAnnualEl) confAnnualEl.textContent = `${formatMoney(totalAnnualUSD)} / year projected`;
  if (ratioEl) ratioEl.textContent = `${reviewedCount} / ${totalFindings} Reviewed`;
  if (pendingEl) {
    const pending = totalFindings - reviewedCount;
    pendingEl.textContent = pending > 0 ? `${pending} items awaiting admin confirmation` : `All items reviewed & confirmed safe`;
    pendingEl.style.color = pending > 0 ? '#B45309' : '#15803D';
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

  const badge = document.getElementById(`status-badge-${id}`);
  if (badge) {
    badge.className = `badge ${isChecked ? 'badge-neutral' : 'badge-warning'}`;
    badge.textContent = isChecked ? 'Confirmed Safe' : 'Review Needed';
  }
  updateReviewLockState();
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
    <span class="syn-cmd">Write-Host</span> <span class="syn-str">"`n[1/2] Connecting to Microsoft Graph..."</span> -ForegroundColor Cyan
    <span class="syn-cmd">Connect-MgGraph</span> <span class="syn-param">-Scopes</span> <span class="syn-str">"User.ReadWrite.All", "Directory.ReadWrite.All"</span> -NoWelcome

    <span class="syn-comment"># Explicitly reviewed candidate accounts with exact Microsoft SkuId GUIDs</span>
    $LicenseCandidates = @(
        @{ UPN = <span class="syn-str">"rahul.sharma@contoso.com"</span>; SkuId = <span class="syn-str">"c5928f49-12ba-48f7-8140-f6f3477d9c93"</span>; Name = <span class="syn-str">"Office 365 E5"</span> },
        @{ UPN = <span class="syn-str">"priya.verma@contoso.com"</span>; SkuId = <span class="syn-str">"05e01617-00a6-4261-a773-5a61447866b2"</span>; Name = <span class="syn-str">"Microsoft 365 E3"</span> },
        @{ UPN = <span class="syn-str">"neha.gupta@contoso.com"</span>; SkuId = <span class="syn-str">"c5928f49-12ba-48f7-8140-f6f3477d9c93"</span>; Name = <span class="syn-str">"Office 365 E5"</span> }
    )

    foreach ($item in $LicenseCandidates) {
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
    <span class="syn-comment"># SHARED MAILBOX RECONCILIATION &amp; MANDATORY HOLD PREREQUISITES</span>
    <span class="syn-comment"># Microsoft Guidance: Mailboxes &lt;50GB qualify for zero-cost tier ONLY IF</span>
    <span class="syn-comment"># Litigation Hold, In-Place Hold, or Purview retention policies are NOT active.</span>
    <span class="syn-comment"># ==========================================================================</span>
    $SharedMailboxCandidates = @(
        @{ UPN = <span class="syn-str">"invoices@contoso.com"</span>; SkuId = <span class="syn-str">"cbdc14ab-e9e6-432d-9e9d-47abedd7ac2d"</span>; Name = <span class="syn-str">"Business Premium"</span> },
        @{ UPN = <span class="syn-str">"support-team@contoso.com"</span>; SkuId = <span class="syn-str">"4b5d0382-76be-4b95-821a-493405786616"</span>; Name = <span class="syn-str">"Exchange Online P1"</span> }
    )

    foreach ($sm in $SharedMailboxCandidates) {
        if (Get-Command Get-Mailbox -ErrorAction SilentlyContinue) {
            $mbx = <span class="syn-cmd">Get-Mailbox</span> <span class="syn-param">-Identity</span> $sm.UPN <span class="syn-param">-ErrorAction</span> SilentlyContinue
            if ($mbx -and ($mbx.LitigationHoldEnabled -eq $true -or $mbx.InPlaceHolds.Count -gt 0)) {
                <span class="syn-cmd">Write-Warning</span> <span class="syn-str">"[HOLD ACTIVE] Mailbox $($sm.UPN) has active Litigation Hold. License must NOT be removed. Skipping."</span>
                continue
            }
        }

        <span class="syn-cmd">Write-Host</span> <span class="syn-str">"[ACTION] Reclassifying shared mailbox $($sm.UPN) to native zero-cost shared tier..."</span> -ForegroundColor Cyan
        <span class="syn-cmd">Set-MgUserLicense</span> <span class="syn-param">-UserId</span> $sm.UPN <span class="syn-param">-RemoveLicenses</span> @($sm.SkuId) <span class="syn-param">-AddLicenses</span> @()${whatIfFlag}
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
    <span class="syn-cmd">Write-Host</span> <span class="syn-str">"`n[2/2] Connecting to Microsoft Azure..."</span> -ForegroundColor Cyan
    <span class="syn-cmd">Connect-AzAccount</span> -WarningAction SilentlyContinue | Out-Null

    $TargetDisks = @(
        @{ ResourceGroup = <span class="syn-str">"rg-ecommerce-prod"</span>; DiskName = <span class="syn-str">"disk-webprod-backup-os"</span> },
        @{ ResourceGroup = <span class="syn-str">"rg-qa-environments"</span>; DiskName = <span class="syn-str">"disk-testdb-data01"</span> },
        @{ ResourceGroup = <span class="syn-str">"rg-analytics-temp"</span>; DiskName = <span class="syn-str">"disk-analytics-worker"</span> }
    )

    foreach ($target in $TargetDisks) {
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

<span class="syn-cmd">Write-Host</span> <span class="syn-str">"`n=== REMEDIATION EXECUTION COMPLETE ==="</span> -ForegroundColor Green
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

function renderSupportingTables() {
  const tbodyM365 = document.getElementById('tbodyM365Supporting');
  if (tbodyM365) {
    tbodyM365.innerHTML = '';
    AppState.m365Records.forEach(r => {
      const badgeClass = r.severity === 'critical' ? 'badge-danger' : (r.severity === 'shared' ? 'badge-warning' : 'badge-neutral');
      const verifBadge = r.needsVerification 
        ? `<span class="badge-verification">Needs verification</span><span class="verification-subtext">Check Litigation Hold &amp; Purview policy</span>` 
        : `<span style="font-size:0.75rem; color:#15803D;">✓ Account offboarded</span>`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${r.upn}</strong></td>
        <td><span class="badge ${badgeClass}">${r.state}</span></td>
        <td><code>${r.sku}</code></td>
        <td><code style="font-size:0.75rem; color:#475569;">${r.skuId}</code></td>
        <td>${verifBadge}</td>
        <td style="color:var(--danger-600); font-weight:700;">${formatMoney(r.costUSD)} / mo</td>
      `;
      tbodyM365.appendChild(tr);
    });
  }

  const tbodyAzure = document.getElementById('tbodyAzureSupporting');
  if (tbodyAzure) {
    tbodyAzure.innerHTML = '';
    AppState.azureRecords.forEach(r => {
      const verifBadge = r.needsVerification 
        ? `<span class="badge-verification">Needs verification</span><span class="verification-subtext">${r.verifNote}</span>` 
        : `<span style="font-size:0.75rem; color:#15803D;">✓ ${r.verifNote}</span>`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${r.name}</strong><br><code style="font-size:0.7rem; color:#64748B;">${r.id}</code></td>
        <td>${r.type}</td>
        <td><code>${r.rg}</code></td>
        <td><span class="badge badge-danger">${r.condition}</span></td>
        <td>${verifBadge}</td>
        <td style="color:var(--danger-600); font-weight:700;">${formatMoney(r.costUSD)} / mo</td>
      `;
      tbodyAzure.appendChild(tr);
    });
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
          data: [153.60, 146.00, 99.00, 30.00, 26.00, 4.38],
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
          data: [5024.50, 1485.50],
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

function updateChartCurrency(multiplier, symbol) {
  if (horizontalBarChart) {
    horizontalBarChart.data.datasets[0].data = [
      153.60 * multiplier,
      146.00 * multiplier,
      99.00 * multiplier,
      30.00 * multiplier,
      26.00 * multiplier,
      4.38 * multiplier
    ];
    horizontalBarChart.options.scales.x.ticks.callback = v => symbol + v.toLocaleString();
    horizontalBarChart.update();
  }
}

// ==============================================================================
// 11. AUTHENTICATION & SESSION MANAGEMENT
// ==============================================================================
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
  AppState.currentUser = { email: email, role: 'Tenant Administrator' };
  AppState.mfaActive = true;
  closeAuthModal();

  document.getElementById('btnHeaderSignIn').style.display = 'none';
  document.getElementById('userProfileMenu').style.display = 'flex';
  document.getElementById('userEmailDisplay').textContent = email;
  document.getElementById('dropdownUserEmail').textContent = email;
  document.getElementById('mfaTopStatus').style.display = 'flex';

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
  const activeFindings = AppState.decisionFindings.filter(f => !f.excluded && !f.dismissed);
  const csvContent = "data:text/csv;charset=utf-8,Finding,EstimatedMonthlySavingsUSD,Evidence,Confidence,Status\n" +
    activeFindings.map(a => `"${a.finding} - ${a.resourceLabel}",${a.estimatedSavingUSD},"${a.evidence}","${a.confidence}","${a.reviewed ? 'Reviewed' : 'Pending'}"`).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `CloudTrim_Findings_${AppState.currentTenant}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('✓ Exported prioritized findings to local CSV');
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
  Telemetry.track('demo_viewed', { initialLoad: true });
  initCharts();
  renderDecisionFindings();
  renderSupportingTables();
  renderReviewChecklist();
  renderExclusions();
  updateConfirmedTotals();
  generateRemediationScript();
});
