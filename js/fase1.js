// Importar a próxima cena
import { faselincoln } from "./faselincoln.js";

// Criar a cena 1
var fase1 = new Phaser.Scene("Fase 1");

// Variáveis locais
var bombs;
var bomb;
var terreno;
var ARCas;
var player1;
var player2;
var countdown;
var bot1;
var timer = -1;
var parede;
var voz;
var textt;
var textt2;
var life = 0;
var lifeText;
var trilha;
var jogador;
var corneta;
var botao;
var ice_servers = {
  iceServers: [
    {
      urls: "stun:ifsc.cloud",
    },
    {
      urls: "turns:ifsc.cloud",
      username: "etorresini",
      credential: "matrix",
    },
  ],
};
var sala;
var localConnection;
var remoteConnection;
var midias;
const audio = document.querySelector("audio");

fase1.preload = function () {
  // Tilesets

  this.load.image("transparente", "assets/transparente.png");
  this.load.image("quadra", "assets/Quadra.png");
  this.load.image("bomb", "assets/bomb.png");

  // Tilemap

  // Jogador 1
  this.load.spritesheet("player1", "assets/player1.png", {
    frameWidth: 60,
    frameHeight: 60,
  });

  // Jogador 2
  this.load.spritesheet("player2", "assets/player2.png", {
    frameWidth: 60,
    frameHeight: 60,
  });

  this.load.spritesheet("bot1", "assets/bot1.png", {
    frameWidth: 60,
    frameHeight: 60,
  });
  // Trilha sonora
  this.load.audio("trilha", "assets/cena1.mp3");

  // Efeitos sonoros
  this.load.audio("parede", "assets/parede.mp3");
  this.load.audio("voz", "assets/voz.mp3");
  this.load.audio("corneta", "assets/corneta.mp3");

  // Tela cheia
  this.load.spritesheet("fullscreen", "assets/fullscreen.png", {
    frameWidth: 32,
    frameHeight: 32,
  });

  // D-pad
  this.load.spritesheet("esquerda", "assets/esquerda.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("direita", "assets/direita.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("cima", "assets/cima.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("baixo", "assets/baixo.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
};

fase1.create = function () {
  this.add.image(320, 300, "quadra");
  // Trilha sonora
  trilha = this.sound.add("trilha");
  trilha.play();

    socket.on("connect", () => {
      sala = 1;
      socket.emit("entrar-na-sala", sala);
    });

    socket.on("jogadores", (jogadores) => {
      if (jogadores.primeiro === socket.id) {
        jogador = 1;

        navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => {
            midias = stream;
          })
          .catch((error) => console.log(error));
      } else if (jogadores.segundo === socket.id) {
        jogador = 2;

        navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => {
            midias = stream;
            localConnection = new RTCPeerConnection(ice_servers);
            midias
              .getTracks()
              .forEach((track) => localConnection.addTrack(track, midias));
            localConnection.onicecandidate = ({ candidate }) => {
              candidate && socket.emit("candidate", sala, candidate);
            };
            console.log(midias);
            localConnection.ontrack = ({ streams: [midias] }) => {
              audio.srcObject = midias;
            };
            localConnection
              .createOffer()
              .then((offer) => localConnection.setLocalDescription(offer))
              .then(() => {
                socket.emit("offer", sala, localConnection.localDescription);
              });
          })
          .catch((error) => console.log(error));
      }
      console.log(jogadores);
    });

    socket.on("offer", (socketId, description) => {
      remoteConnection = new RTCPeerConnection(ice_servers);
      midias
        .getTracks()
        .forEach((track) => remoteConnection.addTrack(track, midias));
      remoteConnection.onicecandidate = ({ candidate }) => {
        candidate && socket.emit("candidate", sala, candidate);
      };
      remoteConnection.ontrack = ({ streams: [midias] }) => {
        audio.srcObject = midias;
      };
      remoteConnection
        .setRemoteDescription(description)
        .then(() => remoteConnection.createAnswer())
        .then((answer) => remoteConnection.setLocalDescription(answer))
        .then(() => {
          socket.emit("answer", sala, remoteConnection.localDescription);
        });
    });

    socket.on("answer", (description) => {
      localConnection.setRemoteDescription(description);
    });

    socket.on("candidate", (candidate) => {
      const conn = localConnection || remoteConnection;
      conn.addIceCandidate(new RTCIceCandidate(candidate));
    });
  // Efeitos sonoros
  parede = this.sound.add("parede");
  voz = this.sound.add("voz");
  corneta = this.sound.add("corneta");

  botao = this.add.image(520, 380, "transparente", 0).setInteractive();
  botao.setVisible(false);

  botao.on(
    "pointerdown",
    function () {
      socket.emit("proxima-fase", sala,"faselincoln");
      this.scene.start(faselincoln);
    },
    this
  );

  //

  // Camada 1: terreno

  // Personagens
  player1 = this.physics.add
    .sprite(360, 755, "player1")
    .setImmovable(true)
    .setScale(1.25);
  player2 = this.physics.add
    .sprite(280, 755, "player2")
    .setImmovable(true)
    .setScale(1.25);
  bot1 = this.physics.add
    .sprite(350, 30, "bot1")
    .setImmovable(true)
    .setScale(1.25);

  player1.setSize(25, 35, true);
  player2.setSize(25, 35, true);
  bot1.setSize(35, 45, true);

  var tutu = "Parabéns, você passou esta fase. Boa sorte nas próximas!!";
  textt = this.add.text(80, 505, tutu, {
    fontSize: "16px",
    fill: "#ffffff",
  });
  textt.setVisible(false);

  var skip = "Clique na tela para prosseguir.";
  textt2 = this.add.text(80, 530, skip, {
    fontSize: "14px",
    fill: "#ffffff",
  });
  textt2.setVisible(false);

  // Animação do jogador 1: a esquerda
  this.anims.create({
    key: "left1",
    frames: this.anims.generateFrameNumbers("player1", {
      start: 4,
      end: 6,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // Animação do jogador 2: a esquerda
  this.anims.create({
    key: "left2",
    frames: this.anims.generateFrameNumbers("player2", {
      start: 4,
      end: 6,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // Animação do jogador 1: a direita
  this.anims.create({
    key: "right1",
    frames: this.anims.generateFrameNumbers("player1", {
      start: 7,
      end: 9,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // Animação do player 1 pra baixo
  this.anims.create({
    key: "descendo1",
    frames: this.anims.generateFrameNumbers("player1", {
      start: 1,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // Animação do player 1 pra cima
  this.anims.create({
    key: "subindo1",
    frames: this.anims.generateFrameNumbers("player1", {
      start: 10,
      end: 12,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // Animação do player 2 pra baixo
  this.anims.create({
    key: "descendo2",
    frames: this.anims.generateFrameNumbers("player2", {
      start: 1,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // Animação do player 2 pra cima
  this.anims.create({
    key: "subindo2",
    frames: this.anims.generateFrameNumbers("player2", {
      start: 10,
      end: 12,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // Animação do jogador 2: a direita
  this.anims.create({
    key: "right2",
    frames: this.anims.generateFrameNumbers("player2", {
      start: 7,
      end: 9,
    }),
    frameRate: 10,
    repeat: -1,
  });

  //Animação do bot respirando
  this.anims.create({
    key: "random",
    frames: this.anims.generateFrameNumbers("bot1", {
      start: 0,
      end: 1,
    }),
    frameRate: 2,
    repeat: -1,
  });
  bot1.anims.play("random", true);
  //bot1.body.immovable = true;

  // Animação do jogador 1: ficar parado (e virado para a direita)
  this.anims.create({
    key: "stopped1",
    frames: this.anims.generateFrameNumbers("player1", {
      start: 0,
      end: 0,
    }),
    frameRate: 5,
    repeat: -1,
  });

  // Animação do jogador 2: ficar parado (e virado para a direita)
  this.anims.create({
    key: "stopped2",
    frames: this.anims.generateFrameNumbers("player2", {
      start: 0,
      end: 0,
    }),
    frameRate: 5,
    repeat: -1,
  });

  // Camada 2: ARCas  ARCas = map.createStaticLayer("ARCas", tileset1, 0, 0);

  // Interação por toque de tela (até 2 toques simultâneos: 0 a 1)
  pointer = this.input.addPointer(1);

  // Mostra há quanto tempo estão jogando (a vida dos jogadores)
  lifeText = this.add.text(20, 24, life, {
    fontSize: "32px",
    fill: "#cccccc",
  });
  lifeText.setScrollFactor(0);

  // Mostra na tela o contador

  // Cena (960x960) maior que a tela (800x600)
  this.cameras.main.setBounds(0, 0, 700, 800);
  this.physics.world.setBounds(0, 0, 700, 800);

  // Botão de ativar/desativar tela cheia
  var button = this.add
    .image(640 - 16, 16, "fullscreen", 0)
    .setOrigin(1, 0)
    .setInteractive()
    .setScrollFactor(0);

  // Ao clicar no botão de tela cheia
  button.on(
    "pointerup",
    function () {
      if (this.scale.isFullscreen) {
        button.setFrame(0);
        this.scale.stopFullscreen();
      } else {
        button.setFrame(1);
        this.scale.startFullscreen();
      }
    },
    this
  );

  // Tecla "F" também ativa/desativa tela cheia
  var FKey = this.input.keyboard.addKey("F");
  FKey.on(
    "down",
    function () {
      if (this.scale.isFullscreen) {
        button.setFrame(0);
        this.scale.stopFullscreen();
      } else {
        button.setFrame(1);
        this.scale.startFullscreen();
      }
    },
    this
  );

  // D-pad
  var esquerda = this.add
    .image(490, 275, "esquerda", 0)
    .setInteractive()
    .setScrollFactor(0);
  var direita = this.add
    .image(590, 275, "direita", 0)
    .setInteractive()
    .setScrollFactor(0);
  var cima = this.add
    .image(540, 230, "cima", 0)
    .setInteractive()
    .setScrollFactor(0);
  var baixo = this.add
    .image(540, 320, "baixo", 0)
    .setInteractive()
    .setScrollFactor(0);

  // Conectar no servidor via WebSocket
  socket = io();

  socket.on("proxima-fase", (fase) => {
    if (fase === "fase 2") {
      this.scene.start(fase2);
    }
  });

  // Disparar evento quando jogador entrar na partida
  var self = this;
  var physics = this.physics;
  var cameras = this.cameras;
  var time = this.time;

  socket.on("jogadores", function (jogadores) {
    if (jogadores.primeiro === socket.id) {
      // Define jogador como o primeiro
      jogador = 1;

      // Personagens colidem com os limites da cena
      player1.setCollideWorldBounds(true);

      // Detecção de colisão: terreno
      physics.add.collider(player1, terreno, hitCave, null, this);

      //physics.add.collider(player1, player2, baterEspadas, null, this);

      physics.add.collider(player1, bot1, colbot1, null, this);

      // Detecção de colisão e disparo de evento: ARCas
      physics.add.collider(player1, ARCas, hitARCa, null, this);

      physics.add.collider(player1, bombs, hitBomb, null, this);

      // Câmera seguindo o personagem 1
      cameras.main.startFollow(player1);

      // D-pad: para cada direção já os eventos
      // para tocar a tela ("pointerover")
      // e ao terminar essa interação ("pointerout")
      esquerda.on("pointerover", () => {
        if (timer > 0) {
          esquerda.setFrame(1);
          player1.setVelocityX(-160);
          player1.anims.play("left1", true);
        }
      });
      esquerda.on("pointerout", () => {
        if (timer > 0) {
          esquerda.setFrame(0);
          player1.setVelocityX(0);
          player1.anims.play("stopped1", true);
        }
      });
      direita.on("pointerover", () => {
        if (timer > 0) {
          direita.setFrame(1);
          player1.setVelocityX(160);
          player1.anims.play("right1", true);
        }
      });
      direita.on("pointerout", () => {
        if (timer > 0) {
          direita.setFrame(0);
          player1.setVelocityX(0);
          player1.anims.play("stopped1", true);
        }
      });
      cima.on("pointerover", () => {
        if (timer > 0) {
          cima.setFrame(1);
          player1.setVelocityY(-160);
          player1.anims.play("subindo1", true);
        }
      });
      cima.on("pointerout", () => {
        if (timer > 0) {
          cima.setFrame(0);
          player1.setVelocityY(0);
          player1.anims.play("stopped1", true);
        }
      });
      baixo.on("pointerover", () => {
        if (timer > 0) {
          baixo.setFrame(1);
          player1.setVelocityY(160);
          player1.anims.play("descendo1", true);
        }
      });
      baixo.on("pointerout", () => {
        if (timer > 0) {
          baixo.setFrame(0);
          player1.setVelocityY(0);
          player1.anims.play("stopped1", true);
        }
      });

      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          midias = stream;
        })
        .catch((error) => console.log(error));
    } else if (jogadores.segundo === socket.id) {
      // Define jogador como o segundo
      jogador = 2;

      // Personagens colidem com os limites da cena
      player2.setCollideWorldBounds(true);

      // Detecção de colisão: terreno
      physics.add.collider(player2, terreno, hitCave, null, this);

      // Detecção de colisão e disparo de evento: ARCas
      physics.add.collider(player2, ARCas, hitARCa, null, this);

      physics.add.collider(player2, bot1, colbot1, null, this);

      physics.add.collider(player2, bombs, hitBomb, null, this);

      // Câmera seguindo o personagem 2
      cameras.main.startFollow(player2);

      // D-pad: para cada direção já os eventos
      // para tocar a tela ("pointerover")
      // e ao terminar essa interação ("pointerout")
      esquerda.on("pointerover", () => {
        if (timer > 0) {
          esquerda.setFrame(1);
          player2.setVelocityX(-160);
          player2.anims.play("left2", true);
        }
      });
      esquerda.on("pointerout", () => {
        if (timer > 0) {
          esquerda.setFrame(0);
          player2.setVelocityX(0);
          player2.anims.play("stopped2", true);
        }
      });
      direita.on("pointerover", () => {
        if (timer > 0) {
          direita.setFrame(1);
          player2.setVelocityX(160);
          player2.anims.play("right2", true);
        }
      });
      direita.on("pointerout", () => {
        if (timer > 0) {
          direita.setFrame(0);
          player2.setVelocityX(0);
          player2.anims.play("stopped2", true);
        }
      });
      cima.on("pointerover", () => {
        if (timer > 0) {
          cima.setFrame(1);
          player2.setVelocityY(-160);
          player2.anims.play("subindo2", true);
        }
      });
      cima.on("pointerout", () => {
        if (timer > 0) {
          cima.setFrame(0);
          player2.setVelocityY(0);
          player2.anims.play("stopped2", true);
        }
      });
      baixo.on("pointerover", () => {
        if (timer > 0) {
          baixo.setFrame(1);
          player2.setVelocityY(160);
          player2.anims.play("descendo2", true);
        }
      });
      baixo.on("pointerout", () => {
        if (timer > 0) {
          baixo.setFrame(0);
          player2.setVelocityY(0);
          player2.anims.play("stopped2", true);
        }
      });

      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          midias = stream;
          localConnection = new RTCPeerConnection(ice_servers);
          midias
            .getTracks()
            .forEach((track) => localConnection.addTrack(track, midias));
          localConnection.onicecandidate = ({ candidate }) => {
            candidate &&
              socket.emit("candidate", sala, jogadores.primeiro, candidate);
          };
          console.log(midias);
          localConnection.ontrack = ({ streams: [midias] }) => {
            audio.srcObject = midias;
          };
          localConnection
            .createOffer()
            .then((offer) => localConnection.setLocalDescription(offer))
            .then(() => {
              socket.emit(
                "offer",sala,
                jogadores.primeiro,
                localConnection.localDescription
              );
            });
        })
        .catch((error) => console.log(error));
    }

    // Os dois jogadores estão conectados
    console.log(jogadores);
    if (jogadores.primeiro !== undefined && jogadores.segundo !== undefined) {
      // Contagem regressiva em segundos (1.000 milissegundos)
      timer = 15;
      timedEvent = time.addEvent({
        delay: 1000,
        callback: countdown,
        callbackScope: this,
        loop: true,
      });
    }
  });

  socket.on("offer", (socketId, description) => {
    remoteConnection = new RTCPeerConnection(ice_servers);
    midias
      .getTracks()
      .forEach((track) => remoteConnection.addTrack(track, midias));
    remoteConnection.onicecandidate = ({ candidate }) => {
      candidate && socket.emit("candidate", socketId,sala, candidate);
    };
    remoteConnection.ontrack = ({ streams: [midias] }) => {
      audio.srcObject = midias;
    };
    remoteConnection
      .setRemoteDescription(description)
      .then(() => remoteConnection.createAnswer())
      .then((answer) => remoteConnection.setLocalDescription(answer))
      .then(() => {
        socket.emit("answer", socketId, sala, remoteConnection.localDescription);
      });
  });

  socket.on("answer", (description) => {
    localConnection.setRemoteDescription(description);
  });

  socket.on("candidate", (candidate) => {
    const conn = localConnection || remoteConnection;
    conn.addIceCandidate(new RTCIceCandidate(candidate));
  });

  // Desenhar o outro jogador
  socket.on("desenharOutroJogador", ({ frame, x, y }) => {
    if (jogador === 1) {
      player2.setFrame(frame);
      player2.x = x;
      player2.y = y;
    } else if (jogador === 2) {
      player1.setFrame(frame);
      player1.x = x;
      player1.y = y;
    }
  });
  bombs = this.physics.add.group();

  bomb = bombs.create(20, 580, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(510, 225), 80);
  bomb = bombs.create(200, 16, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-312, 713), 80);
  bomb = bombs.create(201, 336, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(420, -342), 80);
  bomb = bombs.create(520, 169, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-610, 343), 80);
  bomb = bombs.create(200, 116, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(530, -210), 80);
  bomb = bombs.create(680, 126, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(340, 440), 80);
  bomb = bombs.create(310, 236, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-420, 300), 80);
  bomb = bombs.create(120, 826, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(520, -310), 80);
  bomb = bombs.create(530, 116, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-220, 410), 80);
  bomb = bombs.create(20, 580, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(510, 225), 80);
  bomb = bombs.create(200, 16, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-652, 713), 80);
  bomb = bombs.create(201, 336, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(454, -542), 80);
  bomb = bombs.create(520, 169, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-617, 373), 80);
  bomb = bombs.create(200, 116, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(230, -230), 80);
  bomb = bombs.create(680, 126, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(240, 440), 80);
  bomb = bombs.create(310, 236, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-420, 400), 80);
  bomb = bombs.create(120, 826, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(620, -310), 80);
  bomb = bombs.create(330, 116, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-220, 410), 80);
  bomb = bombs.create(680, 126, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(240, 440), 80);
  bomb = bombs.create(310, 236, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-420, 400), 80);
  bomb = bombs.create(120, 826, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(620, -310), 80);
  bomb = bombs.create(330, 116, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-220, 410), 80);
  bomb = bombs.create(310, 236, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-420, 400), 80);
  bomb = bombs.create(120, 826, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(620, -310), 80);
  bomb = bombs.create(330, 116, "bomb");
  bomb.setBounce(0.98);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-220, 410), 80);
};
fase1.update = function (time, delta) {
  if (timer <= 5) {
    let frame;
    // Controle do personagem por direcionais
    if (jogador === 1) {
      // Testa se há animação do oponente,
      // caso contrário envia o primeiro frame (0)
      try {
        frame = player1.anims.getFrameName();
      } catch (e) {
        frame = 0;
      }
      socket.emit("estadoDoJogador",sala, {
        frame: frame,
        x: player1.body.x,
        y: player1.body.y,
      });
    } else if (jogador === 2) {
      // Testa se há animação do oponente,
      // caso contrário envia o primeiro frame (0)
      try {
        frame = player2.anims.getFrameName();
      } catch (e) {
        frame = 0;
      }
      socket.emit("estadoDoJogador", sala,{
        frame: frame,
        x: player2.body.x,
        y: player2.body.y,
      });
    }
  }
};

function hitCave(player, terreno) {
  // Ao passar pela frente da caverna, toca o efeito sonoro
  voz.play();
}

function hitARCa(player, ARCas) {
  // Ao colidir com a parede, toca o efeito sonoro
  parede.play();
}

function colbot1(player, bot) {
  corneta.play();
  textt.setVisible(true);
  textt2.setVisible(true);
  player.setVelocityX(0);
  player.setVelocityY(0);
  botao.setVisible(true);
}

function hitBomb(player, bomb) {
  player1.x = 360;
  player1.y = 755;
  player2.x = 280;
  player2.y = 755;
}

// Exportar a cena
export { fase1 };
