document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM - Formulários e Containers
    const formularioEvento = document.getElementById('formularioEvento');
    const formularioContato = document.getElementById('formularioContato');
    const containerFormularioEvento = document.getElementById('containerFormularioEvento');
    const containerFormularioContato = document.getElementById('containerFormularioContato');
    const containerMensagem = document.getElementById('containerMensagem');
    
    // Elementos DOM - Inputs e Botões
    const mensagemGerada = document.getElementById('mensagemGerada');
    const previaMensagem = document.getElementById('previaMensagem');
    const botaoCopiarEnviar = document.getElementById('botaoCopiarEnviar');
    const botaoRecomecar = document.getElementById('botaoRecomecar');
    const botaoVoltarEvento = document.getElementById('botaoVoltarEvento');
    const botaoVoltarContato = document.getElementById('botaoVoltarContato');
    const contagemCaracteres = document.getElementById('contagemCaracteres');
    
    // Elementos DOM - Progresso e Modal
    const preenchimentoProgresso = document.getElementById('preenchimentoProgresso');
    const etapas = document.querySelectorAll('.etapa');
    const modalSucesso = document.getElementById('modalSucesso');
    const botaoFecharModal = document.getElementById('botaoFecharModal');
    
    // Objeto de dados do formulário
    let dadosFormulario = {
        evento: {},
        contato: {}
    };
    
    // Rastreador de etapa atual
    let etapaAtual = 1;
    
    // Carregar dados salvos do localStorage se disponível
    carregarDadosSalvos();
    
    // Atualizar barra de progresso
    function atualizarProgresso(etapa) {
        etapaAtual = etapa;
        
        // Atualizar preenchimento de progresso
        preenchimentoProgresso.style.width = `${(etapa / 3) * 100}%`;
        
        // Atualizar indicadores de etapa
        etapas.forEach((elementoEtapa, indice) => {
            if (indice + 1 < etapa) {
                elementoEtapa.classList.add('completa');
                elementoEtapa.classList.remove('ativa');
            } else if (indice + 1 === etapa) {
                elementoEtapa.classList.add('ativa');
                elementoEtapa.classList.remove('completa');
            } else {
                elementoEtapa.classList.remove('ativa', 'completa');
            }
        });
    }
    
    // Mostrar container de formulário com animação
    function mostrarContainer(container, direcao = 'direita') {
        // Ocultar todos os containers
        [containerFormularioEvento, containerFormularioContato, containerMensagem].forEach(cont => {
            cont.classList.remove('ativa');
        });
        
        // Mostrar o container solicitado com animação
        container.classList.add('ativa');
        
        if (direcao === 'direita') {
            container.classList.add('deslizar-direita');
            setTimeout(() => container.classList.remove('deslizar-direita'), 500);
        } else {
            container.classList.add('deslizar-esquerda');
            setTimeout(() => container.classList.remove('deslizar-esquerda'), 500);
        }
    }
    
    // Funções de validação de formulário
    function validarFormularioEvento() {
        const nomeEvento = document.getElementById('nomeEvento').value;
        const dataEvento = document.getElementById('dataEvento').value;
        const localEvento = document.getElementById('localEvento').value;
        const categoria = document.getElementById('categoria').value;
        const atracoes = document.getElementById('atracoes').value;
        const linkEvento = document.getElementById('linkEvento').value;
        
        // Validação simples de URL
        const padraoUrl = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
        
        if (!nomeEvento || !dataEvento || !localEvento || !categoria || !atracoes || !linkEvento) {
            mostrarToast('Por favor, preencha todos os campos obrigatórios', 'erro');
            return false;
        }
        
        if (!padraoUrl.test(linkEvento)) {
            mostrarToast('Por favor, insira uma URL válida para o link do evento', 'erro');
            return false;
        }
        
        return true;
    }
    
    function validarFormularioContato() {
        const nomeProdutor = document.getElementById('nomeProdutor').value;
        const emailProdutor = document.getElementById('emailProdutor').value;
        const telefoneProdutor = document.getElementById('telefoneProdutor').value;
        
        // Validação de email
        const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Validação de telefone - apenas números
        const padraoTelefone = /^\d{10,15}$/;
        
        if (!nomeProdutor || !emailProdutor || !telefoneProdutor) {
            mostrarToast('Por favor, preencha todos os campos obrigatórios', 'erro');
            return false;
        }
        
        if (!padraoEmail.test(emailProdutor)) {
            mostrarToast('Por favor, insira um endereço de email válido', 'erro');
            return false;
        }
        
        if (!padraoTelefone.test(telefoneProdutor)) {
            mostrarToast('Por favor, insira um número de telefone válido (apenas números)', 'erro');
            return false;
        }
        
        return true;
    }
    
    // Função de notificação toast
    function mostrarToast(mensagem, tipo = 'info') {
        // Criar elemento toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;
        toast.innerHTML = `
            <div class="conteudo-toast">
                <i class="fas ${tipo === 'erro' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${mensagem}</span>
            </div>
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(toast);
        
        // Mostrar com animação
        setTimeout(() => toast.classList.add('mostrar'), 10);
        
        // Remover após 3 segundos
        setTimeout(() => {
            toast.classList.remove('mostrar');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Envio do Formulário de Evento
    formularioEvento.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormularioEvento()) {
            // Coletar dados do formulário de evento
            dadosFormulario.evento = {
                nomeEvento: document.getElementById('nomeEvento').value,
                dataEvento: document.getElementById('dataEvento').value,
                localEvento: document.getElementById('localEvento').value,
                categoria: document.getElementById('categoria').value,
                atracoes: document.getElementById('atracoes').value,
                linkEvento: document.getElementById('linkEvento').value
            };
            
            // Salvar no localStorage
            salvarNoLocalStorage();
            
            // Atualizar progresso e mostrar formulário de contato
            atualizarProgresso(2);
            mostrarContainer(containerFormularioContato);
        }
    });
    
    // Envio do Formulário de Contato
    formularioContato.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormularioContato()) {
            // Coletar dados do formulário de contato
            dadosFormulario.contato = {
                nomeProdutor: document.getElementById('nomeProdutor').value,
                emailProdutor: document.getElementById('emailProdutor').value,
                telefoneProdutor: document.getElementById('telefoneProdutor').value,
                empresa: document.getElementById('empresa').value
            };
            
            // Salvar no localStorage
            salvarNoLocalStorage();
            
            // Gerar mensagem
            gerarMensagem();
            
            // Atualizar progresso e mostrar container de mensagem
            atualizarProgresso(3);
            mostrarContainer(containerMensagem);
            
            // Adicionar animação de pulso ao botão de enviar
            botaoCopiarEnviar.classList.add('pulsar');
        }
    });
    
    // Botões de voltar
    botaoVoltarEvento.addEventListener('click', function() {
        atualizarProgresso(1);
        mostrarContainer(containerFormularioEvento, 'esquerda');
    });
    
    botaoVoltarContato.addEventListener('click', function() {
        atualizarProgresso(2);
        mostrarContainer(containerFormularioContato, 'esquerda');
    });
    
    // Copiar e Enviar via WhatsApp
    botaoCopiarEnviar.addEventListener('click', function() {
        const mensagem = encodeURIComponent(mensagemGerada.value);
        const urlWhatsapp = `https://wa.me/?text=${mensagem}`;
        
        // Copiar para a área de transferência
        navigator.clipboard.writeText(mensagemGerada.value)
            .then(() => {
                // Mostrar modal de sucesso
                modalSucesso.classList.add('ativa');
                
                // Abrir WhatsApp em uma nova aba após um pequeno atraso
                setTimeout(() => {
                    window.open(urlWhatsapp, '_blank');
                }, 1000);
            })
            .catch(err => {
                console.error('Falha ao copiar texto: ', err);
                mostrarToast('Falha ao copiar mensagem. Abrindo WhatsApp mesmo assim.', 'erro');
                // Se a área de transferência falhar, apenas abrir WhatsApp
                window.open(urlWhatsapp, '_blank');
            });
    });
    
    // Fechar modal
    botaoFecharModal.addEventListener('click', function() {
        modalSucesso.classList.remove('ativa');
    });
    
    // Botão Recomeçar
    botaoRecomecar.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja recomeçar? Todos os seus dados serão apagados.')) {
            // Limpar dados do formulário
            dadosFormulario = {
                evento: {},
                contato: {}
            };
            
            // Limpar localStorage
            localStorage.removeItem('dadosGeradorWhatsapp');
            
            // Resetar formulários
            formularioEvento.reset();
            formularioContato.reset();
            
            // Resetar progresso e mostrar formulário de evento
            atualizarProgresso(1);
            mostrarContainer(containerFormularioEvento, 'esquerda');
            
            // Remover animação de pulso
            botaoCopiarEnviar.classList.remove('pulsar');
        }
    });
    
    // Gerar mensagem com base nos dados do formulário
    function gerarMensagem() {
        // Formatar data
        const dataEvento = new Date(dadosFormulario.evento.dataEvento);
        const dataFormatada = dataEvento.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Criar mensagem
        let mensagem = `🎉 *${dadosFormulario.evento.nomeEvento}* 🎉\n\n` +
            `📅 *Data:* ${dataFormatada}\n` +
            `📍 *Local:* ${dadosFormulario.evento.localEvento}\n` +
            `🏷️ *Categoria:* ${dadosFormulario.evento.categoria}\n` +
            `⭐ *Atrações:* ${dadosFormulario.evento.atracoes}\n\n` +
            `🔗 *Link do Evento:* ${dadosFormulario.evento.linkEvento}\n\n` +
            `Para mais informações, contate:\n` +
            `👤 ${dadosFormulario.contato.nomeProdutor}\n` +
            `📱 ${dadosFormulario.contato.telefoneProdutor}\n` +
            `📧 ${dadosFormulario.contato.emailProdutor}\n`;
            
        // Adicionar empresa se fornecida
        if (dadosFormulario.contato.empresa) {
            mensagem += `🏢 ${dadosFormulario.contato.empresa}\n`;
        }
        
        // Adicionar assinatura
        mensagem += `\nNão perca! Salve a data e compartilhe com os amigos! 🎊`;
        
        // Definir mensagem na área de texto e na pré-visualização
        mensagemGerada.value = mensagem;
        previaMensagem.innerText = mensagem;
        
        // Atualizar contagem de caracteres
        atualizarContagemCaracteres();
    }
    
    // Atualizar contagem de caracteres
    function atualizarContagemCaracteres() {
        const contagem = mensagemGerada.value.length;
        contagemCaracteres.textContent = contagem;
        
        // Mudar cor se estiver se aproximando do limite
        if (contagem > 4000) {
            contagemCaracteres.style.color = 'var(--erro)';
        } else {
            contagemCaracteres.style.color = 'var(--cor-texto-clara)';
        }
    }
    
    // Ouvir mudanças na área de texto da mensagem
    mensagemGerada.addEventListener('input', function() {
        previaMensagem.innerText = this.value;
        atualizarContagemCaracteres();
    });
    
    // Salvar dados do formulário no localStorage
    function salvarNoLocalStorage() {
        localStorage.setItem('dadosGeradorWhatsapp', JSON.stringify(dadosFormulario));
    }
    
    // Carregar dados salvos do localStorage
    function carregarDadosSalvos() {
        const dadosSalvos = localStorage.getItem('dadosGeradorWhatsapp');
        
        if (dadosSalvos) {
            dadosFormulario = JSON.parse(dadosSalvos);
            
            // Preencher formulário de evento se os dados existirem
            if (dadosFormulario.evento.nomeEvento) {
                document.getElementById('nomeEvento').value = dadosFormulario.evento.nomeEvento || '';
                document.getElementById('dataEvento').value = dadosFormulario.evento.dataEvento || '';
                document.getElementById('localEvento').value = dadosFormulario.evento.localEvento || '';
                document.getElementById('categoria').value = dadosFormulario.evento.categoria || '';
                document.getElementById('atracoes').value = dadosFormulario.evento.atracoes || '';
                document.getElementById('linkEvento').value = dadosFormulario.evento.linkEvento || '';
            }
            
            // Preencher formulário de contato se os dados existirem
            if (dadosFormulario.contato.nomeProdutor) {
                document.getElementById('nomeProdutor').value = dadosFormulario.contato.nomeProdutor || '';
                document.getElementById('emailProdutor').value = dadosFormulario.contato.emailProdutor || '';
                document.getElementById('telefoneProdutor').value = dadosFormulario.contato.telefoneProdutor || '';
                document.getElementById('empresa').value = dadosFormulario.contato.empresa || '';
            }
        }
    }
    
    // Adicionar este CSS para notificações toast
    const estilo = document.createElement('style');
    estilo.textContent = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--branco);
            color: var(--cor-texto);
            padding: 12px 20px;
            border-radius: var(--raio-input);
            box-shadow: var(--sombra);
            z-index: 1000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        }
        
        .toast.mostrar {
            transform: translateX(0);
        }
        
        .conteudo-toast {
            display: flex;
            align-items: center;
        }
        
        .conteudo-toast i {
            margin-right: 10px;
        }
        
        .toast-erro {
            border-left: 4px solid var(--erro);
        }
        
        .toast-erro i {
            color: var(--erro);
        }
        
        .toast-info {
            border-left: 4px solid var(--cor-secundaria);
        }
        
        .toast-info i {
            color: var(--cor-secundaria);
        }
    `;
    document.head.appendChild(estilo);
});