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

//ajout à la div menu
div_choice.appendChild(b_login);
div_choice.appendChild(b_create_account);
div_choice.appendChild(b_write_msg);

//ajout de la div a la page
document.body.appendChild(div_choice);

//gestion du bouton login
b_login.addEventListener("click", () => {
  alert("bouton login cliqué");
});

//gestion du bouton de creation de compte
b_create_account.addEventListener("click", () => {
  const div_modal = document.createElement("div");
  div_modal.className = "modal-create";
  const div_container = document.createElement("div");
  div_container.className = "modal-container";
  const modal = document.createElement("form");
  modal.method = "POST";
  modal.action = "/signin";
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
  div_container.appendChild(modal);
  div_modal.appendChild(div_container);
  document.body.appendChild(div_modal);
  //intercept submit
  document
    .getElementById("modal_login")
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
});

//test
const title = document.createElement("h1");
title.innerHTML = "hello in my app";
document.body.appendChild(title);
