/* Faz a interface entre a interface utilizador e o objeto “blackjack” (“Controller”) */
// PCM 2021-2022 Blackjack oop

const MIN_BET = 20;

let game      = null;
let betPlaced = false;
let playerBet;
let playerMoney; 

function buttons_initialization(){
    document.getElementById("winnerDealer").style.display = 'none';
    document.getElementById("winnerPlayer").style.display = 'none';
    document.getElementById("deck").style.pointerEvents = 'auto';
    document.getElementById("cardbttn").disabled = false;
    document.getElementById("stand").disabled    = false;
    document.getElementById("new_game").disabled = true;
    document.getElementById("continue").disabled = true;

}

function finalize_buttons(){
    document.getElementById("deck").style.pointerEvents = 'none';
    document.getElementById("cardbttn").disabled = true;
    document.getElementById("stand").disabled    = true;
    document.getElementById("new_game").disabled = false;
    if(playerMoney >= 20){
        document.getElementById("continue").disabled = false;
    } else {
        document.getElementById("continue").disabled = true;
    }
    if (game.get_cards_value(game.get_dealer_cards()) === game.get_cards_value(game.get_player_cards())){
        document.getElementById("winnerPlayer").style.display = 'inline-block';
        document.getElementById("winnerDealer").style.display = 'inline-block';
    } else if (game.get_game_state().dealerWon){
        document.getElementById("winnerDealer").style.display = 'inline-block';
    } else {
        document.getElementById("winnerPlayer").style.display = 'inline-block';
    }
}

//FUNÇÕES QUE DEVEM SER IMPLEMENTADOS PELOS ALUNOS

/* Esta função cria uma instância da classe “blackJack”, executa duas jogadas do dealer
e uma do player. Não se esqueça que a 2ª carta do dealer deve aparecer voltada para
baixo. Por exemplo, deve substituir a apresentação da 2ªcarta do dealer pelo caracter
“X”. Finalmente, são inicializados os botões da interface utilizador. 
*/
function new_game(){
    game = new BlackJack();
    betPlaced   = false;
    playerBet   = 0;
    playerMoney = 500; 

    showDeck();
    document.getElementById("winnerDealer").style.display = 'none';
    document.getElementById("winnerPlayer").style.display = 'none';
    document.getElementById("deck").style.pointerEvents = 'none';
    document.getElementById("cardbttn").disabled    = true;
    document.getElementById("stand").disabled       = true;
    document.getElementById("confirmBet").disabled  = true;
    document.getElementById("new_game").disabled    = true;
    document.getElementById("continue").disabled    = true;

        
    setTimeout(() => { 
        shuffleAnimation();
     }, 0);
     
    update_dealer();
    update_player();
    dealer_new_card();
    dealer_new_card();
    player_new_card();

    setTimeout(() => { 
        document.getElementById("confirmBet").disabled  = false;
     }, 3050);
    jQuery('#currentPlayerMoney').html(playerMoney);
    jQuery('#currentBetValue').html(playerBet + "  ");
    }

    function continueGame(){
        updateMoney()
        game = new BlackJack();
        betPlaced   = false;
        playerBet   = 0;
    
        showDeck();
        document.getElementById("winnerDealer").style.display = 'none';
        document.getElementById("winnerPlayer").style.display = 'none';
        document.getElementById("deck").style.pointerEvents = 'none';
        document.getElementById("cardbttn").disabled    = true;
        document.getElementById("stand").disabled       = true;
        document.getElementById("confirmBet").disabled  = true;
        document.getElementById("new_game").disabled    = true;
        document.getElementById("continue").disabled    = true;
    
            
        setTimeout(() => { 
            shuffleAnimation();
         }, 0);
         
        update_dealer();
        update_player();
        dealer_new_card();
        dealer_new_card();
        player_new_card();
    
        setTimeout(() => { 
            document.getElementById("confirmBet").disabled  = false;
         }, 3050);
        jQuery('#currentPlayerMoney').html(playerMoney);
        jQuery('#currentBetValue').html(playerBet + "  ");
        }

    function updateMoney(){
        if (!game.get_game_state().dealerWon){
            if (game.get_cards_value(game.get_player_cards()) === 21){
                playerMoney += Math.floor(2.5* playerBet);
            } else {
                playerMoney += 2* playerBet;
            }
        } else if (game.get_cards_value(game.get_dealer_cards()) === game.get_cards_value(game.get_player_cards())){
            playerMoney += playerBet;
        }
    }

    
    /* Esta função verifica se o estado do jogo é “gameEnded”. Em caso afirmativo, pede
    à classe “blackJack” as cartas do dealer. Verifica se o dealer ganhou ou perdeu. E
começa a construir uma string para mostrar as cartas acrescentando à string 
informação se o dealer ganhou ou perdeu. Finalmente atualiza a string no elemento
HTML associado ao dealer e executa a função finalize_buttons(). */
function update_dealer(state){
    showDeck();
    let stringCartasDealer = '';
    let dealer_score = game.get_cards_value(game.get_dealer_cards());

    if (game.get_game_state().gameEnded === true){
        let cartas_do_dealer = game.get_dealer_cards();
        for (let i = 0 ; i < cartas_do_dealer.length ; i++){
            stringCartasDealer += '<div id="dealer-card-'+ i + '" class="carta"><img class="image" src="./imagens/' + game.get_dealer_cards()[i].naipe + "-" + game.get_dealer_cards()[i].valor + '.svg" /></div>';
        }

        finalize_buttons();
    } else {
        if (!(game.get_dealer_cards().length===0)){
            dealer_score = game.visible_card_value();
        }
        for (let i = 0; i<game.get_dealer_cards().length ; i++){
            if (i === 1){
                stringCartasDealer += '<div id="dealer-card-'+ i + '" class="carta"><img class="image" src="./imagens/back2.png"/></div>';
            } else {
                stringCartasDealer += '<div id="dealer-card-'+ i + '" class="carta"><img class="image" src="./imagens/' + game.get_dealer_cards()[i].naipe + "-" + game.get_dealer_cards()[i].valor + '.svg" /></div>';
            }
        }
    }
    jQuery('#scoreDealer').html(dealer_score);
    jQuery('#dealer').html(stringCartasDealer);  
}

/* Esta função pede à classe “blackJack” as cartas do player e começa a construir
uma string para mostrar as cartas. A seguir, verifica se o estado do jogo é
“gameEnded” e se o player ganhou de modo a acrescentar à string informação
se o utilizador ganhou ou perdeu. Depois atualiza a string no elemento HTML
associado ao player e executa a função finalize_buttons(). */
function update_player(state){
    showDeck();
    let stringCartasJogador = '';
    for (let i = 0; i<game.get_player_cards().length ; i++){
        stringCartasJogador += '<div id="player-card-'+ i + '" class="carta"><img class="image" src="./imagens/' + game.get_player_cards()[i].naipe + "-" + game.get_player_cards()[i].valor + '.svg" /></div>';
    }
    jQuery('#player').html(stringCartasJogador);  

    let cartas_do_player_string = "";

    if (game.get_game_state().gameEnded === true){
        let perdeu = game.get_game_state().dealerWon;
        cartas_do_player_string += !perdeu + ": ";
        finalize_buttons();
    }

    jQuery('#scorePlayer').html(game.get_cards_value(game.get_player_cards()))
    update_dealer();
}

/* Esta função executa o método da classe “blackJack” que realiza a jogada do
dealer, atualiza o dealer e retorna o estado do jogo. */
function dealer_new_card(visible){
    game.dealer_move(visible);
    update_dealer();
    return game.get_game_state();
}

/* Esta função executa o método da classe “blackJack” que realiza a jogada do
player, atualiza o player e retorna o estado do jogo. */
function player_new_card(){
    game.player_move();
    this.update_player();
    return game.get_game_state();
}

/* Esta função chama o método get_game_state() da classe “blackJack” e
coloca a “true” a variável “DealerTurn da classe “blackJack”. Depois é criado
um ciclo até que o jogo termine (state.gameEnded). Nesse ciclo, é atualizado
o dealer, realizada uma jogada do dealer e atualizado o estado do jogo em cada
iteração */
function dealer_acaba(){
    game.setDealerTurn(true);
    update_dealer();
    while(game.get_game_state().gameEnded === false){
        update_dealer();
        dealer_new_card();
        game.state = game.get_game_state();
    }
}

/* FUNÇÕES DE INTERFACE */
function showDeck(){
    let stringBaralho = '';
    for (let i = 0; i<game.deck.length ; i++){
        stringBaralho += '<div id="card-'+ i + '" class="carta stack" style="transform:translate(' + i/3 + "px," + i/3 + 'px)" ><img class="image" src="./imagens/back2.png"/></div>';
    }
    jQuery('#deck').html(stringBaralho);  
}

function shuffleAnimation(){
    for (let i = 0 ; i < game.deck.length ; i++){
        let selectCard = jQuery('#card-' + i);
        let movement1  = Math.random() * (0.4) + 1;
        let direction1 = Math.floor(Math.random() * (2)) == 1 ? '+' : '-';
        let movement2  = Math.random() * (0.4) + 1;
        let direction2 = Math.floor(Math.random() * (2)) == 1 ? '+' : '-';
        moveCard(direction1 + 60*movement1, (direction1 + 2), selectCard);
        setTimeout(() => { 
            moveCard(i/3, (direction1 - 2), selectCard);
         }, 200);
        setTimeout(() => { 
            moveCard(direction2 + 60*movement2, (direction2 + 2), selectCard);
         }, 900);
        setTimeout(() => { 
            moveCard(i/3, i/3, selectCard);
         }, 2000);
    }
}

function moveCard(mx, my, card){
    card.css('transform','translate('+ mx + "px," + my + "px)");
}

function addToBet(valor){
    if(!betPlaced && valor <= playerMoney) {
        playerBet += valor;
        playerMoney -= valor;
    }
    jQuery('#currentPlayerMoney').html(playerMoney);
    jQuery('#currentBetValue').html(playerBet + "");
}

function confirmBet(){
    if (playerBet >= MIN_BET){
        buttons_initialization();
        betPlaced = true;
        document.getElementById("confirmBet").disabled  = true;
    }
}

function resetBet(){
    if(!betPlaced){
        playerMoney += playerBet;
        playerBet = 0;
    }
    jQuery('#currentPlayerMoney').html(playerMoney);
    jQuery('#currentBetValue').html(playerBet + "");
}