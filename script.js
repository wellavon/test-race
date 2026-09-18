// === ФУНКЦИИ ДЛЯ АВТОМАТИЧЕСКОГО ПОДСЧЁТА ОЧКОВ ===

function calculateScore(achievements) {
    let score = 0;

    const projectsCount = achievements.projects ? achievements.projects.length : 0;
    score += projectsCount * 100;

    const festivalsCount = achievements.festivals ? achievements.festivals.length : 0;
    score += festivalsCount * 50;

    if (achievements.wins && achievements.wins.length > 0) {
        achievements.wins.forEach(win => {
            switch (win.place) {
                case 1: score += 50; break;
                case 2: score += 30; break;
                case 3: score += 20; break;
            }
        });
    }

    if (achievements.bonus) {
        score += achievements.bonus;
    }

    return score;
}

function getRacerClass(score) {
    if (score >= 9000) return "Royal";
    if (score >= 5000) return "Ruler";
    if (score >= 3000) return "Rover";
    if (score >= 1000) return "Rusher";
    if (score >= 800) return "Raider";
    if (score >= 600) return "Rider";
    if (score >= 450) return "Runner";
    return "Rookie";
}

function updateRacerScores() {
    racersData.forEach(racer => {
        racer.score = calculateScore(racer.achievements);
        racer.class = getRacerClass(racer.score);
    });
}

// === ЗАГРУЗКА МИССИЙ ИЗ missions.json ===

let missionData = [];
let missionsLoaded = false;
let missionsLoadPromise = null;

async function loadMissions(forceReload = false) {
    if (missionsLoaded && !forceReload) {
        return missionData;
    }
    if (missionsLoadPromise && !forceReload) {
        return missionsLoadPromise;
    }

    missionsLoadPromise = (async () => {
        try {
            const resp = await fetch('missions.json?t=' + Date.now(), { cache: 'no-store' });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const data = await resp.json();
            missionData = Array.isArray(data.missions) ? data.missions : [];
            missionsLoaded = true;
            return missionData;
        } catch (e) {
            console.error('Не удалось загрузить missions.json:', e);
            missionData = [];
            missionsLoaded = true;
            return missionData;
        }
    })();

    return missionsLoadPromise;
}

// === ДАННЫЕ РЭЙСЕРОВ ===

const racersData = [
    {
        id: "2507.7",
        name: "Kento",
        class: "",
        score: 0,
        photo: "kento",
        achievements: {
            projects: ["P1Harmony - Pretty Boy", "Ateez - In Your Fantasy", "XLOV - 1&Only",
                "Yena - Wicked Love", "Stray Kids - Ceremony", "All(h)ours - Gotcha", "Ateez - Shaboom",
                "Monsta X - Do What I Want", "Xikers - Superpower", "Stray Kids - Do It", "Kid Phenomenon - Party Over There",
                "Lngshot - Saucin'", "Ateez - Adrenaline", "Nexz - One Bite", "All(h)ours - Ready 2 Rumble", "One Or Eight - Tokyo Drift",
                "Cortis - RedRed", "The Jet Boy Bangerz - Gear5 + B.A.D", "Le Sserafim - Boompala", "Xikers - OKay", "Ateez - BAD", "&Team - Rush",
                "Ateez - BAD (Wedding Ver)", "Girlset - Chat", "J.Y.Park - Wet", "Cortis - Acai", "Tobii - Hotel Lobby"],
            festivals: ["Venom Fest (27.04.25)", "CoverLand (27.04.25)", "ANM Dance Festival (29.06.25)",
                "DEEPFEST SUMMER 2025 (29.06.25)", "1Y (17.08.25) - Boys", "1Y (17.08.25) - Solo/Duo With Team", "lll кубок Москвы (30.08.25)",
                "ANM Dance Festival (14.09.25)", "CoverLand (14.12.25)", "DEEPFEST WINTER 2025 (21.12.25)", "K-DOM Champ (11.01.26)",
                "ANM Dance Festival (8.02.26)", "Coolapalooza (22.03.26)", "Venom Fest (19.04.26)", "1Y (3.05.26)", "ADF (16.05.26)", "DEEPFEST SUMMER 2026 (21.06.26)",
                "ANM Dance Festival (28.06.26)", "K-POP COVER BATTLE (11.07.26)", "CHOOM BATTLE (18.07.26)", "VK ADF (18.07.26)", "1Y (30.08.26) - Solo/Duo with team",
                "1Y (30.08.26) - Who's next"],
            wins: [
                { place: 1, festival: "Venom Fest (27.04.25)" },
                { place: 1, festival: "1Y (17.08.25) - Boys" },
                { place: 1, festival: "1Y (3.05.26)" },
                { place: 1, festival: "K-POP COVER BATTLE (11.07.26)" },
                { place: 1, festival: "CHOOM BATTLE (18.07.26)" },
                { place: 2, festival: "ANM Dance Festival (8.02.26)" },
                { place: 2, festival: "DEEPFEST SUMMER 2026 (21.06.26)" },
                { place: 2, festival: "VK ADF (18.07.26)" },
                { place: 3, festival: "ANM Dance Festival (14.09.25)" },
                { place: 3, festival: "DEEPFEST WINTER 2025 (21.12.25)" },
                { place: 3, festival: "Coolapalooza (22.03.26)" }
            ],
            bonus: 500
        }
    },
    {
        id: "0103.5",
        name: "Corey",
        class: "",
        score: 0,
        photo: "corey",
        achievements: {
            projects: ["P1Harmony - Pretty Boy", "Ateez - In Your Fantasy", "XLOV - 1&Only",
                "Yena - Wicked Love", "Stray Kids - Ceremony", "All(h)ours - Gotcha", "Ateez - Shaboom",
                "Monsta X - Do What I Want", "Xikers - Superpower", "Itzy - Tunnel Vision", "Stray Kids - Do It", "Kid Phenomenon - Party Over There",
                "Lngshot - Saucin'", "Ateez - Adrenaline", "Nexz - One Bite", "All(h)ours - Ready 2 Rumble", "One Or Eight - Tokyo Drift",
                "Katseye - Pinky Up", "Cortis - RedRed", "The Jet Boy Bangerz - Gear5 + B.A.D", "Le Sserafim - Boompala", "Xikers - OKay", "Meovv - Hit 'Em",
                "Ateez - BAD", "&Team - Rush", "Ateez - BAD (Wedding Ver)", "Girlset - Chat", "J.Y.Park - Wet", "Cortis - Acai", "Tobii - Hotel Lobby"],
            festivals: ["Venom Fest (27.04.25)", "CoverLand (27.04.25)", "ANM Dance Festival (29.06.25)",
                "DEEPFEST SUMMER 2025 (29.06.25)", "1Y (17.08.25) - Boys", "1Y (17.08.25) - Solo/Duo With Team", "lll кубок Москвы (30.08.25)",
                "ANM Dance Festival (14.09.25)", "CoverLand (14.12.25)", "DEEPFEST WINTER 2025 (21.12.25)", "K-DOM Champ (11.01.26)",
                "ANM Dance Festival (8.02.26)", "Coolapalooza (22.03.26)", "Venom Fest (19.04.26)", "1Y (3.05.26)", "ADF (16.05.26)", "DEEPFEST SUMMER 2026 (21.06.26)",
                "ANM Dance Festival (28.06.26)", "K-POP COVER BATTLE (11.07.26)", "CHOOM BATTLE (18.07.26)", "VK ADF (18.07.26)", "1Y (30.08.26) - Solo/Duo with team",
                "1Y (30.08.26) - Who's next"],
            wins: [
                { place: 1, festival: "Venom Fest (27.04.25)" },
                { place: 1, festival: "1Y (17.08.25) - Boys" },
                { place: 1, festival: "1Y (3.05.26)" },
                { place: 1, festival: "K-POP COVER BATTLE (11.07.26)" },
                { place: 1, festival: "CHOOM BATTLE (18.07.26)" },
                { place: 2, festival: "ANM Dance Festival (8.02.26)" },
                { place: 2, festival: "DEEPFEST SUMMER 2026 (21.06.26)" },
                { place: 2, festival: "VK ADF (18.07.26)" },
                { place: 3, festival: "ANM Dance Festival (14.09.25)" },
                { place: 3, festival: "DEEPFEST WINTER 2025 (21.12.25)" },
                { place: 3, festival: "Coolapalooza (22.03.26)" }
            ],
            bonus: 150
        }
    },
    {
        id: "0404.4",
        name: "Budilya",
        class: "",
        score: 0,
        photo: "budilya",
        achievements: {
            projects: ["Ateez - In Your Fantasy", "Ateez - Shaboom", "Xikers - Superpower", "Lngshot - Saucin'", "Nexz - One Bite",
                "Ateez - Adrenaline", "One Or Eight - Tokyo Drift", "Katseye - Pinky Up", "Cortis - RedRed", "The Jet Boy Bangerz - Gear5 + B.A.D",
                "Le Sserafim - Boompala", "Xikers - OKay", "Ateez - BAD", "&Team - Rush", "Ateez - BAD (Wedding Ver)", "Cortis - Acai"
            ],
            festivals: ["1Y (17.08.25) - Boys", "CoverLand (14.12.25)", "K-DOM Champ (11.01.26)", "ANM Dance Festival (8.02.26)",
                "Venom Fest (19.04.26)", "1Y (3.05.26)", "ADF (16.05.26)", "DEEPFEST SUMMER 2026 (21.06.26)", "ANM Dance Festival (28.06.26)",
                "K-POP COVER BATTLE (11.07.26)", "CHOOM BATTLE (18.07.26)", "VK ADF (18.07.26)"],
            wins: [
                { place: 1, festival: "1Y (17.08.25) - Boys" },
                { place: 1, festival: "1Y (3.05.26)" },
                { place: 1, festival: "K-POP COVER BATTLE (11.07.26)" },
                { place: 1, festival: "CHOOM BATTLE (18.07.26)" },
                { place: 2, festival: "ANM Dance Festival (8.02.26)" },
                { place: 2, festival: "DEEPFEST SUMMER 2026 (21.06.26)" },
                { place: 2, festival: "VK ADF (18.07.26)" }
            ]
        }
    },
    {
        id: "1312.3",
        name: "Sai",
        class: "",
        score: 0,
        photo: "sai",
        achievements: {
            projects: ["XLOV - 1&Only", "Kid Phenomenon - Party Over There", "Lngshot - Saucin'", "Ateez - Adrenaline", "One Or Eight - Tokyo Drift",
                "The Jet Boy Bangerz - Gear5 + B.A.D", "Ateez - BAD", "Ateez - BAD (Wedding Ver)", "Girlset - Chat"],
            festivals: ["DEEPFEST WINTER 2025 (21.12.25)", "K-DOM Champ (11.01.26)", "Venom Fest (19.04.26)", "1Y (3.05.26)", "ADF (16.05.26)",
                "VK ADF (18.07.26)"],
            wins: [
                { place: 1, festival: "1Y (3.05.26)" },
                { place: 3, festival: "DEEPFEST WINTER 2025 (21.12.25)" },
                { place: 2, festival: "VK ADF (18.07.26)" }
            ]
        }
    },
    {
        id: "2710.3",
        name: "Ana",
        class: "",
        score: 0,
        photo: "ana",
        achievements: {
            projects: ["Stray Kids - Ceremony", "Stray Kids - Do It", "Nexz - One Bite", "All(h)ours - Ready 2 Rumble", "Katseye - Pinky Up",
                "Cortis - RedRed", "The Jet Boy Bangerz - Gear5 + B.A.D", "Le Sserafim - Boompala", "Xikers - OKay", "Ateez - BAD", "&Team - Rush",
                "Ateez - BAD (Wedding Ver)", "Girlset - Chat", "Cortis - Acai", "Tobii - Hotel Lobby"],
            festivals: ["ANM Dance Festival (8.02.26)", "Coolapalooza (22.03.26)", "ADF (16.05.26)", "DEEPFEST SUMMER 2026 (21.06.26)", "ANM Dance Festival (28.06.26)",
                "K-POP COVER BATTLE (11.07.26)", "CHOOM BATTLE (18.07.26)", "VK ADF (18.07.26)", "1Y (30.08.26) - Who's next"],
            wins: [
                { place: 1, festival: "K-POP COVER BATTLE (11.07.26)" },
                { place: 1, festival: "CHOOM BATTLE (18.07.26)" },
                { place: 2, festival: "ANM Dance Festival (8.02.26)" },
                { place: 2, festival: "DEEPFEST SUMMER 2026 (21.06.26)" },
                { place: 2, festival: "VK ADF (18.07.26)" },
                { place: 3, festival: "Coolapalooza (22.03.26)" }
            ]
        }
    },
    {
        id: "2401.2",
        name: "Vanyaslay",
        class: "",
        score: 0,
        photo: "vanyaslay",
        achievements: {
            projects: ["All(h)ours - Gotcha", "All(h)ours - Ready 2 Rumble", "One Or Eight - Tokyo Drift", "Le Sserafim - Boompala", "Xikers - OKay", "&Team - Rush"],
            festivals: ["lll кубок Москвы (30.08.25)", "ANM Dance Festival (14.09.25)", "Coolapalooza (22.03.26)",
                "Venom Fest (19.04.26)", "1Y (3.05.26)", "DEEPFEST SUMMER 2026 (21.06.26)", "ANM Dance Festival (28.06.26)",
                "K-POP COVER BATTLE (11.07.26)", "CHOOM BATTLE (18.07.26)"],
            wins: [
                { place: 1, festival: "1Y (3.05.26)" },
                { place: 1, festival: "K-POP COVER BATTLE (11.07.26)" },
                { place: 1, festival: "CHOOM BATTLE (18.07.26)" },
                { place: 2, festival: "DEEPFEST SUMMER 2026 (21.06.26)" },
                { place: 3, festival: "ANM Dance Festival (14.09.25)" },
                { place: 3, festival: "Coolapalooza (22.03.26)" }
            ]
        }
    },
    {
        id: "1012.3",
        name: "Tokbok",
        class: "",
        score: 0,
        photo: "tokbok",
        achievements: {
            projects: ["One Or Eight - Tokyo Drift", "&Team - Rush"],
            festivals: ["1Y (3.05.26)", "K-POP COVER BATTLE (11.07.26)"],
            wins: [
                { place: 1, festival: "1Y (3.05.26)" },
                { place: 1, festival: "K-POP COVER BATTLE (11.07.26)" }
            ]
        }
    }
];

updateRacerScores();

// === РОУТИНГ ===

async function loadContent(page, params = {}) {
    const contentDiv = document.getElementById('content');

    switch (page) {
        case 'home':
            contentDiv.innerHTML = generateHomePage();
            break;

        case 'about':
            contentDiv.innerHTML = generateAboutPage();
            break;

        case 'ranking':
            contentDiv.innerHTML = generateRankingPage();
            break;

        case 'catalog':
            contentDiv.innerHTML = generateLoading();
            await loadMissions();
            contentDiv.innerHTML = generateCatalogPage();
            break;

        case 'apply':
            contentDiv.innerHTML = generateLoading();
            await loadMissions();
            contentDiv.innerHTML = generateApplyPage(params.project || '');
            break;

        case 'upload':
            contentDiv.innerHTML = generateUploadPage();
            break;

        default:
            contentDiv.innerHTML = generateHomePage();
    }
}

function generateLoading() {
    return `
        <div style="text-align:center;padding:80px 20px;color:#0f0;font-family:'ZenDotsKir',sans-serif">
            <i class="fas fa-spinner fa-spin" style="font-size:2rem"></i>
            <p style="margin-top:20px;letter-spacing:2px">ЗАГРУЗКА...</p>
        </div>
    `;
}

// === ГЛАВНАЯ ===

function generateHomePage() {
    return `
        <div class="home-page">
            <div class="welcome-text">
                Добро пожаловать, пользователь!
                <br>Вас приветствует система RC:RC.</br>
                Ниже Вы можете перейти в интересующий Вас раздел.
            </div>
            <div class="buttons-container">
                <button class="menu-btn" onclick="loadContent('about')">
                    <i class="fas fa-info-circle"></i> О системе
                </button>
                <button class="menu-btn" onclick="loadContent('ranking')">
                    <i class="fas fa-users"></i> рэйсеры
                </button>
                <button class="menu-btn" onclick="loadContent('catalog')">
                    <i class="fas fa-folder-open"></i> каталог
                </button>
            </div>
            <div class="social-buttons-container">
                <a href="https://youtube.com/@racerccrew?si=8FXf_KD2fMxJbWgP" target="_blank" class="social-btn" rel="noopener noreferrer">
                    <i class="fab fa-youtube"></i>
                </a>
                <a href="https://t.me/racerc_crew" target="_blank" class="social-btn" rel="noopener noreferrer">
                    <i class="fab fa-telegram"></i>
                </a>
                <a href="https://www.tiktok.com/@racerc_crew?_t=ZS-8ycnyIdBAIh&_r=1" target="_blank" class="social-btn" rel="noopener noreferrer">
                    <i class="fab fa-tiktok"></i>
                </a>
                <a href="https://t.me/wellandcats/4098" target="_blank" class="social-btn" rel="noopener noreferrer">
                    <i class="fas fa-lightbulb"></i>
                </a>
            </div>
            <div style="margin-top:30px;font-size:0.75rem;opacity:0.35;text-align:center">
                <a href="#" onclick="loadContent('upload');return false;" style="color:#666;text-decoration:none;letter-spacing:2px">
                    ⚙ upload
                </a>
            </div>
        </div>
    `;
}

// === О СИСТЕМЕ ===

function generateAboutPage() {
    return `
        <div class="about-page">
            <div class="back-btn-container">
                <button class="back-btn" onclick="loadContent('home')">
                    <i class="fas fa-arrow-left"></i> Назад
                </button>
            </div>
            <h1 class="page-title">О системе</h1>
            <div class="system-info">
                <ul class="system-list">
                    <li class="system-list-main">Система rc:rc — это цифровой интеллект и проводник по мультивселенной, помогающий рэйсерам в процессе их путешествия по альтернативным реальностям.</li>
                    <li>Доступ к миссиям осуществляется по персональным ID-картам, которые определяют ранг пользователя.</li>
                    <li>Работа строится вокруг каталога готовых практик или режима "автор", позволяющего создавать собственные миры.</li>
                    <li>Рэйсеры могут действовать в одиночку или в кооперативе.</li>
                    <li>Основная задача — синхронизация с выбранной реальностью и успешное прохождение испытания, результаты которого автоматически монтируются в видеоотчет и публикуются в разделе "портфолио".</li>
                    <li>Активность пользователя влияет на его ранг.</li>
                </ul>
            </div>
        </div>
    `;
}

// === РЭЙСЕРЫ ===

function getDisplayName(racerId) {
    if (racerId === "2401.2") {
        return "Vanya<br>slay";
    }
    const racer = racersData.find(r => r.id === racerId);
    if (!racer) return "";
    return racer.name;
}

function generateRankingPage() {
    const sortedRacers = [...racersData]
        .filter(racer => racer.score >= 350)
        .sort((a, b) => b.score - a.score);

    const topTwoRacers = sortedRacers.slice(0, 2);
    const otherRacers = sortedRacers.slice(2);

    const cardHTML = (racer) => `
        <div class="id-card" onclick="openRacerAchievements('${racer.id}')">
            <div class="card-logo">racer card</div>
            <div class="racer-photo-container">
                <div class="racer-photo">
                    <img src="${racer.photo}.png" alt="${racer.name}" ${['corey', 'minka', 'tveva', 'vanyaslay', 'tokbok'].includes(racer.photo) ? 'class="zoomed"' : ''}>
                </div>
            </div>
            <div class="racer-info">
                <div class="info-item">
                    <span class="info-label">name:</span>
                    <span class="info-value">${racer.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">id:</span>
                    <span class="info-value">${racer.id}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">class:</span>
                    <span class="info-value class-value">${racer.class}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">score:</span>
                    <span class="info-value">${racer.score}</span>
                </div>
            </div>
            <div class="racer-signature">${racer.name.split(' ')[0]}</div>

            <div class="neon-stripe"></div>
        </div>
    `;

    const topTwoHTML = topTwoRacers.map(cardHTML).join('');
    const otherHTML = otherRacers.map(cardHTML).join('');

    return `
        <div class="ranking-page">
            <div class="back-btn-container">
                <button class="back-btn" onclick="loadContent('home')">
                    <i class="fas fa-arrow-left"></i> Назад
                </button>
            </div>
            <h2 class="page-title">менторы</h2>
            <div class="racers-container">
                ${topTwoHTML}
            </div>
            <h2 class="page-title">рэйсеры</h2>
            <div class="racers-container">
                ${otherHTML}
            </div>
            <div class="modal-overlay" id="racerAchievementsModal" onclick="closeRacerAchievements(event)">
                <div class="modal-content achievements-modal-content">
                    <button class="modal-close" onclick="closeRacerAchievements()">
                        <i class="fas fa-times"></i>
                    </button>
                    <div id="racerAchievementsContent"></div>
                </div>
            </div>
        </div>
    `;
}

// === МОДАЛКА ДОСТИЖЕНИЙ ===

function openRacerAchievements(racerId) {
    const racer = racersData.find(r => r.id === racerId);
    if (!racer) return;

    const achievements = racer.achievements;

    let projectsHTML = '';
    if (achievements.projects && achievements.projects.length > 0) {
        projectsHTML = achievements.projects.map(p => `<li class="achievement-item">${p}</li>`).join('');
    } else {
        projectsHTML = '<li class="achievement-item empty">Нет участий в проектах</li>';
    }

    let festivalsHTML = '';
    if (achievements.festivals && achievements.festivals.length > 0) {
        festivalsHTML = achievements.festivals.map(f => `<li class="achievement-item">${f}</li>`).join('');
    } else {
        festivalsHTML = '<li class="achievement-item empty">Нет участий на фестивалях</li>';
    }

    let winsHTML = '';
    if (achievements.wins && achievements.wins.length > 0) {
        winsHTML = achievements.wins.map(w => {
            const placeText = w.place === 1 ? '1 место' : w.place === 2 ? '2 место' : '3 место';
            return `<li class="achievement-item win-item">
                <span class="win-place">${placeText}</span>
                <span class="win-festival">${w.festival}</span>
            </li>`;
        }).join('');
    } else {
        winsHTML = '<li class="achievement-item empty">Пока нет побед</li>';
    }

    const contentHTML = `
        <div class="achievements-header">
            <div class="achievements-photo"><img src="${racer.photo}.png" alt="${racer.name}"${['corey', 'minka', 'tveva', 'vanyaslay', 'tokbok'].includes(racer.photo) ? ' class="zoomed"' : ''}></div>
            <div class="achievements-info">
                <h2 class="achievements-name">${getDisplayName(racer.id)}</h2>
                <p class="achievements-id">ID: ${racer.id}</p>
                <p class="achievements-class">${racer.class}</p>
            </div>
        </div>

        <div class="achievements-sections">
            <div class="achievement-section">
                <h3 class="section-title">
                    <i class="fas fa-rocket"></i>
                    Проекты с записью (${achievements.projects ? achievements.projects.length : 0})
                </h3>
                <ul class="achievement-list">
                    ${projectsHTML}
                </ul>
            </div>

            <div class="achievement-section">
                <h3 class="section-title">
                    <i class="fas fa-music"></i>
                    Фесты (${achievements.festivals ? achievements.festivals.length : 0})
                </h3>
                <ul class="achievement-list">
                    ${festivalsHTML}
                </ul>
            </div>

            <div class="achievement-section">
                <h3 class="section-title">
                    <i class="fas fa-trophy"></i>
                    Победы (${achievements.wins ? achievements.wins.length : 0})
                </h3>
                <ul class="achievement-list wins-list">
                    ${winsHTML}
                </ul>
            </div>
        </div>
    `;

    document.getElementById('racerAchievementsContent').innerHTML = contentHTML;

    const modal = document.getElementById('racerAchievementsModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
    }
}

function closeRacerAchievements(event) {
    if (!event || event.target === event.currentTarget || event.target.closest('.modal-close')) {
        const modal = document.getElementById('racerAchievementsModal');
        if (modal) {
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            document.body.style.overflow = '';
        }
    }
}

// === КАТАЛОГ ХОРЕОГРАФИЙ ===

function generateCatalogPage() {
    if (!missionData || missionData.length === 0) {
        return `
            <div class="catalog-page">
                <div class="back-btn-container">
                    <button class="back-btn" onclick="loadContent('home')">
                        <i class="fas fa-arrow-left"></i> Назад
                    </button>
                </div>
                <h1 class="page-title">Каталог хореографий</h1>
                <div class="catalog-empty">
                    <i class="fas fa-folder-open"></i>
                    <p>Каталог пока пуст</p>
                    <p class="catalog-empty-sub">Следи за обновлениями — хореографии появятся здесь после публикации</p>
                </div>
            </div>
        `;
    }

    const sorted = [...missionData].sort((a, b) => b.id - a.id);

    const cardsHTML = sorted.map(mission => `
        <div class="catalog-card">
            <div class="catalog-img">
                <img src="${mission.image}.jpeg" alt="${mission.name}"
                     onerror="this.src='${mission.image}.png'; this.onerror=function(){this.style.display='none'; this.parentElement.innerHTML='<span style=\\'color:#666;font-size:3rem\\'>📷</span>'}">
                <div class="catalog-badge">ID ${mission.id}</div>
            </div>
            <div class="catalog-body">
                <h3 class="catalog-title">${mission.name}</h3>
                <div class="catalog-actions">
                    <a href="${mission.link}" target="_blank" rel="noopener noreferrer" class="catalog-btn catalog-btn-watch">
                        <i class="fas fa-play"></i> Смотреть
                    </a>
                    <button class="catalog-btn catalog-btn-apply"
                            onclick="loadContent('apply', { project: 'Миссия ${mission.id}' })">
                        <i class="fas fa-paper-plane"></i> Откликнуться
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    return `
        <div class="catalog-page">
            <div class="back-btn-container">
                <button class="back-btn" onclick="loadContent('home')">
                    <i class="fas fa-arrow-left"></i> Назад
                </button>
            </div>
            <h1 class="page-title">Каталог хореографий</h1>
            <div class="catalog-info">
                Выбери хореографию и нажми «Откликнуться» — форма заявки откроется
                с уже выбранным проектом.
            </div>
            <div class="catalog-grid">
                ${cardsHTML}
            </div>
        </div>
    `;
}

// === СТРАНИЦА ЗАЯВКИ ===

function generateApplyPage(preselectedProject = '') {
    const allProjects = [...missionData].sort((a, b) => b.id - a.id);

    const projectsOptions = allProjects.map(p => {
        const selected = (String(p.name) === String(preselectedProject)) ? ' selected' : '';
        return `<option value="${p.name}"${selected}>${p.name}</option>`;
    }).join('');

    return `
        <div class="apply-page">
            <div class="back-btn-container">
                <button class="back-btn" onclick="loadContent('catalog')">
                    <i class="fas fa-arrow-left"></i> К каталогу
                </button>
            </div>
            <h1 class="page-title">Заявка на хореографию</h1>

            <div class="apply-info">
                Заполни форму — заявка уйдёт напрямую организаторам.
                Мы свяжемся с тобой в Telegram.
            </div>

            <form id="applyForm" class="apply-form" onsubmit="submitApplication(event)">
                <input type="text" name="website" id="applyWebsite"
                       class="hp-field" tabindex="-1" autocomplete="off">

                <div class="form-group">
                    <label for="applyName">Имя / Ник <span class="required">*</span></label>
                    <input type="text" id="applyName" name="name"
                           placeholder="Например: Kento" required maxlength="50">
                </div>

                <div class="form-group">
                    <label for="applyTelegram">Telegram для связи <span class="required">*</span></label>
                    <input type="text" id="applyTelegram" name="telegram"
                           placeholder="@username" required maxlength="50">
                </div>

                <div class="form-group">
                    <label for="applyProject">На какую хореографию откликаешься? <span class="required">*</span></label>
                    <select id="applyProject" name="project" required>
                        <option value="">— Выбери проект —</option>
                        ${projectsOptions}
                        <option value="Другое">Другое (напишу в комментарии)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="applyExperience">Опыт / уровень</label>
                    <select id="applyExperience" name="experience">
                        <option value="Новичок">Новичок</option>
                        <option value="Любитель">Любитель (1-2 года)</option>
                        <option value="Продвинутый">Продвинутый (3+ года)</option>
                        <option value="Профессионал">Профессионал</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="applyAbout">О себе / ссылки на видео</label>
                    <textarea id="applyAbout" name="about" rows="4"
                              placeholder="Пара слов о себе, ссылки на твои видео..."
                              maxlength="500"></textarea>
                </div>

                <div class="form-status" id="applyStatus"></div>

                <button type="submit" class="submit-btn" id="applySubmitBtn">
                    <i class="fas fa-paper-plane"></i> Отправить заявку
                </button>
            </form>
        </div>
    `;
}

// === ОТПРАВКА ЗАЯВКИ ===

const APPLY_COOLDOWN_MS = 60 * 1000;
const APPLY_STORAGE_KEY = 'rcrc_last_apply';

function canSubmitApplication() {
    try {
        const last = parseInt(localStorage.getItem(APPLY_STORAGE_KEY) || '0', 10);
        const now = Date.now();
        if (now - last < APPLY_COOLDOWN_MS) {
            const left = Math.ceil((APPLY_COOLDOWN_MS - (now - last)) / 1000);
            return { ok: false, secondsLeft: left };
        }
        return { ok: true };
    } catch (e) {
        return { ok: true };
    }
}

function markApplicationSent() {
    try {
        localStorage.setItem(APPLY_STORAGE_KEY, String(Date.now()));
    } catch (e) { /* ignore */ }
}

async function submitApplication(event) {
    event.preventDefault();

    const form = event.target;
    const statusEl = document.getElementById('applyStatus');
    const submitBtn = document.getElementById('applySubmitBtn');

    if (form.website && form.website.value.trim() !== '') {
        statusEl.textContent = 'Заявка отправлена!';
        statusEl.className = 'form-status success';
        form.reset();
        return;
    }

    const rl = canSubmitApplication();
    if (!rl.ok) {
        statusEl.textContent = `Подожди ${rl.secondsLeft} сек. перед следующей заявкой.`;
        statusEl.className = 'form-status error';
        return;
    }

    const name = form.name.value.trim();
    const telegram = form.telegram.value.trim();
    const project = form.project.value;
    const experience = form.experience.value;
    const about = form.about.value.trim();

    if (!name || !telegram || !project) {
        statusEl.textContent = 'Заполни обязательные поля.';
        statusEl.className = 'form-status error';
        return;
    }

    if (name.length > 50 || telegram.length > 50 || about.length > 500) {
        statusEl.textContent = 'Слишком длинный текст в одном из полей.';
        statusEl.className = 'form-status error';
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    const time = new Date().toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    const text = [
        '🏁 <b>НОВАЯ ЗАЯВКА RC:RC</b>',
        '',
        `👤 <b>Имя:</b> ${escapeHtml(name)}`,
        `✈️ <b>Telegram:</b> ${escapeHtml(telegram)}`,
        `🎬 <b>Проект:</b> ${escapeHtml(project)}`,
        `⭐ <b>Опыт:</b> ${escapeHtml(experience)}`,
        about ? `📝 <b>О себе:</b>\n${escapeHtml(about)}` : '',
        '',
        `🕒 ${time}`
    ].filter(Boolean).join('\n');

    try {
        const url = `https://api.telegram.org/bot${CONFIG.APPLY_BOT_TOKEN}/sendMessage`;
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CONFIG.APPLY_CHAT_ID,
                text: text,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        });

        const data = await resp.json();

        if (!resp.ok || !data.ok) {
            throw new Error(data.description || 'Ошибка Telegram API');
        }

        statusEl.textContent = '✅ Заявка отправлена! Мы свяжемся с тобой в Telegram.';
        statusEl.className = 'form-status success';
        markApplicationSent();
        form.reset();

        setTimeout(() => {
            if (document.getElementById('applyForm')) {
                loadContent('catalog');
            }
        }, 8000);

    } catch (err) {
        console.error('Apply error:', err);
        statusEl.textContent = '❌ Не удалось отправить. Попробуй позже или напиши нам в Telegram ' +
            CONFIG.CONTACT_USERNAME + '.';
        statusEl.className = 'form-status error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить заявку';
    }
}

// === СТРАНИЦА UPLOAD (для организаторов) ===

function generateUploadPage() {
    return `
        <div class="upload-page">
            <div class="back-btn-container">
                <button class="back-btn" onclick="loadContent('home')">
                    <i class="fas fa-arrow-left"></i> Назад
                </button>
            </div>
            <h1 class="page-title">Добавить миссию</h1>

            <div class="apply-info">
                Заполни данные — миссия автоматически закоммитится в GitHub
                через Cloudflare Worker. Через минуту появится в каталоге.
            </div>

            <form class="apply-form" onsubmit="submitMission(event)">
                <div class="form-group">
                    <label for="missionId">ID миссии <span class="required">*</span></label>
                    <input type="number" id="missionId" required min="1" placeholder="33">
                </div>

                <div class="form-group">
                    <label for="missionImage">Кодовое имя картинки <span class="required">*</span></label>
                    <input type="text" id="missionImage" required
                           placeholder="lobby" maxlength="40"
                           pattern="[a-z0-9_]+"
                           title="Только латиница в нижнем регистре, цифры и подчёркивания">
                </div>

                <div class="form-group">
                    <label for="missionLink">Ссылка на YouTube <span class="required">*</span></label>
                    <input type="url" id="missionLink" required
                           placeholder="https://youtu.be/xxxxxxxxxxx">
                </div>

                <div class="form-status" id="missionStatus"></div>

                <button type="submit" class="submit-btn">
                    <i class="fas fa-paper-plane"></i> Отправить в GitHub
                </button>
            </form>
        </div>
    `;
}

async function submitMission(event) {
    event.preventDefault();
    const statusEl = document.getElementById('missionStatus');

    const id = parseInt(document.getElementById('missionId').value, 10);
    const image = document.getElementById('missionImage').value.trim();
    const link = document.getElementById('missionLink').value.trim();

    if (!id || !image || !link) {
        statusEl.textContent = 'Заполни все поля.';
        statusEl.className = 'form-status error';
        return;
    }

    statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка в GitHub...';
    statusEl.className = 'form-status';

    try {
        const resp = await fetch(CONFIG.GITHUB_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mission: { id: id, link: link, image: image }
            })
        });

        const data = await resp.json();

        if (data.ok) {
            statusEl.innerHTML = `
                ✅ <b>Миссия ${id} добавлена в GitHub!</b><br>
                <a href="${data.commit}" target="_blank" style="color:#0f0">Посмотреть коммит</a><br>
                <span style="font-size:0.85rem;opacity:0.7">Подожди ~1 минуту, пока GitHub Pages обновится</span>
            `;
            statusEl.className = 'form-status success';

            // Сбрасываем кеш миссий, чтобы при следующем заходе подтянулись новые
            missionsLoaded = false;
            missionsLoadPromise = null;
        } else {
            throw new Error(data.error || 'Ошибка');
        }
    } catch (e) {
        console.error('Mission submit error:', e);
        statusEl.textContent = '❌ Ошибка: ' + e.message;
        statusEl.className = 'form-status error';
    }
}

// === УТИЛИТЫ ===

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// === ЭФФЕКТЫ ФОНА ===

function createIntenseMatrix() {
    const matrixContainer = document.getElementById('matrixContainer');
    if (!matrixContainer) return;

    const digits = ['0', '1', '101', '010', '110', '001', '100', '011'];

    for (let i = 0; i < 50; i++) {
        const digit = document.createElement('div');
        digit.className = 'matrix-digit';
        digit.textContent = digits[Math.floor(Math.random() * digits.length)];

        digit.style.left = `${Math.random() * 100}%`;
        digit.style.top = `${Math.random() * 100}%`;

        const duration = 8 + Math.random() * 15;
        const delay = Math.random() * 5;
        digit.style.animationDuration = `${duration}s`;
        digit.style.animationDelay = `${delay}s`;

        const size = 1.5 + Math.random() * 1.5;
        digit.style.fontSize = `${size}rem`;

        matrixContainer.appendChild(digit);
    }

    setInterval(() => {
        const digits = matrixContainer.querySelectorAll('.matrix-digit');
        digits.forEach(digit => {
            digit.style.left = `${Math.random() * 100}%`;
            digit.style.top = `${Math.random() * 100}%`;
        });
    }, 30000);
}

function addRandomSkew() {
    const cards = document.querySelectorAll('.id-card');

    if (window.innerWidth <= 480) {
        cards.forEach(card => {
            card.style.transform = 'none';
        });
        return;
    }

    cards.forEach(card => {
        const rotateY = (Math.random() * 10 - 5);
        const rotateX = (Math.random() * 6 - 3);
        const rotateZ = (Math.random() * 4 - 2);

        card.style.transform = `perspective(500px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`;
    });
}

// === ИНИЦИАЛИЗАЦИЯ ===

document.addEventListener('DOMContentLoaded', function () {
    loadContent('home');
    createIntenseMatrix();

    const tracks = document.querySelectorAll('.tire-track');
    tracks.forEach(track => {
        track.style.animation = `track-move ${20 + Math.random() * 20}s linear infinite`;
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes track-move {
            0% { opacity: 0.1; transform: translateX(0) rotate(20deg); }
            50% { opacity: 0.4; }
            100% { opacity: 0.1; transform: translateX(100px) rotate(20deg); }
        }

        @keyframes neon-pulse {
            0% { opacity: 0.3; }
            50% { opacity: 0.8; }
            100% { opacity: 0.3; }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        const neonElements = document.querySelectorAll('.neon-stripe, .class-value, .logo-glow');
        neonElements.forEach(el => {
            el.style.animation = 'neon-pulse 2s infinite alternate';
        });
    }, 1000);

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                setTimeout(addRandomSkew, 100);
            }
        });
    });

    const contentDiv = document.getElementById('content');
    if (contentDiv) {
        observer.observe(contentDiv, { childList: true });
    }
});

window.addEventListener('resize', function () {
    addRandomSkew();
});

updateRacerScores();
