const listaResiduos = document.getElementById("lista-residuos");

const imagensResiduos = {
  "Plástico": "img/plastico.png",
  "Papel": "img/papel.png",
  "Papelão": "img/papelao.png",
  "Vidro": "img/vidro.png",
  "Metal": "img/metal.png",
  "Alumínio": "img/aluminio.png",
  "Embalagem longa vida": "img/emb-long-vida.png",
  "Eletrônicos": "img/eletronico.png",
  "Óleo de cozinha usado": "img/oleo.png",
  "Pilhas e baterias": "img/pilhas.png",
  "Isopor": "img/isopor.png"
};

const iconesResiduos = {
  "Plástico": "bi-cup-straw",
  "Papel": "bi-file-earmark-text",
  "Papelão": "bi-box-seam",
  "Vidro": "bi-cup",
  "Metal": "bi-nut",
  "Alumínio": "bi-cup-hot",
  "Embalagem longa vida": "bi-box",
  "Eletrônicos": "bi-phone",
  "Óleo de cozinha usado": "bi-droplet-half",
  "Pilhas e baterias": "bi-battery-charging",
  "Isopor": "bi-box2"
};

async function carregarResiduos() {
  try {
    const resposta = await fetch("http://localhost:1337/api/residuos");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar resíduos.");
    }

    const dados = await resposta.json();
    const residuos = dados.data;

    listaResiduos.innerHTML = "";

    if (residuos.length === 0) {
      listaResiduos.innerHTML = `
        <p class="muted">
          Nenhuma orientação de descarte cadastrada até o momento.
        </p>
      `;
      return;
    }

    residuos.forEach(function (residuo) {
      const nome = residuo.nome;
      const imagem = imagensResiduos[nome] || "img/reciclagem-banner.png";
      const icone = iconesResiduos[nome] || "bi-recycle";

      const item = document.createElement("article");
      item.classList.add("education-item");

      item.innerHTML = `
        <img 
          src="${imagem}" 
          alt="Ilustração sobre ${nome}" 
          class="education-image"
        >

        <div class="education-content">
          <div class="education-title">
            <i class="bi ${icone}"></i>
            <h4>${nome}</h4>
          </div>

          <span class="education-category">
            Categoria: ${residuo.categoria}
          </span>

          <p>
            ${residuo.descricao || "Sem descrição cadastrada."}
          </p>

          <div class="education-tip">
            <strong>Orientação de descarte:</strong>
            <p>
              ${residuo.orientacao_descarte || "Orientação ainda não cadastrada."}
            </p>
          </div>
        </div>
      `;

      listaResiduos.appendChild(item);
    });

  } catch (erro) {
    console.error(erro);

    listaResiduos.innerHTML = `
      <p class="muted">
        Não foi possível carregar as orientações. Verifique se o Strapi está rodando.
      </p>
    `;
  }
}

carregarResiduos();