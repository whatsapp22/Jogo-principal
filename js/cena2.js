// Importar a próxima cena
import { fase1 } from "./fase1.js";

// Criar a cena 2
var fim = new Phaser.Scene("Fim");

fim.preload = function () {
  // Imagem de fundo
  this.load.image("flor", "assets/cena2.png");
};

fim.create = function () {
  // Botão com a imagem de fundo
  var button = this.add.image(320, 180, "flor", 0).setInteractive();

  // Ao clicar no botão, volta para a cena 1
  button.on(
    "pointerdown",
    function () {
      this.scene.start(fase1);
    },
    this
  );
};

fim.update = function () {};

// Exportar a cena
export { fim };
