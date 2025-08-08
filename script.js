const bosses = [
  { stage: 10, name: 'devilmon', hp: 5000, speed: 1.2, size: 80 },
  { stage: 20, name: 'etemon', hp: 15000, speed: 1.5, size: 85 },
  { stage: 30, name: 'myotismon', hp: 30000, speed: 1.4, size: 90 },
  { stage: 40, name: 'venommyotismon', hp: 50000, speed: 1.0, size: 120 },
  { stage: 50, name: 'metalsidramon', hp: 75000, speed: 2.0, size: 95 },
  { stage: 60, name: 'powerdramon', hp: 100000, speed: 1.2, size: 110 },
  { stage: 70, name: 'pinocchimon', hp: 120000, speed: 1.8, size: 80 },
  { stage: 80, name: 'piedmon', hp: 150000, speed: 1.6, size: 90 },
  { stage: 90, name: 'apocarmon', hp: 250000, speed: 1.0, size: 150 },
];

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingEnabled = false;

  // --- UI Elements ---
  const goldEl = document.getElementById('gold');
  const lifeEl = document.getElementById('life');
  const stageEl = document.getElementById('stage');
  const waveTimerEl = document.getElementById('wave-timer');
  const buyUnitBtn = document.getElementById('buy-unit-btn');
  const startWaveBtn = document.getElementById('start-wave-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const unitDetailsEl = document.getElementById('unit-details');
  const unitDetailImgEl = document.getElementById('unit-detail-img');
  const unitDetailNameEl = document.getElementById('unit-detail-name');
  // const unitDetailLevelEl = document.getElementById('unit-detail-level'); // 레벨 표시 제거
  const unitDetailKillsEl = document.getElementById('unit-detail-kills');
  const unitDetailReqEl = document.getElementById('unit-detail-req');
  const evolveBtn = document.getElementById('evolve-btn');
  const dismissBtn = document.getElementById('dismiss-btn');
  const crestSlots = document.querySelectorAll('.crest-slot');
  const waveTimeLimitEl = document.getElementById('wave-time-limit');
  const evolutionAnimationEl = document.getElementById('evolution-animation');
  const evolutionVideoEl = document.getElementById('evolution-video');
  const skipEvolutionCheckbox = document.getElementById(
    'skip-evolution-checkbox'
  );
  const restartBtn = document.getElementById('restart-btn');
  const shopBtn = document.getElementById('shop-btn');
  const shopModal = document.getElementById('shop-modal');
  const closeShopBtn = shopModal.querySelector('.close-button');
  const shopGoldEl = document.getElementById('shop-gold');
  const buyCrestBtns = document.querySelectorAll('.buy-crest-btn');
  const playerInventoryEl = document.getElementById('player-inventory');
  const inventoryCrestsEl = document.getElementById('inventory-crests');
  const selectedCrestInfoEl = document.getElementById('selected-crest-info');
  const inventoryItems = document.querySelectorAll('.inventory-item');

  // --- Image Loading ---
  const images = {};
  const imageSources = {
    // Agumon
    agumon: 'img/agumon/agumon.png',
    greymon: 'img/agumon/greymon.png',
    metalgreymon: 'img/agumon/metalgreymon.png',
    wargreymon: 'img/agumon/wargreymon.png',
    // Palmon
    palmon: 'img/Palmon/Palmon.webp',
    needmon: 'img/Palmon/Needmon.webp',
    lillimon: 'img/Palmon/Lillimon.webp',
    rosemon: 'img/Palmon/Rosemon.webp',
    // Papimon
    papimon: 'img/Papimon/Papimon.webp',
    garummon: 'img/Papimon/garummon.png',
    wargarummon: 'img/Papimon/Wargarummon.webp',
    metalgarummon: 'img/Papimon/metalgarummon.webp',
    // Patamon
    patamon: 'img/Patamon/Patamon.webp',
    angelmon: 'img/Patamon/Angelmon.webp',
    holyangelmon: 'img/Patamon/Holyangelmon.webp',
    seraphimon: 'img/Patamon/Seraphimon.webp',
    // Piyomon
    piyomon: 'img/Piyomon/Piyomon.webp',
    vudramon: 'img/Piyomon/Vudramon.webp',
    garudamon: 'img/Piyomon/garudamon.webp',
    phoenixmon: 'img/Piyomon/Phoenixmon.webp',
    // Plotmon
    plotmon: 'img/Plotmon/Plotmon.webp',
    gatmon: 'img/Plotmon/Gatmon.webp',
    angelumon: 'img/Plotmon/Angelumon.webp',
    opanymon: 'img/Plotmon/Opanymon.webp',
    // Shrimmon
    shrimmon: 'img/Shrimmon/Shrimmon.webp',
    ikkakumon: 'img/Shrimmon/Ikkakumon.webp',
    judemon: 'img/Shrimmon/Judemon.png',
    vikemon: 'img/Shrimmon/vikemon.png',
    // Tentamon
    tentamon: 'img/Tentamon/Tentamon.webp',
    copterimon: 'img/Tentamon/Copterimon.webp',
    atracopterimon: 'img/Tentamon/Atracopterimon.webp',
    hercules_atracopterimon: 'img/Tentamon/hercules_atracopterimon.webp',
    // Terriamon
    terriamon: 'img/Terriamon/Terriamon.webp',
    gargormon: 'img/Terriamon/Gargormon.webp',
    lapidmon: 'img/Terriamon/Lapidmon.png',
    seintgargormon: 'img/Terriamon/Seintgargormon.webp',
    // Tutumon
    tutumon: 'img/tutumon/tutumon.webp',
    stingmon: 'img/tutumon/stingmon.webp',
    // Vmon
    vmon: 'img/vmon/vmon.webp',
    xvmon: 'img/vmon/xvmon.webp',

    // Omegamon
    omegamon: 'img/omegamon/omegamon.webp',
    omegamon_merciful: 'img/omegamon/Omegamon_ MercyPool_Mode.webp',

    // Bosses
    devilmon: 'img/Boss/Devilmon.webp',
    etemon: 'img/Boss/Etemon.webp',
    myotismon: 'img/Boss/Myotismon.webp',
    venommyotismon: 'img/Boss/Venommyotismon.webp',
    metalsidramon: 'img/Boss/Metalsidramon.webp',
    powerdramon: 'img/Boss/Powerdramon.webp',
    pinocchimon: 'img/Boss/Pinocchimon.webp',
    piedmon: 'img/Boss/Piedmon.webp',
    apocarmon: 'img/Boss/Apocarmon.webp',
  };
  const baseDigimons = [
    'agumon',
    'palmon',
    'papimon',
    'patamon',
    'piyomon',
    'plotmon',
    'shrimmon',
    'tentamon',
  ];
  const legendaryDigimons = ['terriamon', 'tutumon', 'vmon'];
  let imagesLoaded = 0;
  const numImages = Object.keys(imageSources).length;

  for (const key in imageSources) {
    images[key] = new Image();
    images[key].src = imageSources[key];
    images[key].onload = () => {
      imagesLoaded++;
      if (imagesLoaded === numImages) {
        requestAnimationFrame(gameLoop);
      }
    };
    images[key].onerror = () => {
      imagesLoaded++;
      if (imagesLoaded === numImages) {
        requestAnimationFrame(gameLoop);
      }
    };
  }

  // --- Game State ---
  let gold = 40,
    life = 20,
    stage = 1;
  let enemies = [],
    allies = [],
    projectiles = [],
    effects = [];
  let waveTimer = 30,
    waveInProgress = false,
    isSpawning = false,
    waveTimeLimit = 0;
  let isPaused = false,
    isGameOver = false;
  let selectedAlly = null;
  let animationFrameId = null;
  let selectedCrest = null;

  const crests = {
    courage: 0,
    friendship: 0,
    love: 0,
    sincerity: 0,
    knowledge: 0,
    reliability: 0,
    hope: 0,
    light: 0,
    chromidizoid_gold: 0,
    chromidizoid_black: 0,
    evolutionary_data: 0,
  };

  const crestNamesKorean = {
    courage: '용기',
    friendship: '우정',
    love: '사랑',
    sincerity: '순수',
    knowledge: '지식',
    reliability: '성실',
    hope: '희망',
    light: '빛',
    chromidizoid_gold: '크로미디조이드 골드',
    chromidizoid_black: '크로미디조이드 블랙',
    evolutionary_data: '진화 데이터',
  };

  const digimonData = {
    agumon: {
      evolutions: ['agumon', 'greymon', 'metalgreymon', 'wargreymon'],
      crestRequirements: [null, null, 'courage', 'courage'],
    },
    palmon: {
      evolutions: ['palmon', 'needmon', 'lillimon', 'rosemon'],
      crestRequirements: [null, null, 'sincerity', 'sincerity'],
    },
    papimon: {
      evolutions: ['papimon', 'garummon', 'wargarummon', 'metalgarummon'],
      crestRequirements: [null, null, 'friendship', 'friendship'],
    },
    patamon: {
      evolutions: ['patamon', 'angelmon', 'holyangelmon', 'seraphimon'],
      crestRequirements: [null, null, 'hope', 'hope'],
    },
    piyomon: {
      evolutions: ['piyomon', 'vudramon', 'garudamon', 'phoenixmon'],
      crestRequirements: [null, null, 'love', 'love'],
    },
    plotmon: {
      evolutions: ['plotmon', 'gatmon', 'angelumon', 'opanymon'],
      crestRequirements: [null, null, 'light', 'light'],
    },
    shrimmon: {
      evolutions: ['shrimmon', 'ikkakumon', 'judemon', 'vikemon'],
      crestRequirements: [null, null, 'reliability', 'reliability'],
    },
    tentamon: {
      evolutions: [
        'tentamon',
        'copterimon',
        'atracopterimon',
        'hercules_atracopterimon',
      ],
      crestRequirements: [null, null, 'knowledge', 'knowledge'],
    },
    terriamon: {
      evolutions: ['terriamon', 'gargormon', 'lapidmon', 'seintgargormon'],
      crestRequirements: [null, null, null, null],
    },
    tutumon: {
      evolutions: ['tutumon', 'stingmon'],
      crestRequirements: [null, 'chromidizoid_gold'],
    },
    vmon: {
      evolutions: ['vmon', 'xvmon'],
      crestRequirements: [null, 'chromidizoid_gold'],
    },
    paildramon: { evolutions: ['paildramon'], crestRequirements: [null] },
    omegamon: {
      evolutions: ['omegamon', 'omegamon_merciful'],
      crestRequirements: [null, null],
    },
  };

  const digimonKoreanNames = {
    agumon: '아구몬',
    greymon: '그레이몬',
    metalgreymon: '메탈그레이몬',
    wargreymon: '워그레이몬',
    palmon: '팔몬',
    needmon: '니드몬',
    lillimon: '릴리몬',
    rosemon: '로제몬',
    papimon: '파피몬',
    garummon: '가루몬',
    wargarummon: '워가루몬',
    metalgarummon: '메탈가루몬',
    patamon: '파닥몬',
    angelmon: '엔젤몬',
    holyangelmon: '홀리엔젤몬',
    seraphimon: '세라피몬',
    piyomon: '피요몬',
    vudramon: '버드라몬',
    garudamon: '가루다몬',
    phoenixmon: '피닉스몬',
    plotmon: '플롯트몬',
    gatmon: '가트몬',
    angelumon: '엔젤우몬',
    opanymon: '오파니몬',
    shrimmon: '쉬라몬',
    ikkakumon: '원뿔몬',
    judemon: '쥬드몬',
    vikemon: '바이킹몬',
    tentamon: '텐타몬',
    copterimon: '캅테리몬',
    atracopterimon: '아트라캅테리몬',
    hercules_atracopterimon: '헤라클레스캅테리몬',
    terriamon: '테리어몬',
    gargormon: '가고몬',
    lapidmon: '래피드몬',
    seintgargormon: '세인트가고몬',
    tutumon: '추추몬',
    stingmon: '스팅몬',
    vmon: '브이몬',
    xvmon: '엑스브이몬',
    paildramon: '파일드라몬',
    omegamon: '오메가몬',
    omegamon_merciful: '오메가몬 머시풀 모드',
    devilmon: '데블몬',
    etemon: '에테몬',
    myotismon: '묘티스몬',
    venommyotismon: '베놈묘티스몬',
    metalsidramon: '메탈시드라몬',
    powerdramon: '파워드라몬',
    pinocchimon: '피노키오몬',
    piedmon: '삐에몬',
    apocarmon: '아포카리몬',
  };

  const digimonVideos = {
    metalgreymon: 'img/agumon/metalgreymon.mp4',
    wargreymon: 'img/agumon/wargreymon.mp4',
    lillimon: 'img/Palmon/Lillimon.mp4',
    rosemon: 'img/Palmon/Rosemon.mp4',
    wargarummon: 'img/Papimon/Wargarummon.mp4',
    metalgarummon: 'img/Papimon/metalgarummon.mp4',
    holyangelmon: 'img/Patamon/Holyangelmon.mp4',
    seraphimon: 'img/Patamon/Seraphimon.mp4',
    garudamon: 'img/Piyomon/garudamon.mp4',
    phoenixmon: 'img/Piyomon/Phoenixmon.mp4',
    angelumon: 'img/Plotmon/Angelumon.mp4',
    opanymon: 'img/Plotmon/Opanymon.mp4',
    judemon: 'img/Shrimmon/Judemon.mp4',
    vikemon: 'img/Shrimmon/vikemon.mp4',
    atracopterimon: 'img/Tentamon/Atracopterimon.mp4',
    hercules_atracopterimon: 'img/Tentamon/hercules_atracopterimon.mp4',
    gargormon: 'img/Terriamon/Gargormon.mp4',
    lapidmon: 'img/Terriamon/Lapidmon.mp4',
    seintgargormon: 'img/Terriamon/Seintgargormon.mp4',
    stingmon: 'img/tutumon/stingmon.mp4',
    xvmon: 'img/vmon/xvmon.mp4',
    magnemon: 'img/vmon/Magnemon.mp4',
    paildramon: 'img/Jogress Evolution/File_Dramon.mp4',
    omegamon: 'img/omegamon/omegamon.mp4',
    omegamon_merciful: 'img/omegamon/Omegamon_ MercyPool_Mode.mp4',
  };

  const INNER_X_START = 100,
    INNER_Y_START = 100;
  const INNER_X_END = 700,
    INNER_Y_END = 500;
  const MYTHIC_CHANCE = 0.2;
  const PRIMORDIAL_CHANCE = 0.05;

  let draggingUnit = null,
    originalX,
    originalY;

  const path = [
    { x: 50, y: 50 },
    { x: 750, y: 50 },
    { x: 750, y: 475 },
    { x: 50, y: 475 },
    { x: 50, y: 50 },
  ];

  class Unit {
    constructor(x, y, hp, speed) {
      this.x = x;
      this.y = y;
      this.hp = hp;
      this.maxHp = hp;
      this.speed = speed;
    }
    draw() {}
    update() {}
  }

  class Enemy extends Unit {
    constructor(hp, speed) {
      super(path[0].x, path[0].y, hp, speed);
      this.pathIndex = 0;
    }
    update() {
      if (this.pathIndex < path.length - 1) {
        const target = path[this.pathIndex + 1];
        const dx = target.x - this.x,
          dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.speed) {
          this.x = target.x;
          this.y = target.y;
          this.pathIndex++;
        } else {
          this.x += (dx / distance) * this.speed;
          this.y += (dy / distance) * this.speed;
        }
      } else {
        this.pathIndex = 0;
        this.x = path[0].x;
        this.y = path[0].y;
      }
    }
    draw() {
      ctx.fillStyle = '#c0392b';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(this.x - 15, this.y - 25, 30, 5);
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(this.x - 15, this.y - 25, 30 * (this.hp / this.maxHp), 5);
    }
  }

  class Boss extends Enemy {
    constructor(name, hp, speed, size) {
      super(hp, speed);
      this.name = name;
      this.size = size;
      this.imageKey = name.toLowerCase();
    }

    draw() {
      const img = images[this.imageKey];
      if (img && img.complete && img.naturalHeight !== 0) {
        ctx.drawImage(
          img,
          this.x - this.size / 2,
          this.y - this.size / 2,
          this.size,
          this.size
        );
      } else {
        ctx.fillStyle = '#550000';
        ctx.fillRect(
          this.x - this.size / 2,
          this.y - this.size / 2,
          this.size,
          this.size
        );
      }

      // Draw HP bar
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(
        this.x - this.size / 2,
        this.y - this.size / 2 - 15,
        this.size,
        10
      );
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(
        this.x - this.size / 2,
        this.y - this.size / 2 - 15,
        this.size * (this.hp / this.maxHp),
        10
      );
    }
  }

  class Ally extends Unit {
    constructor(x, y, name, level = 1, type = 'normal') {
      super(x, y, 0, 0);
      this.name = name;
      this.level = level;
      this.type = type;
      this.killData = 0;
      this.crests = {
        courage: 0,
        friendship: 0,
        love: 0,
        sincerity: 0,
        knowledge: 0,
        reliability: 0,
        hope: 0,
        light: 0,
        chromidizoid_gold: 0,
        chromidizoid_black: 0,
      };
      this.isEvolving = false;
      this.updateStats();
    }

    updateStats() {
      const data = digimonData[this.name];
      if (!data) {
        console.error(`No data for digimon: ${this.name}`);
        return;
      }

      if (this.type === 'mythic') {
        this.size = 55;
        this.range = 220;
        this.damage = 400;
        this.attackSpeed = 600;
        this.evolutionRequirement = 50;
        this.imageKey = data.evolutions[3];
      } else if (this.type === 'primordial') {
        this.size = 65;
        this.range = 350;
        this.damage = 2000;
        this.attackSpeed = 400;
        this.evolutionRequirement = Infinity;
        this.imageKey = 'omegamon';
      } else if (this.type === 'jogress') {
        this.size = 60;
        this.range = 300;
        this.damage = 1500;
        this.attackSpeed = 500;
        this.evolutionRequirement = Infinity;
        this.imageKey = 'paildramon';
      } else if (this.type === 'merciful') {
        this.size = 80;
        this.range = 500;
        this.damage = 10000;
        this.attackSpeed = 2000;
        this.evolutionRequirement = Infinity;
        this.imageKey = 'omegamon_merciful';
        this.lastSpecialAttackTime = 0;
      } else {
        this.size = 45 + this.level * 5;
        this.range = 100 + this.level * 15;
        this.damage = 10 * Math.pow(this.level, 2);
        this.attackSpeed = 1000 - this.level * 50;
        this.evolutionRequirement = 5 + this.level * 5;
        this.imageKey = data.evolutions[this.level - 1];
      }

      this.hp = 100 * Math.pow(this.level, 2);
      this.maxHp = this.hp;
      this.lastAttackTime = 0;
    }

    update(currentTime) {
      if (this.isEvolving) return;
      if (currentTime - this.lastAttackTime > this.attackSpeed) {
        if (this.type === 'primordial') {
          const targets = this.findTargets(5);
          if (targets.length > 0) {
            targets.forEach((target) => {
              projectiles.push(
                new Projectile(this.x, this.y, target, this.damage, this)
              );
            });
            this.lastAttackTime = currentTime;
          }
        } else {
          const target = this.findTarget();
          if (target) {
            projectiles.push(
              new Projectile(this.x, this.y, target, this.damage, this)
            );
            this.lastAttackTime = currentTime;
          }
        }
      }

      if (
        this.type === 'merciful' &&
        currentTime - this.lastSpecialAttackTime > 5000
      ) {
        enemies.forEach((enemy) => {
          projectiles.push(
            new Projectile(this.x, this.y, enemy, this.damage / 2, this, true)
          );
        });
        this.lastSpecialAttackTime = currentTime;
      }
    }

    findTarget() {
      for (let enemy of enemies) {
        const dx = enemy.x - this.x,
          dy = enemy.y - this.y;
        if (Math.sqrt(dx * dx + dy * dy) < this.range) return enemy;
      }
      return null;
    }

    findTargets(maxTargets) {
      const targets = [];
      for (let enemy of enemies) {
        if (targets.length >= maxTargets) break;
        const dx = enemy.x - this.x,
          dy = enemy.y - this.y;
        if (Math.sqrt(dx * dx + dy * dy) < this.range) {
          targets.push(enemy);
        }
      }
      return targets;
    }

    draw(currentTime) {
      if (this.isEvolving) return;
      const hoverEffect = Math.sin(currentTime / 300) * 2;
      const yPos = this.y + hoverEffect;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(
        this.x,
        this.y + this.size / 2,
        this.size / 2.5,
        this.size / 5,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      let imgKey = this.imageKey;
      const img = images[imgKey];

      if (img && img.complete && img.naturalHeight !== 0) {
        ctx.drawImage(
          img,
          this.x - this.size / 2,
          yPos - this.size / 2,
          this.size,
          this.size
        );
      } else {
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', this.x, this.y);
      }
    }
  }

  class Projectile {
    constructor(x, y, target, damage, owner) {
      this.x = x;
      this.y = y;
      this.target = target;
      this.damage = damage;
      this.speed = 7;
      this.owner = owner;
    }
    update() {
      if (!this.target || this.target.hp <= 0) {
        this.x = -100;
        return;
      }
      const dx = this.target.x - this.x,
        dy = this.target.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.speed) {
        this.target.hp -= this.damage;
        this.target.lastHitter = this.owner;

        if (this.owner.type === 'mythic') {
          const splashRadius = 80;
          const splashDamage = this.damage * 0.5;
          effects.push(
            new SplashEffect(this.target.x, this.target.y, splashRadius)
          );

          enemies.forEach((enemy) => {
            if (enemy !== this.target) {
              const distFromImpact = Math.sqrt(
                Math.pow(enemy.x - this.target.x, 2) +
                  Math.pow(enemy.y - this.target.y, 2)
              );
              if (distFromImpact < splashRadius) {
                enemy.hp -= splashDamage;
                enemy.lastHitter = this.owner;
              }
            }
          });
        }
        this.x = -100;
      } else {
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
      }
    }
    draw() {
      const typeColors = {
        normal: '#f1c40f',
        mythic: '#9b59b6',
        primordial: '#ffffff',
      };
      ctx.fillStyle = typeColors[this.owner.type];
      if (this.isSpecial) {
        ctx.fillStyle = '#00ffff'; // Merciful mode special attack color
      }
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y,
        this.owner.type === 'primordial' ? 8 : 5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  class SplashEffect {
    constructor(x, y, maxRadius) {
      this.x = x;
      this.y = y;
      this.maxRadius = maxRadius;
      this.radius = 0;
      this.opacity = 1;
    }
    update() {
      this.radius += 4;
      this.opacity -= 0.05;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(142, 68, 173, ${this.opacity})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '계속' : '일시정지';
    if (isPaused) {
      cancelAnimationFrame(animationFrameId);
    } else {
      requestAnimationFrame(gameLoop);
    }
  }

  function startWave() {
    if (waveInProgress) return;
    waveInProgress = true;
    isSpawning = true;
    waveTimer = 0;
    waveTimerEl.textContent = '진행중';
    startWaveBtn.disabled = true;

    waveTimeLimit = 45;
    waveTimeLimitEl.textContent = `${waveTimeLimit}초`;

    const bossData = bosses.find((b) => b.stage === stage);
    if (bossData) {
      console.log(
        `Stage ${stage}: Boss ${bossData.name} detected. Spawning boss.`
      );
      enemies.push(
        new Boss(bossData.name, bossData.hp, bossData.speed, bossData.size)
      );
      isSpawning = false;
    } else {
      console.log(`Stage ${stage}: No boss. Spawning regular enemies.`);
      const enemyCount = 10 + stage * 2;
      const enemyBaseHp = 10 + stage * 12;
      const enemySpeed = 1.5 + stage * 0.1;
      const spawnInterval = Math.max(500 - stage * 10, 200);

      for (let i = 0; i < enemyCount; i++) {
        setTimeout(() => {
          enemies.push(new Enemy(enemyBaseHp, enemySpeed));
          if (i === enemyCount - 1) {
            isSpawning = false;
          }
        }, i * spawnInterval);
      }
    }
  }

  function endWave() {
    waveInProgress = false;
    stage++;
    stageEl.textContent = stage;
    gold += 100 + stage * 10;
    goldEl.textContent = gold;
    waveTimer = 30;
    waveTimeLimit = 0;
    waveTimeLimitEl.textContent = '-';
    startWaveBtn.disabled = false;
  }

  function buyUnit(isLegendary = false) {
    const cost = isLegendary ? 200 : 10;
    if (gold >= cost) {
      gold -= cost;
      goldEl.textContent = gold;
      let x, y, occupied;
      let attempts = 0;
      const centerX = INNER_X_START + (INNER_X_END - INNER_X_START) / 2;
      const centerY = INNER_Y_START + (INNER_Y_END - INNER_Y_START) / 2;
      const spawnRadius = 80;

      do {
        occupied = false;
        x = centerX + (Math.random() - 0.5) * 2 * spawnRadius;
        y = centerY + (Math.random() - 0.5) * 2 * spawnRadius;

        for (const ally of allies) {
          const dist = Math.sqrt(
            Math.pow(ally.x - x, 2) + Math.pow(ally.y - y, 2)
          );
          if (dist < 40) {
            occupied = true;
            break;
          }
        }
        attempts++;
      } while (occupied && attempts < 50);

      if (!occupied) {
        const digimonList = isLegendary ? legendaryDigimons : baseDigimons;
        const randomDigimonName =
          digimonList[Math.floor(Math.random() * digimonList.length)];
        allies.push(new Ally(x, y, randomDigimonName));
      } else {
        alert('유닛을 소환할 공간이 부족합니다! 중앙 공간을 비워주세요.');
      }
    } else {
      alert('골드가 부족합니다.');
    }
  }

  function showShop() {
    shopModal.classList.add('visible');
    shopGoldEl.textContent = gold;
    togglePause();
  }

  function hideShop() {
    shopModal.classList.remove('visible');
    togglePause();
  }

  function buyCrest(crestType) {
    let price = 50;
    if (crestType.includes('chromidizoid')) {
      price = 100;
    } else if (crestType === 'evolutionary_data') {
      price = 30;
    }

    if (gold >= price) {
      gold -= price;
      goldEl.textContent = gold;
      shopGoldEl.textContent = gold;

      if (crestType === 'evolutionary_data') {
        crests[crestType] += 5;
      } else {
        crests[crestType]++;
      }

      updateInventoryUI();
      alert(
        `${crestNamesKorean[crestType]}을(를) 구매했습니다! 현재 ${crests[crestType]}개 보유.`
      );
    } else {
      alert('골드가 부족합니다.');
    }
  }

  function drawPath() {
    ctx.strokeStyle = '#7f8c8d';
    ctx.lineWidth = 40;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
    ctx.closePath();
    ctx.stroke();
  }

  function drawPauseScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 50px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
  }

  function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(231, 76, 60, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    restartBtn.classList.remove('hidden');
  }

  function gameOver() {
    isGameOver = true;
  }

  function resetGame() {
    gold = 40;
    life = 20;
    stage = 1;
    enemies = [];
    allies = [];
    projectiles = [];
    effects = [];
    waveTimer = 30;
    waveInProgress = false;
    waveTimeLimit = 0;
    isPaused = false;
    isGameOver = false;
    selectedAlly = null;
    selectedCrest = null;

    for (const crestType in crests) {
      crests[crestType] = 0;
    }

    goldEl.textContent = gold;
    lifeEl.textContent = life;
    stageEl.textContent = stage;
    waveTimerEl.textContent = waveTimer;
    waveTimeLimitEl.textContent = '-';
    startWaveBtn.disabled = false;
    pauseBtn.textContent = '일시정지';
    hideUnitDetails();
    restartBtn.classList.add('hidden');
    updateInventoryUI();

    requestAnimationFrame(gameLoop);
  }

  function updateInventoryUI() {
    inventoryItems.forEach((item) => {
      const crestType = item.dataset.crestType;
      const countSpan = item.querySelector('.inventory-count');
      countSpan.textContent = crests[crestType];

      if (selectedCrest === crestType) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
    let selectedText = '없음';
    if (selectedCrest) {
      selectedText = crestNamesKorean[selectedCrest] || '';
      if (selectedCrest !== 'evolutionary_data') {
        selectedText += '의 문장';
      }
    }
    selectedCrestInfoEl.textContent = `선택된 아이템: ${selectedText}`;
  }

  function gameLoop(currentTime) {
    if (isGameOver) {
      drawGameOverScreen();
      return;
    }
    if (isPaused) {
      drawPauseScreen();
      animationFrameId = requestAnimationFrame(gameLoop);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPath();

    allies.forEach((ally) => ally.update(currentTime));
    enemies.forEach((enemy) => enemy.update());
    projectiles.forEach((projectile) => projectile.update());
    effects.forEach((effect) => effect.update());

    const deadEnemies = enemies.filter((e) => e.hp <= 0);
    deadEnemies.forEach((deadEnemy) => {
      if (deadEnemy.lastHitter) {
        deadEnemy.lastHitter.killData++;
        console.log(
          `Kill data for ${deadEnemy.lastHitter.name} increased to ${deadEnemy.lastHitter.killData}`
        );
        if (selectedAlly && selectedAlly === deadEnemy.lastHitter) {
          updateUnitDetails();
        }
      }
      gold += 5;
      goldEl.textContent = gold;
    });

    allies.forEach((ally) => ally.draw(currentTime));
    [...enemies, ...projectiles, ...effects].forEach((obj) => obj.draw());

    if (draggingUnit) {
      draggingUnit.draw(currentTime);
    }

    enemies = enemies.filter((e) => e.hp > 0);
    projectiles = projectiles.filter((p) => p.x > -1);
    effects = effects.filter((e) => e.opacity > 0);

    if (waveInProgress && !isSpawning && enemies.length === 0) {
      endWave();
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  function getEventCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    const touch =
      (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
    if (touch) {
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const canvasX = (clientX - rect.left) * scaleX;
    const canvasY = (clientY - rect.top) * scaleY;

    return { x: canvasX, y: canvasY };
  }

  function handleInputStart(e) {
    const coords = getEventCoords(e);
    let unitClicked = false;
    for (let i = allies.length - 1; i >= 0; i--) {
      const ally = allies[i];
      const dist = Math.sqrt(
        Math.pow(ally.x - coords.x, 2) + Math.pow(ally.y - coords.y, 2)
      );
      if (dist < ally.size / 2) {
        unitClicked = true;
        draggingUnit = ally;
        originalX = draggingUnit.x;
        originalY = draggingUnit.y;
        if (unitClicked) {
          showUnitDetails(draggingUnit);
        }

        document.addEventListener('mousemove', handleInputMove);
        document.addEventListener('mouseup', handleInputEnd);
        document.addEventListener('touchmove', handleInputMove, {
          passive: false,
        });
        document.addEventListener('touchend', handleInputEnd, {
          passive: false,
        });
        break;
      }
    }

    if (!unitClicked) {
      hideUnitDetails();
    }

    if (selectedCrest && selectedAlly) {
      console.log(
        `Attempting to use crest: ${selectedCrest}. Current count: ${crests[selectedCrest]}`
      );
      if (crests[selectedCrest] > 0) {
        const usedCrest = selectedCrest; // Store for logging
        if (selectedCrest === 'evolutionary_data') {
          crests[selectedCrest]--;
          selectedAlly.killData += 5;
          alert(
            `진화 데이터를 사용하여 ${
              digimonKoreanNames[selectedAlly.imageKey]
            }의 진화 데이터가 5 증가했습니다.`
          );
        } else {
          crests[selectedCrest]--;
          selectedAlly.crests[selectedCrest]++;
          alert(
            `${crestNamesKorean[selectedCrest]}의 문장을 ${
              digimonKoreanNames[selectedAlly.imageKey]
            }에게 적용했습니다!`
          );
        }

        console.log(`Crest ${usedCrest} used. New count: ${crests[usedCrest]}`);

        updateInventoryUI();
        updateUnitDetails();
        selectedCrest = null;
        updateInventoryUI();
      } else {
        alert('보유한 아이템이 없습니다.');
        console.log(`Crest ${selectedCrest} not used. Count is 0 or less.`);
      }
    }
  }

  function handleInputMove(e) {
    if (draggingUnit) {
      const coords = getEventCoords(e);
      draggingUnit.x = coords.x;
      draggingUnit.y = coords.y;
    }
  }

  function handleInputEnd(e) {
    if (draggingUnit) {
      const coords = getEventCoords(e);
      if (coords.x > 70 && coords.x < 730 && coords.y > 70 && coords.y < 455) {
        draggingUnit.x = coords.x;
        draggingUnit.y = coords.y;
      } else {
        draggingUnit.x = originalX;
        draggingUnit.y = originalY;
      }
      draggingUnit = null;

      document.removeEventListener('mousemove', handleInputMove);
      document.removeEventListener('mouseup', handleInputEnd);
      document.removeEventListener('touchmove', handleInputMove);
      document.removeEventListener('touchend', handleInputEnd);
    }
  }

  function showUnitDetails(unit) {
    selectedAlly = unit;
    if (selectedAlly) {
      unitDetailsEl.classList.remove('hidden');
      updateUnitDetails();
    } else {
      hideUnitDetails();
    }
  }

  function hideUnitDetails() {
    selectedAlly = null;
    unitDetailsEl.classList.add('hidden');
  }

  function updateUnitDetails() {
    if (!selectedAlly || !selectedAlly.name) return;

    const digimonInfo = digimonData[selectedAlly.name];
    if (!digimonInfo || !digimonInfo.crestRequirements) return;
    const isMaxLevel =
      selectedAlly.level >= digimonInfo.evolutions.length ||
      selectedAlly.type === 'primordial' ||
      selectedAlly.type === 'mythic';

    if (unitDetailImgEl) {
      const img = images[selectedAlly.imageKey];
      if (img && img.complete && img.naturalHeight !== 0) {
        unitDetailImgEl.src = img.src;
      }
    }

    if (unitDetailNameEl) {
      const currentDigimonNameKey =
        digimonInfo.evolutions[selectedAlly.level - 1];
      unitDetailNameEl.textContent =
        digimonKoreanNames[currentDigimonNameKey] || currentDigimonNameKey;
    }

    const evolutionInfoEl = document.getElementById('unit-evolution-info');
    const specialEvolveBtn = document.getElementById('special-evolve-btn');

    if (specialEvolveBtn) specialEvolveBtn.classList.add('hidden');

    if (evolutionInfoEl) evolutionInfoEl.classList.remove('hidden'); // 항상 표시
    if (unitDetailKillsEl)
      unitDetailKillsEl.textContent = selectedAlly.killData;

    // 크로미디조이드 골드 표시 (워그레이몬, 메탈가루몬에만 해당)
    let chromidizoidGoldInfoEl = document.getElementById(
      'chromidizoid-gold-info'
    );
    if (
      selectedAlly.imageKey === 'wargreymon' ||
      selectedAlly.imageKey === 'metalgarummon'
    ) {
      if (!chromidizoidGoldInfoEl) {
        const evolutionInfoDiv = document.getElementById('unit-evolution-info');
        const newDiv = document.createElement('div');
        newDiv.id = 'chromidizoid-gold-info';
        newDiv.innerHTML = `<p>크로미디조이드 골드: <span id="unit-detail-chromidizoid-gold">0</span></p>`;
        evolutionInfoDiv.appendChild(newDiv);
        chromidizoidGoldInfoEl = newDiv;
      }
      document.getElementById('unit-detail-chromidizoid-gold').textContent =
        selectedAlly.crests.chromidizoid_gold;
      chromidizoidGoldInfoEl.style.display = 'block';
    } else {
      if (chromidizoidGoldInfoEl) {
        chromidizoidGoldInfoEl.style.display = 'none';
      }
    }

    // 진화 요구사항 텍스트 및 버튼 활성화 로직
    let evolutionRequirementText = `진화 데이터: ${selectedAlly.killData} / ${selectedAlly.evolutionRequirement}`;

    const requiredCrest = digimonInfo.crestRequirements[selectedAlly.level]; // 다음 진화에 필요한 문장
    let canEvolve =
      selectedAlly.killData >= selectedAlly.evolutionRequirement && !isMaxLevel; // isMaxLevel일 경우 진화 불가

    // 오메가몬 합체 진화 조건 확인
    if (
      selectedAlly.imageKey === 'wargreymon' ||
      selectedAlly.imageKey === 'metalgarummon'
    ) {
      const partnerType =
        selectedAlly.imageKey === 'wargreymon' ? 'metalgarummon' : 'wargreymon';
      const partnerDigimon = allies.find(
        (ally) =>
          ally.imageKey === partnerType &&
          ally.killData >= 50 &&
          ally.crests.chromidizoid_gold >= 2
      );

      if (partnerDigimon) {
        canEvolve = true;
        evolutionRequirementText = `합체 진화 (오메가몬): 진화 데이터 50 / 크로미디조이드 골드 2 (각각 필요) (보유: ${selectedAlly.killData} / ${selectedAlly.crests.chromidizoid_gold})`;
      } else {
        canEvolve = false;
        evolutionRequirementText = `합체 진화 (오메가몬): 파트너 (${digimonKoreanNames[partnerType]}) 필요 및 각 진화 데이터 50 / 크로미디조이드 골드 2 필요 (보유: ${selectedAlly.killData} / ${selectedAlly.crests.chromidizoid_gold})`;
      }
    }

    // 파일드라몬 합체 진화 조건 확인
    if (
      selectedAlly.imageKey === 'xvmon' ||
      selectedAlly.imageKey === 'stingmon'
    ) {
      const partnerType =
        selectedAlly.imageKey === 'xvmon' ? 'stingmon' : 'xvmon';
      const partnerDigimon = allies.find(
        (ally) =>
          ally.imageKey === partnerType &&
          ally.killData >= 30 &&
          ally.crests.chromidizoid_black >= 5
      );

      if (partnerDigimon) {
        canEvolve = true;
        evolutionRequirementText = `합체 진화 (파일드라몬): 진화 데이터 30 / 디지크롬 블랙 5 (각각 필요) (보유: ${selectedAlly.killData} / ${selectedAlly.crests.chromidizoid_black})`;
      } else {
        canEvolve = false;
        evolutionRequirementText = `합체 진화 (파일드라몬): 파트너 (${digimonKoreanNames[partnerType]}) 필요 및 각 진화 데이터 30 / 디지크롬 블랙 5 필요 (보유: ${selectedAlly.killData} / ${selectedAlly.crests.chromidizoid_black})`;
      }
    }

    // 오메가몬 머시풀 모드 진화 조건 확인
    if (selectedAlly.imageKey === 'omegamon') {
      const requiredAllies = [
        'rosemon',
        'seraphimon',
        'phoenixmon',
        'opanymon',
        'vikemon',
        'hercules_atracopterimon',
      ];
      const hasAllRequiredAllies = requiredAllies.every((requiredAlly) =>
        allies.some((ally) => ally.imageKey === requiredAlly)
      );

      if (
        hasAllRequiredAllies &&
        selectedAlly.killData >= 100 &&
        crests.chromidizoid_black >= 10 &&
        crests.chromidizoid_gold >= 10 &&
        gold >= 1000
      ) {
        canEvolve = true;
        evolutionRequirementText = `궁극 합체 (머시풀 모드): 진화 데이터 100, 골드 1000, 디지크롬 블랙/골드 각 10개, 6기 궁극체 필요 (조건 충족)`;
      } else {
        canEvolve = false;
        evolutionRequirementText = `궁극 합체 (머시풀 모드): 진화 데이터 100, 골드 1000, 디지크롬 블랙/골드 각 10개, 6기 궁극체 필요 (조건 미충족)`;
      }
    }

    if (requiredCrest) {
      const userHasCrest = selectedAlly.crests[requiredCrest] >= 1;
      canEvolve = canEvolve && userHasCrest;
      evolutionRequirementText += userHasCrest
        ? ` (${crestNamesKorean[requiredCrest]} 보유)`
        : ` (${crestNamesKorean[requiredCrest]} 1개 필요)`;
    }

    if (unitDetailReqEl) unitDetailReqEl.textContent = evolutionRequirementText;
    if (evolveBtn) evolveBtn.disabled = !canEvolve; // isMaxLevel이거나 조건 미충족 시 비활성화

    crestSlots.forEach((slot) => {
      const crestType = slot.dataset.crestType;
      const countSpan = slot.querySelector('.crest-count');
      if (countSpan)
        countSpan.textContent = selectedAlly.crests[crestType] || 0;
    });
  }

  function evolveUnit() {
    if (!selectedAlly) return;

    // 오메가몬 합체 진화 로직
    if (
      selectedAlly.imageKey === 'wargreymon' ||
      selectedAlly.imageKey === 'metalgarummon'
    ) {
      const currentDigimon = selectedAlly;
      const partnerType =
        currentDigimon.imageKey === 'wargreymon'
          ? 'metalgarummon'
          : 'wargreymon';
      const partnerDigimon = allies.find(
        (ally) =>
          ally.imageKey === partnerType &&
          ally.killData >= 50 &&
          ally.crests.chromidizoid_gold >= 2 &&
          ally !== currentDigimon // 자기 자신 제외
      );

      if (
        partnerDigimon &&
        currentDigimon.killData >= 50 &&
        currentDigimon.crests.chromidizoid_gold >= 2
      ) {
        const evolutionFn = () => {
          // 기존 디지몬 제거
          allies = allies.filter(
            (ally) => ally !== currentDigimon && ally !== partnerDigimon
          );

          // 오메가몬 생성 (두 디지몬의 평균 위치에 생성)
          const newX = (currentDigimon.x + partnerDigimon.x) / 2;
          const newY = (currentDigimon.y + partnerDigimon.y) / 2;
          const omegamon = new Ally(newX, newY, 'omegamon', 1, 'primordial');
          allies.push(omegamon);

          // 진화 데이터 및 크로미디조이드 골드 소모 (개별 디지몬에서 소모)
          currentDigimon.killData -= 50;
          currentDigimon.crests.chromidizoid_gold -= 2;
          partnerDigimon.killData -= 50;
          partnerDigimon.crests.chromidizoid_gold -= 2;

          updateInventoryUI(); // 전역 인벤토리 업데이트는 필요 없지만, 혹시 모르니 호출

          evolutionAnimationEl.classList.add('hidden');
          evolutionVideoEl.pause();
          evolutionVideoEl.currentTime = 0;
          hideUnitDetails(); // 합체 진화 후 상세 정보 닫기
        };

        let videoSource = digimonVideos['omegamon'];
        if (videoSource && !skipEvolutionCheckbox.checked) {
          currentDigimon.isEvolving = true; // 현재 디지몬만 isEvolving 상태로
          evolutionAnimationEl.classList.remove('hidden');
          evolutionVideoEl.src = videoSource;
          evolutionVideoEl.play();
          evolutionVideoEl.onended = evolutionFn;
        } else {
          evolutionFn();
        }
        return; // 합체 진화 처리 후 함수 종료
      }
    }

    // 파일드라몬 합체 진화 로직
    if (
      selectedAlly.imageKey === 'xvmon' ||
      selectedAlly.imageKey === 'stingmon'
    ) {
      const currentDigimon = selectedAlly;
      const partnerType =
        currentDigimon.imageKey === 'xvmon' ? 'stingmon' : 'xvmon';
      const partnerDigimon = allies.find(
        (ally) =>
          ally.imageKey === partnerType &&
          ally.killData >= 30 &&
          ally.crests.chromidizoid_black >= 5 &&
          ally !== currentDigimon
      );

      if (
        partnerDigimon &&
        currentDigimon.killData >= 30 &&
        currentDigimon.crests.chromidizoid_black >= 5
      ) {
        const evolutionFn = () => {
          allies = allies.filter(
            (ally) => ally !== currentDigimon && ally !== partnerDigimon
          );

          const newX = (currentDigimon.x + partnerDigimon.x) / 2;
          const newY = (currentDigimon.y + partnerDigimon.y) / 2;
          const paildramon = new Ally(newX, newY, 'paildramon', 1, 'jogress');
          allies.push(paildramon);

          currentDigimon.killData -= 30;
          currentDigimon.crests.chromidizoid_black -= 5;
          partnerDigimon.killData -= 30;
          partnerDigimon.crests.chromidizoid_black -= 5;

          updateInventoryUI();

          evolutionAnimationEl.classList.add('hidden');
          evolutionVideoEl.pause();
          evolutionVideoEl.currentTime = 0;
          hideUnitDetails();
        };

        let videoSource = digimonVideos['paildramon'];
        if (videoSource && !skipEvolutionCheckbox.checked) {
          currentDigimon.isEvolving = true;
          evolutionAnimationEl.classList.remove('hidden');
          evolutionVideoEl.src = videoSource;
          evolutionVideoEl.play();
          evolutionVideoEl.onended = evolutionFn;
        } else {
          evolutionFn();
        }
        return;
      }
    }

    // 오메가몬 머시풀 모드 진화 로직
    if (selectedAlly.imageKey === 'omegamon') {
      const requiredAllies = [
        'rosemon',
        'seraphimon',
        'phoenixmon',
        'opanymon',
        'vikemon',
        'hercules_atracopterimon',
      ];
      const hasAllRequiredAllies = requiredAllies.every((requiredAlly) =>
        allies.some((ally) => ally.imageKey === requiredAlly)
      );

      if (
        hasAllRequiredAllies &&
        selectedAlly.killData >= 100 &&
        crests.chromidizoid_black >= 10 &&
        crests.chromidizoid_gold >= 10 &&
        gold >= 1000
      ) {
        const evolutionFn = () => {
          // 재료 디지몬 제거
          const alliesToKeep = allies.filter(
            (ally) =>
              ally !== selectedAlly && !requiredAllies.includes(ally.imageKey)
          );
          allies = alliesToKeep;

          // 오메가몬 머시풀 모드 생성
          const newX = selectedAlly.x;
          const newY = selectedAlly.y;
          const omegamonMerciful = new Ally(
            newX,
            newY,
            'omegamon',
            2,
            'merciful'
          );
          allies.push(omegamonMerciful);

          // 재료 소모
          selectedAlly.killData -= 100;
          crests.chromidizoid_black -= 10;
          crests.chromidizoid_gold -= 10;
          gold -= 1000;

          updateInventoryUI();
          goldEl.textContent = gold;

          evolutionAnimationEl.classList.add('hidden');
          evolutionVideoEl.pause();
          evolutionVideoEl.currentTime = 0;
          hideUnitDetails();
        };

        let videoSource = digimonVideos['omegamon_merciful'];
        if (videoSource && !skipEvolutionCheckbox.checked) {
          selectedAlly.isEvolving = true;
          evolutionAnimationEl.classList.remove('hidden');
          evolutionVideoEl.src = videoSource;
          evolutionVideoEl.play();
          evolutionVideoEl.onended = evolutionFn;
        } else {
          evolutionFn();
        }
        return;
      }
    }

    const digimonInfo = digimonData[selectedAlly.name];
    if (!digimonInfo) {
      console.error('Cannot find digimon data for:', selectedAlly.name);
      return;
    }

    const nextLevel = selectedAlly.level + 1;

    if (nextLevel > digimonInfo.evolutions.length) {
      alert('이 디지몬은 더 이상 진화할 수 없습니다.');
      return;
    }

    const requiredCrest = digimonInfo.crestRequirements[nextLevel - 1];

    const canEvolve =
      selectedAlly.killData >= selectedAlly.evolutionRequirement &&
      (!requiredCrest || selectedAlly.crests[requiredCrest] >= 1);

    if (!canEvolve) {
      alert(
        '진화 조건이 충족되지 않았습니다. 진화 데이터를 충분히 모았는지, 필요한 문장을 소지하고 있는지 확인하세요.'
      );
      return;
    }

    const evolutionFn = () => {
      // 진화 성공 로직
      selectedAlly.isEvolving = false;
      selectedAlly.killData = 0;

      // 문장 소모 로직
      const crestToConsume = digimonInfo.crestRequirements[nextLevel - 1];
      if (crestToConsume && selectedAlly.crests[crestToConsume] > 0) {
        selectedAlly.crests[crestToConsume]--;
        updateInventoryUI();
      }

      selectedAlly.level++;

      // 다음 단계 진화
      if (selectedAlly.level <= digimonInfo.evolutions.length) {
        const nextDigimonKey = digimonInfo.evolutions[selectedAlly.level - 1];
        selectedAlly.imageKey = nextDigimonKey;
      }

      selectedAlly.updateStats();
      updateUnitDetails();

      evolutionAnimationEl.classList.add('hidden');
      evolutionVideoEl.pause();
      evolutionVideoEl.currentTime = 0;

      showUnitDetails(selectedAlly);
    };

    // 진화 영상 재생 로직
    const nextDigimonKey = digimonInfo.evolutions[nextLevel - 1];
    let videoSource = digimonVideos[nextDigimonKey];

    console.log(
      `Attempting to evolve ${selectedAlly.name} to ${nextDigimonKey}`
    );
    console.log(`Video source for ${nextDigimonKey}: ${videoSource}`);

    if (videoSource && !skipEvolutionCheckbox.checked) {
      selectedAlly.isEvolving = true;
      evolutionAnimationEl.classList.remove('hidden');
      evolutionVideoEl.src = videoSource;
      evolutionVideoEl.play();
      evolutionVideoEl.onended = evolutionFn;
    } else {
      evolutionFn();
    }
  }

  function dismissUnit() {
    if (!selectedAlly) return;

    const confirmation = confirm(
      `정말로 ${
        digimonKoreanNames[selectedAlly.imageKey]
      }와(과) 이별하시겠습니까?`
    );

    if (confirmation) {
      allies = allies.filter((ally) => ally !== selectedAlly);
      hideUnitDetails();
    }
  }

  // --- Timer ---
  setInterval(() => {
    if (isPaused || isGameOver) return;

    console.log(
      `Wave Timer: ${waveTimer}, Wave Time Limit: ${waveTimeLimit}, Enemies: ${enemies.length}, Wave In Progress: ${waveInProgress}, Is Spawning: ${isSpawning}`
    );

    if (waveInProgress) {
      if (waveTimeLimit > 0) {
        waveTimeLimit--;
        waveTimeLimitEl.textContent = `${waveTimeLimit}초`;
      } else if (enemies.length > 0) {
        life -= enemies.length;
        lifeEl.textContent = life;
        enemies = [];
        endWave();
        if (life <= 0) {
          gameOver();
        }
      }
    } else {
      if (waveTimer > 0) {
        waveTimer--;
        waveTimerEl.textContent = waveTimer;
      } else {
        startWave();
      }
    }
  }, 1000);

  // --- Event Listeners ---
  buyUnitBtn.addEventListener('click', () => buyUnit(false));
  startWaveBtn.addEventListener('click', startWave);
  pauseBtn.addEventListener('click', togglePause);
  evolveBtn.addEventListener('click', evolveUnit);
  dismissBtn.addEventListener('click', dismissUnit);
  restartBtn.addEventListener('click', resetGame);
  shopBtn.addEventListener('click', showShop);
  closeShopBtn.addEventListener('click', hideShop);

  shopModal.addEventListener('click', (e) => {
    if (e.target === shopModal) {
      hideShop();
    }
  });

  buyCrestBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const crestType = btn.dataset.crest;
      buyCrest(crestType);
    });
  });

  document
    .getElementById('buy-legendary-egg-btn')
    .addEventListener('click', () => buyUnit(true));

  canvas.addEventListener('mousedown', handleInputStart);
  canvas.addEventListener('touchstart', handleInputStart, { passive: false });

  inventoryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const crestType = item.dataset.crestType;
      if (selectedCrest === crestType) {
        selectedCrest = null;
      } else {
        selectedCrest = crestType;
      }
      updateInventoryUI();
    });
  });
});
