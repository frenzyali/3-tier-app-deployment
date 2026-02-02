
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.4s ease forwards";
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

async function loadUsers() {
    const res = await fetch("/api/users");
    const users = await res.json();

    const list = document.getElementById("userList");
    if (!list) return;

    list.innerHTML = "";
    users.forEach(u => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${u.name}
            <button onclick="handleDelete(${u.id})">Delete</button>
        `;
        list.appendChild(li);
    });
}

async function addUser() {
    const input = document.getElementById("name");
    const name = input.value.trim();
    if (!name) return;

    // TEMP ID for optimistic UI
    const tempId = "temp-" + Date.now();

    addUserToDOM(tempId, name);
    showToast("Adding user...");

    input.value = "";

    try {
        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });

        if (!res.ok) throw new Error();

        showToast("User added");
        loadUsers(); // sync real IDs
    } catch {
        removeUserFromDOM(tempId);
        showToast("Failed to add user", "error");
    }
}


let deleteId = null;

function openModal(id) {
    deleteId = id;

    const modal = document.getElementById("modal");
    if (!modal) {
        console.error("Modal not found on this page");
        return;
    }

    modal.style.display = "flex";
}


function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.style.display = "none";
}

async function handleDelete(id) {
    removeUserFromDOM(id);
    showToast("Deleting user...");

    try {
        const res = await fetch(`/api/users/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error();

        showToast("User deleted");
    } catch {
        showToast("Delete failed, restoring user", "error");
        loadUsers(); // restore from server
    }
}

function addUserToDOM(id, name) {
    const list = document.getElementById("userList");
    if (!list) return;

    const li = document.createElement("li");
    li.dataset.id = id;
    li.classList.add("user-item");

    li.innerHTML = `
        <span>${name}</span>
        <button onclick="handleDelete(${id})">Delete</button>
    `;

    list.prepend(li);
}

function removeUserFromDOM(id) {
    const item = document.querySelector(`li[data-id="${id}"]`);
    if (!item) return;

    item.style.transition = "all 0.25s ease";
    item.style.opacity = "0";
    item.style.transform = "translateX(20px)";

    setTimeout(() => item.remove(), 250);
}

loadUsers();

