/* Contém o código do objeto (Model). */
// PCM 2021-2022 Blackjack object

//constante com o número máximo de pontos para blackJack
const MAX_POINTS = 21;
const MIN_POINTS_DEALER = 17;

// Classe BlackJack - construtor
class BlackJack {
    constructor() {
        // array com as cartas do dealer
        this.dealer_cards = [];
        // array com as cartas do player
        this.player_cards = [];
        // variável booleana que indica a vez do dealer jogar até ao fim
        this.dealerTurn = false;

        // objeto na forma literal com o estado do jogo
        this.state = {
            'gameEnded': false,
            'dealerWon': false,
            'playerBusted': false
        };

        //métodos utilizados no construtor (DEVEM SER IMPLEMENTADOS PELOS ALUNOS)
        /* Este método retorna um array com as 52 cartas representadas por números de 1 a
        13 para cada naipe. Os números 11, 12 e 13 representam as figuras (Rei, Valete e
        Dama). */
        this.new_deck = function () {
            let new_deck = new Array(); // Array a ser retornado   
            
            // Arrays com os valores e naipes
            var valores = [1, 2, 3, 4, 5, 6, 7 ,8 ,9, 10, 11, 12, 13];
            var naipes  = ["COPAS", "ESPADAS", "OUROS", "PAUS"];

            // Ciclos que criam cada uma das cartas (13 * 4 = 52 cartas)
            for (let valor_i = 0; valor_i < valores.length; valor_i++) {
                for (let naipe_i = 0; naipe_i < naipes.length; naipe_i++) {
                    let carta = {
                        valor: valores[valor_i],
                        naipe: naipes[naipe_i],
                    };
                    new_deck.push(carta);
                }
              }
            return new_deck;
        };

        /* Este método baralha o array de cartas construído no método anterior e retorna um
        novo array baralhado.
        Deve criar um array de índices de 1 a 52 (for). De seguida deve fazer um outro for
        que em cada ciclo (52) faça o sorteio (Math.random) de um índice. Este índice é
        usado para ir buscar uma carta ao baralho. Esta carta é inserida num fim de outro 
        array com as cartas baralhadas. Não esquecer de remover o índice sorteado do array
        de índice. */
        this.shuffle = function (deck) {
            let shuffled_deck    = new Array(); // Será o array retornado

            // "Deve criar um array de índices de 1 a 52 (for)."
            let array_de_indices = new Array();
            for (let i = 0 ; i < 52 ; i++){
                array_de_indices.push(i);
            }

            // "De seguida deve fazer um outro for que em cada ciclo (52) faça o sorteio (Math.random) de um índice."
            for (let j = 0 ; j < 52 ; j++){
                let rnd = Math.floor(Math.random() * (array_de_indices.length));
                let indice_random = array_de_indices[rnd]; // Indices de 0 ao número de indices por baralhar
                // "Este índice é usado para ir buscar uma carta ao baralho."
                let carta_obtida  = deck[indice_random];
                // "Esta carta é inserida num fim de outro array com as cartas baralhadas."
                shuffled_deck.push(carta_obtida);
                // "Não esquecer de remover o índice sorteado do array de índice."
                array_de_indices.splice(rnd, 1);
            }
            return shuffled_deck;
        };

        // baralho de cartas baralhado
        this.deck = this.shuffle(this.new_deck());
    }

    // métodos
    // devolve as cartas do dealer num novo array (splice)
    get_dealer_cards() {
        return this.dealer_cards.slice();
    }

    // devolve as cartas do player num novo array (splice)
    get_player_cards() {
        return this.player_cards.slice();
    }

    // Ativa a variável booleana "dealerTurn"
    setDealerTurn (val) {
        this.dealerTurn = true;
    }

    //MÉTODOS QUE DEVEM SER IMPLEMENTADOS PELOS ALUNOS
    /* Este método conta o valor de um array de cartas (dealer_cards ou
    player_cards) de acordo com as regras do blackjack. As cartas do 2 ao 9
    pontuam com o valor marcado na carta (2 a 9 pontos). O Rei, a Dama e o Valete
    valem 10 pontos e o Às pode ter o valor de 1 ou 11 (o jogador escolhe como lhe
    dá mais jeito). Retorna os pontos resultantes. */
    get_cards_value(cards) {
        let pontos = 0;
        for (let carta_i = 0 ; carta_i < cards.length ; carta_i++){
            let valor_carta = cards[carta_i].valor;
            // "As cartas do 2 ao 9 pontuam com o valor marcado na carta (2 a 9 pontos)."
            if (valor_carta >= 2 && valor_carta <= 10) {
                pontos += valor_carta;
            }
            // "O Rei, a Dama e o Valete valem 10 pontos"
            else if (valor_carta >= 11 && valor_carta <= 13){
                pontos += 10;
            }
            // "O Às pode ter o valor de 1 ou 11 (o jogador escolhe como lhe dá mais jeito)"
            else if (valor_carta == 1){
                if (pontos + 11 > MAX_POINTS) pontos += 1;
                else pontos += 11;
            }
        }
        return pontos;
    }

    /* Este método verifica se a pontuação das cartas do dealer e do player permitem
    terminar o jogo (rebentar ou 21) e se alguém ganhou. Atualiza a variável “state”
    (membro da classe Blackjack) com o estado atual e retorna essa variável.  */
    get_game_state() {
        // Contagem dos pontos
        let pontos_player = this.get_cards_value(this.player_cards);
        let pontos_dealer = this.get_cards_value(this.dealer_cards);

        // Não contar a carta virada ao contrário até o jogados fizer Stand e for a vez do dealer
        if (this.dealer_cards.length > 1 && !this.dealerTurn){
            pontos_dealer = this.visible_card_value();
        }

        // O jogo acaba se:
        //    *- O Jogador rebentar antes de fazer stand;
        //    *- O Jogador fizer Blackjack (obter 21 valores exatos);
        //    *- Tendo o Jogador feito stand, o Dealer ultrapassar os 17 pontos (tira cartas até fazer mais de 17 pontos);
        if ((pontos_player >= MAX_POINTS) || (this.dealerTurn && pontos_dealer > MIN_POINTS_DEALER)){
            this.state.gameEnded = true;

            // O dealer ganha se:
            //   *- O Jogador rebentar;
            //   *- O Dealer tiver mais pontos que o jogador, sem ter rebentado;
            if (pontos_player > MAX_POINTS || (this.dealerTurn && pontos_dealer > pontos_player && pontos_dealer <= MAX_POINTS)){
                this.state.dealerWon = true;
            }
            else {
                this.state.dealerWon = false;
            }
            // O Jogador rebenta se passar os 21 pontos;
            if (pontos_player > MAX_POINTS){
                this.state.playerBusted = true;
            }
            else {
                this.state.playerBusted = false;
            }
        }
        else {
            this.state.gameEnded = false;
        }
        return this.state;
    }

    /* Este método vai buscar a próxima carta ao baralho e coloca-a no array de cartas
    do player. Retorna a variável “state” atualizada executando o método
    get_game_state()que atualiza o estado do jogo após a jogada do player */
    player_move() {
        if (this.state.gameEnded === false){
            let carta_retirada = this.deck.pop();
            this.player_cards.push(carta_retirada);
            return this.get_game_state();
        }
    }

    /* Este método é igual ao anterior mas agora para o dealer (a nova carta deve ser
    colocada no array de cartas do dealer.  */
    dealer_move() {
        let carta_retirada = this.deck.pop();
        this.dealer_cards.push(carta_retirada);
        return this.get_game_state();
    }

    /* Este método retorna o valor da carta visivel do dealer.  */
    visible_card_value(){
        let valor = 0;
        if (!(this.dealer_cards.length===0)){
            let valor_carta = this.dealer_cards[0].valor;
            // "As cartas do 2 ao 9 pontuam com o valor marcado na carta (2 a 9 pontos)."
            if (valor_carta >= 2 && valor_carta <= 10) {
                valor = valor_carta;
            }
            // "O Rei, a Dama e o Valete valem 10 pontos"
            else if (valor_carta >= 11 && valor_carta <= 13){
                valor = 10;
            }
            // "O Às pode ter o valor de 1 ou 11 (o jogador escolhe como lhe dá mais jeito)"
            else if (valor_carta == 1){
                valor = 11;
            } 
        }
        return valor;
    }
}