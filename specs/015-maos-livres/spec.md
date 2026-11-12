# Spec 015 — Mãos livres: tela acesa, temporizador nas receitas e lembretes na agenda

> **Status:** aprovada pelo dono em 2026-11-12 ("pode prosseguir")
> **Pedido por:** dono do site, ao perguntar o que mais melhoraria a usabilidade. Claude sugeriu e o dono aprovou.
> **Escrita por:** Claude · **Executor:** Claude (mesmo dia)
> Regras: `.specify/memory/constitution.md` (II.3, III.2, IV.1, IV.2, V.3, VI.1)

## 1. Por quê

Quem prepara um banho, um chá ou uma defumação está com as mãos ocupadas: a tela do celular apaga, o tempo de "abafe por 15 minutos" fica no olho, e a data da lua ou do portal passa sem aviso.

## 2. Requisitos

### A. Temporizador nas receitas
- **RF-A1** Em toda ficha aberta na gaveta (banhos, chás, defumações, ervas), cada trecho "N minuto(s)" (de 1 a 60) ganha logo depois um botão pequeno **"⏱ N min"**.
- **RF-A2** Ao tocar, aparece uma barra fixa no pé da tela com o nome da ficha, a contagem regressiva e os botões **Pausar/Continuar** e **Cancelar**. A barra continua visível com a gaveta fechada e ao trocar de ficha. Só um temporizador por vez: tocar em outro troca o tempo.
- **RF-A3** No fim: a barra mostra "Deu o tempo: {N} minutos." e o botão **OK**; vibração curta e um sinal sonoro suave (o celular pode estar na bancada). A contagem usa a hora do relógio, então continua certa mesmo se a tela apagar ou o navegador for para segundo plano.

### B. Tela acesa
- **RF-B1** Enquanto um temporizador de receita ou a prática de 2 minutos da lua estiver correndo, a tela do celular não apaga (Screen Wake Lock), se o navegador permitir. Ao terminar, pausar ou cancelar, a tela volta ao normal.
- **RF-B2** Na barra da gaveta, um botão **"Tela acesa"** (ícone de sol) mantém a tela acesa enquanto a ficha estiver aberta, para ler com calma durante o preparo. Fechar a gaveta desliga. Navegadores sem suporte não mostram o botão.

### C. Lembretes na agenda
- **RF-C1** No Calendário lunar (card "Próximas fases") e em Portais & Números (card "Próximos portais"), um botão **"Adicionar à minha agenda"** baixa um arquivo `.ics` que o celular abre na agenda.
- **RF-C2** O arquivo traz os próximos 12 meses: as 4 fases principais da lua e os 12 portais. Cada evento é de dia inteiro, com aviso às 9h do próprio dia.
- **RF-C3** Textos dos eventos (§3). Nenhum dado pessoal, nenhum cadastro, nada sai do aparelho.

## 3. Textos (final)

- Botão de agenda: "📅 Adicionar à minha agenda"
- Linha abaixo do botão: "Baixa um arquivo com as fases da lua e os portais dos próximos 12 meses. O celular abre na agenda e avisa às 9h do dia. Nada é enviado para fora do aparelho."
- Evento de lua: título "{ícone} {nome da fase}" (ex.: "🌕 Lua Cheia"); descrição: "{intenção da fase} Prática de 2 minutos: {link}".
- Evento de portal: título "✨ Portal {dd/mm}"; descrição: "{tema do portal} Ritual do portal: {link}".
- Barra do temporizador: "⏱ {nome da ficha}", "Pausar", "Continuar", "Cancelar", "Deu o tempo: {N} minutos.", "OK".
- Botão da gaveta: título "Manter a tela acesa"; aviso ao ligar: "Tela acesa enquanto a ficha estiver aberta."; ao desligar: "A tela volta a apagar normalmente."

## 4. Critérios de aceite

- **CA-01** Um banho com "abafe por 15 minutos" mostra "⏱ 15 min" e a barra conta de 15:00 até o fim, com pausa e cancelar.
- **CA-02** A barra sobrevive a fechar a gaveta e abrir outra ficha.
- **CA-03** O `.ics` tem as fases e os portais de 12 meses e abre sem erro (formato RFC 5545, linhas dobradas, texto escapado).
- **CA-04** Sem suporte a Wake Lock, nada quebra e o botão de sol não aparece.
- **CA-05** Console limpo; sem rolagem lateral a 375 px e 1440 px; funciona offline; com movimento reduzido nada pisca.
