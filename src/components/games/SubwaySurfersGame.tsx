import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Volume2, VolumeX, Pause, Play, RotateCcw, Shield, Zap, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { toOdiaNumber } from '../../utils/odiaNumerals';
import { getRandomRunnerQuestion, RunnerQuizGate } from '../../data/runnerQuestions';

interface SubwaySurfersGameProps {
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

// 3 Lanes: 0 = Left, 1 = Center, 2 = Right
type Lane = 0 | 1 | 2;

interface Obstacle {
  id: number;
  lane: Lane;
  z: number; // distance ahead in pseudo-3D (0 = at player, 1000 = far horizon)
  type: 'hurdle' | 'overhead' | 'train'; // hurdle = jump, overhead = slide, train = avoid
  passed: boolean;
}

interface Coin {
  id: number;
  lane: Lane;
  z: number;
  collected: boolean;
}

interface ActiveGate {
  gate: RunnerQuizGate;
  z: number;
  passed: boolean;
}

export const SubwaySurfersGame: React.FC<SubwaySurfersGameProps> = ({
  onBack,
  soundEnabled,
  onToggleSound,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High score persistence
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('skv_subwaysurfers_highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Game state
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'gameover'>('ready');
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [gatesCleared, setGatesCleared] = useState<number>(0);
  const [hasShield, setHasShield] = useState<boolean>(false);
  const [hasMagnet, setHasMagnet] = useState<number>(0); // timer in seconds
  const [hasMultiplier, setHasMultiplier] = useState<number>(0);

  // Active quiz gate displayed at top HUD
  const [activeQuizBanner, setActiveQuizBanner] = useState<RunnerQuizGate | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  // Internal mutable refs for 60fps canvas loop
  const playerLaneRef = useRef<Lane>(1);
  const targetLaneRef = useRef<Lane>(1);
  const laneOffsetRef = useRef<number>(0); // smooth animation between -1, 0, 1
  const isJumpingRef = useRef<boolean>(false);
  const jumpHeightRef = useRef<number>(0);
  const jumpVelocityRef = useRef<number>(0);
  const isSlidingRef = useRef<boolean>(false);
  const slideTimerRef = useRef<number>(0);

  const obstaclesRef = useRef<Obstacle[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const activeGateRef = useRef<ActiveGate | null>(null);

  const speedRef = useRef<number>(7);
  const distanceRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const coinsRefCounter = useRef<number>(0);
  const livesRef = useRef<number>(3);
  const gatesClearedRef = useRef<number>(0);
  const hasShieldRef = useRef<boolean>(false);
  const magnetTimerRef = useRef<number>(0);
  const multiplierTimerRef = useRef<number>(0);

  const nextObstacleZRef = useRef<number>(400);
  const nextGateDistanceRef = useRef<number>(100); // gate appears every 100-120m
  const animFrameIdRef = useRef<number | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  // Sync state refs
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);
  useEffect(() => {
    hasShieldRef.current = hasShield;
  }, [hasShield]);

  // Actions: Move Left, Right, Jump, Slide
  const moveLeft = useCallback(() => {
    if (gameState !== 'playing') return;
    if (targetLaneRef.current > 0) {
      targetLaneRef.current = (targetLaneRef.current - 1) as Lane;
      soundManager.playClick();
    }
  }, [gameState]);

  const moveRight = useCallback(() => {
    if (gameState !== 'playing') return;
    if (targetLaneRef.current < 2) {
      targetLaneRef.current = (targetLaneRef.current + 1) as Lane;
      soundManager.playClick();
    }
  }, [gameState]);

  const jump = useCallback(() => {
    if (gameState !== 'playing') return;
    if (!isJumpingRef.current && !isSlidingRef.current) {
      isJumpingRef.current = true;
      jumpVelocityRef.current = 14;
      soundManager.playJump();
    }
  }, [gameState]);

  const slide = useCallback(() => {
    if (gameState !== 'playing') return;
    if (!isSlidingRef.current) {
      isSlidingRef.current = true;
      slideTimerRef.current = 28; // ~0.5 second
      if (isJumpingRef.current) {
        // fast fall if jumping
        jumpVelocityRef.current = -12;
      }
      soundManager.playSlide();
    }
  }, [gameState]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        jump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        slide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight, jump, slide]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;
    touchStartPos.current = null;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < 20) return; // tap, not swipe

    if (absDx > absDy) {
      if (dx < 0) moveLeft();
      else moveRight();
    } else {
      if (dy < 0) jump();
      else slide();
    }
  };

  // Start / Reset Game
  const startGame = () => {
    playerLaneRef.current = 1;
    targetLaneRef.current = 1;
    laneOffsetRef.current = 0;
    isJumpingRef.current = false;
    jumpHeightRef.current = 0;
    jumpVelocityRef.current = 0;
    isSlidingRef.current = false;
    slideTimerRef.current = 0;

    obstaclesRef.current = [];
    coinsRef.current = [];
    activeGateRef.current = null;

    speedRef.current = 7.5;
    distanceRef.current = 0;
    scoreRef.current = 0;
    coinsRefCounter.current = 0;
    livesRef.current = 3;
    gatesClearedRef.current = 0;
    hasShieldRef.current = true; // start with 1 free hover shield!
    magnetTimerRef.current = 0;
    multiplierTimerRef.current = 0;

    nextObstacleZRef.current = 350;
    nextGateDistanceRef.current = 80;

    setScore(0);
    setDistance(0);
    setCoins(0);
    setLives(3);
    setGatesCleared(0);
    setHasShield(true);
    setHasMagnet(0);
    setHasMultiplier(0);
    setActiveQuizBanner(null);
    setQuizFeedback(null);
    setGameState('playing');
    soundManager.playClick();
  };

  const handleGameOver = () => {
    setGameState('gameover');
    soundManager.playWrong();
    const finalScore = scoreRef.current;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      try {
        localStorage.setItem('skv_subwaysurfers_highscore', String(finalScore));
      } catch {
        // ignore
      }
    }
  };

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(32, time - lastTime);
      lastTime = time;

      // 1. UPDATE GAME STATE
      const currentSpeed = speedRef.current;
      distanceRef.current += (currentSpeed * 0.05);
      const mult = multiplierTimerRef.current > 0 ? 2 : 1;
      scoreRef.current += Math.round(currentSpeed * 0.2 * mult);

      // Speed increases slightly over distance
      if (speedRef.current < 16) {
        speedRef.current += 0.001;
      }

      // Decrement timers
      if (magnetTimerRef.current > 0) {
        magnetTimerRef.current -= dt / 1000;
        if (magnetTimerRef.current <= 0) setHasMagnet(0);
        else setHasMagnet(Math.ceil(magnetTimerRef.current));
      }
      if (multiplierTimerRef.current > 0) {
        multiplierTimerRef.current -= dt / 1000;
        if (multiplierTimerRef.current <= 0) setHasMultiplier(0);
        else setHasMultiplier(Math.ceil(multiplierTimerRef.current));
      }

      // Smooth lane transition
      const targetOffset = targetLaneRef.current - 1; // -1, 0, 1
      laneOffsetRef.current += (targetOffset - laneOffsetRef.current) * 0.22;
      playerLaneRef.current = targetLaneRef.current;

      // Jump physics
      if (isJumpingRef.current) {
        jumpHeightRef.current += jumpVelocityRef.current;
        jumpVelocityRef.current -= 0.85; // gravity
        if (jumpHeightRef.current <= 0) {
          jumpHeightRef.current = 0;
          isJumpingRef.current = false;
        }
      }

      // Slide physics
      if (isSlidingRef.current) {
        slideTimerRef.current--;
        if (slideTimerRef.current <= 0) {
          isSlidingRef.current = false;
        }
      }

      // 2. SPAWN OBSTACLES & COINS
      if (nextObstacleZRef.current <= 0) {
        // Pick an obstacle type
        const rand = Math.random();
        const obsType: 'hurdle' | 'overhead' | 'train' =
          rand < 0.4 ? 'hurdle' : rand < 0.75 ? 'overhead' : 'train';
        const obsLane = (Math.floor(Math.random() * 3)) as Lane;

        obstaclesRef.current.push({
          id: Date.now() + Math.random(),
          lane: obsLane,
          z: 850,
          type: obsType,
          passed: false
        });

        // Spawn a coin chain on one of the other lanes
        const coinLane = (obsLane + 1 + Math.floor(Math.random() * 2)) % 3 as Lane;
        for (let i = 0; i < 4; i++) {
          coinsRef.current.push({
            id: Date.now() + i + Math.random(),
            lane: coinLane,
            z: 800 + i * 40,
            collected: false
          });
        }

        // Random chance of power-up
        if (Math.random() < 0.12 && !hasShieldRef.current) {
          hasShieldRef.current = true;
          setHasShield(true);
        }

        nextObstacleZRef.current = 200 + Math.random() * 120;
      } else {
        nextObstacleZRef.current -= currentSpeed;
      }

      // 3. SPAWN QUIZ GATE
      if (distanceRef.current >= nextGateDistanceRef.current && !activeGateRef.current) {
        const newGate = getRandomRunnerQuestion();
        activeGateRef.current = {
          gate: newGate,
          z: 950,
          passed: false
        };
        setActiveQuizBanner(newGate);
        nextGateDistanceRef.current = distanceRef.current + 110 + Math.random() * 40;
      }

      // 4. ADVANCE OBSTACLES & COLLISION DETECTION
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        obs.z -= currentSpeed;

        // Collision check when obstacle is close to player (z between 20 and 70)
        if (!obs.passed && obs.z > 20 && obs.z < 70) {
          const isSameLane = Math.abs(laneOffsetRef.current - (obs.lane - 1)) < 0.45;

          if (isSameLane) {
            let hits = false;
            if (obs.type === 'hurdle') {
              // must jump
              if (jumpHeightRef.current < 28) hits = true;
            } else if (obs.type === 'overhead') {
              // must slide
              if (!isSlidingRef.current) hits = true;
            } else if (obs.type === 'train') {
              // must not be in lane
              hits = true;
            }

            if (hits) {
              obs.passed = true;
              if (hasShieldRef.current) {
                // Shield saves player!
                hasShieldRef.current = false;
                setHasShield(false);
                soundManager.playPowerup();
                setQuizFeedback({ message: '🛡️ ସୁରକ୍ଷା ଢାଲ ରକ୍ଷା କଲା!', isCorrect: true });
                setTimeout(() => setQuizFeedback(null), 1500);
              } else {
                // Lose a life
                const newLives = livesRef.current - 1;
                livesRef.current = newLives;
                setLives(newLives);
                soundManager.playWrong();
                if (newLives <= 0) {
                  handleGameOver();
                  return;
                }
              }
            }
          }
        }

        // Clean up passed obstacles
        if (obs.z < -50) {
          obstaclesRef.current.splice(i, 1);
        }
      }

      // 5. ADVANCE COINS
      for (let i = coinsRef.current.length - 1; i >= 0; i--) {
        const c = coinsRef.current[i];
        c.z -= currentSpeed;

        // Magnet attraction
        if (magnetTimerRef.current > 0 && c.z < 250 && c.z > 0) {
          const currentLaneIdx = targetLaneRef.current;
          c.lane = currentLaneIdx;
        }

        // Coin collection check
        if (!c.collected && c.z > 10 && c.z < 80) {
          const isSameLane = Math.abs(laneOffsetRef.current - (c.lane - 1)) < 0.55;
          if (isSameLane) {
            c.collected = true;
            coinsRefCounter.current += 1;
            scoreRef.current += 20 * mult;
            soundManager.playCoin();
          }
        }

        if (c.z < -30) {
          coinsRef.current.splice(i, 1);
        }
      }

      // 6. ADVANCE ACTIVE QUIZ GATE
      if (activeGateRef.current) {
        const g = activeGateRef.current;
        g.z -= currentSpeed;

        // Pass through gate check (z around 40)
        if (!g.passed && g.z < 55 && g.z > 15) {
          g.passed = true;
          const playerLane = targetLaneRef.current; // 0, 1, or 2
          const isCorrect = playerLane === g.gate.correctLane;

          if (isCorrect) {
            // Correct gate!
            soundManager.playCorrect();
            scoreRef.current += 500;
            coinsRefCounter.current += 15;
            gatesClearedRef.current += 1;
            setGatesCleared(gatesClearedRef.current);
            // Reward magnet and multiplier
            magnetTimerRef.current = 10;
            multiplierTimerRef.current = 15;
            setHasMagnet(10);
            setHasMultiplier(15);
            setQuizFeedback({
              message: `✨ ସଠିକ୍! +୫୦୦ ପଏଣ୍ଟସ! ୨x ମଲ୍ଟିପ୍ଲାୟର୍ ବୋନସ୍!`,
              isCorrect: true
            });
          } else {
            // Wrong gate!
            soundManager.playWrong();
            if (hasShieldRef.current) {
              hasShieldRef.current = false;
              setHasShield(false);
              setQuizFeedback({
                message: `ଭୁଲ୍ ଫାଟକ! ଢାଲ ରକ୍ଷା କଲା (ସଠିକ୍ ଉତ୍ତର: ${g.gate.options[g.gate.correctLane]})`,
                isCorrect: false
              });
            } else {
              const newLives = livesRef.current - 1;
              livesRef.current = newLives;
              setLives(newLives);
              setQuizFeedback({
                message: `ଭୁଲ୍ ଫାଟକ! -୧ ଜୀବନ (ସଠିକ୍ ଉତ୍ତର: ${g.gate.options[g.gate.correctLane]})`,
                isCorrect: false
              });
              if (newLives <= 0) {
                handleGameOver();
                return;
              }
            }
          }

          setTimeout(() => {
            setActiveQuizBanner(null);
            setQuizFeedback(null);
          }, 3500);
        }

        if (g.z < -60) {
          activeGateRef.current = null;
        }
      }

      // Sync state for UI counters
      setScore(scoreRef.current);
      setDistance(Math.floor(distanceRef.current));
      setCoins(coinsRefCounter.current);

      // ==========================================
      // 7. RENDER 3D CANVAS PERSPECTIVE
      // ==========================================
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Perspective projection parameters
      const horizonY = height * 0.38;
      const vanishingX = width / 2;
      const maxZ = 900;

      // Helper to project 3D coordinate (xInLane: -1, 0, 1, z: 0..maxZ) into 2D canvas (x, y, scale)
      const project = (laneOffset: number, z: number, yOffset: number = 0) => {
        const clampedZ = Math.max(1, Math.min(maxZ, z));
        // Perspective factor: closer objects (z=0) have factor ~1, far objects (z=900) have factor ~0.08
        const factor = (maxZ - clampedZ) / maxZ;
        const scale = 0.12 + Math.pow(factor, 2.2) * 0.88;
        const screenY = horizonY + (height - horizonY) * scale - yOffset * scale;
        // Lane spread widens as it approaches the bottom
        const laneWidth = width * 0.36 * scale;
        const screenX = vanishingX + laneOffset * laneWidth;
        return { x: screenX, y: screenY, scale };
      };

      // A. Sky & Subway Depot Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.6, '#1e293b');
      skyGrad.addColorStop(1, '#334155');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // Distant city silhouette / depot warehouses
      ctx.fillStyle = '#090d16';
      for (let i = 0; i < 7; i++) {
        const bW = width * 0.18;
        const bH = 30 + (i % 3) * 20;
        ctx.fillRect(i * (bW * 0.85) - 10, horizonY - bH, bW, bH);
      }

      // Overhead electric wires
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, horizonY - 15);
      ctx.bezierCurveTo(width * 0.3, horizonY + 5, width * 0.7, horizonY + 5, width, horizonY - 15);
      ctx.stroke();

      // B. Ground / Subway Tracks Base
      const groundGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      groundGrad.addColorStop(0, '#1e293b');
      groundGrad.addColorStop(1, '#0b0f19');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // C. Railway Track Ties & Steel Rails
      // Draw 3 track lanes (-1, 0, 1)
      const lanes: Lane[] = [0, 1, 2];
      const laneOffsets = [-1, 0, 1];

      // Draw railway wooden sleepers (ties) scrolling forward
      const tieSpacing = 45;
      const tieScroll = (distanceRef.current * 10) % tieSpacing;
      for (let z = maxZ; z >= 20; z -= tieSpacing) {
        const curZ = z - tieScroll;
        if (curZ < 20 || curZ > maxZ) continue;
        const pL = project(-1.45, curZ);
        const pR = project(1.45, curZ);
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = Math.max(1, 4 * pL.scale);
        ctx.beginPath();
        ctx.moveTo(pL.x, pL.y);
        ctx.lineTo(pR.x, pR.y);
        ctx.stroke();
      }

      // Draw Steel Rails for each of the 3 lanes
      laneOffsets.forEach((lOff) => {
        const railHalf = 0.32;
        // Left rail of track
        const pNearL = project(lOff - railHalf, 20);
        const pFarL = project(lOff - railHalf, maxZ);
        // Right rail of track
        const pNearR = project(lOff + railHalf, 20);
        const pFarR = project(lOff + railHalf, maxZ);

        // Track ballast highlight
        const gradRail = ctx.createLinearGradient(0, horizonY, 0, height);
        gradRail.addColorStop(0, '#64748b');
        gradRail.addColorStop(1, '#cbd5e1');

        ctx.strokeStyle = gradRail;
        ctx.lineWidth = Math.max(1.5, 3.5 * pNearL.scale);
        ctx.beginPath();
        ctx.moveTo(pFarL.x, pFarL.y);
        ctx.lineTo(pNearL.x, pNearL.y);
        ctx.moveTo(pFarR.x, pFarR.y);
        ctx.lineTo(pNearR.x, pNearR.y);
        ctx.stroke();
      });

      // Side Track Warning Stripes / Gravel edge
      const edgeFarL = project(-1.6, maxZ);
      const edgeNearL = project(-1.6, 20);
      const edgeFarR = project(1.6, maxZ);
      const edgeNearR = project(1.6, 20);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(edgeFarL.x, edgeFarL.y);
      ctx.lineTo(edgeNearL.x, edgeNearL.y);
      ctx.moveTo(edgeFarR.x, edgeFarR.y);
      ctx.lineTo(edgeNearR.x, edgeNearR.y);
      ctx.stroke();

      // D. Draw Active Quiz Gate in 3D Perspective
      if (activeGateRef.current) {
        const g = activeGateRef.current;
        const gateZ = g.z;
        if (gateZ > 20 && gateZ < maxZ) {
          const pLeftPillar = project(-1.55, gateZ, 0);
          const pRightPillar = project(1.55, gateZ, 0);
          const pTopLeft = project(-1.55, gateZ, 120);
          const pTopRight = project(1.55, gateZ, 120);
          const scale = pLeftPillar.scale;

          // Gate Arches & Gantry Banner
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = Math.max(2, 4 * scale);

          // Pillars
          ctx.beginPath();
          ctx.moveTo(pLeftPillar.x, pLeftPillar.y);
          ctx.lineTo(pTopLeft.x, pTopLeft.y);
          ctx.lineTo(pTopRight.x, pTopRight.y);
          ctx.lineTo(pRightPillar.x, pRightPillar.y);
          ctx.stroke();

          // Banner board
          const bannerH = 34 * scale;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
          ctx.fillRect(pTopLeft.x, pTopLeft.y, pTopRight.x - pTopLeft.x, bannerH);
          ctx.strokeStyle = '#38bdf8';
          ctx.strokeRect(pTopLeft.x, pTopLeft.y, pTopRight.x - pTopLeft.x, bannerH);

          // Draw Lane Option Boxes on the Gate
          laneOffsets.forEach((lOff, idx) => {
            const pOption = project(lOff, gateZ, 60);
            const optW = 75 * scale;
            const optH = 45 * scale;
            const isTarget = targetLaneRef.current === idx;

            // Box background
            ctx.fillStyle = isTarget ? 'rgba(56, 189, 248, 0.95)' : 'rgba(30, 41, 59, 0.9)';
            ctx.fillRect(pOption.x - optW / 2, pOption.y - optH / 2, optW, optH);
            ctx.strokeStyle = isTarget ? '#ffffff' : '#64748b';
            ctx.lineWidth = Math.max(1, 2.5 * scale);
            ctx.strokeRect(pOption.x - optW / 2, pOption.y - optH / 2, optW, optH);

            // Option Letter & Text
            const fontSize = Math.max(8, Math.round(13 * scale));
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.fillStyle = isTarget ? '#0f172a' : '#f8fafc';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const letter = idx === 0 ? 'A' : idx === 1 ? 'B' : 'C';
            ctx.fillText(`${letter}: ${g.gate.options[idx].substring(0, 10)}`, pOption.x, pOption.y);
          });
        }
      }

      // E. Draw Coins
      coinsRef.current.forEach((coin) => {
        if (coin.collected || coin.z < 20 || coin.z > maxZ) return;
        const lOff = coin.lane - 1;
        const p = project(lOff, coin.z, 20);
        const radius = Math.max(3, 11 * p.scale);

        // Golden rotating coin
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = Math.max(1, 2 * p.scale);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(6, Math.round(9 * p.scale))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', p.x, p.y);
      });

      // F. Draw Obstacles (sorted back-to-front for proper depth overlap)
      const sortedObstacles = [...obstaclesRef.current].sort((a, b) => b.z - a.z);

      sortedObstacles.forEach((obs) => {
        if (obs.z < 20 || obs.z > maxZ) return;
        const lOff = obs.lane - 1;

        if (obs.type === 'hurdle') {
          // Low Barrier / Hurdle (Jump over!)
          const p = project(lOff, obs.z, 0);
          const w = 70 * p.scale;
          const h = 28 * p.scale;

          // Hazard stripes barrier
          ctx.fillStyle = '#eab308';
          ctx.fillRect(p.x - w / 2, p.y - h, w, h);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = Math.max(1, 2 * p.scale);
          ctx.strokeRect(p.x - w / 2, p.y - h, w, h);

          // Diagonal black stripes
          ctx.fillStyle = '#000000';
          for (let s = -w / 2 + 5; s < w / 2; s += 16 * p.scale) {
            ctx.fillRect(p.x + s, p.y - h, 6 * p.scale, h);
          }

          // Jump indicator label
          if (p.scale > 0.4) {
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.round(10 * p.scale)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('⬆️ JUMP', p.x, p.y - h - 4);
          }
        } else if (obs.type === 'overhead') {
          // Overhead High Warning Board (Slide under!)
          const pGround = project(lOff, obs.z, 0);
          const pTop = project(lOff, obs.z, 55);
          const w = 78 * pGround.scale;
          const signH = 26 * pGround.scale;

          // Two side poles
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = Math.max(2, 3.5 * pGround.scale);
          ctx.beginPath();
          ctx.moveTo(pGround.x - w / 2, pGround.y);
          ctx.lineTo(pTop.x - w / 2, pTop.y);
          ctx.moveTo(pGround.x + w / 2, pGround.y);
          ctx.lineTo(pTop.x + w / 2, pTop.y);
          ctx.stroke();

          // Overhead sign board
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(pTop.x - w / 2, pTop.y, w, signH);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(pTop.x - w / 2, pTop.y, w, signH);

          if (pGround.scale > 0.4) {
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.round(9 * pGround.scale)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⬇️ SLIDE', pTop.x, pTop.y + signH / 2);
          }
        } else if (obs.type === 'train') {
          // Parked Train Car / Boxcar (Dodge lane!)
          const p = project(lOff, obs.z, 0);
          const w = 76 * p.scale;
          const h = 85 * p.scale;

          // Train front body
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(p.x - w / 2, p.y - h, w, h);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = Math.max(1.5, 3 * p.scale);
          ctx.strokeRect(p.x - w / 2, p.y - h, w, h);

          // Train front windshield
          ctx.fillStyle = '#67e8f9';
          ctx.fillRect(p.x - w * 0.4, p.y - h + 10 * p.scale, w * 0.8, 25 * p.scale);

          // Train headlights
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(p.x - w * 0.28, p.y - 15 * p.scale, 6 * p.scale, 0, Math.PI * 2);
          ctx.arc(p.x + w * 0.28, p.y - 15 * p.scale, 6 * p.scale, 0, Math.PI * 2);
          ctx.fill();

          // Front bumper stripes
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(p.x - w / 2, p.y - 10 * p.scale, w, 8 * p.scale);
        }
      });

      // G. Draw Player Character in Foreground (z ~ 40)
      const playerP = project(laneOffsetRef.current, 45, jumpHeightRef.current);
      const pScale = playerP.scale;
      const charW = 38 * pScale;
      const charH = isSlidingRef.current ? 22 * pScale : 48 * pScale;
      const charX = playerP.x;
      const charY = playerP.y;

      // Ground shadow
      const shadowP = project(laneOffsetRef.current, 45, 0);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(shadowP.x, shadowP.y, charW * 0.7, 7 * pScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shield aura
      if (hasShieldRef.current) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(charX, charY - charH / 2, charH * 0.75, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Magnet particle glow
      if (magnetTimerRef.current > 0) {
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(charX, charY - charH / 2, charH * 0.9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (isSlidingRef.current) {
        // Sliding posture (skateboard / slide roll)
        ctx.fillStyle = '#f97316'; // orange hoodie
        ctx.beginPath();
        ctx.roundRect(charX - charW * 0.7, charY - charH, charW * 1.4, charH, 8 * pScale);
        ctx.fill();
        ctx.strokeStyle = '#ea580c';
        ctx.stroke();

        // Skateboard / slide dust
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(charX - charW, charY - 4, 5 * pScale, 0, Math.PI * 2);
        ctx.arc(charX + charW, charY - 4, 4 * pScale, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Normal / Jumping runner body
        // Body (Hoodie)
        ctx.fillStyle = '#f97316'; // orange hoodie
        ctx.beginPath();
        ctx.roundRect(charX - charW / 2, charY - charH * 0.75, charW, charH * 0.5, 6 * pScale);
        ctx.fill();

        // Legs (Jeans)
        ctx.fillStyle = '#1e3a8a';
        const legRunCycle = Math.sin(distanceRef.current * 0.8) * (8 * pScale);
        // Left Leg
        ctx.fillRect(charX - charW * 0.4, charY - charH * 0.25, charW * 0.32, charH * 0.25 + legRunCycle);
        // Right Leg
        ctx.fillRect(charX + charW * 0.08, charY - charH * 0.25, charW * 0.32, charH * 0.25 - legRunCycle);

        // Sneakers (Bright White/Red)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(charX - charW * 0.45, charY + legRunCycle, charW * 0.38, 6 * pScale);
        ctx.fillRect(charX + charW * 0.05, charY - legRunCycle, charW * 0.38, 6 * pScale);

        // Head & Cap
        ctx.fillStyle = '#fde047'; // cap
        ctx.beginPath();
        ctx.arc(charX, charY - charH * 0.85, charW * 0.38, 0, Math.PI * 2);
        ctx.fill();
        // Cap visor backwards
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(charX - charW * 0.2, charY - charH * 0.95, charW * 0.4, 4 * pScale);
      }

      // Schedule next frame
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [gameState]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white max-w-lg mx-auto w-full select-none overflow-hidden relative">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
              SUBWAY SURFERS 🚇
            </div>
            <h1 className="text-sm font-bold text-white odia-text">ରେଲୱେ କୁଇଜ୍ ରନର୍</h1>
          </div>
        </div>

        {/* Lives & Score */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5" title="ଜୀବନ">
            {[1, 2, 3].map((heartIdx) => (
              <Heart
                key={heartIdx}
                className={`w-4 h-4 transition-transform ${
                  heartIdx <= lives
                    ? 'text-rose-500 fill-rose-500 animate-pulse'
                    : 'text-slate-600 fill-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onToggleSound}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </header>

      {/* Main Game Screen */}
      <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
        {/* Real-time Question / Gate Announcement Banner */}
        {activeQuizBanner && (
          <div className="absolute top-2 left-2 right-2 z-20 animate-in slide-in-from-top-3 duration-300">
            <div className="bg-slate-900/95 border-2 border-amber-400 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-amber-400 font-mono flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ରେଲୱେ ଫାଟକ: ସଠିକ୍ ଟ୍ରାକ୍ ବାଛନ୍ତୁ!</span>
                </span>
                <span className="text-[10px] bg-indigo-900/80 text-indigo-200 px-2 py-0.5 rounded-full font-medium">
                  {activeQuizBanner.subjectName}
                </span>
              </div>
              <p className="text-xs font-bold text-white odia-text leading-snug">
                {activeQuizBanner.question}
              </p>
              <div className="grid grid-cols-3 gap-1 mt-2 text-center text-[10px]">
                {activeQuizBanner.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`p-1 rounded-lg border font-medium truncate ${
                      targetLaneRef.current === idx
                        ? 'bg-amber-400 text-slate-950 border-white font-bold ring-2 ring-white'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span className="font-mono font-bold">{idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}: </span>
                    <span className="odia-text">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Feedback Toast */}
        {quizFeedback && (
          <div className="absolute top-32 left-4 right-4 z-20 text-center animate-in zoom-in-90 duration-200 pointer-events-none">
            <div
              className={`inline-block px-4 py-2 rounded-2xl font-bold text-xs shadow-2xl backdrop-blur-md border ${
                quizFeedback.isCorrect
                  ? 'bg-emerald-500/90 text-white border-emerald-300'
                  : 'bg-rose-600/90 text-white border-rose-300'
              }`}
            >
              {quizFeedback.message}
            </div>
          </div>
        )}

        {/* HUD Overlay (Score, Distance, Coins, Powerups) */}
        <div className="absolute top-2 left-3 right-3 z-10 flex items-center justify-between pointer-events-none text-xs font-mono">
          <div className="space-y-1">
            <div className="bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">ସ୍କୋର</span>
              <span className="text-base font-black text-amber-400">
                {toOdiaNumber(score)}
              </span>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-xs px-2.5 py-0.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
              ଦୂରତା: <strong className="text-white">{toOdiaNumber(distance)}m</strong>
            </div>
          </div>

          <div className="space-y-1 text-right">
            <div className="bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">ମୁଦ୍ରା (Coins)</span>
              <span className="text-base font-black text-yellow-400 flex items-center justify-end gap-1">
                <span>★</span> {toOdiaNumber(coins)}
              </span>
            </div>
            {/* Active powerups indicator */}
            <div className="flex items-center justify-end gap-1">
              {hasShield && (
                <span className="bg-sky-500/80 text-white px-1.5 py-0.5 rounded-md text-[10px] flex items-center gap-0.5">
                  <Shield className="w-3 h-3" /> ଢାଲ
                </span>
              )}
              {hasMagnet > 0 && (
                <span className="bg-purple-600/80 text-white px-1.5 py-0.5 rounded-md text-[10px] flex items-center gap-0.5">
                  <Zap className="w-3 h-3" /> ଚୁମ୍ବକ {hasMagnet}s
                </span>
              )}
              {hasMultiplier > 0 && (
                <span className="bg-amber-500/80 text-slate-950 font-bold px-1.5 py-0.5 rounded-md text-[10px]">
                  ୨x {hasMultiplier}s
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 60FPS Canvas */}
        <canvas
          ref={canvasRef}
          width={400}
          height={480}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full flex-1 bg-slate-950 block touch-none"
        />

        {/* Ready Overlay */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/30 mb-3 animate-bounce">
              🚇
            </div>
            <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
              SUBWAY SURFERS QUIZ RUNNER
            </span>
            <h2 className="text-2xl font-black text-white odia-text mt-1">
              ସବୱେ ସର୍ଫର୍ସ: ରେଲୱେ ରନର୍
            </h2>
            <p className="text-xs text-slate-300 odia-text max-w-xs mt-2 leading-relaxed">
              ୩ଟି ଟ୍ରାକ୍ ରେ ଦୌଡ଼ନ୍ତୁ! ବାଧକ ଉପରେ ଡିଅନ୍ତୁ (Jump), ସଙ୍କେତ ବୋର୍ଡ ତଳେ ଗଡ଼ନ୍ତୁ (Slide), ଏବଂ ରେଲୱେ ପ୍ରଶ୍ନ ଫାଟକରେ ସଠିକ୍ ଟ୍ରାକ୍ ଚୟନ କରି ବିଶାଳ ସ୍କୋର ପାଆନ୍ତୁ!
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 my-4 w-full max-w-xs text-left text-xs space-y-1.5 text-slate-300">
              <div className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">
                କିପରି ଖେଳିବେ (Controls):
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>ବାମ / ଡାହାଣ ସ୍ୱାଇପ୍:</span>
                <span className="text-white font-semibold">ଟ୍ରାକ୍ ବଦଳାନ୍ତୁ</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>ଉପରକୁ ସ୍ୱାଇପ୍ (⬆️):</span>
                <span className="text-white font-semibold">ଡିଆଁ ମାରନ୍ତୁ (Jump)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>ତଳକୁ ସ୍ୱାଇପ୍ (⬇️):</span>
                <span className="text-white font-semibold">ଗଡ଼ନ୍ତୁ (Slide)</span>
              </div>
            </div>

            {highScore > 0 && (
              <div className="text-xs text-slate-400 mb-3 font-mono">
                ଆପଣଙ୍କ ହାଇସ୍କୋର: <strong className="text-amber-400">{toOdiaNumber(highScore)}</strong>
              </div>
            )}

            <button
              onClick={startGame}
              className="w-full max-w-xs py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-xl active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 odia-text"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>ଦୌଡ଼ ଆରମ୍ଭ କରନ୍ତୁ (Start Run)</span>
            </button>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-rose-600/20 text-rose-500 border border-rose-500/40 flex items-center justify-center text-3xl mb-3">
              💥
            </div>
            <h2 className="text-2xl font-black text-white odia-text">
              ଖେଳ ସମାପ୍ତ (Game Over)
            </h2>
            <p className="text-xs text-slate-400 odia-text mt-1">
              ଉତ୍କୃଷ୍ଟ ପ୍ରୟାସ! ରେଲୱେ ଟ୍ରାକ୍‌ରେ ଆପଣ ବହୁତ ବଢ଼ିଆ ଦୌଡ଼ିଲେ।
            </p>

            <div className="grid grid-cols-2 gap-2 my-4 w-full max-w-xs text-left">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-medium">ଅନ୍ତିମ ସ୍କୋର</span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {toOdiaNumber(score)}
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-medium">ହାଇସ୍କୋର</span>
                <span className="text-xl font-black text-white font-mono">
                  {toOdiaNumber(highScore)}
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-medium">ଦୂରତା</span>
                <span className="text-sm font-bold text-slate-200 font-mono">
                  {toOdiaNumber(distance)} ମିଟର
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-medium">କୁଇଜ୍ ଫାଟକ</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {toOdiaNumber(gatesCleared)} ଟି ପାର୍
                </span>
              </div>
            </div>

            <div className="flex gap-2 w-full max-w-xs">
              <button
                onClick={startGame}
                className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5 odia-text"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ପୁଣି ଖେଳନ୍ତୁ</span>
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs active:scale-95 transition cursor-pointer odia-text"
              >
                ହବ୍ କୁ ଫେରନ୍ତୁ
              </button>
            </div>
          </div>
        )}

        {/* Mobile Tactile Control Pad (Bottom) */}
        {gameState === 'playing' && (
          <div className="bg-slate-900/95 border-t border-slate-800 p-2.5 flex items-center justify-between gap-2 z-20">
            {/* Left Button */}
            <button
              onPointerDown={moveLeft}
              className="flex-1 py-3 rounded-xl bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-0.5 shadow-md active:scale-95 transition cursor-pointer select-none"
            >
              <span className="text-base">⬅️</span>
              <span className="text-[10px] odia-text">ବାମ</span>
            </button>

            {/* Jump Button */}
            <button
              onPointerDown={jump}
              className="flex-1 py-3 rounded-xl bg-amber-500/20 active:bg-amber-500 active:text-slate-950 border border-amber-500/40 text-amber-300 font-bold text-xs flex flex-col items-center justify-center gap-0.5 shadow-md active:scale-95 transition cursor-pointer select-none"
            >
              <span className="text-base">⬆️</span>
              <span className="text-[10px] odia-text">ଡିଆଁ (Jump)</span>
            </button>

            {/* Slide Button */}
            <button
              onPointerDown={slide}
              className="flex-1 py-3 rounded-xl bg-indigo-500/20 active:bg-indigo-500 active:text-white border border-indigo-500/40 text-indigo-300 font-bold text-xs flex flex-col items-center justify-center gap-0.5 shadow-md active:scale-95 transition cursor-pointer select-none"
            >
              <span className="text-base">⬇️</span>
              <span className="text-[10px] odia-text">ଗଡ଼ିବା (Slide)</span>
            </button>

            {/* Right Button */}
            <button
              onPointerDown={moveRight}
              className="flex-1 py-3 rounded-xl bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-0.5 shadow-md active:scale-95 transition cursor-pointer select-none"
            >
              <span className="text-base">➡️</span>
              <span className="text-[10px] odia-text">ଡାହାଣ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
