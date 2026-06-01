const botaoMostrarSenha = document.querySelector(".toggle-password");
const campoSenha = document.getElementById("senha");
const campoEmail = document.getElementById("email");
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

formularioLogin.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = campoEmail.value.trim();
  const senha = campoSenha.value.trim();

  if (!email || !senha) {
    alert("Preencha o e-mail e a senha para continuar.");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:1337/api/auth/local", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        identifier: email,
        password: senha
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      console.error("Erro no login:", dados);
      alert("E-mail ou senha inválidos.");
      return;
    }

    localStorage.setItem("token", dados.jwt);
    localStorage.setItem("usuario", JSON.stringify(dados.user));

    window.location.href = "dashboard.html";

  } catch (erro) {
    console.error("Erro de conexão:", erro);
    alert("Não foi possível conectar ao Strapi. Verifique se o backend está rodando.");
  }
});

if (botaoGoogle) {
  botaoGoogle.addEventListener("click", function () {
    alert("Login com Google ainda não implementado nesta versão.");
  });
}