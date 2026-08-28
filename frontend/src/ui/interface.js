// --- CAMADA DE INTERFACE E UI CONTROLLER ---

function lerCamposTela() {
  return {
    saldoInicial: parseFloat(document.getElementById('saldo').value) || 0,
    gastosFixos: parseFloat(document.getElementById('gastos').value) || 0,
    receitasFixas: parseFloat(document.getElementById('receitas').value) || 0,
    anos: parseInt(document.getElementById('anos').value) || 1
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
    // 1. Capta os dados do HTML e atualiza a Store
    const dadosFormulario = lerCamposTela();
    definirEstado(dadosFormulario);

    // 2. Executa a regra pura usando a fonte da verdade
    estado.projecaoAtual = calcularProjecao(
      estado.saldoInicial,
      estado.gastosFixos,
      estado.receitasFixas,
      estado.anos
    );

    // 3. Renderiza a tabela na tela
    renderizarProjecao();

    // 4. Salva no banco de forma assíncrona
    if (typeof banco !== 'undefined') {
      await banco.salvarEstado({
        saldoInicial: estado.saldoInicial,
        gastosFixos: estado.gastosFixos,
        receitasFixas: estado.receitasFixas,
        anos: estado.anos
      });
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

// Inicialização da aplicação ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
  if (typeof banco !== 'undefined') {
    const estadoSalvo = await banco.carregarEstado();
    if (estadoSalvo) {
      definirEstado(estadoSalvo);
      preencherCamposTela(estadoSalvo);
      
      if (estado.saldoInicial > 0) {
        calcularEExibir();
      }
    }
  }
});