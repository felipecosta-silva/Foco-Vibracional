# Plano 017 · Revisão 2: vela realista e bule de vidro

> Spec: `spec.md`, seção "Revisão 2". Escrito pelo Claude; executado pelo Gemini.
> Regras (`.specify/memory/constitution.md`):
> - Só tokens de cor (`:root`).
> - Nenhum `style=""` novo.
> - CSS novo no fim de `styles/styles.css`.
> - `style.setProperty` para variáveis CSS no JS é permitido.

## Onde está o código hoje

- **`script/inicio.js`:**
  - `VELA_CICLO`, `velaHash`, `velaEstado(date)` (altura, modo e escorridos) e `VELA_MODOS`.
  - `velaSvg(svg, e)`: a borda `rim` (7 pontos) é suavizada por `suave()`, e os escorridos são desenhados ali.
  - `aplicarVela(vela, date)` e `initVelaRelogio()`.
  - A xícara: `XICARA_SVG` e a arte `kind === "steam"`, perto da linha 83.
- **`styles/styles.css`:**
  - No bloco da spec 017, no fim do arquivo: `.ph-candle*`, `.vc-*`, `.ph-vela--*` e `@keyframes velaVento`.
  - A xícara: `.ph-cha*` e `.xc-*`, perto da linha 6030, e a regra de celular `.ph-cha{ ... scale(.6) }`.

## Regras de desenho que não podem quebrar

- **Sentido do desenho:** todos os subcaminhos do SVG da cera são desenhados no mesmo sentido (anti-horário), como hoje. Se o sentido for misturado, a regra nonzero abre buracos e os escorridos ficam ocos.
- **Vela determinística:** tudo sai de `velaHash` com `ciclo`, `ms` e índices. Nada de `Math.random()` na vela.
- **Altura:** a altura em px vem de `svg.clientHeight`, que não muda com o `scale` do celular.
- **Menos movimento:** a vela fica parada no estado certo, com a borda gasta e os escorridos.

## Mudanças

### A. `velaEstado`: rajadas e forma

- **`forma`:** `clamp(min / 30, 0, 1)`. Vale 0 na vela nova e pontuda e 1 na borda madura.
- **`ventos`:**
  - `n = floor(h * 4)`, ou seja, de 0 a 3 rajadas.
  - Cada rajada fica numa fatia própria do ciclo, para não se sobreporem.
  - Nenhuma rajada nos primeiros nem nos últimos 15 min.
  - Cada rajada tem `{ ini (min), dur: 4..20, lado: -1|1, forca: .35..1 }`.
- **`vento`:** a rajada ativa agora, ou `null`.
- **`desgaste { esq, dir }`:** cada valor vai de 0 a 1. Para cada rajada que já começou, soma no lado dela, com teto 1:
  - durante a rajada: `forca * clamp((min - ini) / 3, 0, 1)`;
  - depois que ela acabou: `forca * exp(-(min - fim) / 15)`.
- **Modo:**
  - A ordem atual continua: `apagada`, `acendendo` e `baixa` no fim.
  - Depois, se houver `vento`, o modo é `"vento"`.
  - Senão, vale o sorteio de 90 s, agora sem `vento`: calma, alta, sobe, bifurcada e baixa, com as proporções reajustadas.
- **Escorridos:**
  - Os de base caem para 4 a 6.
  - Cada rajada acrescenta 2 ou 3 escorridos com `borda = true` e `lado = rajada.lado`.
  - O `pIni` desses escorridos cai dentro da janela `ini..ini+dur`, e o `lmax` deles é 1,4× maior.
- **Retorno:** devolver `forma`, `vento` e `desgaste` no objeto.

### B. `velaSvg`: ponta, borda baixa e lado gasto

- **Perfil pontudo** (forma 0), com 7 pontos como o `rim`:
  - o ombro desce nas laterais: `[L, yTop+7]`, `[L+3, yTop+3]`, `[L+8, yTop-1]`;
  - o ápice fica em `[cx, yTop-5]`;
  - o outro lado é o espelho.
- **Perfil maduro** (forma 1):
  - lábios de 1,5 a 3,5 px (hoje vão de 4 a 11);
  - o meio fica só 1 a 1,5 px abaixo de `yTop`.
- **Interpolação:** ponto a ponto, `p = pontudo + (maduro - pontudo) * forma`.
- **Desgaste:** no lado gasto, somar `desgaste.lado * 7` ao y dos 3 pontos daquele lado. A borda fica inclinada e o lábio desse lado desce.
- **Poça:** remover a `ellipse.vc-poca`. A luz `vc-luz` continua.
- **Pavio na vela nova:**
  - O pavio nasce no ápice.
  - Expor `--ponta` via `style.setProperty`: vai de 5 px a 0 conforme `forma`.
  - No CSS, `.ph-candle__pavio`, `.ph-candle__chama` e `.ph-candle__halo` somam `var(--ponta)` ao `bottom`.

### C. Chama na corrente de ar

- **Variáveis:** `aplicarVela` define `--vento-lado` (1 ou -1) e `--vento-forca` (de .35 a 1) quando o modo é `vento`.
- **Inclinação:** `@keyframes velaVento` passa a usar `rotate: calc(var(--vento-lado) * var(--vento-forca) * Ndeg)`, com N variando entre 14 e 30 graus, como hoje.
- **Forma da chama:** `--sx` e `--sy` acompanham a força. Com mais força, a chama fica mais baixa e mais deitada.

### D. Teste por horário

- `initVelaRelogio` lê `new URLSearchParams(location.search).get("vela")`.
- Com uma data válida, aplica essa data congelada e não roda o intervalo.
- Sem o parâmetro, o comportamento é o de hoje.

### E. Bule de vidro (Chás)

- **Troca do desenho:**
  - Trocar `XICARA_SVG` por `BULE_SVG`, com viewBox de cerca de `0 0 240 180`.
  - A arte steam passa a usá-lo.
  - O contêiner continua `.ph-cha`, para a regra de celular valer.
- **Bule:**
  - Corpo redondo e achatado: preenchimento de vidro com pouca opacidade, contorno claro e dois ou três reflexos curvos brancos.
  - Tampa de vidro com pegador redondo.
  - Bico curvo à esquerda.
  - Alça de vidro à direita: traço grosso translúcido, com brilho.
  - Sombra suave embaixo.
- **Chá:**
  - Ocupa a metade de baixo do corpo, recortado pelo próprio corpo (`clipPath`).
  - Degradê âmbar com `--cha-reflexo`, `--cha-liquido` e `--cha-fundo`.
  - A superfície é uma elipse mais clara.
- **Ervas dentro do chá:**
  - 3 ou 4 folhas, 1 flor pequena e 1 rodela de laranja em corte.
  - Cada uma num `g.bl-erva`, que boia devagar: translate de 2 a 3 px e rotação de 2 a 4 graus, entre 7 e 11 s, com atrasos diferentes.
  - Usar `transform-box: fill-box`.
  - O "menos movimento" global já desliga essas animações.
- **Vapor:** reaproveitar `.ph-cha__vapor` sobre a tampa e acrescentar um segundo `div.ph-cha__vapor.ph-cha__vapor--bico` na ponta do bico.
- **Tokens novos em `:root`:**
  - `--vidro`, `--vidro-borda`, `--vidro-brilho`;
  - `--erva-folha`, `--erva-folha-escura`, `--erva-flor`;
  - `--laranja-casca`, `--laranja-polpa`.
  - Antes, procure se já existem tokens equivalentes.
- **Remover:** a `XICARA_SVG`, os `.xc-*`, e `--porcelana-brilho`, `--porcelana-funda` e qualquer token que ficar sem uso.

### F. Entrega

- **`sw.js`:** não alterar. O pacote fv-v59 ainda não foi publicado.
- **Spec e plano:** não alterar `spec.md` nem `plan.md`. Se discordar de algo, escreva no Registro do executor (em `tasks.md`) e pare.
