const botaoMostrarSenha = document.querySelector(".toggle-password");
const campoSenha = document.getElementById("senha");
const formularioLogin = document.querySelector("form");
const botaoGoogle = document.querySelector(".login-google-btn");

botaoMostrarSenha.addEventListener("click", function () {
  const senhaEstaOculta = campoSenha.type === "password";

  if (senhaEstaOculta) {
    campoSenha.type = "text";
    botaoMostrarSenha.innerHTML = '<i class="bi bi-eye-slash"></i>';
  } else {
    campoSenha.type = "password";
    botaoMostrarSenha.innerHTML = '<i class="bi bi-eye"></i>';
  }
});

formularioLogin.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (email === "" || senha === "") {
    alert("Preencha o e-mail e a senha para continuar.");
    return;
  }

  window.location.href = "dashboard.html";
});

botaoGoogle.addEventListener("click", function () {
  alert("Login com Google ainda não implementado.");
});