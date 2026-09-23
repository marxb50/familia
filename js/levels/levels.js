const LEVELS_DATA = [
  {
    id: 1,
    title: "Fase 1: O Castelo Silencioso & O Mago",
    subtitle: "O reino não tem cores... Procure o bondoso Mago no jardim!",
    playerMode: 'couple',
    colorFilter: "grayscale(100%)",
    isBW: true,
    bgImage: "assets/images/backgrounds/bg_level1.png",
    width: 2600,
    height: 720,
    playerStart: { x: 120, y: 420 },
    platforms: [
      { x: 0, y: 570, width: 2600, height: 150, type: 'stone' },
      { x: 260, y: 450, width: 200, height: 34, type: 'stone' },
      { x: 540, y: 350, width: 220, height: 34, type: 'stone' },
      { x: 860, y: 430, width: 180, height: 34, type: 'stone' },
      { x: 1120, y: 330, width: 240, height: 34, type: 'stone' },
      { x: 1460, y: 440, width: 210, height: 34, type: 'stone' },
      { x: 1760, y: 340, width: 220, height: 34, type: 'stone' },
      { x: 2060, y: 450, width: 200, height: 34, type: 'stone' },
      { x: 740, y: 230, width: 160, height: 30, type: 'stone' },
      { x: 1340, y: 210, width: 160, height: 30, type: 'stone' }
    ],
    collectibles: [
      { type: 'star', x: 330, y: 380 },
      { type: 'star', x: 630, y: 280 },
      { type: 'heart', x: 800, y: 160, colorName: 'green' },
      { type: 'star', x: 920, y: 360 },
      { type: 'star', x: 1220, y: 260 },
      { type: 'heart', x: 1400, y: 140, colorName: 'green' },
      { type: 'star', x: 1540, y: 370 },
      { type: 'star', x: 1840, y: 270 },
      { type: 'heart', x: 2140, y: 380, colorName: 'green' }
    ],
    npc: {
      type: 'mago',
      x: 2360,
      y: 435,
      width: 110,
      height: 145,
      isBW: true,
      name: "Sábio Mago 🔮"
    },
    goalText: "Encontre o Sábio Mago no jardim!"
  },
  {
    id: 2,
    title: "Fase 2: A Estrada dos Girassóis & Matheus Bebê",
    subtitle: "As primeiras cores surgem! Viaje pelos campos para acolher Matheus.",
    playerMode: 'couple',
    colorFilter: "grayscale(25%) sepia(10%)",
    bgImage: "assets/images/backgrounds/bg_level2.png",
    width: 2800,
    height: 720,
    playerStart: { x: 100, y: 420 },
    platforms: [
      { x: 0, y: 570, width: 2800, height: 150, type: 'grass' },
      { x: 280, y: 450, width: 210, height: 34, type: 'grass' },
      { x: 580, y: 350, width: 230, height: 34, type: 'wood' },
      { x: 920, y: 440, width: 200, height: 34, type: 'grass' },
      { x: 1200, y: 330, width: 240, height: 34, type: 'wood' },
      { x: 1540, y: 430, width: 220, height: 34, type: 'grass' },
      { x: 1840, y: 340, width: 220, height: 34, type: 'wood' },
      { x: 2140, y: 440, width: 200, height: 34, type: 'grass' },
      { x: 800, y: 230, width: 170, height: 30, type: 'wood' },
      { x: 1440, y: 220, width: 170, height: 30, type: 'wood' }
    ],
    collectibles: [
      { type: 'heart', x: 360, y: 380, colorName: 'green' },
      { type: 'star', x: 670, y: 280 },
      { type: 'heart', x: 860, y: 160, colorName: 'yellow' },
      { type: 'heart', x: 990, y: 370, colorName: 'green' },
      { type: 'star', x: 1300, y: 260 },
      { type: 'heart', x: 1500, y: 150, colorName: 'yellow' },
      { type: 'heart', x: 1630, y: 360, colorName: 'green' },
      { type: 'star', x: 1920, y: 270 },
      { type: 'heart', x: 2220, y: 370, colorName: 'yellow' }
    ],
    npc: {
      type: 'matheus_stand',
      x: 2500,
      y: 453,
      width: 76,
      height: 117,
      name: "Príncipe Matheus 💙"
    },
    goalText: "Viaje para acolher o pequeno Matheus!"
  },
  {
    id: 3,
    title: "Fase 3: Os Pincéis Mágicos do Príncipe Matheus",
    subtitle: "Matheus colore o reino! Colete pincéis azuis para pintar o mundo ao vivo!",
    playerMode: 'matheus_brush',
    specialMechanic: 'paint_stage',
    colorFilter: "grayscale(100%)",
    bgImage: "assets/images/backgrounds/bg_level3.png",
    width: 2800,
    height: 720,
    playerStart: { x: 120, y: 440 },
    platforms: [
      { x: 0, y: 570, width: 2800, height: 150, type: 'stone' },
      { x: 250, y: 460, width: 210, height: 34, type: 'stone' },
      { x: 550, y: 360, width: 220, height: 34, type: 'wood' },
      { x: 880, y: 450, width: 200, height: 34, type: 'stone' },
      { x: 1180, y: 340, width: 230, height: 34, type: 'wood' },
      { x: 1500, y: 440, width: 220, height: 34, type: 'stone' },
      { x: 1800, y: 350, width: 230, height: 34, type: 'wood' },
      { x: 2100, y: 450, width: 210, height: 34, type: 'stone' },
      { x: 720, y: 240, width: 160, height: 30, type: 'wood' },
      { x: 1360, y: 220, width: 170, height: 30, type: 'wood' }
    ],
    collectibles: [
      { type: 'brush', x: 340, y: 390 },
      { type: 'star', x: 640, y: 290 },
      { type: 'brush', x: 780, y: 170 },
      { type: 'heart', x: 960, y: 380, colorName: 'blue' },
      { type: 'brush', x: 1280, y: 270 },
      { type: 'star', x: 1430, y: 150 },
      { type: 'brush', x: 1590, y: 370 },
      { type: 'heart', x: 1900, y: 280, colorName: 'blue' },
      { type: 'brush', x: 2190, y: 380 }
    ],
    npcs: [
      {
        type: 'king_stand',
        x: 2440,
        y: 421,
        width: 97,
        height: 149,
        name: "Rei 👑"
      },
      {
        type: 'queen_stand',
        x: 2560,
        y: 421,
        width: 97,
        height: 149,
        name: "Rainha 👑"
      }
    ],
    goalText: "Pinte o mundo com os Pincéis Mágicos e mostre sua arte aos pais!"
  },
  {
    id: 4,
    title: "Fase 4: As Colinas da Coragem & A Chegada de Pedro",
    subtitle: "A família avista um nobre cavalo branco se aproximando das colinas!",
    playerMode: 'couple',
    colorFilter: "saturate(115%)",
    bgImage: "assets/images/backgrounds/bg_level4.png",
    width: 2800,
    height: 720,
    playerStart: { x: 100, y: 420 },
    platforms: [
      { x: 0, y: 570, width: 2800, height: 150, type: 'grass' },
      { x: 260, y: 450, width: 210, height: 34, type: 'stone' },
      { x: 560, y: 350, width: 230, height: 34, type: 'grass' },
      { x: 900, y: 440, width: 210, height: 34, type: 'stone' },
      { x: 1200, y: 330, width: 240, height: 34, type: 'wood' },
      { x: 1520, y: 430, width: 220, height: 34, type: 'stone' },
      { x: 1820, y: 340, width: 230, height: 34, type: 'grass' },
      { x: 2140, y: 450, width: 200, height: 34, type: 'stone' },
      { x: 740, y: 220, width: 170, height: 30, type: 'stone' },
      { x: 1380, y: 210, width: 170, height: 30, type: 'stone' }
    ],
    collectibles: [
      { type: 'heart', x: 340, y: 380, colorName: 'blue' },
      { type: 'star', x: 650, y: 280 },
      { type: 'heart', x: 810, y: 150, colorName: 'yellow' },
      { type: 'heart', x: 980, y: 370, colorName: 'blue' },
      { type: 'star', x: 1300, y: 260 },
      { type: 'heart', x: 1450, y: 140, colorName: 'red' },
      { type: 'heart', x: 1610, y: 360, colorName: 'red' },
      { type: 'star', x: 1910, y: 270 },
      { type: 'heart', x: 2220, y: 380, colorName: 'red' }
    ],
    npc: {
      type: 'pedro_horse',
      x: 2450,
      y: 430,
      width: 145,
      height: 140,
      name: "Príncipe Pedro ⚔️"
    },
    goalText: "Avance pelas colinas para acolher o Príncipe Pedro!"
  },
  {
    id: 5,
    title: "Fase 5: A Cavalgada Real do Príncipe Pedro",
    subtitle: "Pedro cavalga velozmente em seu cavalo branco com a espada da coragem!",
    playerMode: 'pedro_horse',
    specialMechanic: 'gallop',
    colorFilter: "saturate(125%)",
    bgImage: "assets/images/backgrounds/bg_level5.png",
    width: 3000,
    height: 720,
    playerStart: { x: 120, y: 430 },
    platforms: [
      { x: 0, y: 570, width: 3000, height: 150, type: 'grass' },
      { x: 300, y: 450, width: 230, height: 34, type: 'wood' },
      { x: 650, y: 360, width: 250, height: 34, type: 'grass' },
      { x: 1020, y: 440, width: 230, height: 34, type: 'wood' },
      { x: 1380, y: 340, width: 260, height: 34, type: 'grass' },
      { x: 1760, y: 440, width: 240, height: 34, type: 'wood' },
      { x: 2120, y: 350, width: 250, height: 34, type: 'grass' },
      { x: 2480, y: 440, width: 230, height: 34, type: 'wood' },
      { x: 820, y: 230, width: 190, height: 30, type: 'wood' },
      { x: 1540, y: 210, width: 200, height: 30, type: 'wood' }
    ],
    collectibles: [
      { type: 'banner', x: 400, y: 380 },
      { type: 'star', x: 750, y: 290 },
      { type: 'banner', x: 900, y: 160 },
      { type: 'heart', x: 1110, y: 370, colorName: 'red' },
      { type: 'banner', x: 1490, y: 270 },
      { type: 'heart', x: 1630, y: 140, colorName: 'red' },
      { type: 'banner', x: 1860, y: 370 },
      { type: 'star', x: 2220, y: 280 },
      { type: 'banner', x: 2580, y: 370 }
    ],
    npc: {
      type: 'matheus_stand',
      x: 2780,
      y: 453,
      width: 76,
      height: 117,
      name: "Príncipe Matheus 💙"
    },
    goalText: "Cavalgue pelas pradarias até o encontro de seu irmão Matheus!"
  },
  {
    id: 6,
    title: "Fase 6: A Floresta Encantada & A Viagem de Trem",
    subtitle: "Siga os trilhos iluminados por lanternas em busca da jovem princesa!",
    playerMode: 'couple',
    colorFilter: "saturate(130%) contrast(105%)",
    bgImage: "assets/images/backgrounds/bg_level6.png",
    width: 2800,
    height: 720,
    playerStart: { x: 100, y: 420 },
    platforms: [
      { x: 0, y: 570, width: 2800, height: 150, type: 'grass' },
      { x: 280, y: 460, width: 220, height: 34, type: 'wood' },
      { x: 600, y: 360, width: 240, height: 34, type: 'grass' },
      { x: 960, y: 450, width: 220, height: 34, type: 'wood' },
      { x: 1260, y: 340, width: 250, height: 34, type: 'grass' },
      { x: 1600, y: 440, width: 230, height: 34, type: 'wood' },
      { x: 1900, y: 350, width: 240, height: 34, type: 'grass' },
      { x: 2220, y: 450, width: 210, height: 34, type: 'wood' },
      { x: 770, y: 240, width: 180, height: 30, type: 'wood' },
      { x: 1420, y: 220, width: 180, height: 30, type: 'wood' }
    ],
    collectibles: [
      { type: 'heart', x: 370, y: 390, colorName: 'pink' },
      { type: 'star', x: 700, y: 290 },
      { type: 'heart', x: 850, y: 170, colorName: 'pink' },
      { type: 'heart', x: 1050, y: 380, colorName: 'pink' },
      { type: 'star', x: 1370, y: 270 },
      { type: 'heart', x: 1500, y: 150, colorName: 'pink' },
      { type: 'heart', x: 1690, y: 370, colorName: 'pink' },
      { type: 'star', x: 2000, y: 280 },
      { type: 'heart', x: 2310, y: 380, colorName: 'pink' }
    ],
    npc: {
      type: 'maria_rosa_stand',
      x: 2500,
      y: 440,
      width: 90,
      height: 130,
      name: "Princesa Maria Rosa 🌸"
    },
    goalText: "Encontre a adorável Princesa Maria Rosa na floresta!"
  },
  {
    id: 7,
    title: "Fase 7: O Grande Baile Real de Maria Rosa",
    subtitle: "Maria Rosa desce as escadarias e dança a valsa imperial no Salão Nobre!",
    playerMode: 'maria_rosa',
    specialMechanic: 'ballroom',
    colorFilter: "saturate(135%) brightness(105%)",
    bgImage: "assets/images/backgrounds/bg_level7.png",
    width: 2800,
    height: 720,
    playerStart: { x: 120, y: 440 },
    platforms: [
      { x: 0, y: 570, width: 2800, height: 150, type: 'stone' },
      { x: 260, y: 460, width: 210, height: 34, type: 'stone' },
      { x: 560, y: 360, width: 230, height: 34, type: 'stone' },
      { x: 880, y: 450, width: 220, height: 34, type: 'stone' },
      { x: 1200, y: 340, width: 240, height: 34, type: 'stone' },
      { x: 1520, y: 440, width: 220, height: 34, type: 'stone' },
      { x: 1820, y: 350, width: 230, height: 34, type: 'stone' },
      { x: 2120, y: 450, width: 210, height: 34, type: 'stone' },
      { x: 720, y: 240, width: 170, height: 30, type: 'stone' },
      { x: 1370, y: 220, width: 170, height: 30, type: 'stone' }
    ],
    collectibles: [
      { type: 'music', x: 350, y: 390 },
      { type: 'star', x: 660, y: 290 },
      { type: 'music', x: 800, y: 170 },
      { type: 'heart', x: 970, y: 380, colorName: 'pink' },
      { type: 'music', x: 1300, y: 270 },
      { type: 'star', x: 1450, y: 150 },
      { type: 'music', x: 1610, y: 370 },
      { type: 'heart', x: 1920, y: 280, colorName: 'pink' },
      { type: 'music', x: 2210, y: 380 }
    ],
    npcs: [
      {
        type: 'matheus_stand',
        x: 2450,
        y: 453,
        width: 76,
        height: 117,
        name: "Príncipe Matheus 💙"
      },
      {
        type: 'pedro_stand',
        x: 2580,
        y: 444,
        width: 76,
        height: 126,
        name: "Príncipe Pedro ⚔️"
      }
    ],
    goalText: "Dance pelo Salão Nobre até seus irmãos para conduzi-la pelo baile!"
  },
  {
    id: 8,
    title: "Fase 8: A Grande Celebração da Adoção",
    subtitle: "Todas as cores e virtudes reunidas! Toda a família unida pelo amor!",
    playerMode: 'couple',
    colorFilter: "saturate(140%) contrast(110%)",
    bgImage: "assets/images/backgrounds/bg_level8.png",
    width: 2800,
    height: 720,
    playerStart: { x: 100, y: 420 },
    platforms: [
      { x: 0, y: 570, width: 2800, height: 150, type: 'stone' },
      { x: 260, y: 450, width: 210, height: 34, type: 'stone' },
      { x: 560, y: 350, width: 240, height: 34, type: 'grass' },
      { x: 910, y: 440, width: 220, height: 34, type: 'stone' },
      { x: 1220, y: 330, width: 250, height: 34, type: 'grass' },
      { x: 1560, y: 430, width: 230, height: 34, type: 'stone' },
      { x: 1870, y: 340, width: 240, height: 34, type: 'grass' },
      { x: 2190, y: 450, width: 210, height: 34, type: 'stone' },
      { x: 740, y: 220, width: 180, height: 30, type: 'stone' },
      { x: 1400, y: 200, width: 180, height: 30, type: 'stone' }
    ],
    collectibles: [
      { type: 'heart', x: 350, y: 380, colorName: 'green' },
      { type: 'heart', x: 660, y: 270, colorName: 'yellow' },
      { type: 'heart', x: 820, y: 150, colorName: 'blue' },
      { type: 'heart', x: 1000, y: 370, colorName: 'red' },
      { type: 'heart', x: 1330, y: 250, colorName: 'pink' },
      { type: 'heart', x: 1480, y: 130, colorName: 'rainbow' },
      { type: 'heart', x: 1660, y: 360, colorName: 'rainbow' },
      { type: 'heart', x: 1980, y: 260, colorName: 'rainbow' }
    ],
    npcs: [
      {
        type: 'matheus_stand',
        x: 2280,
        y: 453,
        width: 76,
        height: 117,
        name: "Príncipe Matheus 💙"
      },
      {
        type: 'pedro_stand',
        x: 2420,
        y: 444,
        width: 76,
        height: 126,
        name: "Príncipe Pedro ⚔️"
      },
      {
        type: 'maria_rosa_stand',
        x: 2560,
        y: 440,
        width: 90,
        height: 130,
        name: "Princesa Maria Rosa 🌸"
      }
    ],
    goalText: "Celebre com toda a família reunida pelo poder da adoção!"
  }
];

window.LEVELS_DATA = LEVELS_DATA;
