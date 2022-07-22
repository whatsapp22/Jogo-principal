// Importar a próxima cena
import { fase1 } from "./fase1.js";
import { faselincoln } from "./faselincoln.js";
import { fase2 } from "./fase2.js";

// Criar a cena 0
var inicio = new Phaser.Scene("inicio");
var trilha


inicio.preload = function () {
  // Imagem de fundo
  this.load.image("inicio", "assets/Qual vocÊ quer jogar.png");
  this.load.image("supertrunfo", "assets/super trunfo.png");
  this.load.audio("trilha", "assets/cena1.mp3");
  this.load.image("labirinto", "assets/labitinto.png");
  this.load.image("queimada", "assets/queimada.png");
};

inicio.create = function () {
  // Botão com a imagem de fundo
  var fundo = this.add.image(320, 175, "inicio", 0).setInteractive();
  var trunfo = this.add.image(320, 180, "supertrunfo", 0).setInteractive();
  var lab = this.add.image( 135, 183,"labirinto", 0).setInteractive();
  var quei = this.add.image(505, 180, "queimada", 0).setInteractive();

  trilha = this.sound.add("trilha");
  trilha.play();


  // Ao clicar no botão, inicia a cena 1
  trunfo.on(
    "pointerdown",
    function () {
      //this.scale.startFullscreen();
      trilha.stop();
      this.scene.start(faselincoln);
    },
    this
  );
    lab.on(
      "pointerdown",
      function () {
        //this.scale.startFullscreen();
        trilha.stop();
        this.scene.start(fase2);
      },
      this
    );
    quei.on(
      "pointerdown",
      function () {
        //this.scale.startFullscreen();
        trilha.stop();
        this.scene.start(fase1);
      },
      this
    );
};


inicio.update = function () {};

// Exportar a cena
export { inicio };
