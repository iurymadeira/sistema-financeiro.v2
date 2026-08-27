// --- CAMADA DE INTERFACE ---
function calcularEExibir() {
  try {
    // 1. Sincroniza os dados do HTML para a memória (Store)
    atualizarEstado();

    // 2. Executa a regra usando a fonte da verdade
    estado.projecaoAtual = calcularProjecao(
      estado.saldoInicial,
      estado.gastosFixos,
      estado.receitasFixas,
      estado.anos
    );

    // 3. Renderiza a tela baseando-se unicamente no estado
    renderizarProjecao();

  } catch (erro) {
    alert(erro.message);
  }
}

function renderizarProjecao() {
  const container = document.getElementById('containerProjecao');
  container.innerHTML = ''; 

  if (!estado.projecaoAtual) return;

  Object.keys(estado.projecaoAtual).forEach(ano => {
    let tabelaHTML = `
      <div class="bloco-ano">
        <h3>Ano: ${ano}</h3>
        <table>
          <thead>
            <tr>
              <th>Mês</th>
              <th>Saldo Previsto</th>
            </tr>
          </thead>
          <tbody>
    `;

    estado.projecaoAtual[ano].forEach(item => {
      // Bônus: Formatando a moeda diretamente na camada visual
      const saldoFormatado = new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(item.saldo);

      tabelaHTML += `
        <tr>
          <td>${item.mes}</td>
          <td>${saldoFormatado}</td>
        </tr>
      `;
    });

    tabelaHTML += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML += tabelaHTML;
  });
}