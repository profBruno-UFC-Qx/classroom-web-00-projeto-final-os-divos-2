const botoesTipoUsuario = document.querySelectorAll(".user-types button");
const formularioCadastro = document.querySelector("form");

let tipoUsuarioSelecionado = "cidadao";

const tiposUsuario = {
  "Cidadão": "cidadao",
  "Catador/Coletor": "catador",
  "Comércio/Escola": "comercio_escola"
};

botoesTipoUsuario.forEach(function (botao) {
  botao.addEventListener("click", function () {
    botoesTipoUsuario.forEach(function (item) {
      item.classList.remove("active");
    });

    botao.classList.add("active");

    const nomeTipo = botao.querySelector("strong");
    const textoTipo = nomeTipo ? nomeTipo.textContent.trim() : botao.textContent.trim();

    tipoUsuarioSelecionado = tiposUsuario[textoTipo] || "cidadao";
  });
});

formularioCadastro.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nome = document.querySelector('input[placeholder="Digite seu nome completo"]').value.trim();
  const email = document.querySelector('input[placeholder="seu@email.com"]').value.trim();
  const cpf = document.querySelector('input[placeholder="000.000.000-00"]').value.trim();
  const telefone = document.querySelector('input[placeholder="(88) 99999-9999"]').value.trim();
  const endereco = document.querySelector('input[placeholder="Rua, número, bairro, cidade - CE"]').value.trim();
  const senha = document.querySelector('input[placeholder="Crie uma senha"]').value.trim();
  const confirmarSenha = document.querySelector('input[placeholder="Confirme sua senha"]').value.trim();
  const aceitouTermos = document.getElementById("termos").checked;

  if (!nome || !email || !cpf || !telefone || !endereco || !senha || !confirmarSenha) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  if (senha.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres.");
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

  try {
    const respostaCadastro = await fetch("http://localhost:1337/api/auth/local/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: nome,
        email: email,
        password: senha
      })
    });

    const dadosCadastro = await respostaCadastro.json();

    if (!respostaCadastro.ok) {
      console.error("Erro no cadastro:", dadosCadastro);

      if (dadosCadastro.error && dadosCadastro.error.message) {
        alert("Erro ao cadastrar: " + dadosCadastro.error.message);
      } else {
        alert("Não foi possível realizar o cadastro.");
      }

      return;
    }

    const token = dadosCadastro.jwt;
    const usuario = dadosCadastro.user;

    const respostaAtualizacao = await fetch(`http://localhost:1337/api/users/${usuario.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        nome_completo: nome,
        cpf: cpf,
        telefone: telefone,
        endereco: endereco,
        tipo_usuario: tipoUsuarioSelecionado
      })
    });

    const usuarioAtualizado = await respostaAtualizacao.json();

    if (!respostaAtualizacao.ok) {
      console.error("Erro ao atualizar usuário:", usuarioAtualizado);
      alert("Usuário criado, mas não foi possível salvar os dados complementares.");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));

    alert("Cadastro realizado com sucesso!");
    window.location.href = "dashboard.html";

  } catch (erro) {
    console.error("Erro de conexão:", erro);
    alert("Não foi possível conectar ao Strapi. Verifique se o backend está rodando.");
  }
});