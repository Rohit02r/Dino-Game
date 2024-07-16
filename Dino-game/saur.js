document.addEventListener('DOMContentLoaded', () => {
    const WIDTH = 500;
    const HEIGHT = 700;
    const FRAME_COUNT = 100;
    const DINO_FRAME_COUNT = 2;
    const GRAVITY = 0.0015;
    const JUMP_SPEED = 0.45;
    const SPEED = 0.05;
    const MINIMUM_INTERVAL = 700;
    const MAXIMUM_INTERVAL = 2000;
  
    let lastTime;
    let delta;
    let score;
    let currentTime;
    let dinoFrame;
    let isJumping;
    let yVel;
    let nextCactus;
    
    const world = document.querySelector('.world');
    const scoreElement = document.querySelector('.score');
    const heading = document.querySelector('.heading');
    const dinoElement = document.querySelector('[data-dinosaur]');
    const grounds = document.querySelectorAll('.ground');
  
    function setCustomProperty(element, property, value) {
      element.style.setProperty(property, value);
    }
  
    function getCustomProperty(element, property) {
      return parseFloat(getComputedStyle(element).getPropertyValue(property)) || 0;
    }
  
    function incrementCustomProperty(element, property, incrementAmount) {
      setCustomProperty(
        element,
        property,
        getCustomProperty(element, property) + incrementAmount
      );
    }
  
    function startGame() {
      score = 0;
      heading.classList.add('hide');
      setupGround();
      setupDino();
      setupCactus();
      window.requestAnimationFrame(update);
    }
  
    function update(time) {
      if (lastTime == null) {
        lastTime = time;
        window.requestAnimationFrame(update);
        return;
      }
      delta = time - lastTime;
  
      updateGround(delta);
      updateDino(delta);
      updateCactus(delta);
      updateScore(delta);
  
      if (checkGameOver()) {
        return handleLose();
      }
  
      lastTime = time;
      window.requestAnimationFrame(update);
    }
  
    function setupGround() {
      setCustomProperty(grounds[0], '--left', 0);
      setCustomProperty(grounds[1], '--left', 300);
    }
  
    function updateGround(delta) {
      grounds.forEach((ground) => {
        incrementCustomProperty(ground, '--left', delta * SPEED * -1);
  
        if (getCustomProperty(ground, '--left') < -300) {
          setCustomProperty(ground, '--left', 300);
        }
      });
    }
  
    function setupDino() {
      setCustomProperty(dinoElement, '--bottom', 0);
      currentTime = 0;
      dinoFrame = 0;
      isJumping = false;
      document.removeEventListener('keydown', jump);
      document.addEventListener('keydown', jump);
    }
  
    function updateDino(delta) {
      handleRun(delta);
      handleJump(delta);
    }
  
    function handleRun(delta) {
      if (isJumping) {
        dinoElement.src = 'images/dino-stationary.png';
      }
  
      if (currentTime >= FRAME_COUNT) {
        dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
        dinoElement.src = `images/dino-run-${dinoFrame}.png`;
        currentTime -= FRAME_COUNT;
      }
      currentTime += delta;
    }
  
    function handleJump(delta) {
      if (!isJumping) return;
      incrementCustomProperty(dinoElement, '--bottom', yVel * delta);
  
      if (getCustomProperty(dinoElement, '--bottom') <= 0) {
        setCustomProperty(dinoElement, '--bottom', 0);
        isJumping = false;
      }
      yVel -= GRAVITY * delta;
    }
  
    function jump(e) {
      if (e.key !== ' ' || isJumping) return;
      yVel = JUMP_SPEED;
      isJumping = true;
    }
  
    function setupCactus() {
      nextCactus = MINIMUM_INTERVAL;
      document.querySelectorAll('.cactus').forEach((cactus) => cactus.remove());
    }
  
    function updateCactus(delta) {
      document.querySelectorAll('.cactus').forEach((cactus) => {
        incrementCustomProperty(cactus, '--left', delta * SPEED * -1);
        if (getCustomProperty(cactus, '--left') <= -100) {
          cactus.remove();
        }
      });
  
      if (nextCactus <= 0) {
        createCactus();
        nextCactus = randomNumberGenerator(MINIMUM_INTERVAL, MAXIMUM_INTERVAL);
      }
      nextCactus -= delta;
    }
  
    function createCactus() {
      const cactusElement = document.createElement('img');
      cactusElement.src = 'images/cactus.png';
      cactusElement.classList.add('cactus');
      setCustomProperty(cactusElement, '--left', 100);
      world.appendChild(cactusElement);
    }
  
    function randomNumberGenerator(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  
    function getDinoRect() {
      return dinoElement.getBoundingClientRect();
    }
  
    function getCactusRects() {
      return [...document.querySelectorAll('.cactus')].map((cactus) => {
        return cactus.getBoundingClientRect();
      });
    }
  
    function checkGameOver() {
      const dinoRect = getDinoRect();
      return getCactusRects().some((rect) => {
        return (
          rect.left < dinoRect.right &&
          rect.right > dinoRect.left &&
          rect.top < dinoRect.bottom &&
          rect.bottom > dinoRect.top
        );
      });
    }
  
    function handleLose() {
      dinoElement.src = 'images/dino-lose.png';
      setTimeout(() => {
        document.addEventListener('keydown', startGame, { once: true });
        heading.classList.remove('hide');
      }, 100);
    }
  
    function updateScore(delta) {
      score += delta * 0.001;
      scoreElement.textContent = Math.floor(score);
    }
  
    document.addEventListener('keydown', startGame, { once: true });
    window.addEventListener('resize', () => {
      world.style.width = `${WIDTH}px`;
      world.style.height = `${HEIGHT}px`;
    });
  });
  