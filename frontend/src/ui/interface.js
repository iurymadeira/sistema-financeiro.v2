// --- CAMADA DE INTERFACE E CONTROLLER DE UI ---

function lerCamposTela() {
  return {
    saldoInicial: parseFloat(document.getElementById('saldo').value) || 0,
    gastosFixos: parseFloat(document.getElementById('gastos').value) || 0,
    receitasFixas: parseFloat(document.getElementById('receitas').value) || 0,
    anos: parseInt(document.getElementById('anos').value) || 1,
    transacoesVariaveis: estado.transacoesVariaveis || []
  };
}

function preencherCamposTela(dados) {
  if (document.getElementById('saldo')) document.getElementById('saldo').value = dados.saldoInicial;
  if (document.getElementById('gastos')) document.getElementById('gastos').value = dados.gastosFixos;
  if (document.getElementById('receitas')) document.getElementById('receitas').value = dados.receitasFixas;
  if (document.getElementById('anos')) document.getElementById('anos').value = dados.anos;
}

async function calcularEExibir() {
  try {
    const dadosFormulario = lerCamposTela();
    definirEstado(dadosFormulario);

    // Solicita o cálculo e gravação diretamente ao backend
    const respostaBackend = await financeiroService.calcularProjecao(dadosFormulario);

    if (respostaBackend.sucesso) {
      estado.projecaoAtual = respostaBackend.projecao;
      estado.metricasAtuais = respostaBackend.metricas;
      renderizarProjecao();
    }
  } catch (erro) {
    alert(erro.message);
  }
}

function renderizarProjecao() {
  const container = document.getElementById('containerProjecao');
  container.innerHTML = '';

  if (!estado.projecaoAtual) return;

  const fragmento = document.createDocumentFragment();

  Object.keys(estado.projecaoAtual).forEach(ano => {
    const blocoAno = document.createElement('div');
    blocoAno.className = 'bloco-ano';

    const titulo = document.createElement('h3');
    titulo.textContent = `Ano: ${ano}`;
    blocoAno.appendChild(titulo);

    const tabela = document.createElement('table');
    tabela.innerHTML = `
      <thead>
        <tr>
          <th>Mês</th>
          <th>Saldo Previsto</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = tabela.querySelector('tbody');

    estado.projecaoAtual[ano].forEach(item => {
      const saldoFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(item.saldo);

      const tr = document.createElement('tr');
      const tdMes = document.createElement('td');
      tdMes.textContent = item.mes;

      const tdSaldo = document.createElement('td');
      tdSaldo.textContent = saldoFormatado;

      tr.appendChild(tdMes);
      tr.appendChild(tdSaldo);
      tbody.appendChild(tr);
    });

    blocoAno.appendChild(tabela);
    fragmento.appendChild(blocoAno);
  });

  container.appendChild(fragmento);
}

document.addEventListener('DOMContentLoaded', async () => {
  const estadoSalvo = await financeiroService.carregarEstado();
  if (estadoSalvo) {
    definirEstado(estadoSalvo);
    preencherCamposTela(estadoSalvo);
    if (estado.saldoInicial > 0) {
      calcularEExibir();
    }
  }
});