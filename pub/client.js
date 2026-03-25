const div_choice = document.createElement("div"); //contienr les vues
//connecter
const b_login = document.createElement("button");
b_login.textContent = "login";
//creer compte
const b_create_account = document.createElement("button");
b_create_account.textContent = "create account";
// nouveau message
const b_write_msg = document.createElement("button");
b_write_msg.textContent = "new message";

//container des messages
const div_messages = document.createElement("div");
div_messages.id = "div_messages";

//ajout à la div menu

div_choice.appendChild(b_login);
div_choice.appendChild(b_create_account);
div_choice.appendChild(b_write_msg);

//ajout de la div a la page
document.body.appendChild(div_choice);
document.body.appendChild(div_messages);
loadMessages();

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

  interceptLoginModal();
});

//gestion de l'ajout de message
b_write_msg.addEventListener("click", () => {
  const div_modal = document.createElement("div");
  div_modal.className = "modal-create";

  const div_container = document.createElement("div");
  div_container.className = "modal-container";

  const modal = create_message_form();

  div_container.appendChild(modal);
  div_modal.appendChild(div_container);
  document.body.appendChild(div_modal);

  interceptMessageModal();
})

//test
const title = document.createElement("h1");
title.innerHTML = "hello in my app";
document.body.appendChild(title);

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
      const h_res = document.createElement("h1");
      if (!j_res.error) {
        h_res.textContent = j_res.msg;
      } else {
        h_res.textContent = "error:\t" + j_res.error;
      }
      document.body.appendChild(h_res);
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

      const h_res = document.createElement("h1");

      if (!j_res.error) {
        h_res.textContent = j_res.msg;
        localStorage.setItem("user", j_res.user);
        localStorage.setItem("password", j_res.password);
      } else {
        h_res.textContent = "error:\t" + j_res.error;
      }

      document.body.appendChild(h_res);
      document.querySelector(".modal-create").remove();
    });
}

async function loadMessages() {
  const res = await fetch("/messages");
  const j_res = await res.json();

  console.log(j_res);

  div_messages.innerHTML = "";

  const title_messages = document.createElement("h2");
  title_messages.textContent = "False Social";
  const div_scroll = document.createElement('div');
  div_scroll.className= "scroll";
  div_messages.appendChild(title_messages);
  div_messages.appendChild(div_scroll);
  if (j_res.error) {
    const error = document.createElement("p");
    error.textContent = j_res.error;
    div_messages.appendChild(error);
    return;
  }

  for (let msg of j_res) {
    const div_msg = document.createElement("div");
    div_msg.className = "item";
    const author = document.createElement("h3");
    author.textContent = msg.author;

    const div_content = document.createElement("div");
    div_content.className = "message_content";
    msg.content.split("\n").forEach((line) => {
      const content = document.createElement("p");
      content.textContent = line;
      div_content.appendChild(content);
    });

    const date = document.createElement("small");
    date.textContent = msg.created_at;

    div_msg.appendChild(author);
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
  modal.appendChild(content);
  const hidden_user = document.createElement("input");
  hidden_user.type = "hidden";
  hidden_user.hidden = "";
  hidden_user.name = "user";
  hidden_user.value = localStorage.getItem("user");
  modal.appendChild(hidden_user);
  const hidden_password = document.createElement("input");
  hidden_password.type = "hidden";
  hidden_password.name = "password";
  hidden_password.value = localStorage.getItem("password");
  modal.appendChild(hidden_password);
  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "send";
  modal.appendChild(submit);

  return modal;
}

async function interceptMessageModal() {
  document.getElementById("modal_post")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const form = event.target;
      const data = new FormData(form);

      const res = await fetch("/post", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(data)),
        headers: { "Content-Type": "application/json" },
      });

      console.log(res);
      const j_res = await res.json();
      console.log(j_res);
      const h_res = document.createElement("h1");
      if (!j_res.error) {
        h_res.textContent = j_res.msg;
      } else {
        h_res.textContent = "error:\t" + j_res.error;
      }
      document.body.appendChild(h_res);
      document.querySelector(".modal-create").remove();
    });
}
