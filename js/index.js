// Importar todas as cenas
//import { inicio } from "./inicio.js";
import { fase1 } from "./fase1.js";
import { fase2 } from "./fase2.js";
import { faselincoln } from "./faselincoln.js";
//import { fase3 } from "./fase3.js";
import { inicio } from "./inicio.js";

// Configuração do jogo
const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "game-container",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 640,
    height: 360,
  },
  scene: [inicio,faselincoln,fase1,fase2],
};

// Criar o objeto principal
const game = new Phaser.Game(config);
