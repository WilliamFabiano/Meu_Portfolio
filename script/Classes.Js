class Player {
    constructor(x, y, Imagem, rai) {
        this.PlaX = x;
        this.PlaY = y;
        this.Img = Imagem;
        this.Raio = rai
        this.DirX = 0;
        this.DirY = 0;
        this.Vida = 100;

    }
    Movimentacao() {
        this.PlaX += this.DirX;
        this.PlaY += this.DirY;
    }

    Desenhar() {
        var img = new Image();
        img.src = this.Img;
        pincel.drawImage(img, this.PlaX - this.Raio, this.PlaY - this.Raio, this.Raio * 2, this.Raio * 2);
    }

    Distancia(x, y) { return Math.hypot(this.PlaX - x, this.PlaY - y); }
    // calculo de distancia e a mesma coisa que calcular a hipotenusa de um triangulo baseado no xy dado menos o atual,
    // entao e mais facil so pedir o calculo de distancia usando hypot da biblioteca math do javascript *William  

    ImpedirAndarForaDoMapa() {
        if (this.PlaX - this.Raio < 0) this.PlaX = 0 + this.Raio;
        if (this.PlaX + this.Raio > 600) this.PlaX = 600 - this.Raio;
        if (this.PlaY - this.Raio < 0) this.PlaY = 0 + this.Raio;
        if (this.PlaY + this.Raio > 600) this.PlaY = 600 - this.Raio;
        // ve se o player esta em encostando em alguma parede e nao deixa ele passar *William
    }
}
class Boss {
    constructor(Imagem) {
        this.PosX = 100;
        this.PosY = 380;
        this.Raiou = 80;
        this.VeloX = 5;
        this.VeloY = 5;
        this.Vida = 20;
        this.Imagem = Imagem;
    }
    Desenhar() {
        var img = new Image();
        img.src = this.Imagem;
        pincel.drawImage(img, this.PosX - this.Raiou, this.PosY - this.Raiou, this.Raiou * 2, this.Raiou * 2);
        //basicamente, inves de fazer toda altura e largura do boss, e simple so fazer
        // raio*2 pois se raio e o ponto central do circulo ate a borda, logo
        // duas vezes o raio e sua altura e largura *William
    }
    Movimento() {
        this.PosX += this.VeloX;
        this.PosY += this.VeloY;

        if (this.PosX - this.Raiou < 0 || this.PosX + this.Raiou > canvas.width) this.VeloX = - this.VeloX;
        if (this.PosY - this.Raiou < 0 || this.PosY + this.Raiou > canvas.height) this.VeloY = - this.VeloY;
    }
    Diminui() {
        if (this.Vida <= 15) this.Raiou = 60;
        if (this.Vida <= 10) this.Raiou = 40;
        if (this.Vida <= 0) this.Raiou = 0;
    }
}
class Sons {
    constructor(InimiMort, InimigoDano, LevarDano, Musicas) {
        this.MorteInimigo = InimiMort;
        this.DanoInimigo = InimigoDano;
        this.PlayerLevarDano = new Audio(LevarDano);
        this.Musica = new Audio(Musicas);
    }
    TocarSom(NomeDoSomParaTocar) {
        switch (NomeDoSomParaTocar) {
            case "DanoInimigo":
                new Audio(this.DanoInimigo).play();
                break;
            case "MorteInimigo":
                new Audio(this.MorteInimigo).play();
                break;
            case "PlayerLevarDano":
                this.PlayerLevarDano.play();
                break;
            default:
                break;
        }

    }
    ComecarMusica() {
        this.Musica.loop = true;
        this.Musica.play();
    }
}
class Pontos {
    constructor() {
        this.Ponto = 0;
        this.PontoFinal = 0;
        this.intervalo;
    }
    AumentarPontosMatarInimigo(tipo) {
        switch (tipo) {
            case "Orange":
                this.Ponto += 5;
                break;
            case "Grey":
                this.Ponto += 10;
                break;
            case "Yellow":
                this.Ponto += 15;
                break;
            case "Olive":
                this.Ponto += 20;
                break;
            case "Blue":
                this.Ponto += 25;
                break;
            case "Boss":
                this.Ponto += 200;
                break;
        }
    }
    DiminuirPontoTempo() {
        setInterval(() => { this.Ponto--; }, 1000)
    }
}
class Background {
    constructor(Img) {
        this.imagem = Img;
    }
    Desenhar() {
        var Inage = new Image();
        Inage.src = this.imagem;
        pincel.drawImage(Inage, 0, 0, 600, 600);
    }
}
class Mapa {
    constructor(Tamanho, Imagens = []) {
        this.SalaFinal;
        this.Duplicados;
        this.PosAtualMapa = 41;
        this.LugarDentroDoMapaFeito = 41;
        this.JaPassados = [41];
        this.MapaFeito = [41];
        this.PortasAtivas = [];
        this.ImagensPortas = Imagens;
        this.Mapa = Array(Tamanho).fill().map(() => Array(Tamanho).fill());
        for (let i = 0, j = 1; i < Tamanho; i++) {
            for (let h = 0; h < Tamanho; h++) {
                this.Mapa[i][h] = j;
                j++;
            }
        }
        // este for cria uma matrix do tamanho, no caso 9 ou seja temos um mapa 9x9
        // abaixo um representação grafica de como o mapa e caso queira mexer *William
    }
    /*
   [1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9
    10,11,12,13,14,15,16,17,18
    19,20,21,22,23,24,25,26,27
    28,29,30,31,32,33,34,35,36
    37,38,39,40,41,42,43,44,45
    46,47,48,49,50,51,52,53,54
    55,56,57,58,59,60,61,62,63
    64,65,66,67,68,69,70,71,72
    73,74,75,76,77,78,79,80,81]

    Atenção, a movimentação na matrix e a seguinte
    Direita = posição_na_matrix++
    Esquerda = Posição_na_matrix--
    Para cima = Posição_na_matrix -9 ou o tamanho dado
    Para baixo = Posição_na_matrix +9 ou o tamanho dado

    *William

*/
    CriarMapa(TamDoMapa) {
        for (let i = 1; i < TamDoMapa; i++) {
            this.QualLugarIr = Math.floor(Math.random() * 4);
            // aqui aleatorizamos se ele quer is para cima,baixo,esquerda,direita, abaixo um switch que faz o movimento respectivo da decisao*William
            switch (this.QualLugarIr) {
                case 0:
                    // Este caso e o da direita, aqui ele verifica se ele for para direita a coluna vai mudar, no caso ele estaria nao indo para direita mas na verdade
                    // teleportando para outro lado em outra coluna, entao se for a mesma coluna, ele aplica o movimento e atualiza nossa variavel de mapafeito que guarda todas 
                    // posições do mapapronto *William
                    if (this.Mapa.findIndex(h => h.includes(this.PosAtualMapa)) == this.Mapa.findIndex(h => h.includes(this.PosAtualMapa + 1))) {
                        this.PosAtualMapa++;
                        this.MapaFeito[i] = this.PosAtualMapa;
                    }
                    else i--;
                    break;
                case 1:
                    // Este caso e o da esquerda, aqui ele verifica se ele for para direita a coluna vai mudar, no caso ele estaria nao indo para direita mas na verdade
                    // teleportando para outro lado em outra coluna, entao se for a mesma coluna, ele aplica o movimento e atualiza nossa variavel de mapafeito que guarda todas 
                    // posições do mapapronto *William
                    if (this.Mapa.findIndex(h => h.includes(this.PosAtualMapa)) == this.Mapa.findIndex(h => h.includes(this.PosAtualMapa - 1))) {
                        this.PosAtualMapa--;
                        this.MapaFeito[i] = this.PosAtualMapa;
                    }
                    else i--;
                    break;
                case 2:
                    // Este e o caso para cima, ele verifica se formos para cima o numero nao sera negativo, se nao for, ele aplica as mudancas e atualiza
                    // nossa variavel de mapafeito que guarda todas posições do mapapronto *William
                    if (!this.MapaFeito.find(() => this.PosAtualMapa - 9 < 0)) {
                        this.PosAtualMapa -= 9;
                        this.MapaFeito[i] = this.PosAtualMapa;
                    }
                    else i--;
                    break;
                case 3:
                    // Este e o caso para baixo, ele verifica se formos para baixo o numero nao sera maior que 81 que e o numero maximo
                    // se nao for, ele aplica as mudancas e atualiza nossa variavel de mapafeito que guarda todas posições do mapapronto *William
                    if (!this.MapaFeito.find(() => this.PosAtualMapa + 9 > 81)) {
                        this.PosAtualMapa += 9;
                        this.MapaFeito[i] = this.PosAtualMapa;
                    }
                    break;
            }
        }
        for (let i = 0; i < this.MapaFeito.length; i++) {
            this.Duplicados = this.MapaFeito.filter((item, index) => this.MapaFeito.indexOf(item) !== index)
            if (this.Duplicados.length > 0) {
                this.PosAtualMapa = 41;
                this.MapaFeito = [41];
                this.Duplicados = [];
                this.CriarMapa(TamDoMapa);
            }
        }
        //Este e o meu canto da vergonha da programação, eu poderia ter feito isso de duas formas, verificando cada posição possivel e ver se ele podia fazer esse movimento
        //ou ir no pior modo, modo de forca bruta, eu fui no modo bruto, para o numero escolhido de fases sempre for respondido, as posições no MapaFeito nao poderiam ser duplicados
        //isso significaria que teriamos menos N numeros de fases do que foi pedido a ser feito, então, este for verifica se a algum duplicado dentro do array MapaFeito
        //se tiver algum duplicado ele joga tudo que foi feito fora, e recria o mapa do zero ate nao haver nenhum duplicado :(*William
    }
    //Esta função inteira cria o como o mapa sera gerado, explicando de modo simples, pense que temos um sapo no meio exato do mapa
    //este sapo decide aleatoriamente onde ele deve ir(cima,baixo,direita,esquerda), colocamos umas verificações onde ele pode ou nao ir
    //e o limite de movimentos do sapo, isto nos devolve um mapa criado "aleatoriamente", Se quiser entrar no modo mais tecnico de como funciona ler comentarios dentro da função :)*William
    DesenharMinimapa() {
        pincel.fillStyle = "DarkGrey";
        pincel.fillRect(510, 0, 100, 90);
        for (let i = 0; i < this.MapaFeito.length; i++) {

            if (i !== this.MapaFeito.length - 1) {
                pincel.fillStyle = "Black";
            }
            else {
                pincel.fillStyle = "Red"
            }
            for (let h = 0; h < this.JaPassados.length; h++) {
                if (this.MapaFeito[i] == this.JaPassados[h]) {
                    pincel.fillStyle = "LightGrey";
                    // ele verifica para cada item que o player ja ando se eles estao no array MapaFeito assim mudando a cor para cinza claro *William
                }
            }


            pincel.fillRect(510 + (this.Mapa[this.Mapa.findIndex(h => h.includes(this.MapaFeito[i]))].indexOf(this.MapaFeito[i]) * 10), 0 + (this.Mapa.findIndex(h => h.includes(this.MapaFeito[i])) * 10), 10, 10);
            //Esta funcao inteira desenha o mapa na direita em cima da tela, basicamente eu peguei a area do quadrado de 100x100, vi como ficaria a area para cada cubo de 81
            //da por volta de 10, entao cada espaco de cubo tem tamanho 10x10, ele pega a posição de comeco do quadrado que e 500x0 e adicio sua posição do array la
            //exemplo seria o numero 41, ele e a posição 4x4, eu multiplico esses numeros por 10, ficando com 40x40, e adicionos ao posicao de comeco
            //entao ele estara na posição 540x40 com 10x10 de tamanho, a cor deles eu mudo, primeiro eu falo que todos devem ser pintado de preto
            //ai verifico se ele esta pintando o ultimo e mudo a cor para vermelho, a posição do player de verde, e onde o player ja passou para um cinza claro *William

            if (this.MapaFeito[i] == this.LugarDentroDoMapaFeito) {
                pincel.fillStyle = "Green"
                pincel.fillRect(510 + (this.Mapa[this.Mapa.findIndex(h => h.includes(this.MapaFeito[i]))].indexOf(this.MapaFeito[i]) * 10) + 2.5, 0 + (this.Mapa.findIndex(h => h.includes(this.MapaFeito[i])) * 10) + 2.5, 5, 5);
            }
        }
    }
    DesenharPortas() {
        var PD = new Image();
        var PB = new Image();
        var PC = new Image();
        var PE = new Image();
        if (this.PortasAtivas[0]) {
            var PE = new Image();
            PE.src = this.ImagensPortas[0];
            pincel.drawImage(PE, 570, 275, 30, 60);
        }
        if (this.PortasAtivas[1]) {

            var PD = new Image();
            PD.src = this.ImagensPortas[1];
            pincel.drawImage(PD, 0, 275, 30, 60);
        }
        if (this.PortasAtivas[2]) {
            var PC = new Image();
            PC.src = this.ImagensPortas[2];
            pincel.drawImage(PC, 275, 0, 60, 30);
        }
        if (this.PortasAtivas[3]) {
            var PB = new Image();
            PB.src = this.ImagensPortas[3];
            pincel.drawImage(PB, 275, 570, 60, 30);
        }
        //Ve se a porta esta ativada e pinta o lugar da porta *William
        for (let i = 0; i < this.PortasAtivas.length; i++) {
            this.PortasAtivas[i] = false;
        }
        // isto concerteza nao deveria estar aqui, mas foi o unico lugar que achei para colocar, 
        //ele desativa as porta para que elas nao fiquem para sempre ativadas *William
    }
    AtualizarPortas() {
        for (let i = 0; i < this.MapaFeito.length; i++) {
            if (this.MapaFeito[i] == this.LugarDentroDoMapaFeito + 1) this.PortasAtivas[0] = true;
            if (this.MapaFeito[i] == this.LugarDentroDoMapaFeito - 1) this.PortasAtivas[1] = true;
            if (this.MapaFeito[i] == this.LugarDentroDoMapaFeito - 9) this.PortasAtivas[2] = true;
            if (this.MapaFeito[i] == this.LugarDentroDoMapaFeito + 9) this.PortasAtivas[3] = true;
            // verifica se na sala que o player esta tal porta deveria ser ativada ou nao *William
        }
    }
    ColisaoPortas(x, y) {
        if (this.PortasAtivas[0] && x < 575 + 25 && x + 1 > 575 && y < 275 + 50 && y + 1 > 275) {
            this.LugarDentroDoMapaFeito++;
            Jogador.PlaX = 30;
        }
        if (this.PortasAtivas[1] && x < 0 + 25 && x + 1 > 0 && y < 275 + 50 && y + 1 > 275) {
            this.LugarDentroDoMapaFeito--;
            Jogador.PlaX = 570;
        }
        if (this.PortasAtivas[2] && x < 275 + 50 && x + 1 > 275 && y < 0 + 25 && y + 1 > 0) {
            this.LugarDentroDoMapaFeito -= 9;
            Jogador.PlaY = 570;
        }
        if (this.PortasAtivas[3] && x < 275 + 50 && x + 1 > 275 && y < 575 + 25 && y + 1 > 575) {
            this.LugarDentroDoMapaFeito += 9;
            Jogador.PlaY = 30;
        }
        //colisao com as portas, nao tem muito que dizer *William
    }
    VerificarSalaFinal() { this.SalaFinal = this.LugarDentroDoMapaFeito == this.PosAtualMapa ? true : false; }
}

class Inimigo {
    constructor(Velocidade, TipoInimigo) {
        this.IniX = Math.random() * 600;
        this.IniY = Math.random() * 600;
        this.Velo = Velocidade;
        this.DirX = 0;
        this.DirY = 0;
        this.Ang = 0;
        this.Vida;
        this.Imagem;
        switch (TipoInimigo) {
            case 0:
                this.Vida = 2;
                this.Imagem = "Orange"
                break;
            case 1:
                this.Vida = 4;
                this.Imagem = "Grey"
                break;
            case 2:
                this.Vida = 6;
                this.Imagem = "Yellow"
                break;
            case 3:
                this.Vida = 8;
                this.Imagem = "Olive"
                break;
            case 4:
                this.Vida = 10;
                this.Imagem = "Blue"
                break;
        }
    }
    Movimentacao() {
        this.DirecaoDoPlayer();
        this.IniX += this.DirX * this.Velo;
        this.IniY += this.DirY * this.Velo;
        // apartir da diferenca de posição e angulo
        // calculamos o sen e cos do angulo com a posição deseja
        // isso nos retorna uma direção para cada eixo, que assim
        // nos volta uma forma do inimigo sempre ir para cima do Player
        // para mudar a velocidade que vai para cima so mudar a velocidade *William
    }
    Desenhar() {
        pincel.beginPath();
        pincel.fillStyle = this.Imagem;
        pincel.translate(this.IniX, this.IniY);
        //  pincel.rotate(this.Ang);
        pincel.fillRect(0, 0, 20, 20);
        pincel.setTransform(1, 0, 0, 1, 0, 0);
        pincel.closePath();
        // Não consegui fazer o inimigo rotacionar ao ponto de a frente dele 
        // sempre estar olhando para o Player, pesquisar forma de fazer isso
        // de forma melhor, por enquanto ele so rotaciona de modo estranho,
        // se quiser ver isso e so descomentar o pince.rotate ali em cima.
        // Alias uma melhor explicação de como a conta de rotate funciona 
        // abaixo no rotate do ELetron -> aquela bola que fica olhando para o mouse *William 
    }
    AtualizarDados(Angulo) { this.Ang = Angulo; }

    DirecaoDoPlayer() {
        this.DirX = Math.sin(this.Ang);
        this.DirY = Math.cos(this.Ang);
        //Pesquisar mais sobre senos,cossenos e etc, provavelmente sera importate para 
        // nosso projeto bastante conhecimento dos calculos de angulo *William
    }
}
class Bala {
    constructor(Velocidade, x, y, Angulo, Rai, PosicaoNoClick) {
        this.Velo = Velocidade;
        this.BalaX = x;
        this.BalaY = y;
        this.Ang = Angulo;
        this.Raio = Rai;
        this.DirX = 0;
        this.DirY = 0;
        this.CLick = PosicaoNoClick;
        this.Clicou = -1;
        this.AngaTes;
        this.BalaXTes;
        this.BalaYTes;
        // verificar forma de diminuir numero de variaveis, isso pode ser
        // um problema mais a frente do projeto, tanto em organização
        // quanto eficiencia *William

        document.querySelector("canvas").addEventListener("click", () => {
            if (this.Clicou !== 2) this.Clicou++;
            else this.Clicou = 0;

            if (this.Clicou == this.CLick) {
                this.Ang = this.AngaTes;
                this.BalaX = this.BalaXTes;
                this.BalaY = this.BalaYTes;
                this.DirX = 0;
                this.DirY = 0;
                this.DefineDirecao();
            }
            //A cada vez que o mouse e clicado, ele ve se esta na posição da bala destinada a ele
            // se estiver ele vai atualizar seus status assim iniciando todo calculo de angulo e 
            // direção, achar forma de impedir a chamada do tiro se a bala ainda estiver na tela *William
        })
    }
    Desaparecer() {
        this.DirX = 0;
        this.DirY = 0;
        this.BalaX = -300;
        this.BalaY = -300;
        // So uso essa função para toda vez que a bala atingir um inimigo 
        // a bala desaparecer entao ela so dara 1 de dano *William
    }

    Movi() {
        this.BalaX += this.DirX * this.Velo;
        this.BalaY += this.DirY * this.Velo;
    }
    Distancia(x, y) { return Math.hypot(this.BalaX - x, this.BalaY - y); }
    // calculo de distancia e a mesma coisa que calcular a hipotenusa de um triangulo baseado no xy dado menos o atual,
    // entao e mais facil so pedir o calculo de distancia usando hypot da biblioteca math do javascript *William

    Desenhar() {
        var img = new Image();
        img.src = "img/Bala.png";
        pincel.drawImage(img, this.BalaX, this.BalaY, 6, 6);
    }

    DefineDirecao() {
        if (typeof this.Ang != "undefined" && !isNaN(this.Ang)) {
            this.DirX -= Math.sin(this.Ang);
            this.DirY -= Math.cos(this.Ang);
        }
        //Pesquisar mais sobre senos,cossenos e etc, provavelmente sera importate para 
        // nosso projeto bastante conhecimento dos calculos de angulo *William
    }

    AtualizarDados(angulo, x, y) {
        this.AngaTes = angulo;
        this.BalaXTes = x;
        this.BalaYTes = y
    }

}
class Eletron {
    constructor(x, y, Ang, rai) {
        this.Angulo = Ang;
        this.EleX = x;
        this.ELeY = y;
        this.Raio = rai;
    }
    AtualizarDados(angulo, NovaPosX, NovaPosY) {
        this.Angulo = angulo
        this.EleX = NovaPosX;
        this.ELeY = NovaPosY;
    }

    Desenhar() {
        pincel.fillStyle = "Black";
        pincel.translate(this.EleX, this.ELeY);
        pincel.rotate(this.Angulo);
        // Rotaciona ao angulo que calculamos fazendo Mouse.Position - Player.Position que nos leva ao meio termos dos dois
        // assim colocamos esta nova posição em Math.Atan2(), atan2 retorna o arco tangente do coeficiente passado, ou seja
        // pegamos o angulo em radianos entre a posição 0,0 do mapa e a que passamos :) *William 

        var img = new Image();
        img.src = "img/Bala.png";
        pincel.drawImage(img, 7, 7, 10, 10);
        // Colocamos o objeto a distancia de 7,7 que da 9,8994949366, assim ele fica um pouco longe
        // ao rotacionar *William

        pincel.setTransform(1, 0, 0, 1, 0, 0);
        // Seta o transform do mundo para voltar ao normal assim nao rotacionamos o canvas inteiro *William

    }

}
class Texto {
    Escrever(x, y, texto) {
        pincel.font = "20px FonteQuadrada";
        pincel.fillText(texto, x, y);
    }
    async CarregarFontNova() {
        const FonteQuadrada = new FontFace('FonteQuadrada', "url(font/FonteBala.ttf)");
        await FonteQuadrada.load();
        document.fonts.add(FonteQuadrada);
        document.body.classList.add("fonts-loaded");
    }
}
class Temporizador {
    constructor() {
        this.TempoAtual = 0;
    }
    ComecarTempo() {
        setInterval(() => { this.TempoAtual++; }, 1000)
    }
}
class Teclado {
    constructor(NomeMenu) {
        document.addEventListener("keydown", function (evento) {
            switch (evento.key.toLocaleLowerCase()) {
                case "a":
                    Jogador.DirX = -1;
                    break;
                case "d":
                    Jogador.DirX = 1;
                    break;
                case "w":
                    Jogador.DirY = -1;
                    break;
                case "s":
                    Jogador.DirY = 1;
                    break;
                default:
                    break;
            }
        })
        document.addEventListener("keyup", function (evento) {
            switch (evento.key.toLocaleLowerCase()) {
                case "a":
                case "d":
                    Jogador.DirX = 0;
                    break;
                case "w":
                case "s":
                    Jogador.DirY = 0;
                    break;
                //teclas de controle do player *William
                case "arrowdown":
                    if (NomeMenu.Y != 170) NomeMenu.Y += 100;
                    break;
                case "arrowup":
                    if (NomeMenu.Y != 70) NomeMenu.Y -= 100;
                    break;
                case "enter":
                    NomeMenu.EntrarOpcoes();
                    break;
                case "escape":
                    NomeMenu.SairTuto();
                    break;
                default:
                    break;
            }
        })
    }
    //Teclado :)  *William
}
class Mouse {
    constructor() {
        this.MouX;
        this.MouY;
        document.querySelector("canvas").addEventListener("mousemove", evento => {
            this.MouX = evento.clientX - document.querySelector("canvas").offsetLeft;
            this.MouY = evento.clientY - document.querySelector("canvas").offsetTop
            // a todo movimento do mouse no canvas pegamos sua posição *William
        })
    }
}
class TodosMenu {
    constructor() {
        this.Comecou = false;
        this.Start = false;
        this.Tutorial = false;
        this.QualMenuEsta = 0;
        this.Y = 70; // 70 e 170
    }
    SairTuto() {
        this.Tutorial = false
    }
    EntrarOpcoes() {
        if (this.Y == 170) this.Tutorial = true;
        else this.Comecou = true;
       
        
    }
    DesenharSeta() {
        if (!this.Tutorial) pincel.fillRect(190, this.Y, 50, 50);
    }
    DesenharMenuInicio() {
        if (!this.Tutorial) {
            pincel.fillStyle = 'black';
            pincel.fillRect(0, 0, 600, 600);
            pincel.font = "20px FonteQuadrada";
            pincel.fillStyle = 'white';
            pincel.fillText("Jogar!", 250, 100);
            pincel.fillText("Tutorial", 250, 200);
            pincel.font = "15px FonteQuadrada";
            pincel.fillText("Atenção para mexer nas opções você deve usar seta para ", 10, 500);
            pincel.fillText("cima e para baixo e para escolher apenas clicar enter", 10, 520);
            pincel.fillText("onde você desejar", 10, 540);
        }
        else {
            pincel.fillStyle = 'black';
            pincel.fillRect(0, 0, 600, 600);
            pincel.font = "15px FonteQuadrada";
            pincel.fillStyle = 'white';

            pincel.fillText("Neste jogo voce deve matar os inimigos e chegar no fim", 10, 40);
            pincel.fillText("para isso voce deve desviar e atirar nos inimigos", 10, 60);
            pincel.fillText("sua movimentação e no W,S,A e D.", 10, 80);
            pincel.fillText("Você atira com o botão esquerdo do mouse e mira com o mesmo", 10, 100);

            pincel.fillText("Tente não ficar pertos dos inimigos, se não levara dano", 10, 140);
            pincel.fillText("Tente fazer o maximo de pontos e matar o chefe final.", 10, 160);

            pincel.fillText("Você tem um minimap no lado direito superior da tela", 10, 200);
            pincel.fillText("com ele você sabe onde esta e onde deve ir", 10, 220);
            pincel.fillText("e ate mesmo o como o mapa e feito", 10, 240);

          

            pincel.fillText("E o mais importante, se divirta!", 10, 400);

            pincel.fillText("alias, para sair daqui apenas aperte esc", 10, 570);
        }
    }
    VerificarSePararJogo(PLayerNome, BossNome, NomeIntervalo, NomePontos) {
        if (BossNome.Vida <= 0) {
            clearInterval(NomeIntervalo);
            NomePontos.AumentarPontosMatarInimigo("Boss");
            NomePontos.PontoFinal = NomePontos.Ponto;
            this.DesenharFinalBom(NomePontos);
        }
        if (PLayerNome.Vida <= 0) {
            clearInterval(NomeIntervalo);
            NomePontos.PontoFinal = NomePontos.Ponto;
            this.DesenharFinalRuim(NomePontos);
        }
    }
    DesenharFinalBom(NomePontos) {
        pincel.clearRect(0, 0, 600, 600);

        pincel.fillStyle = 'black';
        pincel.fillRect(0, 0, 600, 600);

        pincel.font = "20px FonteQuadrada";
        pincel.fillStyle = 'white';
        pincel.fillText("Voce Ganhou! Sua pontuacao foi: " + NomePontos.PontoFinal, 80, 300);

    }
    DesenharFinalRuim(NomePontos) {
        pincel.clearRect(0, 0, 600, 600);

        pincel.fillStyle = 'black';
        pincel.fillRect(0, 0, 600, 600);

        pincel.font = "20px FonteQuadrada";
        pincel.fillStyle = 'white';
        pincel.fillText("Voce Perdeu! Sua pontuacao foi: " + NomePontos.PontoFinal, 80, 300);

    }
}
// HAHAHA EU NAO AGUENTO MAIS JA ESTA NA LINHA 675 NO TOTAL TENHO 889 LINHAS ESCRITAS HAHAHAHHAHA *William