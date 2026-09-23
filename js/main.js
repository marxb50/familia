class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    // 16:9 HD virtual canvas resolution
    this.width = 1280;
    this.height = 720;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Subsystems
    this.input = new InputHandler();
    this.audio = typeof AudioManager !== 'undefined' ? new AudioManager() : new SoundManager();
    this.camera = new Camera(this.width, this.height);
    this.particles = new ParticleSystem();

    // State
    this.state = 'CHAR_SELECT'; // 'CHAR_SELECT', 'CUTSCENE', 'PLAYING', 'STAGE_CLEAR', 'VICTORY'
    this.chosenLeader = 'king'; // 'king' or 'queen'
    this.currentLevelIndex = 0;
    this.currentLevel = null;
    this.couple = null;
    this.platforms = [];
    this.collectibles = [];
    this.npcs = [];
    this.npc = null;
    this.lastTime = 0;
    this.bgImage = new Image();

    // Special mechanics
    this.matheusPaintSaturation = 0.0;
    this.isPS1Mode = false;

    this.init();
  }

  init() {
    this.initRoyalCouple();
    this.setupUI();

    // URL Query Parameter check for direct testing (e.g. ?phase=3, ?fase=3, ?direct=1, ?victory=1, ?ps1=1)
    const urlParams = new URLSearchParams(window.location.search);
    const paramPhase = urlParams.get('phase') || urlParams.get('fase');
    const paramCutscene = urlParams.get('cutscene');
    const paramDirect = urlParams.get('direct');
    const paramVictory = urlParams.get('victory');
    const paramX = urlParams.get('x');
    const paramChar = urlParams.get('char');
    const paramPS1 = urlParams.get('ps1');

    if (paramChar === 'queen' || paramChar === 'rainha') {
      this.chosenLeader = 'queen';
    }

    if (paramPS1 === '1' || paramPS1 === 'true') {
      this.togglePS1Mode();
    }

    if (paramVictory === '1' || paramVictory === 'true') {
      const charSelect = document.getElementById('screen-char-select');
      if (charSelect) charSelect.classList.add('hidden');
      this.currentLevelIndex = 7;
      this.showVictoryScreen();
      return;
    }

    if (paramCutscene) {
      const charSelect = document.getElementById('screen-char-select');
      if (charSelect) charSelect.classList.add('hidden');
      this.initRoyalCouple();
      this.showCutscene(Math.max(0, parseInt(paramCutscene) - 1));
    } else if (paramPhase) {
      const charSelect = document.getElementById('screen-char-select');
      if (charSelect) charSelect.classList.add('hidden');
      this.initRoyalCouple();
      this.currentLevelIndex = Math.max(0, Math.min(LEVELS_DATA.length - 1, parseInt(paramPhase) - 1));
      
      if (paramDirect === '1' || paramDirect === 'true') {
        this.startCurrentLevel();
      } else {
        this.showCutscene(this.currentLevelIndex);
      }

      if (paramX && this.couple && this.couple.leader) {
        this.couple.leader.x = parseFloat(paramX);
        if (this.couple.companion) {
          this.couple.companion.x = parseFloat(paramX) - 55;
        }
        this.camera.x = Math.max(0, Math.min(this.couple.leader.x - this.width / 2, (this.currentLevel ? this.currentLevel.width : 2800) - this.width));
      }
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  setupUI() {
    const cardKing = document.getElementById('card-king');
    const cardQueen = document.getElementById('card-queen');
    const btnConfirm = document.getElementById('btn-confirm-char');

    if (cardKing && cardQueen) {
      cardKing.addEventListener('click', () => {
        this.chosenLeader = 'king';
        cardKing.classList.add('selected');
        cardQueen.classList.remove('selected');
        this.audio.playClick();
      });

      cardQueen.addEventListener('click', () => {
        this.chosenLeader = 'queen';
        cardQueen.classList.add('selected');
        cardKing.classList.remove('selected');
        this.audio.playClick();
      });
    }

    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        this.audio.init();
        this.audio.playClick();
        document.getElementById('screen-char-select').classList.add('hidden');
        this.initRoyalCouple();
        this.showCutscene(0);
      });
    }

    // Cutscene buttons
    const btnStartLevel = document.getElementById('btn-start-level');
    const btnReplayVoice = document.getElementById('btn-replay-voice');

    if (btnStartLevel) {
      btnStartLevel.addEventListener('click', () => {
        this.audio.playClick();
        this.audio.stopNarration();
        document.getElementById('screen-cutscene').classList.add('hidden');
        this.startCurrentLevel();
      });
    }

    if (btnReplayVoice) {
      btnReplayVoice.addEventListener('click', () => {
        this.audio.playClick();
        this.audio.playNarration(this.currentLevelIndex + 1);
      });
    }

    // HUD Leader switch
    const btnHudSwitch = document.getElementById('btn-hud-switch');
    if (btnHudSwitch) {
      btnHudSwitch.addEventListener('click', () => {
        if (this.couple && !this.couple.isSingle) {
          this.couple.switchLeader();
          this.camera.setTarget(this.couple.leader);
          this.updateHUD();
        }
      });
    }

    // Mute buttons (HUD, Mobile, Arcade PC)
    const updateSoundIcons = (isMuted) => {
      const text = isMuted ? '🔇' : '🔊';
      if (document.getElementById('btn-hud-mute')) document.getElementById('btn-hud-mute').textContent = text;
      if (document.getElementById('btnMobileSound')) document.getElementById('btnMobileSound').textContent = text;
      if (document.getElementById('btnSound')) document.getElementById('btnSound').textContent = text + ' Som';
    };

    const handleSoundToggle = () => {
      const isMuted = this.audio.toggleMute();
      updateSoundIcons(isMuted);
    };

    ['btn-hud-mute', 'btnMobileSound', 'btnSound'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', handleSoundToggle);
    });

    // Fullscreen buttons
    ['btnMobileFullscreen', 'btnFullscreen'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => this.toggleFullscreen());
    });

    // Restart buttons
    ['btnMobileRestart', 'btnRestart'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => this.restartLevel());
    });

    // PS1 Mode Toggle Buttons
    ['btn-toggle-ps1', 'btnMobilePS1'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => this.togglePS1Mode());
    });

    // Global keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'p' || e.key === 'P') {
        this.togglePS1Mode();
      } else if (e.key === 'm' || e.key === 'M') {
        handleSoundToggle();
      } else if (e.key === 'f' || e.key === 'F') {
        this.toggleFullscreen();
      } else if (e.key === 'r' || e.key === 'R') {
        if (this.state === 'PLAYING') this.restartLevel();
      }
    });

    // Victory play again button
    const btnPlayAgain = document.getElementById('btn-play-again');
    if (btnPlayAgain) {
      btnPlayAgain.addEventListener('click', () => {
        this.audio.playClick();
        const victoryScreen = document.getElementById('screen-victory');
        if (victoryScreen) victoryScreen.classList.add('hidden');
        this.resetColorsHUD();
        this.currentLevelIndex = 0;
        this.initRoyalCouple();
        this.showCutscene(0);
      });
    }
  }

  toggleFullscreen() {
    const doc = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (doc.requestFullscreen) doc.requestFullscreen().catch(() => {});
      else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  }

  restartLevel() {
    this.audio.playClick();
    this.startCurrentLevel();
  }

  togglePS1Mode() {
    this.isPS1Mode = !this.isPS1Mode;
    const container = document.getElementById('game-container') || document.getElementById('mobileWrapper') || document.getElementById('arcadeContainer');
    const ps1Btn = document.getElementById('btn-toggle-ps1');
    const mobilePs1Btn = document.getElementById('btnMobilePS1');
    const overlay = document.getElementById('ps1-overlay');

    if (this.isPS1Mode) {
      if (container) container.classList.add('ps1-active');
      if (overlay) overlay.classList.remove('hidden');
      if (ps1Btn) ps1Btn.textContent = '🎮 PS1: ON';
      if (mobilePs1Btn) mobilePs1Btn.style.color = '#00ffcc';
      if (this.audio) this.audio.playSwitch();
    } else {
      if (container) container.classList.remove('ps1-active');
      if (overlay) overlay.classList.add('hidden');
      if (ps1Btn) ps1Btn.textContent = '🎮 PS1: OFF';
      if (mobilePs1Btn) mobilePs1Btn.style.color = '';
    }
  }

  initRoyalCouple() {
    this.couple = new PlayerParty('couple', this.chosenLeader, 120, 440);
    this.camera.setTarget(this.couple.leader);
  }

  updateHUD() {
    const leaderAvatar = document.getElementById('hud-leader-img');
    const leaderName = document.getElementById('hud-leader-name');
    const companionAvatar = document.getElementById('hud-companion-img');
    const hudSwitchPanel = document.getElementById('btn-hud-switch');

    if (!this.couple) return;

    if (this.couple.isSingle) {
      // Child solo stage HUD badge
      const childData = {
        'matheus_brush': {
          avatar: 'assets/images/characters/matheus_cheer1.png',
          name: 'Matheus 💙'
        },
        'pedro_horse': {
          avatar: 'assets/images/characters/pedro_stand.png',
          name: 'Pedro ⚔️'
        },
        'maria_rosa': {
          avatar: 'assets/images/characters/maria_rosa_wave.png',
          name: 'Maria Rosa 🌸'
        }
      };
      const info = childData[this.couple.mode] || { avatar: 'assets/images/characters/matheus_cheer1.png', name: 'Príncipe' };
      if (leaderAvatar) leaderAvatar.src = info.avatar;
      if (leaderName) leaderName.textContent = info.name;
      if (companionAvatar) companionAvatar.style.display = 'none';
      if (hudSwitchPanel) {
        hudSwitchPanel.style.cursor = 'default';
        hudSwitchPanel.title = info.name;
      }
    } else {
      // Royal Couple HUD badge
      const isKing = this.couple.leaderType === 'king';
      const isBW = this.currentLevelIndex === 0;

      const kingSrc = isBW ? 'assets/images/characters/king_idle_bw.png' : 'assets/images/characters/king_idle.png';
      const queenSrc = isBW ? 'assets/images/characters/queen_idle_bw.png' : 'assets/images/characters/queen_idle.png';

      if (leaderAvatar) leaderAvatar.src = isKing ? kingSrc : queenSrc;
      if (leaderName) leaderName.textContent = isKing ? 'Rei' : 'Rainha';
      if (companionAvatar) {
        companionAvatar.style.display = 'inline-block';
        companionAvatar.src = isKing ? queenSrc : kingSrc;
      }
      if (hudSwitchPanel) {
        hudSwitchPanel.style.cursor = 'pointer';
        hudSwitchPanel.title = "Clique ou aperte 'C' para alternar o líder";
      }
    }
  }

  showCutscene(levelIdx) {
    this.state = 'CUTSCENE';
    this.currentLevelIndex = levelIdx;
    const levelData = LEVELS_DATA[levelIdx];
    const cutsceneScreen = document.getElementById('screen-cutscene');

    document.getElementById('cutscene-art-img').src = `assets/images/cutscenes/cutscene_${levelIdx + 1}.png`;
    document.getElementById('cutscene-tag').textContent = `Capítulo ${levelIdx + 1} de 8`;
    document.getElementById('cutscene-heading').textContent = levelData.title;

    const cutsceneTexts = [
      // 1. O Castelo Silencioso & O Mago
      "Era uma vez, em um reino distante, um rei e uma rainha que moravam em um lindo castelo. Tudo parecia perfeito, mas eles sentiam que faltava algo especial. Aquele castelo não tinha cores, pois não havia crianças no lugar. Em uma noite de luar, o Mago notou a tristeza e resolveu ajudar. Caminhem juntos pelo castelo cinzento e encontrem o Mago para pedir a bênção de um filho.",
      
      // 2. A Estrada dos Girassóis & Matheus Bebê
      "O bondoso Mago enviou uma carta mágica para o castelo: um príncipe teria nascido e precisava de uma família! O rei e a rainha não pensaram duas vezes e pediram para aprontar a carruagem para uma longa viagem. Avancem pela estrada florida até encontrar o bebê Matheus, que significa Presente de Deus!",
      
      // 3. Os Pincéis Mágicos de Matheus
      "O pequeno Matheus cresceu e trouxe as primeiras cores e brincadeiras ao castelo! Com sua criatividade e alegria, ele descobriu pincéis encantados e potes de tinta azul real. Agora é a vez de Matheus! Salte pelo ateliê e jardins do castelo recolhendo os pincéis mágicos para pintar o reino ao vivo com a cor da confiança e da segurança!",
      
      // 4. As Colinas da Coragem & A Carta de Pedro
      "Anos depois, o príncipe Matheus perguntava ao pai quando novas cores chegariam. E em uma manhã de sol quente, outra carta do Mago anunciou que um príncipe teria nascido e estava em seu cavalo à procura de um lar feliz. Todas as tardes a família esperava na torre. Caminhem pelas colinas da coragem para avistar o cavalo branco!",
      
      // 5. A Cavalgada Real de Pedro
      "Pedro chegou trazendo consigo a força, a resistência e a espada da coragem! O pequeno príncipe ama cavalgar velozmente em seu cavalo branco pelas pradarias do reino. Agora é a sua vez com Pedro! Cavalgue velozmente, salte cercas e desfiladeiros, brandindo a espada para espalhar a cor vermelha da bravura por todo o castelo!",
      
      // 6. A Floresta Encantada & O Trem
      "O castelo agora brilhava com as brincadeiras dos dois príncipes, mas faltava o brilho especial que apenas uma princesa poderia trazer. Histórias corriam de que uma jovenzinha misteriosa viajava de trem em busca de amor e se perdera na floresta encantada. O rei decretou uma grande busca. Atravessem o bosque encantado para resgatar a bela princesa!",
      
      // 7. O Grande Baile Real de Maria Rosa
      "Após meses de busca, Maria Rosa foi encontrada: uma moça de radiante beleza, com a coroa mais linda do reino e um anel com seu nome cravado! O rei e a rainha decretaram uma semana de festas. Agora é a vez de Maria Rosa! Desça a escadaria do Grande Baile Real, dance pelo salão com seus passos de valsa e piruetas, sendo conduzida por seus irmãos Matheus e Pedro!",
      
      // 8. A Grande Celebração da Adoção
      "Toda a família está unida pelo amor! Cada cor agora brilha em sua plenitude: o verde do equilíbrio, o amarelo da esperança, o azul da confiança, o vermelho da coragem e o rosa da ternura. Uma verdadeira família nasce do amor, do carinho e do afeto... porque filhos não nascem só da barriga, mas também nascem no coração. Esse é o poder da adoção! Vamos celebrar no pátio real a vitória da nossa família!"
    ];

    document.getElementById('cutscene-desc').textContent = cutsceneTexts[levelIdx];
    cutsceneScreen.classList.remove('hidden');

    this.audio.playNarration(levelIdx + 1);
  }

  startCurrentLevel() {
    this.state = 'PLAYING';
    const data = LEVELS_DATA[this.currentLevelIndex];
    this.currentLevel = data;

    // Player mode configuration (couple or specific child)
    const mode = data.playerMode || 'couple';
    this.couple.setMode(mode, this.chosenLeader, data.playerStart.x, data.playerStart.y);

    // Filter & B&W mode setup
    if (data.specialMechanic === 'paint_stage') {
      this.matheusPaintSaturation = 0.0;
      this.couple.setBWMode(true);
      this.canvas.style.filter = 'grayscale(100%)';
    } else if (data.isBW) {
      this.couple.setBWMode(true);
      this.canvas.style.filter = data.colorFilter || 'grayscale(100%)';
    } else {
      this.couple.setBWMode(false);
      this.canvas.style.filter = data.colorFilter || 'none';
    }

    this.updateHUD();

    // Update HUD phase title
    document.getElementById('hud-phase-title').textContent = data.title;

    // Load panoramic background
    this.bgImage = new Image();
    this.bgImage.src = data.bgImage;

    // Setup bounds and camera
    this.camera.setLevelBounds(data.width, data.height);
    this.camera.setTarget(this.couple.leader);

    // Setup platforms
    this.platforms = data.platforms.map(p => ({ ...p }));

    // Setup collectibles
    this.collectibles = data.collectibles.map(c => new Collectible(c.type, c.x, c.y, c.colorName));

    // Setup NPCs
    this.npcs = [];
    if (data.npcs && Array.isArray(data.npcs)) {
      this.npcs = data.npcs.map(n => new NPC(n.type, n.x, n.y, n.width, n.height, data.isBW || false, n.name));
    } else if (data.npc) {
      this.npcs = [new NPC(data.npc.type, data.npc.x, data.npc.y, data.npc.width, data.npc.height, data.isBW || false, data.npc.name)];
    }
    this.npc = this.npcs[0] || null;
  }

  resetColorsHUD() {
    ['green', 'yellow', 'blue', 'red', 'pink'].forEach(color => {
      const el = document.getElementById(`hud-heart-${color}`);
      if (el) el.classList.remove('active');
    });
  }

  unlockColorHUD(colorName) {
    const el = document.getElementById(`hud-heart-${colorName}`);
    if (el) el.classList.add('active');
  }

  onGoalReached() {
    this.state = 'STAGE_CLEAR';
    this.audio.playVictoryFanfare();
    this.particles.spawnConfetti(this.width, this.height);

    // Unlocks corresponding virtues and child colors in the HUD across 8 stages
    const stageUnlocks = {
      0: ['green'],                                   // Fase 1: Verde (O Mago e o Equilíbrio)
      1: ['yellow'],                                  // Fase 2: Amarelo (Matheus e a Esperança)
      2: ['blue'],                                    // Fase 3: Azul (Matheus pinta o mundo com Confiança)
      3: ['yellow', 'blue'],                          // Fase 4: O Amor volta a florescer
      4: ['red'],                                     // Fase 5: Vermelho (Pedro e a Coragem a cavalo)
      5: ['pink'],                                    // Fase 6: Rosa (Maria Rosa encontrada)
      6: ['pink'],                                    // Fase 7: Rosa e Dourado (O Grande Baile)
      7: ['green', 'yellow', 'blue', 'red', 'pink']   // Fase 8: Todas as 5 Virtudes Consagradas
    };
    const colors = stageUnlocks[this.currentLevelIndex] || [];
    colors.forEach(c => this.unlockColorHUD(c));

    setTimeout(() => {
      if (this.currentLevelIndex < LEVELS_DATA.length - 1) {
        this.showCutscene(this.currentLevelIndex + 1);
      } else {
        this.showVictoryScreen();
      }
    }, 2400);
  }

  showVictoryScreen() {
    this.state = 'VICTORY';
    this.canvas.style.filter = 'saturate(180%) brightness(105%)';
    const victoryScreen = document.getElementById('screen-victory');
    victoryScreen.classList.remove('hidden');
    this.particles.spawnConfetti(this.width, this.height);
  }

  loop(timestamp) {
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update();
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update() {
    if (this.state === 'PLAYING') {
      if (this.input.switchPressed && !this.couple.isSingle) {
        this.couple.switchLeader();
        this.camera.setTarget(this.couple.leader);
        this.updateHUD();
      }

      this.couple.update(this.input, this.platforms);

      // Keep active characters inside level bounds
      const activeChars = this.couple.isSingle ? [this.couple.leader] : [this.couple.king, this.couple.queen];
      activeChars.forEach(char => {
        if (!char) return;
        if (char.x < 0) char.x = 0;
        if (char.x > this.currentLevel.width - char.width) char.x = this.currentLevel.width - char.width;
        if (char.y > 640) {
          char.y = 440;
          char.vy = 0;
        }
      });

      // Update collectibles
      this.collectibles.forEach(col => {
        if (!col.collected) {
          col.update();
          const touched = this.couple.isSingle 
            ? Physics.checkAABB(this.couple.leader, col)
            : (Physics.checkAABB(this.couple.leader, col) || Physics.checkAABB(this.couple.companion, col));

          if (touched) {
            col.collected = true;
            this.audio.playHeartCollect(col.colorName || 'blue');
            this.particles.spawnHeartSparkle(col.x + col.width / 2, col.y + col.height / 2, col.colorName || 'blue');

            if (col.type === 'heart') {
              this.unlockColorHUD(col.colorName);
            }

            // Matheus Real-Time Painting Mechanic (Fase 3)
            if (col.type === 'brush' && this.currentLevel && this.currentLevel.specialMechanic === 'paint_stage') {
              this.matheusPaintSaturation = Math.min(1.0, this.matheusPaintSaturation + 0.22);
              const sat = Math.round(this.matheusPaintSaturation * 140);
              const gray = Math.round((1.0 - this.matheusPaintSaturation) * 100);
              this.canvas.style.filter = `grayscale(${gray}%) saturate(${sat}%)`;

              if (this.matheusPaintSaturation >= 0.44 && this.couple.leader.isBW) {
                this.couple.leader.setBWMode(false); // Matheus blossoms into full color!
              }
            }
          }
        }
      });

      // Update NPCs
      if (this.npcs && this.npcs.length > 0) {
        for (const npc of this.npcs) {
          npc.update();
          if (Physics.checkAABB(this.couple.leader, npc)) {
            this.onGoalReached();
            break;
          }
        }
      }

      // Update camera
      this.camera.update();
    }

    this.particles.update();
    this.input.clearPresses();
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.state === 'PLAYING' || this.state === 'STAGE_CLEAR') {
      // Wide Panoramic Parallax Background (Ampla, Contínua e 100% Sem Cortes)
      if (this.bgImage && this.bgImage.complete && this.bgImage.naturalWidth > 0) {
        const maxCamX = Math.max(1, (this.currentLevel ? this.currentLevel.width : 2800) - this.width);
        const progress = Math.max(0, Math.min(1, this.camera.x / maxCamX));

        // Expansive panoramic width: smoothly maps across the full level without tiling
        const bgW = Math.round(this.width + maxCamX * 0.55);
        const bgX = -Math.round(progress * (bgW - this.width));

        this.ctx.drawImage(this.bgImage, bgX, 0, bgW, this.height);
      } else {
        this.ctx.fillStyle = '#87ceeb';
        this.ctx.fillRect(0, 0, this.width, this.height);
      }

      // Camera transformed world
      this.ctx.save();
      this.ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

      // Draw platforms
      this.drawPlatforms();

      // Draw collectibles
      this.collectibles.forEach(col => col.draw(this.ctx));

      // Draw NPCs
      if (this.npcs && this.npcs.length > 0) {
        this.npcs.forEach(npc => npc.draw(this.ctx));
      }

      // Draw Goal line if final stage
      if (this.currentLevelIndex === 7) {
        this.drawGoalCelebration(this.ctx);
      }

      // Draw Active Player / Royal Couple
      this.couple.draw(this.ctx);

      // Draw Particles
      this.particles.draw(this.ctx);

      this.ctx.restore();

      // In-game dynamic tutorial / goal text at bottom center
      if (this.currentLevel && this.currentLevel.goalText) {
        this.ctx.save();
        this.ctx.font = 'bold 16px Comfortaa, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.lineWidth = 3.5;
        this.ctx.strokeText(this.currentLevel.goalText, this.width / 2, this.height - 30);
        this.ctx.fillText(this.currentLevel.goalText, this.width / 2, this.height - 30);
        this.ctx.restore();
      }
    }
  }

  drawPlatforms() {
    this.platforms.forEach(p => {
      const tileImg = (Physics.TILE_IMAGES && Physics.TILE_IMAGES[p.type]) ? Physics.TILE_IMAGES[p.type] : null;
      const tileSize = Physics.TILE_SIZE || 40;

      if (tileImg && tileImg.complete && tileImg.naturalWidth > 0) {
        const cols = Math.ceil(p.width / tileSize);
        const rows = Math.ceil(p.height / tileSize);

        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const tx = p.x + c * tileSize;
            const ty = p.y + r * tileSize;
            const tw = Math.min(tileSize, p.x + p.width - tx);
            const th = Math.min(tileSize, p.y + p.height - ty);

            this.ctx.drawImage(tileImg, 0, 0, tw, th, tx, ty, tw, th);
          }
        }
      } else {
        const fillStyles = {
          'stone': '#607d8b',
          'grass': '#4caf50',
          'wood': '#8d6e63'
        };
        this.ctx.fillStyle = fillStyles[p.type] || '#555';
        this.ctx.fillRect(p.x, p.y, p.width, p.height);

        // Stylized top highlight
        this.ctx.fillStyle = p.type === 'grass' ? '#81c784' : (p.type === 'stone' ? '#90a4ae' : '#a1887f');
        this.ctx.fillRect(p.x, p.y, p.width, 4);
      }
    });
  }

  drawGoalCelebration(ctx) {
    const endX = 2200;
    ctx.save();
    ctx.font = 'bold 19px Comfortaa, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffeb3b';
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 4;
    ctx.strokeText('👑 TODOS OS TRÊS FILHOS DO CORAÇÃO 👑', endX + 220, 360);
    ctx.fillText('👑 TODOS OS TRÊS FILHOS DO CORAÇÃO 👑', endX + 220, 360);
    ctx.restore();
  }
}

// Start game instance on page load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
