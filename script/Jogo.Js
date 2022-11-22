var pincel = document.querySelector("canvas").getContext("2d");

//---------------------------------------------------------------
//Movimento do jogo usando WASD
//Tiro do jogo usando Clique esquerdo do Mouse
//Movimentação do Mouse muda a direção que a bala vai

//Favor ler os comentarios eles explicam bem, ou nem tando
//oque as coisas fazem, para assim voce poder usar oque eu fiz
//e escrever sua propria parte, se nao entender algo não hesite em
//me perguntar, talvez eu não consiga explicar tão bem quanto um professor
//mas pelo menos estou tentando.Se quiser tentar resolver algum
//dos problemas que listo nos comentarios eu agradeceria

//Uma ideia minha que to colocando aqui de ultima hora
//mudar o html, para ele ficar legal, invez de um fundo cinza,
//colocar alguma cor no fundo, ou qualquer coisa que fiquei bonita.
//--------------------------------------------------------------- *William

var Menu = new TodosMenu();
var Jogador = new Player(300, 300, "img/player.png", 11);
var Teclas = new Teclado(Menu);
var Mous = new Mouse();
var Ele = new Eletron(0, 0, 0, 5);
var Textos = new Texto();
var Tempo = new Temporizador();
var Mapa9x9 = new Mapa(9, ["img/Esquerda.png", "img/Direita.png", "img/Baixo.png", "img/Cima.png"]);
var Pontuacao = new Pontos();
var Som = new Sons("sound/MorteInimigo.mp3", "sound/LevarDanoInimigo.ogg","sound/PlayerDano.wav", "sound/Musica.wav");
var BG = new Background("img/Chao.png");
var Bossao = new Boss("img/Boss.png");

const Balas = [
    new Bala(2, -300, -300, 0, 3, 0),
    new Bala(2, -300, -300, 0, 3, 1),
    new Bala(2, -300, -300, 0, 3, 2)];
const Inimigos = [];
// Declaro Inimigos como constantes para usalos como array
// ja que havera varios inimigos e balas na tela pensei que seria
// interresante usalos neste formato *William
function Start() {
    Textos.CarregarFontNova();

    if (Menu.Comecou) {
        Mapa9x9.CriarMapa(9);
        // cria um mapa 9x9 *William

        Tempo.ComecarTempo();

        Pontuacao.DiminuirPontoTempo();

        Som.ComecarMusica();

        Menu.Start = true;
    }
}

function Desenhar() {
    pincel.clearRect(0, 0, 600, 600);

    if (Menu.Start) {
        BG.Desenhar();

        for (let i = 0; i < Balas.length; i++) {
            Balas[i].Desenhar();
        }

        for (let i = 0; i < Inimigos.length; i++) {
            Inimigos[i].Desenhar();
        }

        Jogador.Desenhar();

        Ele.Desenhar();

        Mapa9x9.DesenharMinimapa();
        //Desenha aquele quadrado cinza na direita encima que mostra o mapa gerado junto com o final 
        //do mapa e onde o player esta nele *William
        if (Inimigos.length <= 0) Mapa9x9.DesenharPortas();
        //Se nao exister inimigos na cena e desenhado as porta para passar a fase *William

        if (Mapa9x9.SalaFinal) Bossao.Desenhar();
        //apenas na sala final deve desenhar isso <- *William

        pincel.fillStyle = "white";

        Textos.Escrever(20, 20, "Vida: " + Jogador.Vida);
        //Texto de vida na tela *William

        Textos.Escrever(160, 20, "Tempo: " + Tempo.TempoAtual);
        //Texto de tempo na tela *William

        Textos.Escrever(340, 20, "Pontos: " + Pontuacao.Ponto);
        //Texto de ponto na tela *William

    }
    else {
        if (!Menu.Start) {
            Menu.DesenharMenuInicio();
            Menu.DesenharSeta();
        }
    }
}

function Update() {



    if (Menu.Start) {

        Mapa9x9.VerificarSalaFinal();
        //Verifica se esta na sala final*William
        Jogador.ImpedirAndarForaDoMapa();

        if (!Mapa9x9.JaPassados.includes(Mapa9x9.LugarDentroDoMapaFeito) && !Mapa9x9.SalaFinal) {
            for (let i = 0; i < Math.floor(Math.random() * 7) + 3; i++) {
                Inimigos.push(
                    new Inimigo(0.5, Math.floor(Math.random() * 5)),
                )
            }
            Mapa9x9.JaPassados.push(Mapa9x9.LugarDentroDoMapaFeito);
        }
        //se o player entrar numa fase do mapa que ele ainda nao passou ele spawna N inimigos e 
        //declara aquela fase do mapa como passada assim ele nao entra nela novamente e spawna novos inimigos*William

        if (Mapa9x9.SalaFinal) {
            Bossao.Movimento();
            Bossao.Diminui();
            if (Jogador.Distancia(Bossao.PosX, Bossao.PosY) == Jogador.Raio + Bossao.Raiou || Jogador.Distancia(Bossao.PosX, Bossao.PosY) > Jogador.Raio - Bossao.Raiou && Jogador.Distancia(Bossao.PosX, Bossao.PosY) < Jogador.Raio + Bossao.Raiou) {
                Som.TocarSom("PlayerLevarDano");
                Jogador.Vida--;
            }
            //Coisa maluca mas em matematica a gente nao viu isso, deveriamos, mas nao vimos, a distancia entre dois circulos e simple , a distancia dele e igual aos dois raios juntos
            //enconstou, se diminuir os dois raios e for menor que a distancia e se juntar eles for maior que a distancia entao eles entraram um no outro
            //paia demais nao termos visto isso *William
        }
        //Se estivermos na fase final, AKA ultima fase, eles fazem isto tudo *William

        Jogador.Movimentacao();

        Ele.AtualizarDados(-Math.atan2(Jogador.PlaX - Mous.MouX, Jogador.PlaY - Mous.MouY) - 2.3, Jogador.PlaX, Jogador.PlaY);
        // atualiza os dados importantes da bola que roda envolta do Player
        // no caso o eletron dando a ele uma atualização sobre o angulo novo e posições 
        // não entendi por que preciso dar -2.3 e nem por que o angulo tem que estar negativo
        // mas esta funcionando, e em time que esta ganhando nao se mexe *William

        if (Inimigos.length <= 0 && !Mapa9x9.SalaFinal) Mapa9x9.AtualizarPortas();
        //Se nao tiver inimigos na fase ele ve que portas pode se ativar ou nao *William 

        Mapa9x9.ColisaoPortas(Jogador.PlaX, Jogador.PlaY);
        //Colisao do player com as portas *William

        for (let i = 0; i < Balas.length; i++) {
            Balas[i].Movi();
            Balas[i].AtualizarDados(Math.atan2(Jogador.PlaX - Mous.MouX, Jogador.PlaY - Mous.MouY), Ele.EleX, Ele.ELeY);

            if (Mapa9x9.SalaFinal) {
                if (Balas[i].Distancia(Bossao.PosX, Bossao.PosY) == Balas[i].Raio + Bossao.Raiou || Balas[i].Distancia(Bossao.PosX, Bossao.PosY) > Balas[i].Raio - Bossao.Raiou && Balas[i].Distancia(Bossao.PosX, Bossao.PosY) < Balas[i].Raio + Bossao.Raiou) {
                    Balas[i].Desaparecer();
                    Som.TocarSom("DanoInimigo");
                    Bossao.Vida--;
                }
            }
            //Coisa maluca mas em matematica a gente nao viu isso, deveriamos, mas nao vimos, a distancia entre dois circulos e simple , a distancia dele e igual aos dois raios juntos
            //enconstou, se diminuir os dois raios e for menor que a distancia e se juntar eles for maior que a distancia entao eles entraram um no outro
            //paia demais nao termos visto isso *William
            for (let o = 0; o < Inimigos.length; o++) {
                if (Balas[i].Distancia(Inimigos[o].IniX + 10, Inimigos[o].IniY + 10) < 10) {
                    Balas[i].Desaparecer();
                    Som.TocarSom("DanoInimigo");
                    Inimigos[o].Vida--;
                }
            }
        }
        // a cada bala que existe ele atualiza seu movimento na tela
        // e seus dados importantes como o angulo novo do mouse 
        // para no momento que cliclar com o mouse ele os atualizar,
        // alem de cada bala verificar a distancia de todos inimigos na tela
        // se sua distancia for menor que 10, ou seja foi atingido
        // ele tira vida do inimigo que acertou e some com a bala *William

        for (let i = 0; i < Inimigos.length; i++) {
            Inimigos[i].Movimentacao();
            Inimigos[i].AtualizarDados(Math.atan2(Jogador.PlaX - Inimigos[i].IniX, Jogador.PlaY - Inimigos[i].IniY));
            if (Jogador.Distancia(Inimigos[i].IniX + 10, Inimigos[i].IniY + 10) < 20) {
                Som.TocarSom("PlayerLevarDano");
                Jogador.Vida--;
            }
            if (Inimigos[i].Vida <= 0) {
                Som.TocarSom("MorteInimigo");
                Pontuacao.AumentarPontosMatarInimigo(Inimigos[i].Imagem);
                Inimigos.splice(i, 1);
            }
        }
        // a cada inimigo que existe ele atualiza seu movimento na tela
        // e seus dados importates de angulo relativa a cada inimigo para
        // implementar o angulo a cada inimigo, alem de verificar se a vida do inimigo 
        // esta abaixo ou igual a zero, o deletando do array, acabando com sua existencia
        // tambem verifica a distancia de cada inimigo ao player se a distancia for menor
        // que 20 o player perde vida (Achar uma forma tecnica do player so perder vida 1 vez), 
        // esta tudo funcionando, mas ainda falta fazer algo quando o player morrer, talvez
        // criar um menu para quando ele morrer *William


        Menu.VerificarSePararJogo(Jogador, Bossao, Intervalo, Pontuacao);
        // verifica se precisar parar o jogo, se sim ele limpa a tela e coloca a tela final no jogo *William
    }
}
function Main() {
    if (!Menu.Start) Start()
    Desenhar();
    Update();
}
const Intervalo = setInterval(Main, 10);