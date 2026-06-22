const CONFIG = {
  // Insert your deployed Apps Script Web App URL below
  API_URL: "https://script.google.com/macros/s/AKfycbykz_WxoKk8rS2TM2VsJGhl8fBq6r4MRKw5WwPIEHgeestUFegNnPfnaLKJbS4ulAO3cg/exec"
};

// Global Toast Alert UI Mechanism
function spawnNotification(message, type = "success") {
  const existingToast = document.getElementById("runtime-toast");
  if(existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.id = "runtime-toast";
  toast.className = "alert-toast";
  toast.style.background = type === "success" ? "var(--success)" : "var(--error)";
  toast.style.color = "white";
  toast.innerText = message;
  
  document.body.appendChild(toast);
  setTimeout(() => { if(toast) toast.remove(); }, 4000);
}
