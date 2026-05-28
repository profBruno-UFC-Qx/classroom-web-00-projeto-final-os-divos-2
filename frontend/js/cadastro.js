const botoesTipoUsuario = document.querySelectorAll(".user-types button");
const formularioCadastro = document.querySelector("form");

let tipoUsuarioSelecionado = "Cidadão";

botoesTipoUsuario.forEach(function (botao) {
  botao.addEventListener("click", function () {
    botoesTipoUsuario.forEach(function (item) {
      item.classList.remove("active");
    });

    botao.classList.add("active");

    const nomeTipo = botao.querySelector("strong");
    tipoUsuarioSelecionado = nomeTipo ? nomeTipo.textContent : botao.textContent.trim();
  });
});

formularioCadastro.addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = document.querySelector('input[placeholder="Digite seu nome completo"]').value.trim();
  const email = document.querySelector('input[placeholder="seu@email.com"]').value.trim();
  const cpf = document.querySelector('input[placeholder="000.000.000-00"]').value.trim();
  const telefone = document.querySelector('input[placeholder="(88) 99999-9999"]').value.trim();
  const senha = document.querySelector('input[placeholder="Crie uma senha"]').value.trim();
  const confirmarSenha = document.querySelector('input[placeholder="Confirme sua senha"]').value.trim();
  const aceitouTermos = document.getElementById("termos").checked;

  if (!nome || !email || !cpf || !telefone || !senha || !confirmarSenha) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  if (!aceitouTermos) {
    alert("Você precisa aceitar os termos de uso para continuar.");
    return;
  }

  const dadosUsuario = {
    nome,
    email,
    cpf,
    telefone,
    tipoUsuario: tipoUsuarioSelecionado
  };

  console.log("Dados do usuário:", dadosUsuario);

  alert("Cadastro realizado com sucesso!");
  window.location.href = "login.html";
});