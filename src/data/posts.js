export const posts = [
  // --- REDAÇÕES ---
  {
    id: 1, 
    categoryId: 'redacoes', 
    category: 'Redações Nota 10', 
    title: 'A Desigualdade Social no Brasil Contemporâneo', 
    author: 'Maria Silva', 
    date: '03/03/2026',
    excerpt: 'Uma análise profunda sobre as raízes históricas da desigualdade social no Brasil...',
    content: `A desigualdade social no Brasil contemporâneo é um fenômeno complexo, enraizado em séculos de exploração colonial e estruturas econômicas excludentes. Para compreendê-la em sua totalidade, é necessário analisar suas causas históricas, suas manifestações atuais e os possíveis caminhos para sua superação.

Desde o período colonial, o Brasil foi construído sobre uma base de exploração do trabalho escravo e concentração de terras nas mãos de poucos. Esse legado histórico criou uma estrutura social rígida que, mesmo após a abolição da escravatura e a proclamação da República, continuou a reproduzir mecanismos de exclusão. A ausência de políticas de inclusão efetivas para a população recém-liberta perpetuou um ciclo de pobreza e marginalização que persiste até os dias atuais.

No contexto contemporâneo, a desigualdade se manifesta em múltiplas dimensões: econômica, racial, de gênero e regional. Segundo dados do IBGE, os 10% mais ricos da população concentram cerca de 43% da renda nacional, enquanto os 40% mais pobres detêm apenas 7%. Essa concentração extrema de riqueza compromete não apenas o bem-estar material da população, mas também o pleno exercício da cidadania e o funcionamento da democracia.

Diante desse cenário, é fundamental que o Estado brasileiro adote políticas públicas estruturais que combatam a desigualdade em suas raízes. A reforma tributária progressiva, a universalização de uma educação de qualidade e a implementação de políticas de cotas e reparação histórica são medidas indispensáveis. Somente por meio de ações concretas e sustentadas será possível construir uma sociedade verdadeiramente justa e igualitária.`,
    initialLikes: 47, 
    initialComments: [
      { id: 1, author: 'João Pereira', text: 'Excelente redação! Muito bem fundamentada.' },
      { id: 2, author: 'Professor Carlos', text: 'Uso exemplar dos dados estatísticos. Nota 10 merecida!' },
      { id: 3, author: 'Ana Costa', text: 'Parabéns Maria, o terceiro parágrafo ficou perfeito.' },
      { id: 4, author: 'Juliana Castro', text: 'Me ajudou muito a entender o tema para o ENEM, obrigada!' },
      { id: 5, author: 'Felipe Santos', text: 'Alguém sabe me dizer qual foi a fonte dos dados do IBGE?' }
    ]
  },
  {
    id: 2, 
    categoryId: 'redacoes', 
    category: 'Redações Nota 10', 
    title: 'Os Desafios da Educação no Século XXI', 
    author: 'Pedro Oliveira', 
    date: '10/03/2026',
    excerpt: 'Como a transformação digital e as novas demandas do mercado de trabalho exigem uma revolução...',
    content: `A educação brasileira enfrenta no século XXI desafios sem precedentes. A aceleração tecnológica, a globalização e as transformações no mercado de trabalho exigem uma revisão profunda dos modelos pedagógicos tradicionais.

A escola do século XXI precisa formar não apenas cidadãos com conhecimento técnico, mas indivíduos críticos, criativos e capazes de aprender continuamente. As chamadas competências socioemocionais — como empatia, resiliência e trabalho em equipe — tornaram-se tão importantes quanto o domínio dos conteúdos curriculares tradicionais.

A pandemia de COVID-19 evidenciou de forma brutal as desigualdades no acesso à educação digital. Enquanto estudantes de escolas privadas adaptaram-se rapidamente ao ensino remoto, milhões de alunos da rede pública foram privados do direito à educação por falta de acesso à internet e dispositivos tecnológicos.

Portanto, investir em infraestrutura tecnológica nas escolas públicas, capacitar professores para os novos desafios pedagógicos e redesenhar currículos que privilegiem o pensamento crítico são medidas urgentes e inadiáveis para que o Brasil possa garantir uma educação de qualidade para todos os seus cidadãos.`,
    initialLikes: 32, 
    initialComments: [
      { id: 6, author: 'Fernanda Lima', text: 'Muito relevante! A pandemia mesmo mostrou tudo isso na prática.' },
      { id: 7, author: 'Lucas Mendes', text: 'Ótima abordagem Pedro! Concordo plenamente com a parte da tecnologia.' },
      { id: 8, author: 'Professora Renata', text: 'Um olhar muito maduro sobre a nossa realidade em sala de aula.' }
    ]
  },

  // --- CORDÉIS (Literaturas) ---
  {
    id: 3, 
    categoryId: 'cordeis', 
    category: 'Cordéis', 
    title: 'O Sertão que Eu Amo', 
    author: 'Josefa Santos', 
    date: '05/03/2026',
    excerpt: 'Um cordel que celebra a beleza, a resistência e a cultura do povo sertanejo nordestino...',
    content: `Vou contar uma história
Do sertão que tanto amo
Das terras do Nordeste
Onde o povo nunca damo

Na seca mais severa
O sertanejo resiste
Com fé e com coragem
A vida ele persiste

A caatinga florida
Quando a chuva chegar
Mostra toda sua força
É bonita de se olhar

O forró e o baião
São a alma dessa terra
A sanfona e zabumba
Tocam paz e não guerra

Minha terra querida
De beleza singular
Sertão que eu carrego
No fundo do meu olhar`,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=450&fit=crop',
    initialLikes: 68, 
    initialComments: [
      { id: 9, author: 'Antônio Ferreira', text: 'Que belo cordel! Me deu saudade do interior de onde vim.' },
      { id: 10, author: 'Rafaela Silva', text: 'Linda demais! Você tem muito talento Josefa!' },
      { id: 11, author: 'Diretora Márcia', text: 'Orgulho de ver a cultura nordestina tão bem representada por nossos alunos.' }
    ]
  },
  {
    id: 4, 
    categoryId: 'cordeis', 
    category: 'Cordéis', 
    title: 'A Lenda do Boto Cor-de-Rosa', 
    author: 'Raimundo Costa', 
    date: '12/03/2026',
    excerpt: 'Uma releitura poética da famosa lenda amazônica do Boto, que encanta e seduz...',
    content: `Nas águas do Amazonas
Existe um ser encantado
O Boto cor-de-rosa
Que deixa o povo admirado

Nas noites de festa junina
Ele sai das profundezas
Vira um homem elegante
De chapéu e com certezas

Veste roupa toda branca
Seu sorriso é sedutor
Dança com as moças bonitas
Esse ser cheio de cor

Mas quando a festa termina
Ele volta pro rio fundo
Deixa saudade e mistério
Nesse vasto e largo mundo

Quem vê o Boto passando
Deve rezar e ter fé
Pois ele é ser das águas
Da Amazônia que eu sei`,
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=450&fit=crop',
    initialLikes: 41, 
    initialComments: [
      { id: 12, author: 'Cleide Moura', text: 'Adorei a versão em cordel da lenda! Misturou muito bem as regiões.' },
      { id: 13, author: 'Marcos Antônio', text: 'Sempre tive medo dessa lenda quando era criança kkkkkk' }
    ]
  },
  {
    id: 13, 
    categoryId: 'cordeis', 
    category: 'Cordéis', 
    title: 'Versos Livres', 
    author: 'João Antonio', 
    date: '14/03/2026',
    excerpt: 'Poesia em formato de cordel sobre a liberdade e a vida no interior.',
    content: `A liberdade canta forte
Nas cordas de um violão
Lembrando a todos nós
Do valor do nosso chão`,
    image: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=600&h=450&fit=crop',
    initialLikes: 17, 
    initialComments: []
  },

  // --- CONTOS ---
  {
    id: 5, 
    categoryId: 'contos', 
    category: 'Contos', 
    title: 'O Último Pé de Umbu', 
    author: 'Beatriz Nascimento', 
    date: '08/03/2026',
    excerpt: 'Um conto sobre a relação entre um menino e o único pé de umbu que restou após uma grande seca...',
    content: `O sol rachava o chão de Lagoa do Ouro como se quisesse partir o mundo ao meio. Já fazia três anos que a chuva não visitava aquelas bandas, e o Zezinho, com seus doze anos de vida sertaneja, sabia bem o que isso significava.

Mas havia uma coisa que fazia Zezinho sorrir todo dia: o velho pé de umbu que ficava no quintal da vovó Mundinha. Enquanto tudo ao redor secava, murcha e abandonava a vida, aquela árvore teimosa continuava ali, enraizada fundo na terra ressecada, como se soubesse de um segredo que ninguém mais conhecia.

— Essa árvore é um milagre, Zezinho — dizia a vovó, passando a mão nodosa no tronco áspero. — Ela guarda água lá dentro, nas raízes. É assim que sobrevive quando o céu esquece de chorar.

Zezinho pensava muito nisso. Se o umbuzeiro guardava água por dentro para os tempos difíceis, talvez ele também precisasse guardar alguma coisa boa dentro de si. Coragem, talvez. Ou esperança.

Na manhã em que as primeiras nuvens carregadas apareceram no horizonte, Zezinho estava embaixo do umbuzeiro. E quando a primeira gota caiu no seu rosto, ele riu tanto que acordou toda a vizinhança. A árvore, sacudida pelo vento que anunciava a chuva, parecia rir junto com ele.`,
    initialLikes: 89, 
    initialComments: [
      { id: 14, author: 'Mariana Alves', text: 'Que conto lindo! Me emocionei demais.' },
      { id: 15, author: 'Roberto Alves', text: 'Excelente uso da paisagem nordestina como elemento narrativo!' },
      { id: 16, author: 'Carlos Eduardo', text: 'Beatriz você deveria tentar publicar esse conto em alguma editora.' },
      { id: 17, author: 'Isabela Ferreira', text: 'O umbuzeiro como metáfora de resistência foi genial.' }
    ]
  },
  {
    id: 6, 
    categoryId: 'contos', 
    category: 'Contos', 
    title: 'A Professora de Letras', 
    author: 'Thiago Mendonça', 
    date: '15/03/2026',
    excerpt: 'Uma homenagem às professoras do interior que, com poucos recursos mas muita dedicação...',
    content: `Dona Geralda chegava sempre antes dos alunos. Varrendo a sala com uma vassoura velha, ela não estava apenas limpando o chão — estava preparando o espaço para que algo importante acontecesse.

A escola municipal tinha três salas, um banheiro que só funcionava às vezes, e Dona Geralda. Para os habitantes de Pedra Alta, esses três elementos eram, em ordem de importância: Dona Geralda, as três salas, e o banheiro.

Ela ensinava português com uma paixão que poucos conseguiam entender. Para Dona Geralda, uma vírgula no lugar errado não era apenas um erro gramatical — era uma tragédia. Ela acreditava, com toda sua alma de professora do sertão, que as palavras tinham o poder de mudar o mundo.

— Um dia vocês vão sair daqui — ela dizia, olhando para aqueles rostos bronzeados pelo sol — e vão precisar das palavras certas para dizer o que sentem, o que pensam, o que querem. É isso que estou lhes dando.

Anos depois, quando Marcos passou no vestibular de Letras na UFPE, a primeira pessoa que ele ligou foi Dona Geralda. Ela atendeu ao terceiro toque, como sempre, e quando ouviu a notícia, ficou em silêncio por um momento. Depois disse, com a voz levemente trêmula: — Eu sabia.`,
    initialLikes: 112, 
    initialComments: [
      { id: 18, author: 'Luciana Freitas', text: 'Chorei! Lembrei muito da minha tia que também dava aula na zona rural.' },
      { id: 19, author: 'José Augusto', text: 'Toda escola do interior tem uma Dona Geralda. Que homenagem bonita.' }
    ]
  },
  {
    id: 14, 
    categoryId: 'contos', 
    category: 'Contos', 
    title: 'A Noite em que o Rio Secou', 
    author: 'Camila Santos', 
    date: '01/03/2026',
    excerpt: 'Uma narrativa emocionante sobre a escassez de água e a fé da comunidade.',
    content: 'Naquela terça-feira, o rio que cortava a cidade amanheceu reduzido a um fio de lama. O desespero da população se transformou em união para buscar alternativas...',
    initialLikes: 45, 
    initialComments: []
  },

  // --- CRÔNICAS ---
  {
    id: 7, 
    categoryId: 'cronicas', 
    category: 'Crônicas', 
    title: 'Segunda-Feira às Sete da Manhã', 
    author: 'Larissa Campos', 
    date: '02/03/2026',
    excerpt: 'Uma crônica bem-humorada sobre o ritual de ir à escola numa segunda-feira...',
    content: `O despertador tocou às seis da manhã com aquela mesma energia irritante de sempre. Eu olhei para ele com o ódio silencioso que só os adolescentes são capazes de sentir por objetos inanimados numa segunda-feira.

O banho foi frio. Claro que foi. O chuveiro elétrico de casa tem uma teoria própria sobre temperatura — ele acredita que segunda-feira é dia de penitência.

No caminho para a escola, passei pela padaria do seu Manoel. O cheiro de pão quente me atacou com uma crueldade desnecessária. Com o dinheiro do lanche, comprei um coxinha. Comi em pé, na calçada, olhando para os carros que passavam. Por um momento, me senti completamente adulto.

A professora de Matemática entrou na sala às sete e dois minutos com aquele sorriso que só as pessoas que amam segunda-feira têm. Perguntei mentalmente como era possível.

Mas aí, no meio da segunda aula, aconteceu uma coisa estranha: eu entendi a matéria. Aquela equação que parecia escrita em sânscrito semana passada de repente fez sentido. Levantei a mão, respondi certo, e a professora disse "exatamente" com um sorriso genuíno.

Segunda-feira às sete da manhã. Não é assim tão ruim.`,
    initialLikes: 76, 
    initialComments: [
      { id: 20, author: 'Felipe Santos', text: 'O chuveiro de penitência kkkk muito real isso!' },
      { id: 21, author: 'Isabela Cruz', text: 'Me identifiquei com cada linha dessa crônica! Segunda-feira é um teste de resistência.' },
      { id: 22, author: 'Professora Renata', text: 'Ótima crônica Larissa! Mas espero você às 7h amanhã na minha aula, viu?' }
    ]
  },
  {
    id: 15, 
    categoryId: 'cronicas', 
    category: 'Crônicas', 
    title: 'Feira de Caruaru numa Manhã de Sábado', 
    author: 'Lucas Oliveira', 
    date: '25/11/2025',
    excerpt: 'As cores, cheiros e sons da maior feira ao ar livre do Nordeste.',
    content: 'A Feira de Caruaru não é apenas um local de compras, é um organismo vivo pulsante. O cheiro de queijo coalho assando se mistura com as rimas dos emboladores...',
    initialLikes: 102, 
    initialComments: [
      { id: 23, author: 'Ana Costa', text: 'Melhor lugar do mundo!' }
    ]
  },
  {
    id: 16, 
    categoryId: 'cronicas', 
    category: 'Crônicas', 
    title: 'Minha Avó e o Rádio de Pilha', 
    author: 'Gabriel Lima', 
    date: '20/11/2025',
    excerpt: 'Uma viagem no tempo através das memórias sonoras da infância.',
    content: 'Aquele rádio de pilha marrom ficava na janela da cozinha, sintonizado na AM. Era através dele que minha avó ouvia as notícias do mundo e as fofocas da cidade vizinha...',
    initialLikes: 64, 
    initialComments: []
  },

  // --- JORNAL DA ESCOLA ---
  {
    id: 9, 
    categoryId: 'jornal', 
    category: 'Jornal da Escola', 
    title: 'Grêmio Estudantil lança campanha de arrecadação para biblioteca escolar', 
    author: 'Ana Beatriz Souza', 
    date: '28/11/2025',
    excerpt: 'Estudantes do 3º ano organizaram uma campanha para ampliar o acervo da biblioteca...',
    content: `O Grêmio Estudantil "Voz Ativa", formado por alunos do 3º ano, deu início nesta semana a uma ambiciosa campanha de arrecadação de livros. O objetivo é diversificar o acervo da nossa biblioteca, trazendo mais obras de autores nordestinos, além de materiais atualizados de ciências e tecnologia.
    
Segundo a presidente do Grêmio, Ana Beatriz, a iniciativa surgiu após uma pesquisa com os estudantes, que sentiam falta de títulos contemporâneos. "Queremos que a biblioteca seja um espaço vivo, com histórias que conversem com a nossa realidade", explicou.

A campanha vai até o fim do mês que vem, e quem quiser doar pode deixar os livros na caixa de coleta na entrada principal. O resultado superou as expectativas: a iniciativa já conta com mais de 200 doações apenas na primeira semana!`,
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop',
    initialLikes: 120, 
    initialComments: [
      { id: 24, author: 'Diretora Márcia', text: 'Parabéns pela iniciativa, alunos! A escola está orgulhosa.' }
    ]
  },
  {
    id: 10, 
    categoryId: 'jornal', 
    category: 'Ciência', 
    title: 'Alunos do 2º ano desenvolvem filtro d\'água sustentável', 
    author: 'Professor Docente', 
    date: '25/11/2025',
    excerpt: 'O projeto foi apresentado na Feira de Ciências regional e conquistou o primeiro lugar.',
    content: 'Um grupo de alunos do 2º ano do Ensino Médio desenvolveu um protótipo de filtro de água utilizando exclusivamente garrafas PET, areia, pedras e carvão ativado artesanal. O projeto foi o grande vencedor da Feira de Ciências Regional na categoria Inovação Ambiental.',
    initialLikes: 85, 
    initialComments: []
  },
  {
    id: 11, 
    categoryId: 'jornal', 
    category: 'Esporte', 
    title: 'Time de futsal da escola se classifica para o estadual', 
    author: 'Pesquisador Jovem', 
    date: '22/11/2025',
    excerpt: 'Em jogo disputado no ginásio municipal, os alunos viraram o placar nos últimos minutos...',
    content: 'A emoção tomou conta do ginásio municipal na noite de ontem. Perdendo de 2 a 0 no primeiro tempo, a equipe de futsal da nossa escola mostrou resiliência e virou o jogo nos cinco minutos finais, garantindo a vaga.',
    initialLikes: 210, 
    initialComments: [
      { id: 25, author: 'Felipe Santos', text: 'Foi um jogo inesquecível! Rumo ao estadual!' }
    ]
  },
  {
    id: 12, 
    categoryId: 'jornal', 
    category: 'Cultura', 
    title: 'Exposição de arte urbana transforma os muros da escola', 
    author: 'Artista Escolar', 
    date: '20/11/2025',
    excerpt: 'Com temas sobre identidade nordestina, os painéis foram criados pelos estudantes...',
    content: 'Os muros cinzas da escola deram lugar a cores vibrantes e mensagens poderosas. Alunos de artes visuais lideraram um projeto de intervenção urbana durante dois meses valorizando a cultura nordestina.',
    initialLikes: 142, 
    initialComments: []
  },

  // --- CLUBE DE LEITURA (Resenhas) ---
  {
    id: 8, 
    categoryId: 'clube-leitura', 
    category: 'Clube de Leitura', 
    title: 'Resenha: Vidas Secas — Graciliano Ramos', 
    author: 'Gabriel Moreira', 
    date: '18/03/2026',
    excerpt: 'Uma análise aprofundada do clássico de Graciliano Ramos...',
    content: `Publicado em 1938, "Vidas Secas" de Graciliano Ramos é uma obra que transcende seu tempo e continua a reverberar com dolorosa atualidade no contexto nordestino.

O que mais me impressionou na leitura foi a escolha estilística do autor: a linguagem é tão seca quanto a paisagem que descreve. As frases são curtas, cortadas, como a vegetação da caatinga. Os personagens pensam pouco e sentem muito, e é nesse silêncio eloquente que reside a genialidade da obra.

O capítulo dedicado à cachorra Baleia é, para mim, o mais perturbador e belo da literatura brasileira. Ramos nos faz sentir empatia profunda por um animal, e ao fazê-lo, nos obriga a questionar os limites da nossa própria humanidade.

Mais de 80 anos depois, ainda existem Fabianos e Sinhás Vitórias no Brasil. Essa é a tragédia e a grandeza do livro: ele nunca envelhece porque o problema que retrata nunca foi resolvido. Ler "Vidas Secas" em 2026 é um ato político tanto quanto literário.`,
    stars: 5, 
    initialLikes: 54, 
    initialComments: [
      { id: 26, author: 'Amanda Rocha', text: 'O capítulo da Baleia me destruiu quando li. Ótima resenha Gabriel!' },
      { id: 27, author: 'Coordenador Paulo', text: 'Preciso reler esse livro depois dessa resenha.' }
    ]
  },
  {
    id: 17, 
    categoryId: 'clube-leitura', 
    category: 'Clube de Leitura', 
    title: 'Resenha: Quarto de Despejo', 
    author: 'Maria Eduarda', 
    date: '15/03/2026',
    excerpt: 'Uma obra que me fez refletir profundamente sobre desigualdade social.',
    content: 'Carolina escreve com uma força e honestidade raras. Leitura obrigatória para entender a realidade periférica.',
    stars: 5, 
    initialLikes: 42, 
    initialComments: []
  },
  {
    id: 18, 
    categoryId: 'clube-leitura', 
    category: 'Clube de Leitura', 
    title: 'O Diário Devastador', 
    author: 'Ana Clara', 
    date: '14/03/2026',
    excerpt: 'Cada página é um retrato vivo do Brasil que muitos preferem ignorar.',
    content: 'O diário de Carolina é devastador e bonito ao mesmo tempo. Mostra a força da mulher negra em meio a adversidade.',
    stars: 4, 
    initialLikes: 22, 
    initialComments: []
  },

  // --- INFOGRÁFICOS ---
  {
    id: 19, categoryId: 'infograficos', category: 'Infográficos', title: 'Desmatamento no Nordeste', author: 'Lucas Mendes', date: '01/03/2026',
    excerpt: 'Turma: 2º A', content: 'Análise gráfica sobre o avanço do desmatamento na Caatinga...', initialLikes: 15, initialComments: []
  },
  {
    id: 20, categoryId: 'infograficos', category: 'Infográficos', title: 'Água e Saneamento no Sertão', author: 'Maria Clara', date: '02/03/2026',
    excerpt: 'Turma: 1º B', content: 'Dados sobre o acesso a água potável no semiárido...', initialLikes: 25, initialComments: []
  },
  {
    id: 21, categoryId: 'infograficos', category: 'Infográficos', title: 'Energia Solar em Pernambuco', author: 'João Vitor', date: '04/03/2026',
    excerpt: 'Turma: 3º C', content: 'Crescimento das usinas solares na região Nordeste...', initialLikes: 31, initialComments: []
  },

  // --- ARTES (Galeria) ---
  {
    id: 22, categoryId: 'artes', category: 'Galeria de Artes', title: 'Cores do Sertão', author: 'Camila Santos', date: '10/03/2026',
    excerpt: 'Pintura em tela acrílica.', content: 'Representação das cores vivas do por do sol no sertão.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop', initialLikes: 89, initialComments: []
  },
  {
    id: 23, categoryId: 'artes', category: 'Galeria de Artes', title: 'Jardim Nordestino', author: 'Rafael Costa', date: '11/03/2026',
    excerpt: 'Fotografia digital.', content: 'Foco na flora resistente da Caatinga.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', initialLikes: 55, initialComments: []
  },
  {
    id: 24, categoryId: 'artes', category: 'Galeria de Artes', title: 'Rosto da Cidade', author: 'Pedro Silva', date: '12/03/2026',
    excerpt: 'Grafite digital.', content: 'A expressão urbana nas ruas do centro.',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop', initialLikes: 74, initialComments: []
  },

  // --- VÍDEOS ---
  {
    id: 25, categoryId: 'videos', category: 'Vídeos Autorais', title: 'Curta: A Seca e o Sonho', author: 'Ana Paula & equipe', date: '15/03/2026',
    excerpt: 'Duração: 8min', duration: '8min', content: 'Curta metragem produzido pelos alunos do 3º ano abordando a migração nordestina.', initialLikes: 120, initialComments: []
  },
  {
    id: 26, categoryId: 'videos', category: 'Vídeos Autorais', title: 'Vídeo-Poema: Raízes do Sertão', author: 'Gabriel Lima', date: '16/03/2026',
    excerpt: 'Duração: 3min', duration: '3min', content: 'Interpretação visual de poesias clássicas sobre o sertão.', initialLikes: 88, initialComments: []
  },

  // --- LIBRAS ---
  {
    id: 27, categoryId: 'libras', category: 'Literatura em Libras', title: 'O Menino que Plantou Estrelas', author: 'Júlia Santos', date: '20/03/2026',
    excerpt: 'Duração: 5min', duration: '5min', content: 'Conto infantil interpretado integralmente na Língua Brasileira de Sinais.', initialLikes: 45, initialComments: []
  },
  {
    id: 28, categoryId: 'libras', category: 'Literatura em Libras', title: 'Contos do Agreste', author: 'Lucas Oliveira', date: '21/03/2026',
    excerpt: 'Duração: 7min', duration: '7min', content: 'Tradução do clássico regional para a linguagem de sinais.', initialLikes: 60, initialComments: []
  },

  // --- MATERIAIS EM DESTAQUE (Mistura de categorias com a flag 'featured') ---
  {
    id: 29, categoryId: 'redacoes', category: 'História Local', title: 'A Memória das Pedras', author: 'Maria Silva', date: '01/02/2026',
    excerpt: 'Compartilhado por João Pedro - 3º Ano', content: 'Um resgate histórico da fundação da cidade e dos antigos casarões de pedra.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop', featured: true, initialLikes: 45, views: 234, initialComments: []
  },
  {
    id: 30, categoryId: 'redacoes', category: 'Folclore', title: 'Festas e Folguedos do Nordeste', author: 'Pedro Santos', date: '05/02/2026',
    excerpt: 'Compartilhado por Ana Clara - 2º Ano', content: 'As tradições que mantêm viva a chama da nossa cultura, passando por Maracatu e Bumba-meu-boi.',
    image: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=600&h=400&fit=crop', featured: true, initialLikes: 38, views: 189, initialComments: []
  },
  {
    id: 31, categoryId: 'contos', category: 'Literatura', title: 'Entre Versos e Veredas', author: 'Ana Costa', date: '10/02/2026',
    excerpt: 'Compartilhado por Lucas Mendes - 4º Ano', content: 'Uma viagem narrativa pelas trilhas do coração humano, explorando sentimentos profundos.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop', featured: true, initialLikes: 67, views: 312, initialComments: []
  },
  {
    id: 32, categoryId: 'artes', category: 'Artes Visuais', title: 'Arte em Olinda', author: 'Carlos Eduardo', date: '15/02/2026',
    excerpt: 'Compartilhado por Beatriz Lima - 1º Ano', content: 'Ensaio fotográfico capturando o carnaval e a arquitetura das ladeiras de Olinda.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', featured: true, initialLikes: 52, views: 276, initialComments: []
  }
];

// Funções utilitárias para os posts
export function getPostsByCategory(categoryId) {
  return posts.filter((post) => post.categoryId === categoryId);
}

export function getPostById(id) {
  return posts.find((post) => post.id === Number(id));
}

// ==========================================
// 2. CONFIGURAÇÕES ESTÁTICAS
// ==========================================

// O livro do mês é estático pois funciona como a pauta de leitura da Home
export const livroDoMesConfig = {
  title: 'Quarto de Despejo',
  author: 'Carolina Maria de Jesus',
  description: 'Diário de uma mulher que viveu na favela do Canindé, em São Paulo, nos anos 1950.',
  participants: 34,
  image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
  date: '15 de Dezembro, 14h', 
  local: 'Biblioteca da Escola'
};