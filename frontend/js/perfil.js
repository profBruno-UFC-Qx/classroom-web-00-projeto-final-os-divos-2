const token = localStorage.getItem("token");

const perfilNome = document.getElementById("perfil-nome");
const perfilEmail = document.getElementById("perfil-email");
const perfilCpf = document.getElementById("perfil-cpf");
const perfilTelefone = document.getElementById("perfil-telefone");
const perfilEndereco = document.getElementById("perfil-endereco");
const perfilTipo = document.getElementById("perfil-tipo");

const perfilSaudacao = document.getElementById("perfil-saudacao");
const perfilInicial = document.getElementById("perfil-inicial");
const perfilNomeResumo = document.getElementById("perfil-nome-resumo");

const modalPerfil = document.getElementById("profile-modal");
const botaoEditarPerfil = document.getElementById("btn-editar-perfil");
const botaoFecharModal = document.getElementById("btn-fechar-modal");
const botaoCancelarEdicao = document.getElementById("btn-cancelar-edicao");
const formularioEditarPerfil = document.getElementById("form-editar-perfil");

const editarNome = document.getElementById("editar-nome");
const editarCpf = document.getElementById("editar-cpf");
const editarTelefone = document.getElementById("editar-telefone");
const editarEndereco = document.getElementById("editar-endereco");

let usuarioLogado = null;

function formatarTipoUsuario(tipo) {
  const tipos = {
    cidadao: "Cidadão",
    catador: "Catador/Coletor",
    comercio_escola: "Comércio/Escola"
  };

  return tipos[tipo] || "Não informado";
}

function obterPrimeiroNome(nomeCompleto) {
  if (!nomeCompleto) {
    return "usuário";
  }

  return nomeCompleto.trim().split(" ")[0];
}

async function buscarRegistrosDoUsuario(endpoint, usuarioId) {
  try {
    const resposta = await fetch(
      `http://localhost:1337/api/${endpoint}?filters[usuario][id][$eq]=${usuarioId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!resposta.ok) {
      console.warn(
        `Não foi possível buscar ${endpoint}. Verifique relação/permissão no Strapi.`
      );
      return [];
    }

    const dados = await resposta.json();
    return dados.data || [];

  } catch (erro) {
    console.error(`Erro ao buscar ${endpoint}:`, erro);
    return [];
  }
}

function calcularImpacto(descartes) {
  return descartes.reduce(function (total, descarte) {
    const item = descarte.attributes || descarte;

    const peso =
      Number(item.peso_kg) ||
      Number(item.quantidade_kg) ||
      Number(item.quantidade) ||
      0;

    return total + peso;
  }, 0);
}

function atualizarResumoParticipacao(totalDescartes, totalColetas, impactoTotal) {
  const pontos = totalDescartes * 10;

  const campoTotalDescartes = document.getElementById("perfil-total-descartes");
  const campoTotalColetas = document.getElementById("perfil-total-coletas");
  const campoImpacto = document.getElementById("perfil-impacto");
  const campoPontos = document.getElementById("perfil-pontos");

  const textoDescartes = document.getElementById("perfil-texto-descartes");
  const textoColetas = document.getElementById("perfil-texto-coletas");
  const textoImpacto = document.getElementById("perfil-texto-impacto");

  const resumoStatus = document.getElementById("perfil-resumo-status");
  const mensagemParticipacao = document.getElementById("perfil-mensagem-participacao");

  if (campoTotalDescartes) {
    campoTotalDescartes.textContent = totalDescartes;
  }

  if (campoTotalColetas) {
    campoTotalColetas.textContent = totalColetas;
  }

  if (campoImpacto) {
    campoImpacto.textContent = `${impactoTotal.toFixed(1)} kg`;
  }

  if (campoPontos) {
    campoPontos.textContent = pontos;
  }

  if (textoDescartes) {
    textoDescartes.textContent =
      totalDescartes === 1 ? "registro encontrado" : "registros encontrados";
  }

  if (textoColetas) {
    textoColetas.textContent =
      totalColetas === 1 ? "solicitação encontrada" : "solicitações encontradas";
  }

  if (textoImpacto) {
    textoImpacto.textContent =
      impactoTotal > 0 ? "reciclados" : "aguardando registros";
  }

  if (totalDescartes === 0 && totalColetas === 0) {
    if (resumoStatus) {
      resumoStatus.textContent = "Você ainda não possui registros de participação.";
    }

    if (mensagemParticipacao) {
      mensagemParticipacao.textContent =
        "Registre um descarte ou solicite uma coleta para começar a acompanhar seu impacto ambiental.";
    }

    return;
  }

  if (resumoStatus) {
    resumoStatus.textContent =
      `${totalDescartes} descartes e ${totalColetas} coletas vinculados à sua conta.`;
  }

  if (mensagemParticipacao) {
    mensagemParticipacao.textContent =
      "Continue registrando seus descartes e acompanhando suas coletas para aumentar seu impacto positivo.";
  }
}

async function carregarParticipacao(usuarioId) {
  const descartes = await buscarRegistrosDoUsuario("descartes", usuarioId);
  const coletas = await buscarRegistrosDoUsuario("solicitacao-de-coletas", usuarioId);

  const totalDescartes = descartes.length;
  const totalColetas = coletas.length;
  const impactoTotal = calcularImpacto(descartes);

  atualizarResumoParticipacao(totalDescartes, totalColetas, impactoTotal);
}

async function carregarPerfil() {
  if (!token) {
    alert("Você precisa estar logado para acessar o perfil.");
    window.location.href = "login.html";
    return;
  }

  try {
    const resposta = await fetch("http://localhost:1337/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const usuario = await resposta.json();

    if (!resposta.ok) {
      console.error("Erro ao carregar perfil:", usuario);
      alert("Não foi possível carregar os dados do perfil.");
      window.location.href = "login.html";
      return;
    }

    usuarioLogado = usuario;

    const nomeCompleto = usuario.nome_completo || usuario.username || "Usuário";
    const primeiroNome = obterPrimeiroNome(nomeCompleto);

    perfilNome.textContent = nomeCompleto;
    perfilEmail.textContent = usuario.email || "Não informado";
    perfilCpf.textContent = usuario.cpf || "Não informado";
    perfilTelefone.textContent = usuario.telefone || "Não informado";
    perfilEndereco.textContent = usuario.endereco || "Não informado";
    perfilTipo.textContent = formatarTipoUsuario(usuario.tipo_usuario);

    perfilSaudacao.textContent = `Olá, ${primeiroNome}!`;
    perfilInicial.textContent = primeiroNome.charAt(0).toUpperCase();
    perfilNomeResumo.textContent = nomeCompleto;

    await carregarParticipacao(usuario.id);

  } catch (erro) {
    console.error("Erro de conexão:", erro);
    alert("Erro ao conectar com o Strapi. Verifique se o backend está rodando.");
  }
}

function abrirModalPerfil() {
  if (!usuarioLogado) {
    alert("Os dados do usuário ainda não foram carregados.");
    return;
  }

  editarNome.value = usuarioLogado.nome_completo || usuarioLogado.username || "";
  editarCpf.value = usuarioLogado.cpf || "";
  editarTelefone.value = usuarioLogado.telefone || "";
  editarEndereco.value = usuarioLogado.endereco || "";

  modalPerfil.classList.add("active");
}

function fecharModalPerfil() {
  modalPerfil.classList.remove("active");
}

if (botaoEditarPerfil) {
  botaoEditarPerfil.addEventListener("click", abrirModalPerfil);
}

if (botaoFecharModal) {
  botaoFecharModal.addEventListener("click", fecharModalPerfil);
}

if (botaoCancelarEdicao) {
  botaoCancelarEdicao.addEventListener("click", fecharModalPerfil);
}

if (modalPerfil) {
  modalPerfil.addEventListener("click", function (event) {
    if (event.target === modalPerfil) {
      fecharModalPerfil();
    }
  });
}

if (formularioEditarPerfil) {
  formularioEditarPerfil.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!usuarioLogado) {
      alert("Usuário não carregado.");
      return;
    }

    const nomeAtualizado = editarNome.value.trim();
    const telefoneAtualizado = editarTelefone.value.trim();
    const enderecoAtualizado = editarEndereco.value.trim();

    if (!nomeAtualizado || !telefoneAtualizado || !enderecoAtualizado) {
  alert("Preencha todos os campos editáveis.");
  return;
}

    try {
      const resposta = await fetch(`http://localhost:1337/api/users/${usuarioLogado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: nomeAtualizado,
          nome_completo: nomeAtualizado,
          cpf: cpfAtualizado,
          telefone: telefoneAtualizado,
          endereco: enderecoAtualizado
        })
      });

      const usuarioAtualizado = await resposta.json();

      if (!resposta.ok) {
        console.error("Erro ao atualizar perfil:", usuarioAtualizado);
        alert("Não foi possível atualizar o perfil.");
        return;
      }

      usuarioLogado = usuarioAtualizado;
      localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));

      const nomeCompleto = usuarioAtualizado.nome_completo || usuarioAtualizado.username || "Usuário";
      const primeiroNome = obterPrimeiroNome(nomeCompleto);

      perfilNome.textContent = nomeCompleto;
      perfilCpf.textContent = usuarioAtualizado.cpf || "Não informado";
      perfilTelefone.textContent = usuarioAtualizado.telefone || "Não informado";
      perfilEndereco.textContent = usuarioAtualizado.endereco || "Não informado";

      perfilSaudacao.textContent = `Olá, ${primeiroNome}!`;
      perfilInicial.textContent = primeiroNome.charAt(0).toUpperCase();
      perfilNomeResumo.textContent = nomeCompleto;

      fecharModalPerfil();
      alert("Perfil atualizado com sucesso!");

    } catch (erro) {
      console.error("Erro de conexão:", erro);
      alert("Erro ao conectar com o Strapi.");
    }
  });
}

carregarPerfil();