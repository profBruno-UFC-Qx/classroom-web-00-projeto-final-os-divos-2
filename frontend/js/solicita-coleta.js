const formSolicitacao = document.getElementById("form-solicitacao");
const botaoCancelar = document.getElementById("btn-cancelar");

formSolicitacao.addEventListener("submit", async function (event) {
  event.preventDefault();

  const tipoMaterial = document.getElementById("material").value;
  const quantidade = document.getElementById("quantidade").value;
  const endereco = document.getElementById("endereco").value;
  const bairro = document.getElementById("bairro").value;
  const dataColeta = document.getElementById("data").value;
  const horarioPreferido = document.getElementById("horario").value;
  const observacoes = document.getElementById("observacoes").value;

  const dadosSolicitacao = {
    data: {
      tipo_material: tipoMaterial,
      quantidade: quantidade.toLowerCase(),
      endereco: endereco,
      bairro: bairro,
      data_coleta: dataColeta,
      horario_preferido: horarioPreferido,
      observacoes: observacoes,
      situacao: "pendente"
    }
  };

  try {
    const resposta = await fetch("http://localhost:1337/api/solicitacao-de-coletas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dadosSolicitacao)
    });

    if (!resposta.ok) {
      throw new Error("Erro ao enviar solicitação.");
    }

    alert("Solicitação de coleta enviada com sucesso!");
    formSolicitacao.reset();

  } catch (erro) {
    console.error(erro);
    alert("Não foi possível enviar a solicitação. Verifique se o Strapi está rodando.");
  }
});

botaoCancelar.addEventListener("click", function () {
  formSolicitacao.reset();
});