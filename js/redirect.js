document.addEventListener("DOMContentLoaded", () => {
  processUrlHashMapping();
});

async function processUrlHashMapping() {
  const hash = window.location.hash.trim();
  
  if (!hash) {
    // Normal Homepage initialization context
    return;
  }

  // Force system architecture verification standard routing formatting rules
  const lookupId = hash.toLowerCase();

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "getRedirect", id: lookupId })
    });
    
    const data = await res.json();
    
    if (data.success && data.found) {
      window.location.href = data.url;
    } else {
      window.location.href = "404.html";
    }
  } catch (error) {
    console.error("Redirection failure parsing pipeline:", error);
    window.location.href = "404.html";
  }
}