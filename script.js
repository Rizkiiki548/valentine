window.addEventListener("DOMContentLoaded", () => {
  // =======================
  // PAGE SYSTEM
  // =======================
  const pages = [...document.querySelectorAll(".page")];
  let current = 0;

  function showPage(i) {
    if (i < 0 || i >= pages.length) return;

    // cleanup saat keluar page tertentu
    if (current === 3) stopLetterTypewriter(true);
    if (current === 4) stopHeartGameTimers();
    if (current === 7) stopVideoAndRestore();

    pages[current]?.classList.remove("active", "in");
    pages[i]?.classList.add("active");
    requestAnimationFrame(() => pages[i]?.classList.add("in"));

    current = i;
    window.scrollTo({ top: 0, behavior: "smooth" });

    // enter hooks
    if (current === 3) startLetterTypewriter();
    if (current === 4) resetHeartGame();
    if (current === 5) resetMemoryGame();
    if (current === 6) renderMemoriesOneByOne();
    if (current === 7) openVideoModal();
    if (current === 0) resetLetterTypewriter();
  }

  document.querySelectorAll("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;

      // START MUSIC pas pindah dari Page 0 -> Page 1
      if (current === 0) startBgmOnce();

      showPage(current + 1);
    });
  });

  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => showPage(Number(btn.dataset.go)));
  });

  requestAnimationFrame(() => pages[0]?.classList.add("in"));

  // =======================
  // FLOATING HEARTS BACKGROUND
  // =======================
  const heartsBg = document.getElementById("hearts");
  const heartChars = ["❤", "💗", "💞", "💖"];

  function spawnBgHeart() {
    if (!heartsBg) return;

    const s = document.createElement("span");
    s.className = "floating-heart";
    s.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];

    const size = 12 + Math.random() * 22;
    s.style.left = Math.random() * 100 + "%";
    s.style.fontSize = size + "px";
    s.style.animationDuration = 6 + Math.random() * 8 + "s";
    s.style.setProperty("--drift", ((Math.random() * 2 - 1) * 120).toFixed(0) + "px");
    s.style.opacity = (0.1 + Math.random() * 0.18).toFixed(2);

    heartsBg.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
  }

  for (let i = 0; i < 10; i++) setTimeout(spawnBgHeart, i * 260);
  setInterval(spawnBgHeart, 520);

  // =======================
  // PHOTO SYNC
  // =======================
  const bubblePhoto = document.getElementById("bubblePhoto");
  const openCardImg = document.getElementById("openCardImg");
  const gamePhoto1 = document.getElementById("gamePhoto1");
  const gamePhoto2 = document.getElementById("gamePhoto2");
  const modalPreview = document.getElementById("modalPreview");

  function syncPhoto(src) {
    if (openCardImg) openCardImg.src = src;
    if (gamePhoto1) gamePhoto1.src = src;
    if (gamePhoto2) gamePhoto2.src = src;
    if (modalPreview) modalPreview.src = src;
  }
  syncPhoto(bubblePhoto?.src || "foto/1.jpeg");

  // =======================
  // MODAL FOTO (OPEN IT)
  // =======================
  const openBtn = document.getElementById("openBtn");
  const noBtn = document.getElementById("noBtn");
  const photoModal = document.getElementById("photoModal");
  const modalOk = document.getElementById("modalOk");

  function openPhotoModal() {
    if (!photoModal) return;
    syncPhoto(bubblePhoto?.src || "foto/1.jpeg");
    photoModal.classList.add("show");
    photoModal.setAttribute("aria-hidden", "false");
  }
  function closePhotoModal() {
    if (!photoModal) return;
    photoModal.classList.remove("show");
    photoModal.setAttribute("aria-hidden", "true");
  }

  openBtn?.addEventListener("click", openPhotoModal);
  noBtn?.addEventListener("click", () => showPage(2));

  modalOk?.addEventListener("click", () => {
    closePhotoModal();
    showPage(3);
  });

  document.querySelectorAll("[data-close='photoModal']").forEach((el) => {
    el.addEventListener("click", closePhotoModal);
  });

  // =======================
  // BACKSOUND + MUTE BUTTON
  // =======================
  const bgm = document.getElementById("bgm");
  const muteBtn = document.getElementById("muteBtn");
  let bgmStarted = false;

  function updateMuteIcon() {
    if (!muteBtn || !bgm) return;
    muteBtn.textContent = bgm.muted ? "🔇" : "🔊";
  }

  function startBgmOnce() {
    if (!bgm || bgmStarted) return;

    bgmStarted = true;
    bgm.volume = 0.6;
    bgm.muted = false;
    updateMuteIcon();

    bgm.play().catch(() => {
      // kalau masih diblok (jarang), biarin user klik mute
      bgmStarted = false;
    });
  }

  muteBtn?.addEventListener("click", async () => {
    if (!bgm) return;

    if (!bgmStarted) startBgmOnce();

    bgm.muted = !bgm.muted;
    updateMuteIcon();

    if (!bgm.muted && bgm.paused) {
      try {
        await bgm.play();
      } catch (e) {}
    }
  });

  // =======================
  // CONFETTI (MERIAH)
  // =======================
  function burstConfetti() {
    const layer = document.createElement("div");
    layer.className = "confetti";
    document.body.appendChild(layer);

    const icons = ["💗", "💖", "✨", "💞", "❤️", "🎀", "🌸"];
    const COUNT = 90; // rame
    const GAP = 150; // jarak wave

    function spawnWave(mult = 1) {
      for (let i = 0; i < COUNT; i++) {
        const s = document.createElement("div");
        s.className = "conf";
        s.textContent = icons[Math.floor(Math.random() * icons.length)];

        s.style.left = Math.random() * 100 + "vw";

        const size = 12 + Math.random() * 22;
        s.style.fontSize = size * mult + "px";

        const dx = (Math.random() * 2 - 1) * (140 + Math.random() * 160);
        s.style.setProperty("--dx", dx.toFixed(0) + "px");

        const rot = (140 + Math.random() * 520) * (Math.random() < 0.5 ? -1 : 1);
        s.style.setProperty("--rot", rot.toFixed(0) + "deg");

        const dur = 0.95 + Math.random() * 1.0;
        s.style.animationDuration = dur.toFixed(2) + "s";

        const delay = Math.random() * 0.16;
        s.style.animationDelay = delay.toFixed(2) + "s";

        layer.appendChild(s);
      }
    }

    spawnWave(1);
    setTimeout(() => spawnWave(0.9), GAP);

    setTimeout(() => layer.remove(), 2400);
  }

  // =======================
  // TYPEWRITER LETTER (PAGE 3)
  // =======================
  const letterPage = document.querySelector('.page[data-page="3"]');
  const letterBox = letterPage?.querySelector(".letter");
  const letterNextBtn = letterPage?.querySelector("[data-next]");

  let letterParts = null;
  let letterOriginalHTML = "";
  let letterTyping = false;
  let letterTypedOnce = false;
  let letterTimer = null;

  const TYPE_SPEED = 18;
  const PARA_PAUSE = 180;

  function prepareLetterData() {
    if (!letterBox || letterParts) return;

    letterOriginalHTML = letterBox.innerHTML;
    const ps = [...letterBox.querySelectorAll("p")];

    letterParts = ps.map((p) => ({
      text: (p.textContent || "").trim(),
      html: (p.innerHTML || "").trim(),
    }));
  }

  function resetLetterTypewriter() {
    if (!letterBox) return;
    if (!letterParts) prepareLetterData();

    letterTypedOnce = false;
    letterTyping = false;

    if (letterTimer) {
      clearTimeout(letterTimer);
      letterTimer = null;
    }

    if (letterOriginalHTML) letterBox.innerHTML = letterOriginalHTML;
    if (letterNextBtn) letterNextBtn.disabled = false;
  }

  function stopLetterTypewriter(showFull = true) {
    if (letterTimer) {
      clearTimeout(letterTimer);
      letterTimer = null;
    }
    if (!letterBox) return;

    letterTyping = false;
    if (showFull && letterOriginalHTML) letterBox.innerHTML = letterOriginalHTML;

    if (letterNextBtn) letterNextBtn.disabled = false;
    letterTypedOnce = true;
  }

  function startLetterTypewriter() {
    if (!letterBox) return;
    if (!letterParts) prepareLetterData();
    if (!letterParts || letterParts.length === 0) return;
    if (letterTypedOnce || letterTyping) return;

    letterTyping = true;
    if (letterNextBtn) letterNextBtn.disabled = true;

    letterBox.innerHTML = "";
    const pEls = letterParts.map(() => {
      const p = document.createElement("p");
      p.textContent = "";
      letterBox.appendChild(p);
      return p;
    });

    const caret = document.createElement("span");
    caret.className = "letterCaret";
    caret.textContent = "▌";

    let pi = 0;
    let ci = 0;

    function tick() {
      if (!letterTyping) return;

      const part = letterParts[pi];
      const p = pEls[pi];

      p.textContent = part.text.slice(0, ci + 1);
      p.appendChild(caret);
      ci++;

      if (ci >= part.text.length) {
        p.innerHTML = part.html;
        p.appendChild(caret);

        pi++;
        ci = 0;

        if (pi >= letterParts.length) {
          stopLetterTypewriter(true);
          return;
        }

        letterTimer = setTimeout(tick, PARA_PAUSE);
        return;
      }

      letterTimer = setTimeout(tick, TYPE_SPEED);
    }

    tick();
  }

  // klik Next saat masih ngetik => tampil full dulu
  letterNextBtn?.addEventListener(
    "click",
    (e) => {
      if (letterTyping) {
        e.preventDefault();
        e.stopPropagation();
        stopLetterTypewriter(true);
      }
    },
    true,
  );

  letterBox?.addEventListener("click", () => {
    if (letterTyping) stopLetterTypewriter(true);
  });

  // =======================
  // GAME 1: TAP HEARTS (FIX)
  // =======================
  const heartArena = document.getElementById("heartArena");
  const heartTargetEl = document.getElementById("heartTarget");
  const heartTimeEl = document.getElementById("heartTime");
  const heartScoreEl = document.getElementById("heartScore");
  const heartMsg = document.getElementById("heartMsg");
  const heartStartBtn = document.getElementById("heartStartBtn");
  const heartNextBtn = document.getElementById("heartNextBtn");

  const HEART_TARGET = 2;
  const HEART_TIME = 10;
  const MAX_ITEMS = 7;

  let heartScore = 0;
  let timeLeft = HEART_TIME;
  let heartRunning = false;

  let heartTimer = null;
  let spawnTimer = null;

  function stopHeartGameTimers() {
    if (heartTimer) {
      clearInterval(heartTimer);
      heartTimer = null;
    }
    if (spawnTimer) {
      clearInterval(spawnTimer);
      spawnTimer = null;
    }
  }

  function resetHeartGame() {
    stopHeartGameTimers();
    heartRunning = false;
    heartScore = 0;
    timeLeft = HEART_TIME;

    if (heartArena) heartArena.innerHTML = "";
    if (heartTargetEl) heartTargetEl.textContent = String(HEART_TARGET);
    if (heartTimeEl) heartTimeEl.textContent = String(HEART_TIME);
    if (heartScoreEl) heartScoreEl.textContent = "0";
    if (heartMsg) heartMsg.textContent = "Klik hati yang muncul ya 😳💗";

    if (heartNextBtn) heartNextBtn.disabled = true;
    if (heartStartBtn) heartStartBtn.disabled = false;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnPopItem() {
    if (!heartArena || !heartRunning) return;

    const existing = heartArena.querySelectorAll(".popItem").length;
    if (existing >= MAX_ITEMS) return;

    const item = document.createElement("div");
    item.className = "popItem";

    const isHeart = Math.random() < 0.8;
    item.dataset.type = isHeart ? "heart" : "oops";
    item.textContent = isHeart ? "💖" : "😳";
    item.style.fontSize = `${isHeart ? rand(28, 46) : rand(26, 42)}px`;

    const rect = heartArena.getBoundingClientRect();
    const w = Math.max(40, rect.width);
    const h = Math.max(40, rect.height);

    item.style.left = `${rand(20, w - 20)}px`;
    item.style.top = `${rand(20, h - 20)}px`;

    item.addEventListener("click", () => {
      if (!heartRunning) return;

      if (item.dataset.type === "heart") {
        heartScore++;
        if (heartScoreEl) heartScoreEl.textContent = String(heartScore);
        if (heartMsg) heartMsg.textContent = "Nicee! 💖";

        if (heartScore >= HEART_TARGET) winHeartGame();
      } else {
        heartScore = Math.max(0, heartScore - 1);
        if (heartScoreEl) heartScoreEl.textContent = String(heartScore);
        if (heartMsg) heartMsg.textContent = "Eit salah! itu 😳 (score -1)";
      }
      item.remove();
    });

    heartArena.appendChild(item);
    setTimeout(() => item.remove(), isHeart ? rand(850, 1300) : rand(700, 1100));
  }

  function winHeartGame() {
    // kalau kamu punya confetti:
    if (typeof burstConfetti === "function") burstConfetti();

    heartRunning = false;
    stopHeartGameTimers();

    if (heartMsg) heartMsg.textContent = "MENANG! 💖 Sekarang boleh klik Next 😳✨";
    if (heartNextBtn) heartNextBtn.disabled = false;
    if (heartStartBtn) heartStartBtn.disabled = false;

    heartArena?.querySelectorAll(".popItem").forEach((el) => el.remove());
  }

  function loseHeartGame() {
    heartRunning = false;
    stopHeartGameTimers();

    if (heartMsg) heartMsg.textContent = "Wahh hampir 😭 Coba Start lagi ya!";
    if (heartStartBtn) heartStartBtn.disabled = false;
    if (heartNextBtn) heartNextBtn.disabled = true;

    heartArena?.querySelectorAll(".popItem").forEach((el) => el.remove());
  }

  function startHeartGame() {
    resetHeartGame();
    if (!heartArena) return;

    heartRunning = true;
    if (heartStartBtn) heartStartBtn.disabled = true;

    heartTimer = setInterval(() => {
      if (!heartRunning) return;
      timeLeft--;
      if (heartTimeEl) heartTimeEl.textContent = String(timeLeft);
      if (timeLeft <= 0) loseHeartGame();
    }, 1000);

    spawnTimer = setInterval(spawnPopItem, 240);
  }

  heartStartBtn?.addEventListener("click", startHeartGame);

  // init state (biar pas masuk page 4 udah siap)
  resetHeartGame();

  // =======================
  // GAME 2: MEMORY PAIRS
  // =======================
  const memGridEl = document.getElementById("memoryGrid");
  const memMovesEl = document.getElementById("memMoves");
  const memMatchEl = document.getElementById("memMatch");
  const memTotalEl = document.getElementById("memTotal");
  const memStatusEl = document.getElementById("memStatus");
  const memMsgEl = document.getElementById("memMsg");
  const memRestartBtn = document.getElementById("memRestartBtn");
  const memNextBtn = document.getElementById("memNextBtn");

  const PAIRS = [
    { pairId: 1, a: "Aku", b: "Kamu" },
    { pairId: 2, a: "Kangen", b: "Sini" },
    { pairId: 3, a: "Peluk", b: "Cium" },
    { pairId: 4, a: "Bucin", b: "Kamu doang" },
  ];

  let deck = [];
  let first = null;
  let second = null;
  let lock = false;
  let moves = 0;
  let matched = 0;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function updateMemUI() {
    if (memMovesEl) memMovesEl.textContent = String(moves);
    if (memMatchEl) memMatchEl.textContent = String(matched);
    if (memTotalEl) memTotalEl.textContent = String(PAIRS.length);
  }

  function resetMemoryGame() {
    const cards = [];
    PAIRS.forEach((p) => {
      cards.push({ value: p.a, pairId: p.pairId, matched: false });
      cards.push({ value: p.b, pairId: p.pairId, matched: false });
    });

    deck = shuffle(cards).map((c, idx) => ({ ...c, id: idx }));

    first = null;
    second = null;
    lock = false;
    moves = 0;
    matched = 0;

    if (memStatusEl) memStatusEl.textContent = "Main dulu ya 😼";
    if (memMsgEl) memMsgEl.textContent = "Cocokin pasangan bucin-nya ya 😳💞";
    if (memNextBtn) memNextBtn.disabled = true;

    updateMemUI();

    if (!memGridEl) return;
    memGridEl.innerHTML = "";

    deck.forEach((card) => {
      const btn = document.createElement("button");
      btn.className = "memCard hidden";
      btn.type = "button";
      btn.textContent = card.value;
      btn.addEventListener("click", () => onMemClick(card, btn));
      memGridEl.appendChild(btn);
    });
  }

  function reveal(btn) {
    btn.classList.remove("hidden");
    btn.classList.add("revealed");
  }
  function hide(btn) {
    btn.classList.add("hidden");
    btn.classList.remove("revealed");
  }
  function setMatched(btn) {
    btn.classList.remove("hidden", "revealed", "wrong");
    btn.classList.add("matched");
    btn.disabled = true;
  }

  function winMemory() {
    burstConfetti();
    if (memStatusEl) memStatusEl.textContent = "MENANG! 💞";
    if (memMsgEl) memMsgEl.textContent = "Cieee cocok semua 😳💗 Klik Next yaa!";
    if (memNextBtn) memNextBtn.disabled = false;
  }

  function onMemClick(card, btn) {
    if (lock) return;
    if (card.matched) return;
    if (btn.classList.contains("revealed") || btn.classList.contains("matched")) return;

    reveal(btn);

    if (!first) {
      first = { card, btn };
      return;
    }

    second = { card, btn };
    moves++;
    updateMemUI();

    const isMatch = first.card.pairId === second.card.pairId && first.card !== second.card;

    if (isMatch) {
      first.card.matched = true;
      second.card.matched = true;
      matched++;
      updateMemUI();

      setMatched(first.btn);
      setMatched(second.btn);

      first = null;
      second = null;

      if (memStatusEl) memStatusEl.textContent = "Cocok! 💚";
      if (matched >= PAIRS.length) winMemory();
      return;
    }

    lock = true;
    if (memStatusEl) memStatusEl.textContent = "Belum cocok 😭";

    first.btn.classList.add("wrong");
    second.btn.classList.add("wrong");

    setTimeout(() => {
      first.btn.classList.remove("wrong");
      second.btn.classList.remove("wrong");
      hide(first.btn);
      hide(second.btn);

      first = null;
      second = null;
      lock = false;

      if (memStatusEl) memStatusEl.textContent = "Coba lagi 😼";
    }, 650);
  }

  memRestartBtn?.addEventListener("click", resetMemoryGame);

  // =======================
  // MEMORIES APPEAR 1-1
  // =======================
  const rotations = [-3.5, 2.2, -1.2, 3.0, -2.0, 1.6];
  const PHOTO_DIR = "foto/";
  const memories = [
    { src: PHOTO_DIR + "memories5.webp", cap: "memory #1" },
    { src: PHOTO_DIR + "memories1.jpg", cap: "memory #2" },
    { src: PHOTO_DIR + "memories2.jpg", cap: "memory #3" },
    { src: PHOTO_DIR + "memories3.jpg", cap: "memory #4" },
    { src: PHOTO_DIR + "memories4.jpg", cap: "memory #5" },
    { src: PHOTO_DIR + "memories6.JPG", cap: "memory #6" },
  ];

  function renderMemoriesOneByOne() {
    const memGrid = document.getElementById("memGrid");
    if (!memGrid) return;

    memGrid.innerHTML = "";
    memories.forEach((m, idx) => {
      const card = document.createElement("div");
      card.className = "polaroid";
      card.style.setProperty("--rot", rotations[idx % rotations.length] + "deg");

      const img = document.createElement("img");
      img.src = m.src;

      const cap = document.createElement("div");
      cap.className = "cap";
      cap.textContent = m.cap;

      card.appendChild(img);
      card.appendChild(cap);
      memGrid.appendChild(card);

      setTimeout(() => card.classList.add("show"), 200 * idx);
    });
  }

  // =======================
  // VIDEO POPUP + AUTO MUTE BGM
  // (butuh HTML: #finalVideo, #videoModal, #videoPlayBtn, #videoCancelBtn)
  // =======================
  const finalVideo = document.getElementById("finalVideo");
  const videoModal = document.getElementById("videoModal");
  const videoPlayBtn = document.getElementById("videoPlayBtn");
  const videoCancelBtn = document.getElementById("videoCancelBtn");

  let bgmMutedBeforeVideo = null;

  function openVideoModal() {
    if (!videoModal) return;

    if (finalVideo) {
      finalVideo.pause();
      finalVideo.currentTime = 0;
    }

    videoModal.classList.add("show");
    videoModal.setAttribute("aria-hidden", "false");
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove("show");
    videoModal.setAttribute("aria-hidden", "true");
  }

  function muteBgmForVideo() {
    if (!bgm) return;
    if (bgmMutedBeforeVideo === null) bgmMutedBeforeVideo = bgm.muted;

    bgm.muted = true;
    updateMuteIcon();
  }

  function restoreBgmAfterVideo() {
    if (!bgm) return;
    if (bgmMutedBeforeVideo === null) return;

    bgm.muted = bgmMutedBeforeVideo;
    bgmMutedBeforeVideo = null;
    updateMuteIcon();
  }

  function stopVideoAndRestore() {
    if (finalVideo) {
      finalVideo.pause();
      finalVideo.currentTime = 0;
    }
    restoreBgmAfterVideo();
    closeVideoModal();
  }

  videoPlayBtn?.addEventListener("click", async () => {
    closeVideoModal();
    if (!finalVideo) return;

    muteBgmForVideo();
    try {
      await finalVideo.play();
    } catch (e) {}
  });

  videoCancelBtn?.addEventListener("click", () => {
    closeVideoModal();
    showPage(6);
  });

  document.querySelectorAll("[data-close='videoModal']").forEach((el) => {
    el.addEventListener("click", () => {
      closeVideoModal();
      showPage(6);
    });
  });

  finalVideo?.addEventListener("play", () => {
    muteBgmForVideo();
  });

  finalVideo?.addEventListener("ended", () => {
    restoreBgmAfterVideo();
  });

  // =======================
  // INIT
  // =======================
  resetHeartGame();
  resetMemoryGame();
});
