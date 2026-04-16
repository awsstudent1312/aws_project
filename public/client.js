const MAX_MESSAGE_LENGTH = 280;
//limite de caracterec des messages

const div_choice = document.createElement("div"); //contienr les vues
div_choice.id = "topbar";
//connecter
const b_login = document.createElement("button");
b_login.textContent = "login";
//creer compte
const b_create_account = document.createElement("button");
b_create_account.textContent = "create account";
// nouveau message
const b_write_msg = document.createElement("button");
b_write_msg.textContent = "new message";
// deconnection
const b_logout = document.createElement("button");
b_logout.textContent = "logout";

//container des messages
const div_messages = document.createElement("div");
div_messages.id = "div_messages";

const title = document.createElement("div");
title.textContent = "False Social";
title.className = "topbar-title";
//Titre

const topbarIdentity = document.createElement("div");
topbarIdentity.className = "topbar-identity";

const topbarAvatar = document.createElement("img");
topbarAvatar.className = "topbar-avatar";
topbarAvatar.src = "/avatar.svg";
topbarAvatar.alt = "avatar";

const topbarUsername = document.createElement("span");
topbarUsername.className = "topbar-username";

topbarIdentity.appendChild(topbarAvatar);
topbarIdentity.appendChild(topbarUsername);

const right = document.createElement("div");
right.className = "topbar-right";

right.appendChild(b_login);
right.appendChild(b_create_account);
right.appendChild(b_write_msg);
right.appendChild(b_logout);

//ajout à la div menu
const left = document.createElement("div");
left.className = "topbar-left";

left.appendChild(title);
left.appendChild(topbarIdentity);

div_choice.appendChild(left);
div_choice.appendChild(right);

const notificationContainer = document.createElement("div");
notificationContainer.id = "notification-container";

//ajout de la div a la page
document.body.appendChild(div_choice);
document.body.appendChild(notificationContainer);
document.body.appendChild(div_messages);
loadMessages();
updateUI();
setInterval(() => {
  const scrollDiv = document.querySelector("#div_messages .scroll");
  if (!scrollDiv) return;

  const isAtTop = scrollDiv.scrollTop < 50;

  if (!document.querySelector(".modal-create") && isAtTop) {
    loadMessages();
  }
}, 5000);

function enableModalCloseOnOutsideClick(modalOverlay) {
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      modalOverlay.remove();
    }
  });
}

//gestion du bouton de creation de compte
b_create_account.addEventListener("click", () => {
  const div_modal = document.createElement("div");
  div_modal.className = "modal-create";
  const div_container = document.createElement("div");
  div_container.className = "modal-container";
  const modal = create_signin_form();
  div_container.appendChild(modal);
  div_modal.appendChild(div_container);
  document.body.appendChild(div_modal);
  //intercept submit
  enableModalCloseOnOutsideClick(div_modal);
  interceptSigninModal();
});

//gestion du bouton login
b_login.addEventListener("click", () => {
  const div_modal = document.createElement("div");
  div_modal.className = "modal-create";

  const div_container = document.createElement("div");
  div_container.className = "modal-container";

  const modal = create_login_form();
  div_container.appendChild(modal);
  div_modal.appendChild(div_container);
  document.body.appendChild(div_modal);

  enableModalCloseOnOutsideClick(div_modal);
  interceptLoginModal();
});


function showNotification(message, type = "info") {
  const notif = document.createElement("div");
  notif.className = `notification notification-${type}`;
  notif.textContent = message;

  const closeBtn = document.createElement("button");
  closeBtn.className = "notification-close";
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", () => {
    notif.remove();
  });

  notif.appendChild(closeBtn);
  notificationContainer.appendChild(notif);

  setTimeout(() => {
    notif.classList.add("show");
  }, 10);

  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

//gestion de l'ajout de message
b_write_msg.addEventListener("click", () => {
  if (!isLoggedIn()) {
    showNotification("error:\tyou need to login first");
    return;
  }
  const div_modal = document.createElement("div");
  div_modal.className = "modal-create";

  const div_container = document.createElement("div");
  div_container.className = "modal-container";

  const modal = create_message_form();

  div_container.appendChild(modal);
  div_modal.appendChild(div_container);
  document.body.appendChild(div_modal);

  enableModalCloseOnOutsideClick(div_modal);
  interceptMessageModal();
});

//gestion de la déconnection
b_logout.addEventListener("click", logoutUser);

function isLoggedIn() {
  return !!localStorage.getItem("sessionId");
}

function updateUI() {
  const logged = isLoggedIn();
  const username = localStorage.getItem("username") || "";

  b_login.style.display = logged ? "none" : "inline-block";
  b_create_account.style.display = logged ? "none" : "inline-block";
  b_write_msg.style.display = logged ? "inline-block" : "none";
  b_logout.style.display = logged ? "inline-block" : "none";

  if (logged && username) {
    topbarIdentity.style.display = "flex";
    topbarUsername.textContent = `@${username}`;
  } else {
    topbarIdentity.style.display = "none";
    topbarUsername.textContent = "";
  }
}

async function logoutUser() {
  const sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    updateUI();
    return;
  }

  try {
    const res = await fetch("/logout", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
      headers: { "Content-Type": "application/json" },
    });

    const j_res = await res.json();

    if (!j_res.error) {
      localStorage.removeItem("sessionId");
      localStorage.removeItem("username");
      showNotification(j_res.msg, "success");
    } else {
      showNotification(j_res.error, "error");
    }
  } catch (err) {
    showNotification("server unreachable", "error");
  }

  updateUI();
}

function create_signin_form() {
  const modal = document.createElement("form");
  modal.method = "POST";
  modal.action = "/signin";
  modal.id = "modal_signin";
  const div_user = document.createElement("div");
  const label_user = document.createElement("label");
  label_user.textContent = "Username:";
  const username = document.createElement("input");
  username.name = "user";
  username.type = "text";
  const div_pass = document.createElement("div");
  const label_pass = document.createElement("label");
  label_pass.textContent = "Password:";
  const password = document.createElement("input");
  password.name = "pass";
  password.type = "password";
  const div_confirm = document.createElement("div");
  const label_confirm = document.createElement("label");
  label_confirm.textContent = "Reapete:";
  const confirm = document.createElement("input");
  confirm.name = "verif";
  confirm.type = "password";
  const submit = document.createElement("input");
  submit.type = "submit";

  div_user.appendChild(label_user);
  div_user.appendChild(username);
  div_pass.appendChild(label_pass);
  div_pass.appendChild(password);
  div_confirm.appendChild(label_confirm);
  div_confirm.appendChild(confirm);

  modal.appendChild(div_user);
  modal.appendChild(div_pass);
  modal.appendChild(div_confirm);
  modal.appendChild(submit);
  return modal;
}

async function interceptSigninModal() {
  document
    .getElementById("modal_signin")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.target;
      const data = new FormData(form);
      const res = await fetch("/signin", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(data)),
        headers: { "Content-Type": "application/json" },
      });
      console.log(res);
      const j_res = await res.json();
      console.log(j_res);
      if (!j_res.error) {
        showNotification(j_res.msg, "success");
      } else {
        showNotification(j_res.error, "error");
      }
      document.querySelector(".modal-create").remove();
    });
}

function create_login_form() {
  const modal = document.createElement("form");
  modal.method = "POST";
  modal.action = "/login";
  modal.id = "modal_login";

  const div_user = document.createElement("div");
  const label_user = document.createElement("label");
  label_user.textContent = "Username:";
  const username = document.createElement("input");
  username.name = "user";
  username.type = "text";

  const div_pass = document.createElement("div");
  const label_pass = document.createElement("label");
  label_pass.textContent = "Password:";
  const password = document.createElement("input");
  password.name = "pass";
  password.type = "password";

  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "login";

  div_user.appendChild(label_user);
  div_user.appendChild(username);
  div_pass.appendChild(label_pass);
  div_pass.appendChild(password);

  modal.appendChild(div_user);
  modal.appendChild(div_pass);
  modal.appendChild(submit);

  return modal;
}

async function interceptLoginModal() {
  document
    .getElementById("modal_login")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const form = event.target;
      const data = new FormData(form);

      const res = await fetch("/login", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(data)),
        headers: { "Content-Type": "application/json" },
      });

      const j_res = await res.json();
      console.log(j_res);

      if (!j_res.error) {
        showNotification(j_res.msg, "success");
        localStorage.setItem("sessionId", j_res.sessionId);
        localStorage.setItem("username", data.get("user").trim());
        updateUI();
      } else {
        showNotification(j_res.error, "error");
      }

      document.querySelector(".modal-create").remove();
    });
}

function formatRelativeDate(dateString) {
  const now = new Date();
  const date = new Date(dateString);

  const diff = Math.floor((now - date) / 1000); // en secondes

  if (diff < 60) return "à l'instant";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `il y a ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} j`;

  // fallback date classique
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

async function loadMessages() {
  sessionStorage.last = 0; //index dernier message recus
  const res = await fetch("/messages");
  const j_res = await res.json();

  console.log(j_res);

  div_messages.innerHTML = "";

  const title_messages = document.createElement("h2");
  title_messages.textContent = "Messages récents";
  const div_scroll = document.createElement("div");
  div_scroll.className = "scroll";
  div_messages.appendChild(title_messages);
  div_messages.appendChild(div_scroll);
  if (j_res.error) {
    showNotification(j_res.error, "error");
    return;
  }
  sessionStorage.last = j_res.last;
  for (let msg of j_res.messages) {
    const div_msg = document.createElement("div");
    div_msg.className = "item";

    // conteneur header (avatar + pseudo)
    const header = document.createElement("div");
    header.className = "message_header";

    // avatar
    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = "/avatar.svg";

    const author = document.createElement("h3");
    author.textContent = `@${msg.author}`;

    header.appendChild(avatar);
    header.appendChild(author);

    const div_content = document.createElement("div");
    div_content.className = "message_content";
    msg.content.split("\n").forEach((line) => {
      const content = document.createElement("p");
      content.textContent = line;
      div_content.appendChild(content);
    });

    const date = document.createElement("small");
    date.textContent = formatRelativeDate(msg.created_at);

    div_msg.appendChild(header);
    div_msg.appendChild(div_content);
    div_msg.appendChild(date);

    div_scroll.appendChild(div_msg);
  }
  div_scroll.addEventListener("scroll", (event) =>
    send_messages_atBotom(event),
  );
}

async function send_messages_atBotom(event) {
  const cursor_position = event.target.scrollTop;
  const max_pos = event.target.scrollHeight;
  const add_to_position = event.target.clientHeight;
  if (cursor_position + add_to_position >= max_pos - 1) {
    await next_messages();
    setTimeout(500);
  }
}

async function next_messages() {
  const res = await fetch("/messages?size=10&start=" + sessionStorage.last);
  const j_res = await res.json();
  if (j_res.error) {
    showNotification(j_res.error, "info");
    return;
  }
  if (sessionStorage.last == j_res.last) {
    return;
  }
  sessionStorage.last = j_res.last;
  const div_scroll = document.querySelector("#div_messages .scroll");
  for (let msg of j_res.messages) {
    const div_msg = document.createElement("div");
    div_msg.className = "item";

    // conteneur header (avatar + pseudo)
    const header = document.createElement("div");
    header.className = "message_header";

    // avatar
    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = "/avatar.svg";

    const author = document.createElement("h3");
    author.textContent = `@${msg.author}`;

    header.appendChild(avatar);
    header.appendChild(author);

    const div_content = document.createElement("div");
    div_content.className = "message_content";
    msg.content.split("\n").forEach((line) => {
      const content = document.createElement("p");
      content.textContent = line;
      div_content.appendChild(content);
    });

    const date = document.createElement("small");
    date.textContent = formatRelativeDate(msg.created_at);

    div_msg.appendChild(header);
    div_msg.appendChild(div_content);
    div_msg.appendChild(date);

    div_scroll.appendChild(div_msg);
  }
}

function create_message_form() {
  const modal = document.createElement("form");
  modal.method = "POST";
  modal.action = "/post";
  modal.id = "modal_post";

  const content = document.createElement("textarea");
  content.name = "content";
  content.rows = 5;
  content.cols = 30;
  content.maxLength = MAX_MESSAGE_LENGTH;
  content.placeholder = "Quoi de neuf?";
  modal.appendChild(content);

  const counter = document.createElement("div");
  counter.id = "message-counter";
  counter.textContent = `0 / ${MAX_MESSAGE_LENGTH}`;
  modal.appendChild(counter);

  content.addEventListener("input", () => {
    counter.textContent = `${content.value.length} / ${MAX_MESSAGE_LENGTH}`;
  });

  const hidden_session = document.createElement("input");
  hidden_session.type = "hidden";
  hidden_session.hidden = true;
  hidden_session.name = "sessionId";
  hidden_session.value = localStorage.getItem("sessionId");
  modal.appendChild(hidden_session);

  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "send";
  modal.appendChild(submit);

  return modal;
}

async function interceptMessageModal() {
  document
    .getElementById("modal_post")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const form = event.target;
      const data = new FormData(form);
      const data_sent = Object.fromEntries(data);

      const trimmed = (data_sent.content || "").trim();

      if (!trimmed) {
        showNotification("message vide interdit", "error");
        return;
      }

      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        showNotification(
          `message trop long (${MAX_MESSAGE_LENGTH} caractères max)`,
          "error",
        );
        return;
      }

      data_sent.content = trimmed;

      try {
        const res = await fetch("/post", {
          method: "POST",
          body: JSON.stringify(data_sent),
          headers: { "Content-Type": "application/json" },
        });

        const j_res = await res.json();

        if (!j_res.error) {
          showNotification(j_res.msg, "success");
          document.querySelector(".modal-create").remove();
          await loadMessages();
        } else {
          showNotification(j_res.error, "error");
        }
      } catch (err) {
        showNotification("server unreachable", "error");
      }
    });
}
