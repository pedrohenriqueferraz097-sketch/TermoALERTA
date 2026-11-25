document.addEventListener('DOMContentLoaded', () => {

    /* 1. MENU RESPONSIVO */
    const menuToggle = document.getElementById('menuToggle');
    const menuPrincipal = document.getElementById('menuPrincipal');

    menuToggle.addEventListener('click', () => {
        menuPrincipal.classList.toggle('aberto');
    });

    menuPrincipal.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuPrincipal.classList.remove('aberto');
        });
    });

    /* 2. DIRETRIZES E SINAIS TÉRMICOS (COM 32.5°C) */
    const btnCrianca = document.getElementById('btnPerfilCrianca');
    const btnCozinheiro = document.getElementById('btnPerfilCozinheiro');
    const conteudoDicas = document.getElementById('conteudoDicas');

    const dadosPerfis = {
        crianca: [
            {
                titulo: '🟢 Sinal 1: Verde (Seguro / Abaixo de 32,5°C)',
                texto: 'Indica temperatura fria ou ambiente estável. A superfície encontra-se totalmente segura para o contato natural infantil, sem nenhum risco térmico.'
            },
            {
                titulo: '🟡 Sinal 2: Amarelo (Atenção Preventiva / A partir de 32,5°C)',
                texto: 'Ativado no exato momento em que o circuito Arduino detecta calor acima da temperatura corporal. Serve como barreira educativa para interromper a exploração impulsiva.'
            },
            {
                titulo: '🔴 Sinal 3: Vermelho (Risco Crítico / Acima de 60°C)',
                texto: 'Alerta máximo de perigo térmico. Temperaturas nesta faixa provocam lesões dérmicas instantâneas. Aproxime-se apenas sob supervisão estrita e com proteção.'
            }
        ],
        cozinheiro: [
            {
                titulo: '🟢 Sinal 1: Verde (Inércia Térmica Segura)',
                texto: 'Certifica que equipamentos e utensílios resfriaram abaixo de 32,5°C, permitindo manuseio irrestrito sem Equipamentos de Proteção Individual (EPIs).'
            },
            {
                titulo: '🟡 Sinal 2: Amarelo (Aquecimento Inicial / 32,5°C a 59°C)',
                texto: 'Mapeia zonas de transição e calor residual logo após o desligamento de chapas ou fornos, prevenindo acidentes por desatenção operacional.'
            },
            {
                titulo: '🔴 Sinal 3: Vermelho (Temperatura de Cocção / 60°C+)',
                texto: 'Sinaliza estado crítico de operação em cozinhas profissionais. Impede o toque desatento em cabos metálicos ou superfícies de alta caloria.'
            }
        ]
    };

    function renderizarDicas(perfil) {
        const lista = dadosPerfis[perfil];
        let html = '<div class="lista-dicas-perfil">';
        lista.forEach(item => {
            html += `
                <div class="item-dica">
                    <h4 style="color: var(--cor-primaria); margin-bottom: 6px;">${item.titulo}</h4>
                    <p style="color: var(--cor-texto-suave); font-size: 0.95rem; line-height: 1.5;">${item.texto}</p>
                </div>
            `;
        });
        html += '</div>';
        conteudoDicas.innerHTML = html;
    }

    renderizarDicas('crianca');

    btnCrianca.addEventListener('click', () => {
        btnCrianca.classList.add('ativo');
        btnCozinheiro.classList.remove('ativo');
        renderizarDicas('crianca');
    });

    btnCozinheiro.addEventListener('click', () => {
        btnCozinheiro.classList.add('ativo');
        btnCrianca.classList.remove('ativo');
        renderizarDicas('cozinheiro');
    });

    /* 3. SIMULADOR TÉRMICO COM LIMIAR EM 32.5°C */
    const sliderTemp = document.getElementById('sliderTemp');
    const indicadorVisual = document.getElementById('indicadorVisual');
    const iconeStatus = document.getElementById('iconeStatus');
    const textoStatus = document.getElementById('textoStatus');
    const valorTemperatura = document.getElementById('valorTemperatura');
    const mensagemSimulador = document.getElementById('mensagemSimulador');
    const botoesTemp = document.querySelectorAll('.btn-temp');

    function atualizarSimulador(temperatura) {
        valorTemperatura.textContent = `${temperatura}°C`;
        sliderTemp.value = temperatura;

        indicadorVisual.classList.remove('estado-normal', 'estado-atencao', 'estado-elevada');

        if (temperatura < 32.5) {
            indicadorVisual.classList.add('estado-normal');
            iconeStatus.textContent = '🛡️';
            textoStatus.textContent = 'SEGURO';
            mensagemSimulador.innerHTML = '✅ <strong>Condição Segura:</strong> Abaixo de 32,5°C. Superfície em temperatura ambiente e toque totalmente livre.';
        } else if (temperatura >= 32.5 && temperatura < 60) {
            indicadorVisual.classList.add('estado-atencao');
            iconeStatus.textContent = '⚠️';
            textoStatus.textContent = 'ATENÇÃO';
            mensagemSimulador.innerHTML = '⚠️ <strong>Zona de Aquecimento (32,5°C+):</strong> O circuito NTC detectou elevação térmica. Superfície morna, proceda com cautela.';
        } else {
            indicadorVisual.classList.add('estado-elevada');
            iconeStatus.textContent = '🔥';
            textoStatus.textContent = 'PERIGO!';
            mensagemSimulador.innerHTML = '🔥 <strong>Alerta Crítico (60°C+):</strong> Temperatura de risco elevado! Contato direto proibido sem isolamento térmico.';
        }
    }

    sliderTemp.addEventListener('input', (e) => {
        atualizarSimulador(Number(e.target.value));
    });

    botoesTemp.forEach(botao => {
        botao.addEventListener('click', () => {
            const temp = Number(botao.getAttribute('data-temp'));
            atualizarSimulador(temp);
        });
    });

    /* 4. CARRINHO DE COMPRAS */
    let carrinho = [];
    const btnAbrirCarrinho = document.getElementById('btnAbrirCarrinho');
    const btnFecharCarrinho = document.getElementById('btnFecharCarrinho');
    const modalCarrinho = document.getElementById('modalCarrinho');
    const itensCarrinhoEl = document.getElementById('itensCarrinho');
    const contadorCarrinhoEl = document.getElementById('contadorCarrinho');
    const valorTotalCarrinhoEl = document.getElementById('valorTotalCarrinho');
    const botoesComprar = document.querySelectorAll('.btn-comprar');
    const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');

    btnAbrirCarrinho.addEventListener('click', () => modalCarrinho.classList.add('aberto'));
    btnFecharCarrinho.addEventListener('click', () => modalCarrinho.classList.remove('aberto'));

    botoesComprar.forEach(botao => {
        botao.addEventListener('click', () => {
            const nome = botao.getAttribute('data-nome');
            const preco = parseFloat(botao.getAttribute('data-preco'));
            carrinho.push({ nome, preco });
            atualizarInterfaceCarrinho();
            
            const textoOriginal = botao.textContent;
            botao.textContent = '✔ Adicionado!';
            setTimeout(() => botao.textContent = textoOriginal, 900);
        });
    });

    function atualizarInterfaceCarrinho() {
        contadorCarrinhoEl.textContent = carrinho.length;
        if (carrinho.length === 0) {
            itensCarrinhoEl.innerHTML = '<p class="carrinho-vazio">Seu carrinho encontra-se vazio.</p>';
            valorTotalCarrinhoEl.textContent = 'R$ 0,00';
            return;
        }

        let html = '';
        let total = 0;
        carrinho.forEach((item, index) => {
            total += item.preco;
            html += `
                <div class="item-carrinho">
                    <div><strong>${item.nome}</strong><br><small>R$ ${item.preco.toFixed(2).replace('.', ',')}</small></div>
                    <button class="btn-remover" onclick="removerDoCarrinho(${index})">Remover</button>
                </div>
            `;
        });
        itensCarrinhoEl.innerHTML = html;
        valorTotalCarrinhoEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    window.removerDoCarrinho = function(index) {
        carrinho.splice(index, 1);
        atualizarInterfaceCarrinho();
    };

    btnFinalizarCompra.addEventListener('click', () => {
        if (carrinho.length === 0) {
            alert('Adicione ao menos um item ao carrinho antes de finalizar!');
            return;
        }
        alert('🎉 Solicitação registrada com sucesso! A equipe TermoALERTA entrará em contato.');
        carrinho = [];
        atualizarInterfaceCarrinho();
        modalCarrinho.classList.remove('aberto');
    });

    /* 5. FORMULÁRIO DE CONTATO */
    const formContato = document.getElementById('formContato');
    const feedbackForm = document.getElementById('feedbackForm');

    formContato.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();

        if (nome.length < 3 || !email.includes('@') || mensagem.length < 10) {
            feedbackForm.style.color = '#e74c3c';
            feedbackForm.textContent = '⚠️ Por favor, preencha todos os campos com dados válidos (mínimo 3 caracteres no nome e 10 na mensagem).';
            return;
        }

        feedbackForm.style.color = '#2ecc71';
        feedbackForm.textContent = `✅ Mensagem enviada com sucesso, ${nome}! Agradecemos o contato.`;
        formContato.reset();
    });
});