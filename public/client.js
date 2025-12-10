let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJpYXQiOjE3NjUzMTM5NjQsImV4cCI6MTc2NTkxODc2NH0.YL9_c1_UiZ9PdjeUHUehbHLx33-WI-wPTOY3mDl7atE";

// Login
async function login(username, password) {
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (data.token) {
    token = data.token;
    document.getElementById("loginForm").style.display = "none";
    loadFiles();
    document.getElementById("panel").style.display = "block";
  } else {
    alert("Login failed");
  }
}

// Load files
async function loadFiles() {
  const res = await fetch("/files", {
    headers: { Authorization: "Bearer " + token },
  });
  const files = await res.json();
  const list = document.getElementById("fileList");
  list.innerHTML = "";
  files.forEach((f) => {
    const div = document.createElement("div");
    div.className = "file-item";
    div.innerHTML = `
      <span>${f.isDir ? "📁" : "📄"} ${f.name}</span>
      ${
        !f.isDir
          ? `<button onclick="downloadFile('${f.name}')">Download</button>`
          : ""
      }
      <button onclick="deleteFile('${f.name}')">Delete</button>
      <button onclick="renameFilePrompt('${f.name}')">Rename</button>
    `;
    list.appendChild(div);
  });
}

// Download
function downloadFile(name) {
  fetch(`/download?file=${encodeURIComponent(name)}`, {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
}
async function loadUploads() {
  const res = await fetch("/uploads", {
    headers: { Authorization: "Bearer " + token },
  });

  const files = await res.json();
  const sel = document.getElementById("uploadFiles");
  sel.innerHTML = "";

  files.forEach((f) => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    sel.appendChild(opt);
  });
}
async function viewUploadFile() {
  const name = document.getElementById("uploadFiles").value;
  if (!name) return;

  // Шууд татаж авах
  window.location.href = `/download?name=${encodeURIComponent(name)}`;
}

// Upload
function upload() {
  const file = document.getElementById("uploadFile").files[0];
  if (!file) return alert("Select a file");
  const formData = new FormData();
  formData.append("file", file);
  try {
    console.log("token", token);
    fetch("/upload", {
      method: "POST",
      body: formData,
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.text())
      .then((r) => {
        console.log(r);
        loadFiles();
      });
  } catch (error) {
    console.log("err", error);
  }
}

// Delete
function deleteFile(name) {
  if (!confirm(`Delete ${name}?`)) return;
  fetch("/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ name }),
  })
    .then((res) => res.text())
    .then((r) => {
      alert(r);
      loadFiles();
    });
}

// Rename
function renameFilePrompt(oldName) {
  const newName = prompt("New name:", oldName);
  if (!newName) return;
  fetch("/rename", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ oldName, newName }),
  })
    .then((res) => res.text())
    .then((r) => {
      alert(r);
      loadFiles();
    });
}

// Logs
function loadLog() {
  const f = document.getElementById("logFile").value;
  fetch(`/log?file=${f}`, { headers: { Authorization: "Bearer " + token } })
    .then((res) => res.text())
    .then((txt) => {
      document.getElementById("logOutput").innerText = txt;
    });
}

// Auto login
if (document.cookie.includes("token")) {
  token = document.cookie.split("token=")[1];
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("panel").style.display = "block";
  loadFiles();
}
