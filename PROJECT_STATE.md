# PROJECT_STATE — Home School

> **AGENT INSTRUCTION:** Leia este arquivo antes de executar trabalho relevante neste projeto. O estado descrito aqui prevalece sobre contexto histórico de conversas, salvo quando código, conteúdo versionado ou evidência mais recente demonstrarem o contrário. Nesse caso, corrija este arquivo na mesma tarefa.

Updated: 2026-09-24

## Purpose
Portal de estudos interativo, organizado por matérias, para uso direto pela aluna no computador.

## Current state
- Página raiz funciona como entrada para as matérias.
- Estrutura organizada por matéria.
- Inglês foi a primeira matéria.
- História está sendo desenvolvida no mesmo modelo, com aperfeiçoamentos.
- Ciências possui Revisão 1 publicada para o 3º bimestre, cobrindo Forças e Máquinas Simples, com 53 telas, jogos, atividades interativas e exercícios.
- Ciências possui Revisão 2 publicada para o 3º bimestre, com 47 telas, aprofundamento das Leis de Newton, máquinas simples, explicações em camadas, ilustrações/animações e o desafio “Newton • Tudo ou Nada”.
- Ciências possui Revisão 3 publicada para o 3º bimestre, em formato de treino de prova, com 54 exercícios (46 de múltipla escolha), três blocos de simulado, minijogos de memória, forca e jogo da velha quiz, além de diagnóstico final por assunto.
- Conteúdo deve combinar explicações simples e práticas, imagens/animações quando úteis, exercícios, jogos e atividades interativas.
- Exercícios devem permitir interação direta na página sempre que possível: digitação, seleção de alternativas e feedback.
- O texto da interface e das aulas é dirigido à aluna, não ao desenvolvedor.
- Imagens devem ser relevantes ao conteúdo e adequadas à experiência de estudo.

- Matemática foi iniciada com a Revisão 1 do 3º bimestre em formato de jogo investigativo “Os Casos da Detetive Jujuba — O Mistério do Cofre Impossível”. A Revisão 1 de Matemática possui atualmente 39 telas jogáveis e um arco investigativo completo: apresentação de quatro suspeitos, reconstrução da noite do cofre, cruzamento de pistas, eliminação de hipóteses e solução dedutível. O conteúdo trabalha inequações, teste de valores e limites, elementos e comprimento da circunferência, áreas de figuras planas e decomposição, com feedback imediato e persistência local separada da navegação: o caso abre pela capa, oferece retomada do último ponto alcançado e permite voltar às telas anteriores já percorridas. A cobertura visual foi ampliada para todas as 39 telas: as artes cinematográficas permanecem nas cenas narrativas-chave e as demais telas usam cenários/diagramas HTML próprios para cofre, circunferências, plantas, decomposição de áreas, documentos, linha do tempo, suspeitos, ferramentas, passagem e painéis de evidências. Emojis deixaram de funcionar como ilustração principal. Foi feita uma revisão pedagógica/narrativa: a inconsistência de crachás foi corrigida, o exercício triangular foi substituído por área retangular para manter escopo conservador do cronograma, o desfecho de Helena passou a explicar que ela protegeu uma peça de uma vitrine interditada sem registrar a mudança, e o bloqueio de avanço foi reforçado em duas camadas: botões de continuação ficam realmente desabilitados e a função de navegação recusa avanço quando a questão da tela não foi resolvida. As 28 questões de múltipla escolha tiveram as respostas corretas distribuídas de forma equilibrada entre as quatro posições (7 em cada posição), evitando padrão previsível sem desordenar alternativas que possuem ordem semântica própria. Na tela dos registros de segurança, A/B/C/D permanece em ordem e a própria condição matemática foi ajustada para que C seja a resposta correta na terceira posição; o painel de evidências correspondente foi sincronizado. Tentativas são registradas localmente e agora alimentam um diagnóstico final por quatro blocos (Inequações, Circunferência, Áreas e decomposição, Raciocínio investigativo), destacando os temas em que houve mais erros. A lógica de retomada também foi corrigida para usar a última tela realmente alcançada, sem inferir posição a partir do número da questão. Uma verificação estrutural confirmou 39 telas únicas (0–38), 28 questões únicas (1–28), 28 botões de avanço inicialmente desabilitados e distribuição exata de 7 respostas corretas em cada uma das quatro posições. O botão “Começar do início” foi corrigido para iniciar uma investigação realmente nova: apaga progresso, respostas, tentativas e estados visuais anteriores e abre a primeira pista; “Continuar investigação” preserva a retomada separadamente. A Revisão 1 de Matemática foi aprovada em 2026-09-24 e está liberada na página raiz do portal. O botão da revisão agora aponta para o jogo publicado. A página inicial foi atualizada para reconhecer cinco matérias. A versão aprovada permanece com 39 telas; a expansão para aproximadamente 50 telas deixou de ser objetivo desta revisão, pois o arco atual foi considerado completo.


- Matemática possui uma Revisão 2 em desenvolvimento, criada em 2026-09-24 a partir das 20 fotos do material oficial enviadas nesta conversa. A revisão é uma jornada de treinamento da “Academia de Detetives Matemáticos”, distinta do caso narrativo da Revisão 1, com progressão por blocos e 39 questões interativas. O conteúdo segue o material recebido: sinais e membros das inequações, tradução de situações, princípios de equivalência, inversão do sinal ao multiplicar/dividir por número negativo, incógnita nos dois membros, conjuntos/valores solução; circunferência, centro, raio, diâmetro, corda, arco, π≈3,14 e comprimento; unidades de superfície e conversões por fator 100; áreas de retângulo, quadrado, paralelogramo e triângulo; decomposição/recomposição de áreas; e desafios mistos finais. A revisão registra progresso e tentativas localmente, bloqueia avanço até a questão atual ser resolvida e apresenta relatório final por assunto. A Revisão 2 ainda não está ligada na página inicial e permanece em desenvolvimento até validação/aprovação. Em 2026-09-24, foi corrigido um defeito de renderização que exibia textos “undefined” nas telas de questão e o layout responsivo foi reforçado para evitar estouro horizontal/alinhamento fora da tela em celulares.

- Filosofia possui duas revisões interativas publicadas para o 3º bimestre. A Revisão 1 prioriza construção didática dos capítulos 5 e 6, com exemplos práticos, dicas, jogos e exercícios. A Revisão 2 prioriza reta final, conexões rápidas, situações-problema, pegadinhas com termos absolutos e treino de questões. Em 2026-09-24, Filosofia foi liberada na Home com links para as duas revisões. A página inicial agora reconhece seis matérias.

- Em 2026-09-24, foi corrigido um defeito de navegação nas duas revisões de Filosofia: ao responder uma questão de múltipla escolha, somente as alternativas daquela questão são desabilitadas; os controles Anterior, Pausar e Próxima permanecem ativos.

## Current direction
Aumentar a interatividade e a qualidade pedagógica mantendo navegação simples e linguagem apropriada à aluna.

## Source of truth
Este arquivo representa o estado vigente; conteúdo pedagógico e implementação detalhada permanecem nos arquivos específicos de cada matéria.

## Maintenance rule
**Atualize este arquivo sempre que houver mudança relevante de estrutura, matéria, abordagem pedagógica, interface, decisão aprovada/rejeitada, problema conhecido ou próximo passo. Remova ou marque explicitamente como SUPERSEDED/REJECTED qualquer informação que deixe de representar o estado atual. Antes de encerrar uma tarefa relevante, verifique obrigatoriamente se este arquivo precisa ser atualizado.**
