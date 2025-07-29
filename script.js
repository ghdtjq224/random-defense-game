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
    const pauseBtn = document.getElementById('pause-btn');

    // --- Image Loading ---
    const images = {};
    const imageSources = {
        level_1: 'img/level_1.png',
        level_2: 'img/level_2.png',
        level_3: 'img/level_3.png',
        mythic: 'img/mythic.png',
        primordial: 'img/primordial.png'
    };
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
            // Handle image loading errors, maybe show a placeholder
            imagesLoaded++;
            if (imagesLoaded === numImages) {
                requestAnimationFrame(gameLoop);
            }
        };
    }

    // --- Game State ---
    let gold = 100, life = 20, stage = 1;
    let enemies = [], allies = [], projectiles = [];
    let waveTimer = 30, waveInProgress = false;
    let isPaused = false;

    // --- Game Constants ---
    const INNER_X_START = 100, INNER_Y_START = 100;
    const INNER_X_END = 700, INNER_Y_END = 500;
    const MYTHIC_CHANCE = 0.20; // 20%
    const PRIMORDIAL_CHANCE = 0.05; // 5%

    // --- Drag State ---
    let draggingUnit = null, originalX, originalY;

    const path = [
        { x: 50, y: 50 }, { x: 750, y: 50 },
        { x: 750, y: 550 }, { x: 50, y: 550 },
        { x: 50, y: 49 }
    ];

    // --- Classes (most are the same) ---
    class Unit { /* ... */
        constructor(x, y, hp, speed) {
            this.x = x; this.y = y;
            this.hp = hp; this.maxHp = hp;
            this.speed = speed;
        }
        draw() {}
        update() {}
    }

    class Enemy extends Unit { /* ... */ 
        constructor(hp, speed) {
            super(path[0].x, path[0].y, hp, speed);
            this.pathIndex = 0;
        }
        update() {
            if (this.pathIndex < path.length - 1) {
                const target = path[this.pathIndex + 1];
                const dx = target.x - this.x, dy = target.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.speed) {
                    this.x = target.x; this.y = target.y;
                    this.pathIndex++;
                    if (this.pathIndex === path.length - 1) this.pathIndex = 0;
                } else {
                    this.x += (dx / distance) * this.speed;
                    this.y += (dy / distance) * this.speed;
                }
            } else { life--; lifeEl.textContent = life; this.hp = 0; }
        }
        draw() {
            ctx.fillStyle = '#c0392b';
            ctx.beginPath(); ctx.arc(this.x, this.y, 15, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#e74c3c'; ctx.fillRect(this.x - 15, this.y - 25, 30, 5);
            ctx.fillStyle = '#2ecc71'; ctx.fillRect(this.x - 15, this.y - 25, 30 * (this.hp / this.maxHp), 5);
        }
    }

    class Ally extends Unit { /* ... */ 
        constructor(x, y, level = 1, type = 'normal') {
            super(x, y, 100 * Math.pow(level, 2), 0);
            this.level = level;
            this.type = type; // normal, mythic, primordial
            this.updateStats();
        }

        updateStats() {
            if (this.type === 'mythic') {
                this.size = 50;
                this.range = 250;
                this.damage = 500;
                this.attackSpeed = 500;
            } else if (this.type === 'primordial') {
                this.size = 60;
                this.range = 400;
                this.damage = 3000;
                this.attackSpeed = 300;
            } else { // Normal
                this.size = 40 + this.level * 5;
                this.range = 100 + this.level * 15;
                this.damage = 10 * Math.pow(this.level, 2);
                this.attackSpeed = 1000 - this.level * 50;
            }
            this.lastAttackTime = 0;
        }

        update(currentTime) {
            if (currentTime - this.lastAttackTime > this.attackSpeed) {
                let target = this.findTarget();
                if (target) {
                    projectiles.push(new Projectile(this.x, this.y, target, this.damage, this.type));
                    this.lastAttackTime = currentTime;
                }
            }
        }

        findTarget() {
            for (let enemy of enemies) {
                const dx = enemy.x - this.x, dy = enemy.y - this.y;
                if (Math.sqrt(dx * dx + dy * dy) < this.range) return enemy;
            }
            return null;
        }

        draw() {
            let imgKey = `level_${this.level}`;
            if (this.type === 'mythic') imgKey = 'mythic';
            else if (this.type === 'primordial') imgKey = 'primordial';

            const img = images[imgKey];

            if (img && img.complete && img.naturalHeight !== 0) {
                ctx.drawImage(img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
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

    class Projectile { /* ... */ 
        constructor(x, y, target, damage, ownerType) {
            this.x = x; this.y = y;
            this.target = target;
            this.damage = damage;
            this.speed = 7;
            this.ownerType = ownerType;
        }
        update() {
            if (this.target.hp <= 0) { this.x = -100; return; }
            const dx = this.target.x - this.x, dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.speed) {
                this.target.hp -= this.damage;
                this.x = -100;
            } else {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            }
        }
        draw() {
            const typeColors = { normal: '#f1c40f', mythic: '#9b59b6', primordial: '#ffffff' };
            ctx.fillStyle = typeColors[this.ownerType];
            ctx.beginPath(); ctx.arc(this.x, this.y, this.ownerType === 'primordial' ? 8 : 5, 0, Math.PI * 2); ctx.fill();
        }
    }

    // --- Game Logic ---
    function togglePause() {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? "계속" : "일시정지";
        if (!isPaused) {
            requestAnimationFrame(gameLoop);
        }
    }

    function startWave() { /* ... */ 
        waveInProgress = true;
        const enemyCount = 10 + stage * 2;
        for (let i = 0; i < enemyCount; i++) {
            setTimeout(() => {
                if(!isPaused) enemies.push(new Enemy(50 + stage * 20, 1 + stage * 0.1));
            }, i * 300);
        }
    }

    function endWave() { /* ... */ 
        waveInProgress = false;
        stage++;
        stageEl.textContent = stage;
        gold += 100 + stage * 10;
        goldEl.textContent = gold;
        waveTimer = 30;
    }

    function buyUnit() {
        if (gold >= 10) {
            gold -= 10;
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
                    const dist = Math.sqrt(Math.pow(ally.x - x, 2) + Math.pow(ally.y - y, 2));
                    if (dist < 40) {
                        occupied = true;
                        break;
                    }
                }
                attempts++;
            } while (occupied && attempts < 50);

            if (!occupied) {
                allies.push(new Ally(x, y));
            } else {
                alert("유닛을 소환할 공간이 부족합니다! 중앙 공간을 비워주세요.");
            }
        } else {
            alert("골드가 부족합니다.");
        }
    }

    function drawPath() { /* ... */ 
        ctx.strokeStyle = '#7f8c8d'; ctx.lineWidth = 40; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        ctx.closePath(); ctx.stroke();
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

    function gameLoop(currentTime) {
        if (isPaused) {
            drawPauseScreen();
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPath();

        [...allies, ...enemies, ...projectiles].forEach(unit => {
            unit.update(currentTime);
            unit.draw();
        });

        if (draggingUnit) { draggingUnit.draw(); }

        enemies = enemies.filter(e => {
            if (e.hp <= 0) { gold += 5; goldEl.textContent = gold; return false; }
            return true;
        });
        projectiles = projectiles.filter(p => p.x > -1);

        if (waveInProgress && enemies.length === 0) {
            endWave();
        }

        requestAnimationFrame(gameLoop);
    }

    // --- Input Handlers (Improved for Mobile) ---
    function getEventCoords(e) {
        const rect = canvas.getBoundingClientRect();
        let touch = e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0];
        if (touch) {
            return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        } 
        return { x: e.clientX - rect.left, y: e.clientY - rect.top }; // Mouse
    }

    function handleDragStart(e) {
        e.preventDefault();
        const coords = getEventCoords(e);

        for (let i = allies.length - 1; i >= 0; i--) {
            const ally = allies[i];
            const dist = Math.sqrt(Math.pow(ally.x - coords.x, 2) + Math.pow(ally.y - coords.y, 2));
            if (dist < ally.size / 2) {
                draggingUnit = allies.splice(i, 1)[0];
                originalX = draggingUnit.x; originalY = draggingUnit.y;
                return;
            }
        }
    }

    function handleDragMove(e) {
        if (draggingUnit) {
            e.preventDefault();
            const coords = getEventCoords(e);
            draggingUnit.x = coords.x;
            draggingUnit.y = coords.y;
        }
    }

    function handleDragEnd(e) {
        if (draggingUnit) {
            e.preventDefault();
            const coords = getEventCoords(e);
            let combined = false;

            for (let i = 0; i < allies.length; i++) {
                const targetAlly = allies[i];
                const dist = Math.sqrt(Math.pow(targetAlly.x - coords.x, 2) + Math.pow(targetAlly.y - coords.y, 2));
                
                if (targetAlly !== draggingUnit && dist < targetAlly.size / 2) {
                    const newX = targetAlly.x, newY = targetAlly.y;
                    if (draggingUnit.level === 3 && targetAlly.level === 3 && draggingUnit.type === 'normal' && targetAlly.type === 'normal') {
                        if (Math.random() < MYTHIC_CHANCE) allies.push(new Ally(newX, newY, 1, 'mythic'));
                        else allies.push(new Ally(newX, newY, 2, 'normal'));
                        allies.splice(i, 1); combined = true; break;
                    } else if (draggingUnit.type === 'mythic' && targetAlly.type === 'mythic') {
                        if (Math.random() < PRIMORDIAL_CHANCE) allies.push(new Ally(newX, newY, 1, 'primordial'));
                        else allies.push(new Ally(newX, newY, 1, 'normal'));
                        allies.splice(i, 1); combined = true; break;
                    } else if (draggingUnit.level === targetAlly.level && draggingUnit.type === 'normal' && targetAlly.type === 'normal') {
                        allies.push(new Ally(newX, newY, draggingUnit.level + 1, 'normal'));
                        allies.splice(i, 1); combined = true; break;
                    }
                }
            }

            if (!combined) {
                if (coords.x > INNER_X_START && coords.x < INNER_X_END && coords.y > INNER_Y_START && coords.y < INNER_Y_END) {
                    draggingUnit.x = coords.x; draggingUnit.y = coords.y;
                } else {
                    draggingUnit.x = originalX; draggingUnit.y = originalY;
                }
                allies.push(draggingUnit);
            }
            draggingUnit = null;
        }
    }

    // --- Initialization ---
    setInterval(() => {
        if (imagesLoaded === numImages && !waveInProgress && !isPaused) {
            waveTimer--;
            waveTimerEl.textContent = waveTimer > 0 ? waveTimer : 0;
            if (waveTimer <= 0) {
                startWave();
                waveTimerEl.textContent = "진행중";
            }
        }
    }, 1000);

    buyUnitBtn.addEventListener('click', buyUnit);
    pauseBtn.addEventListener('click', togglePause);

    // Mouse Events
    canvas.addEventListener('mousedown', handleDragStart);
    canvas.addEventListener('mousemove', handleDragMove);
    canvas.addEventListener('mouseup', handleDragEnd);

    // Touch Events (with passive: false to allow preventDefault)
    canvas.addEventListener('touchstart', handleDragStart, { passive: false });
    canvas.addEventListener('touchmove', handleDragMove, { passive: false });
    canvas.addEventListener('touchend', handleDragEnd, { passive: false });
});
    // Touch Events
    canvas.addEventListener('touchstart', handleDragStart);
    canvas.addEventListener('touchmove', handleDragMove);
    canvas.addEventListener('touchend', handleDragEnd);
});
