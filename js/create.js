// ... (Keep the rest of create.js exactly the same as the previous response)

    if (data.success) {
      spawnNotification("Link generated successfully!");
      document.getElementById("redirect-generation-form").reset();
      document.getElementById("id-validation-status").innerText = "";
      isIdValidAndAvailable = false;
      
      // FIX: Forces the target URL to use go.html instead of your index page
      const targetBaseUrl = window.location.origin + window.location.pathname.replace("create.html", "go.html");
      const generatedUrl = `${targetBaseUrl}${finalId}`;
      
      document.getElementById("success-display-panel").innerHTML = `
        <div style="margin-top:20px; padding:20px; background:rgba(16,185,129,0.1); border:1px solid var(--success); border-radius:8px;">
          <p style="margin-bottom:8px; color:var(--success); font-weight:bold;">Your Short URL is ready:</p>
          <a href="${generatedUrl}" target="_blank" style="color:var(--accent-cyan); word-break:break-all;">${generatedUrl}</a>
        </div>
      `;
    }
// ...