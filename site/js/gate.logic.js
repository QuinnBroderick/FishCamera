// gateway.js
const $ = (sel) => document.querySelector(sel);

// allowed credentials (temporary; we’ll replace later), add an ablity to add new users
const ALLOWED_USER = "Username";     // <- change me
const ALLOWED_PASS = "password"; // <- change me

function showError(msg) {
  const box = $("#msg");
  if (box) box.textContent = msg || "";
}
// login logic
function attemptLogin() {
  const un = $("#un")?.value.trim() || "";
  const pw = $("#pw")?.value || "";

  if (!un || !pw) {
    showError("Username and password required.");
    (un ? $("#pw") : $("#un"))?.focus();
    return;
  }

  if (un === ALLOWED_USER && pw === ALLOWED_PASS) {
    // mark session as authenticated and go to viewer
    sessionStorage.setItem("fishcam_ok", "1");
    location.href = "home.html";
  } else {
    showError("Incorrect username or password.");
    const pwEl = $("#pw");
    if (pwEl) { pwEl.value = ""; pwEl.focus(); }
  }
}

// button logic
function initGate() {
  $("#enter")?.addEventListener("click", attemptLogin);
  $("#pw")?.addEventListener("keydown", (e) => { if (e.key === "Enter") attemptLogin(); });
  $("#un")?.addEventListener("keydown", (e) => { if (e.key === "Enter") attemptLogin(); });
  showError(""); // clear any default text
}


document.addEventListener("DOMContentLoaded", initGate);

