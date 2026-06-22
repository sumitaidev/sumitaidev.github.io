let cacheMemoryLinks = [];

document.addEventListener("DOMContentLoaded", () => {
  pullAdminRecords();
  document.getElementById("search-box").addEventListener("input", applyLiveFilters);
  document.getElementById("btn-export").addEventListener("click", runDataCsvExport);
  document.getElementById("edit-modal-form").addEventListener("submit", processUpdateSave);
});

async function pullAdminRecords() {
  const tableBody = document.getElementById("table-rows-target");
  tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Fetching links from Google Sheets database...</td></tr>`;

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "getAllLinks" })
    });
    const data = await res.json();
    
    if (data.success) {
      cacheMemoryLinks = data.links;
      renderTableInterface(cacheMemoryLinks);
    } else {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--error);">Failed: ${data.message}</td></tr>`;
    }
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--error);">Connection error pulling runtime dataset.</td></tr>`;
  }
}

function renderTableInterface(dataset) {
  const tableBody = document.getElementById("table-rows-target");
  tableBody.innerHTML = "";

  if (dataset.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-secondary);">No redirection links map matching this criteria.</td></tr>`;
    return;
  }

  dataset.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.date}</td>
      <td style="font-family:monospace; color:var(--accent-cyan); font-weight:600;">${item.id}</td>
      <td style="word-break:break-all;"><a href="${item.link}" target="_blank" style="color:white; text-decoration:none;">${item.link}</a></td>
      <td>
        <button class="action-row-btn btn-primary" onclick="triggerEditModal('${item.id}', '${escapeHtml(item.link)}')">Edit</button>
        <button class="action-row-btn" style="background:var(--error); color:white;" onclick="executeLinkDeletion('${item.id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function applyLiveFilters(e) {
  const term = e.target.value.toLowerCase().trim();
  const subset = cacheMemoryLinks.filter(item => {
    return item.id.toLowerCase().includes(term) || item.link.toLowerCase().includes(term);
  });
  renderTableInterface(subset);
}

function triggerEditModal(id, link) {
  document.getElementById("modal-target-id").value = id;
  document.getElementById("modal-update-url").value = link;
  document.getElementById("edit-modal-element").style.display = "flex";
}

function hideEditModal() {
  document.getElementById("edit-modal-element").style.display = "none";
}

async function processUpdateSave(e) {
  e.preventDefault();
  const id = document.getElementById("modal-target-id").value;
  const link = document.getElementById("modal-update-url").value.trim();

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "updateLink", id: id, link: link })
    });
    const data = await res.json();

    if (data.success) {
      spawnNotification("Link updated successfully.");
      hideEditModal();
      pullAdminRecords();
    } else {
      spawnNotification(data.message, "error");
    }
  } catch (err) {
    spawnNotification("Network submission transaction lost interface pipelines.", "error");
  }
}

async function executeLinkDeletion(id) {
  if (!confirm(`Are you absolutely sure you want to delete ${id}?`)) return;

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "deleteLink", id: id })
    });
    const data = await res.json();

    if (data.success) {
      spawnNotification("Link removed safely from database spreadsheet rows.");
      pullAdminRecords();
    } else {
      spawnNotification(data.message, "error");
    }
  } catch (err) {
    spawnNotification("Server instruction matrix dropped deletion frame package.", "error");
  }
}

function runDataCsvExport() {
  if (cacheMemoryLinks.length === 0) return;
  
  let csvContent = "data:text/csv;charset=utf-8,Date,ID,Destination_Link\n";
  cacheMemoryLinks.forEach(item => {
    csvContent += `"${item.date}","${item.id}","${item.link}"\n`;
  });
  
  const encodedUri = encodeURI(csvContent);
  const downloadLink = document.createElement("a");
  downloadLink.setAttribute("href", encodedUri);
  downloadLink.setAttribute("download", "gyanloop_redirects_export.csv");
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function escapeHtml(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;' }[s];
  });
}