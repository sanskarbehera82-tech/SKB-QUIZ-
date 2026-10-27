import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Volume2, VolumeX, Play, RotateCcw, Shield, Flame, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { toOdiaNumber } from '../../utils/odiaNumerals';
import { getRandomRunnerQuestion, RunnerQuizGate } from '../../data/runnerQuestions';

interface TempleRunGameProps {
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

type Lane = 0 | 1 | 2;

interface TempleObstacle {
  id: number;
  lane: Lane;
  z: number;
  type: 'fire_pit' | 'stone_arch' | 'boulder'; // fire_pit = jump, stone_arch = slide, boulder = dodge
  passed: boolean;
}

interface TempleGem {
  id: number;
  lane: Lane;
  z: number;
  color: 'gold' | 'ruby' | 'emerald';
  collected: boolean;
}

interface ActivePortal {
  gate: RunnerQuizGate;
  z: number;
  passed: boolean;
}

export const TempleRunGame: React.FC<TempleRunGameProps> = ({
  onBack,
  soundEnabled,
  onToggleSound,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('skv_templerun_highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'gameover'>('ready');
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [gems, setGems] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [portalsCleared, setPortalsCleared] = useState<number>(0);
  const [hasShield, setHasShield] = useState<boolean>(false);
  const [frenzyTimer, setFrenzyTimer] = useState<number>(0);

  const [activePortalBanner, setActivePortalBanner] = useState<RunnerQuizGate | null>(null);
  const [portalFeedback, setPortalFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  // 60 FPS animation refs
  const playerLaneRef = useRef<Lane>(1);
  const targetLaneRef = useRef<Lane>(1);
  const laneOffsetRef = useRef<number>(0);
  const isJumpingRef = useRef<boolean>(false);
  const jumpHeightRef = useRef<number>(0);
  const jumpVelocityRef = useRef<number>(0);
  const isSlidingRef = useRef<boolean>(false);
  const slideTimerRef = useRef<number>(0);

  const obstaclesRef = useRef<TempleObstacle[]>([]);
  const gemsRef = useRef<TempleGem[]>([]);
  const activePortalRef = useRef<ActivePortal | null>(null);

  const speedRef = useRef<number>(7.5);
  const distanceRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const gemsRefCounter = useRef<number>(0);
  const livesRef = useRef<number>(3);
  const portalsClearedRef = useRef<number>(0);
  const hasShieldRef = useRef<boolean>(false);
  const frenzyTimerRef = useRef<number>(0);

  const nextObstacleZRef = useRef<number>(380);
  const nextPortalDistanceRef = useRef<number>(90);
  const animFrameIdRef = useRef<number | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);
  useEffect(() => {
    hasShieldRef.current = hasShield;
  }, [hasShield]);

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
      slideTimerRef.current = 28;
      if (isJumpingRef.current) {
        jumpVelocityRef.current = -12;
      }
      soundManager.playSlide();
    }
  }, [gameState]);

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

    if (Math.max(absDx, absDy) < 20) return;

    if (absDx > absDy) {
      if (dx < 0) moveLeft();
      else moveRight();
    } else {
      if (dy < 0) jump();
      else slide();
    }
  };

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
    gemsRef.current = [];
    activePortalRef.current = null;

    speedRef.current = 7.5;
    distanceRef.current = 0;
    scoreRef.current = 0;
    gemsRefCounter.current = 0;
    livesRef.current = 3;
    portalsClearedRef.current = 0;
    hasShieldRef.current = true;
    frenzyTimerRef.current = 0;

    nextObstacleZRef.current = 320;
    nextPortalDistanceRef.current = 80;

    setScore(0);
    setDistance(0);
    setGems(0);
    setLives(3);
    setPortalsCleared(0);
    setHasShield(true);
    setFrenzyTimer(0);
    setActivePortalBanner(null);
    setPortalFeedback(null);
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
        localStorage.setItem('skv_templerun_highscore', String(finalScore));
      } catch {
        // ignore
      }
    }
  };

  // Main 60 FPS Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
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

      const currentSpeed = speedRef.current;
      distanceRef.current += (currentSpeed * 0.05);
      const mult = frenzyTimerRef.current > 0 ? 2 : 1;
      scoreRef.current += Math.round(currentSpeed * 0.22 * mult);

      if (speedRef.current < 16) {
        speedRef.current += 0.001;
      }

      if (frenzyTimerRef.current > 0) {
        frenzyTimerRef.current -= dt / 1000;
        if (frenzyTimerRef.current <= 0) setFrenzyTimer(0);
        else setFrenzyTimer(Math.ceil(frenzyTimerRef.current));
      }

      const targetOffset = targetLaneRef.current - 1;
      laneOffsetRef.current += (targetOffset - laneOffsetRef.current) * 0.22;
      playerLaneRef.current = targetLaneRef.current;

      if (isJumpingRef.current) {
        jumpHeightRef.current += jumpVelocityRef.current;
        jumpVelocityRef.current -= 0.85;
        if (jumpHeightRef.current <= 0) {
          jumpHeightRef.current = 0;
          isJumpingRef.current = false;
        }
      }

      if (isSlidingRef.current) {
        slideTimerRef.current--;
        if (slideTimerRef.current <= 0) {
          isSlidingRef.current = false;
        }
      }

      // Spawning Obstacles & Gems
      if (nextObstacleZRef.current <= 0) {
        const rand = Math.random();
        const obsType: 'fire_pit' | 'stone_arch' | 'boulder' =
          rand < 0.38 ? 'fire_pit' : rand < 0.72 ? 'stone_arch' : 'boulder';
        const obsLane = (Math.floor(Math.random() * 3)) as Lane;

        obstaclesRef.current.push({
          id: Date.now() + Math.random(),
          lane: obsLane,
          z: 850,
          type: obsType,
          passed: false
        });

        // Spawn gem line on another lane
        const gemLane = (obsLane + 1 + Math.floor(Math.random() * 2)) % 3 as Lane;
        const color: 'gold' | 'ruby' | 'emerald' = Math.random() < 0.6 ? 'gold' : Math.random() < 0.85 ? 'ruby' : 'emerald';
        for (let i = 0; i < 4; i++) {
          gemsRef.current.push({
            id: Date.now() + i + Math.random(),
            lane: gemLane,
            z: 800 + i * 42,
            color,
            collected: false
          });
        }

        if (Math.random() < 0.12 && !hasShieldRef.current) {
          hasShieldRef.current = true;
          setHasShield(true);
        }

        nextObstacleZRef.current = 210 + Math.random() * 120;
      } else {
        nextObstacleZRef.current -= currentSpeed;
      }

      // Spawning Knowledge Portal
      if (distanceRef.current >= nextPortalDistanceRef.current && !activePortalRef.current) {
        const newPortal = getRandomRunnerQuestion();
        activePortalRef.current = {
          gate: newPortal,
          z: 950,
          passed: false
        };
        setActivePortalBanner(newPortal);
        nextPortalDistanceRef.current = distanceRef.current + 115 + Math.random() * 40;
      }

      // Obstacle collision
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        obs.z -= currentSpeed;

        if (!obs.passed && obs.z > 20 && obs.z < 70) {
          const isSameLane = Math.abs(laneOffsetRef.current - (obs.lane - 1)) < 0.45;
          if (isSameLane) {
            let hits = false;
            if (obs.type === 'fire_pit') {
              if (jumpHeightRef.current < 26) hits = true;
            } else if (obs.type === 'stone_arch') {
              if (!isSlidingRef.current) hits = true;
            } else if (obs.type === 'boulder') {
              hits = true;
            }

            if (hits) {
              obs.passed = true;
              if (hasShieldRef.current) {
                hasShieldRef.current = false;
                setHasShield(false);
                soundManager.playPowerup();
                setPortalFeedback({ message: '🛡️ ମନ୍ଦିର ଢାଲ ରକ୍ଷା କଲା!', isCorrect: true });
                setTimeout(() => setPortalFeedback(null), 1500);
              } else {
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

        if (obs.z < -50) obstaclesRef.current.splice(i, 1);
      }

      // Gems collection
      for (let i = gemsRef.current.length - 1; i >= 0; i--) {
        const g = gemsRef.current[i];
        g.z -= currentSpeed;

        if (!g.collected && g.z > 10 && g.z < 80) {
          const isSameLane = Math.abs(laneOffsetRef.current - (g.lane - 1)) < 0.55;
          if (isSameLane) {
            g.collected = true;
            const pts = g.color === 'emerald' ? 50 : g.color === 'ruby' ? 35 : 20;
            gemsRefCounter.current += 1;
            scoreRef.current += pts * mult;
            soundManager.playCoin();
          }
        }

        if (g.z < -30) gemsRef.current.splice(i, 1);
      }

      // Portal check
      if (activePortalRef.current) {
        const p = activePortalRef.current;
        p.z -= currentSpeed;

        if (!p.passed && p.z < 55 && p.z > 15) {
          p.passed = true;
          const playerLane = targetLaneRef.current;
          const isCorrect = playerLane === p.gate.correctLane;

          if (isCorrect) {
            soundManager.playCorrect();
            scoreRef.current += 500;
            gemsRefCounter.current += 15;
            portalsClearedRef.current += 1;
            setPortalsCleared(portalsClearedRef.current);
            frenzyTimerRef.current = 15;
            setFrenzyTimer(15);
            setPortalFeedback({
              message: `🛕 ଜ୍ଞାନ ଆଶୀର୍ବାଦ! +୫୦୦ ପଏଣ୍ଟସ & ୨x ବୋନସ୍!`,
              isCorrect: true
            });
          } else {
            soundManager.playWrong();
            if (hasShieldRef.current) {
              hasShieldRef.current = false;
              setHasShield(false);
              setPortalFeedback({
                message: `ଭୁଲ୍ ଦ୍ୱାର! ଢାଲ ରକ୍ଷା କଲା (ସଠିକ୍: ${p.gate.options[p.gate.correctLane]})`,
                isCorrect: false
              });
            } else {
              const newLives = livesRef.current - 1;
              livesRef.current = newLives;
              setLives(newLives);
              setPortalFeedback({
                message: `ଭୁଲ୍ ଦ୍ୱାର! -୧ ଜୀବନ (ସଠିକ୍: ${p.gate.options[p.gate.correctLane]})`,
                isCorrect: false
              });
              if (newLives <= 0) {
                handleGameOver();
                return;
              }
            }
          }

          setTimeout(() => {
            setActivePortalBanner(null);
            setPortalFeedback(null);
          }, 3500);
        }

        if (p.z < -60) activePortalRef.current = null;
      }

      setScore(scoreRef.current);
      setDistance(Math.floor(distanceRef.current));
      setGems(gemsRefCounter.current);

      // ==========================================
      // RENDER TEMPLE RUN CANVAS
      // ==========================================
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const horizonY = height * 0.38;
      const vanishingX = width / 2;
      const maxZ = 900;

      const project = (laneOffset: number, z: number, yOffset: number = 0) => {
        const clampedZ = Math.max(1, Math.min(maxZ, z));
        const factor = (maxZ - clampedZ) / maxZ;
        const scale = 0.12 + Math.pow(factor, 2.2) * 0.88;
        const screenY = horizonY + (height - horizonY) * scale - yOffset * scale;
        const laneWidth = width * 0.36 * scale;
        const screenX = vanishingX + laneOffset * laneWidth;
        return { x: screenX, y: screenY, scale };
      };

      // A. Ancient Jungle & Temple Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#1c1917');
      skyGrad.addColorStop(0.6, '#292524');
      skyGrad.addColorStop(1, '#44403c');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // Ancient Konark wheel silhouette / temple spire in background
      ctx.fillStyle = '#141210';
      // Sun Temple spire (Shikhara)
      ctx.beginPath();
      ctx.moveTo(width / 2, horizonY - 70);
      ctx.lineTo(width / 2 - 35, horizonY);
      ctx.lineTo(width / 2 + 35, horizonY);
      ctx.closePath();
      ctx.fill();

      // Ancient trees & foliage silhouettes
      ctx.fillStyle = '#0f1715';
      ctx.beginPath();
      ctx.arc(width * 0.15, horizonY - 10, 35, 0, Math.PI * 2);
      ctx.arc(width * 0.85, horizonY - 15, 40, 0, Math.PI * 2);
      ctx.fill();

      // B. Ancient Stone Temple Ground
      const groundGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      groundGrad.addColorStop(0, '#292524');
      groundGrad.addColorStop(1, '#0c0a09');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // C. Stone Pavement Tiles Scrolling
      const tileSpacing = 48;
      const tileScroll = (distanceRef.current * 10) % tileSpacing;
      for (let z = maxZ; z >= 20; z -= tileSpacing) {
        const curZ = z - tileScroll;
        if (curZ < 20 || curZ > maxZ) continue;
        const pL = project(-1.5, curZ);
        const pR = project(1.5, curZ);
        ctx.strokeStyle = '#44403c';
        ctx.lineWidth = Math.max(1, 3.5 * pL.scale);
        ctx.beginPath();
        ctx.moveTo(pL.x, pL.y);
        ctx.lineTo(pR.x, pR.y);
        ctx.stroke();
      }

      // Stone Path Boundaries with Ancient Carved Borders
      const edgeFarL = project(-1.55, maxZ);
      const edgeNearL = project(-1.55, 20);
      const edgeFarR = project(1.55, maxZ);
      const edgeNearR = project(1.55, 20);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(edgeFarL.x, edgeFarL.y);
      ctx.lineTo(edgeNearL.x, edgeNearL.y);
      ctx.moveTo(edgeFarR.x, edgeFarR.y);
      ctx.lineTo(edgeNearR.x, edgeNearR.y);
      ctx.stroke();

      // Lane dividers (ancient dashed stone grooves)
      [-0.5, 0.5].forEach((divOffset) => {
        const pFar = project(divOffset, maxZ);
        const pNear = project(divOffset, 20);
        ctx.strokeStyle = '#57534e';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([12, 10]);
        ctx.beginPath();
        ctx.moveTo(pFar.x, pFar.y);
        ctx.lineTo(pNear.x, pNear.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Side Torchlights with Animated Flickering Flames
      for (let z = 120; z < maxZ; z += 180) {
        const flameAnim = Math.sin(time * 0.01 + z) * 3;
        [-1.75, 1.75].forEach((side) => {
          const pTorchBase = project(side, z, 0);
          const pTorchTop = project(side, z, 40);
          const scale = pTorchBase.scale;

          // Torch post
          ctx.strokeStyle = '#78716c';
          ctx.lineWidth = Math.max(2, 4 * scale);
          ctx.beginPath();
          ctx.moveTo(pTorchBase.x, pTorchBase.y);
          ctx.lineTo(pTorchTop.x, pTorchTop.y);
          ctx.stroke();

          // Fire flame
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(pTorchTop.x, pTorchTop.y - 6 * scale + flameAnim * scale, 6 * scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(pTorchTop.x, pTorchTop.y - 6 * scale + flameAnim * scale, 3 * scale, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // D. Draw Active Knowledge Portal (Temple Gate)
      if (activePortalRef.current) {
        const p = activePortalRef.current;
        const gateZ = p.z;
        if (gateZ > 20 && gateZ < maxZ) {
          const pLeftPillar = project(-1.55, gateZ, 0);
          const pRightPillar = project(1.55, gateZ, 0);
          const pTopLeft = project(-1.55, gateZ, 125);
          const pTopRight = project(1.55, gateZ, 125);
          const scale = pLeftPillar.scale;

          // Ancient Stone Pillars
          ctx.fillStyle = '#292524';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = Math.max(2, 4 * scale);

          ctx.beginPath();
          ctx.moveTo(pLeftPillar.x, pLeftPillar.y);
          ctx.lineTo(pTopLeft.x, pTopLeft.y);
          ctx.lineTo(pTopRight.x, pTopRight.y);
          ctx.lineTo(pRightPillar.x, pRightPillar.y);
          ctx.stroke();

          // Stone Arch Inscription Board
          const bannerH = 34 * scale;
          ctx.fillStyle = 'rgba(28, 25, 23, 0.95)';
          ctx.fillRect(pTopLeft.x, pTopLeft.y, pTopRight.x - pTopLeft.x, bannerH);
          ctx.strokeStyle = '#d97706';
          ctx.strokeRect(pTopLeft.x, pTopLeft.y, pTopRight.x - pTopLeft.x, bannerH);

          // 3 Portal Lanes Options
          [-1, 0, 1].forEach((lOff, idx) => {
            const pOption = project(lOff, gateZ, 60);
            const optW = 75 * scale;
            const optH = 45 * scale;
            const isTarget = targetLaneRef.current === idx;

            ctx.fillStyle = isTarget ? 'rgba(245, 158, 11, 0.95)' : 'rgba(41, 37, 36, 0.9)';
            ctx.fillRect(pOption.x - optW / 2, pOption.y - optH / 2, optW, optH);
            ctx.strokeStyle = isTarget ? '#ffffff' : '#78716c';
            ctx.lineWidth = Math.max(1, 2.5 * scale);
            ctx.strokeRect(pOption.x - optW / 2, pOption.y - optH / 2, optW, optH);

            const fontSize = Math.max(8, Math.round(13 * scale));
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.fillStyle = isTarget ? '#000000' : '#fef3c7';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const letter = idx === 0 ? 'A' : idx === 1 ? 'B' : 'C';
            ctx.fillText(`${letter}: ${p.gate.options[idx].substring(0, 10)}`, pOption.x, pOption.y);
          });
        }
      }

      // E. Draw Ancient Gems
      gemsRef.current.forEach((gem) => {
        if (gem.collected || gem.z < 20 || gem.z > maxZ) return;
        const lOff = gem.lane - 1;
        const p = project(lOff, gem.z, 20);
        const radius = Math.max(3, 10 * p.scale);

        ctx.fillStyle = gem.color === 'emerald' ? '#10b981' : gem.color === 'ruby' ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        // Diamond shaped gem
        ctx.moveTo(p.x, p.y - radius);
        ctx.lineTo(p.x + radius, p.y);
        ctx.lineTo(p.x, p.y + radius);
        ctx.lineTo(p.x - radius, p.y);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1, 1.5 * p.scale);
        ctx.stroke();
      });

      // F. Draw Temple Obstacles
      const sortedObstacles = [...obstaclesRef.current].sort((a, b) => b.z - a.z);
      sortedObstacles.forEach((obs) => {
        if (obs.z < 20 || obs.z > maxZ) return;
        const lOff = obs.lane - 1;

        if (obs.type === 'fire_pit') {
          // Fire Pit / Brazier (Jump over!)
          const p = project(lOff, obs.z, 0);
          const w = 68 * p.scale;
          const h = 26 * p.scale;

          // Brazier base
          ctx.fillStyle = '#44403c';
          ctx.fillRect(p.x - w / 2, p.y - h * 0.4, w, h * 0.4);

          // Animated Fire Pit Flames
          const fH = h + Math.sin(time * 0.02 + obs.id) * (6 * p.scale);
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.moveTo(p.x - w / 2, p.y - h * 0.4);
          ctx.lineTo(p.x - w * 0.2, p.y - fH);
          ctx.lineTo(p.x, p.y - h * 0.4);
          ctx.lineTo(p.x + w * 0.2, p.y - fH);
          ctx.lineTo(p.x + w / 2, p.y - h * 0.4);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(p.x, p.y - h * 0.6, 6 * p.scale, 0, Math.PI * 2);
          ctx.fill();

          if (p.scale > 0.4) {
            ctx.fillStyle = '#fef08a';
            ctx.font = `bold ${Math.round(10 * p.scale)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('⬆️ JUMP', p.x, p.y - fH - 4);
          }
        } else if (obs.type === 'stone_arch') {
          // Ancient Stone Lintel Arch (Slide under!)
          const pGround = project(lOff, obs.z, 0);
          const pTop = project(lOff, obs.z, 55);
          const w = 78 * pGround.scale;
          const archH = 25 * pGround.scale;

          ctx.strokeStyle = '#78716c';
          ctx.lineWidth = Math.max(2, 4 * pGround.scale);
          ctx.beginPath();
          ctx.moveTo(pGround.x - w / 2, pGround.y);
          ctx.lineTo(pTop.x - w / 2, pTop.y);
          ctx.moveTo(pGround.x + w / 2, pGround.y);
          ctx.lineTo(pTop.x + w / 2, pTop.y);
          ctx.stroke();

          // Lintel stone
          ctx.fillStyle = '#57534e';
          ctx.fillRect(pTop.x - w / 2, pTop.y, w, archH);
          ctx.strokeStyle = '#a8a29e';
          ctx.strokeRect(pTop.x - w / 2, pTop.y, w, archH);

          if (pGround.scale > 0.4) {
            ctx.fillStyle = '#fef3c7';
            ctx.font = `bold ${Math.round(9 * pGround.scale)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⬇️ SLIDE', pTop.x, pTop.y + archH / 2);
          }
        } else if (obs.type === 'boulder') {
          // Giant Ancient Carved Boulder (Dodge!)
          const p = project(lOff, obs.z, 0);
          const radius = 34 * p.scale;

          ctx.fillStyle = '#78716c';
          ctx.beginPath();
          ctx.arc(p.x, p.y - radius, radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#44403c';
          ctx.lineWidth = Math.max(2, 3 * p.scale);
          ctx.stroke();

          // Carved cracks
          ctx.beginPath();
          ctx.moveTo(p.x - radius * 0.5, p.y - radius * 0.4);
          ctx.lineTo(p.x, p.y - radius);
          ctx.lineTo(p.x + radius * 0.4, p.y - radius * 0.2);
          ctx.stroke();
        }
      });

      // G. Draw Adventurer Character in Foreground
      const playerP = project(laneOffsetRef.current, 45, jumpHeightRef.current);
      const pScale = playerP.scale;
      const charW = 38 * pScale;
      const charH = isSlidingRef.current ? 22 * pScale : 48 * pScale;
      const charX = playerP.x;
      const charY = playerP.y;

      // Shadow
      const shadowP = project(laneOffsetRef.current, 45, 0);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(shadowP.x, shadowP.y, charW * 0.7, 7 * pScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shield Aura
      if (hasShieldRef.current) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(charX, charY - charH / 2, charH * 0.75, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (isSlidingRef.current) {
        ctx.fillStyle = '#b45309'; // adventurer vest
        ctx.beginPath();
        ctx.roundRect(charX - charW * 0.7, charY - charH, charW * 1.4, charH, 8 * pScale);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.stroke();

        ctx.fillStyle = '#d6d3d1';
        ctx.beginPath();
        ctx.arc(charX - charW, charY - 4, 4 * pScale, 0, Math.PI * 2);
        ctx.arc(charX + charW, charY - 4, 4 * pScale, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Body (Adventurer Jacket)
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.roundRect(charX - charW / 2, charY - charH * 0.75, charW, charH * 0.5, 6 * pScale);
        ctx.fill();

        // Legs (Khaki trousers)
        ctx.fillStyle = '#78716c';
        const legRunCycle = Math.sin(distanceRef.current * 0.8) * (8 * pScale);
        ctx.fillRect(charX - charW * 0.4, charY - charH * 0.25, charW * 0.32, charH * 0.25 + legRunCycle);
        ctx.fillRect(charX + charW * 0.08, charY - charH * 0.25, charW * 0.32, charH * 0.25 - legRunCycle);

        // Boots (Brown leather)
        ctx.fillStyle = '#451a03';
        ctx.fillRect(charX - charW * 0.45, charY + legRunCycle, charW * 0.38, 6 * pScale);
        ctx.fillRect(charX + charW * 0.05, charY - legRunCycle, charW * 0.38, 6 * pScale);

        // Head & Explorer Hat
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(charX, charY - charH * 0.85, charW * 0.38, 0, Math.PI * 2);
        ctx.fill();
        // Hat brim
        ctx.fillStyle = '#92400e';
        ctx.fillRect(charX - charW * 0.5, charY - charH * 0.88, charW, 4 * pScale);
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [gameState]);

  return (
    <div className="flex flex-col min-h-screen bg-stone-950 text-white max-w-lg mx-auto w-full select-none overflow-hidden relative">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-800 active:scale-95 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider font-mono">
              TEMPLE RUN 🛕
            </div>
            <h1 className="text-sm font-bold text-white odia-text">ମନ୍ଦିର କୁଇଜ୍ ରନର୍</h1>
          </div>
        </div>

        {/* Lives & Sound */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5" title="ଜୀବନ">
            {[1, 2, 3].map((heartIdx) => (
              <Heart
                key={heartIdx}
                className={`w-4 h-4 transition-transform ${
                  heartIdx <= lives
                    ? 'text-rose-500 fill-rose-500 animate-pulse'
                    : 'text-stone-600 fill-stone-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onToggleSound}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-500" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>
        </div>
      </header>

      {/* Main Game Screen */}
      <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
        {/* Real-time Portal Banner */}
        {activePortalBanner && (
          <div className="absolute top-2 left-2 right-2 z-20 animate-in slide-in-from-top-3 duration-300">
            <div className="bg-stone-900/95 border-2 border-amber-500 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-amber-400 font-mono flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ମନ୍ଦିର ଜ୍ଞାନ ଦ୍ୱାର: ସଠିକ୍ ପଥ ବାଛନ୍ତୁ!</span>
                </span>
                <span className="text-[10px] bg-amber-900/80 text-amber-200 px-2 py-0.5 rounded-full font-medium">
                  {activePortalBanner.subjectName}
                </span>
              </div>
              <p className="text-xs font-bold text-white odia-text leading-snug">
                {activePortalBanner.question}
              </p>
              <div className="grid grid-cols-3 gap-1 mt-2 text-center text-[10px]">
                {activePortalBanner.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`p-1 rounded-lg border font-medium truncate ${
                      targetLaneRef.current === idx
                        ? 'bg-amber-500 text-stone-950 border-white font-bold ring-2 ring-white'
                        : 'bg-stone-800 text-stone-300 border-stone-700'
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

        {/* Feedback Toast */}
        {portalFeedback && (
          <div className="absolute top-32 left-4 right-4 z-20 text-center animate-in zoom-in-90 duration-200 pointer-events-none">
            <div
              className={`inline-block px-4 py-2 rounded-2xl font-bold text-xs shadow-2xl backdrop-blur-md border ${
                portalFeedback.isCorrect
                  ? 'bg-emerald-600/90 text-white border-emerald-300'
                  : 'bg-rose-600/90 text-white border-rose-300'
              }`}
            >
              {portalFeedback.message}
            </div>
          </div>
        )}

        {/* HUD Overlay */}
        <div className="absolute top-2 left-3 right-3 z-10 flex items-center justify-between pointer-events-none text-xs font-mono">
          <div className="space-y-1">
            <div className="bg-stone-900/80 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-stone-800">
              <span className="text-stone-400 text-[10px] block">ସ୍କୋର</span>
              <span className="text-base font-black text-amber-400">
                {toOdiaNumber(score)}
              </span>
            </div>
            <div className="bg-stone-900/80 backdrop-blur-xs px-2.5 py-0.5 rounded-xl border border-stone-800 text-[11px] text-stone-300">
              ଦୂରତା: <strong className="text-white">{toOdiaNumber(distance)}m</strong>
            </div>
          </div>

          <div className="space-y-1 text-right">
            <div className="bg-stone-900/80 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-stone-800">
              <span className="text-stone-400 text-[10px] block">ମଣିରତ୍ନ (Gems)</span>
              <span className="text-base font-black text-amber-400 flex items-center justify-end gap-1">
                <span>💎</span> {toOdiaNumber(gems)}
              </span>
            </div>
            <div className="flex items-center justify-end gap-1">
              {hasShield && (
                <span className="bg-amber-600/80 text-white px-1.5 py-0.5 rounded-md text-[10px] flex items-center gap-0.5">
                  <Shield className="w-3 h-3" /> ଢାଲ
                </span>
              )}
              {frenzyTimer > 0 && (
                <span className="bg-rose-600/80 text-white font-bold px-1.5 py-0.5 rounded-md text-[10px] flex items-center gap-0.5">
                  <Flame className="w-3 h-3" /> ୨x {frenzyTimer}s
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
          className="w-full flex-1 bg-stone-950 block touch-none"
        />

        {/* Ready Overlay */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 z-30 bg-stone-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-3xl shadow-xl shadow-amber-600/30 mb-3 animate-bounce">
              🛕
            </div>
            <span className="text-xs font-bold text-amber-500 font-mono uppercase tracking-wider">
              TEMPLE RUN QUIZ ESCAPE
            </span>
            <h2 className="text-2xl font-black text-white odia-text mt-1">
              ଟେମ୍ପଲ୍ ରନ୍: ମନ୍ଦିର ରନର୍
            </h2>
            <p className="text-xs text-stone-300 odia-text max-w-xs mt-2 leading-relaxed">
              ପ୍ରାଚୀନ କୋଣାର୍କ ମନ୍ଦିର ପଥରେ ଦୌଡ଼ନ୍ତୁ! ଅଗ୍ନିକୁଣ୍ଡ ଉପରେ ଡିଅନ୍ତୁ (Jump), ପ୍ରସ୍ତର ତୋରଣ ତଳେ ଗଡ଼ନ୍ତୁ (Slide) ଏବଂ ପ୍ରାଚୀନ ଜ୍ଞାନ ଦ୍ୱାରରେ ସଠିକ୍ ଉତ୍ତର ବାଛି ଆଶୀର୍ବାଦ ଓ ପଏଣ୍ଟସ ପାଆନ୍ତୁ!
            </p>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 my-4 w-full max-w-xs text-left text-xs space-y-1.5 text-stone-300">
              <div className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">
                କିପରି ଖେଳିବେ (Controls):
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>ବାମ / ଡାହାଣ ସ୍ୱାଇପ୍:</span>
                <span className="text-white font-semibold">ପଥ ବଦଳାନ୍ତୁ</span>
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
              <div className="text-xs text-stone-400 mb-3 font-mono">
                ଆପଣଙ୍କ ହାଇସ୍କୋର: <strong className="text-amber-400">{toOdiaNumber(highScore)}</strong>
              </div>
            )}

            <button
              onClick={startGame}
              className="w-full max-w-xs py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-stone-950 font-black text-sm shadow-xl active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 odia-text"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>ଦୌଡ଼ ଆରମ୍ଭ କରନ୍ତୁ (Start Run)</span>
            </button>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 z-30 bg-stone-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-amber-600/20 text-amber-500 border border-amber-500/40 flex items-center justify-center text-3xl mb-3">
              🪨
            </div>
            <h2 className="text-2xl font-black text-white odia-text">
              ଦୌଡ଼ ସମାପ୍ତ (Game Over)
            </h2>
            <p className="text-xs text-stone-400 odia-text mt-1">
              ଉତ୍କୃଷ୍ଟ ସାହସ! ପ୍ରାଚୀନ ମନ୍ଦିର ପଥରେ ଆପଣ ଚମତ୍କାର ଦୌଡ଼ିଲେ।
            </p>

            <div className="grid grid-cols-2 gap-2 my-4 w-full max-w-xs text-left">
              <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                <span className="text-[10px] text-stone-400 block font-medium">ଅନ୍ତିମ ସ୍କୋର</span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {toOdiaNumber(score)}
                </span>
              </div>
              <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                <span className="text-[10px] text-stone-400 block font-medium">ହାଇସ୍କୋର</span>
                <span className="text-xl font-black text-white font-mono">
                  {toOdiaNumber(highScore)}
                </span>
              </div>
              <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                <span className="text-[10px] text-stone-400 block font-medium">ଦୂରତା</span>
                <span className="text-sm font-bold text-stone-200 font-mono">
                  {toOdiaNumber(distance)} ମିଟର
                </span>
              </div>
              <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl">
                <span className="text-[10px] text-stone-400 block font-medium">ଜ୍ଞାନ ଦ୍ୱାର</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {toOdiaNumber(portalsCleared)} ଟି ପାର୍
                </span>
              </div>
            </div>

            <div className="flex gap-2 w-full max-w-xs">
              <button
                onClick={startGame}
                className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-lg active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5 odia-text"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ପୁଣି ଖେଳନ୍ତୁ</span>
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs active:scale-95 transition cursor-pointer odia-text"
              >
                ହବ୍ କୁ ଫେରନ୍ତୁ
              </button>
            </div>
          </div>
        )}

        {/* Mobile Tactile Control Pad (Bottom) */}
        {gameState === 'playing' && (
          <div className="bg-stone-900/95 border-t border-stone-800 p-2.5 flex items-center justify-between gap-2 z-20">
            <button
              onPointerDown={moveLeft}
              className="flex-1 py-3 rounded-xl bg-stone-800 active:bg-amber-500 active:text-stone-950 border border-stone-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-0.5 shadow-md active:scale-95 transition cursor-pointer select-none"
            >
              <span className="text-base">⬅️</span>
              <span className="text-[10px] odia-text">ବାମ</span>
            </button>

            <button
              onPointerDown={jump}
              className="flex-1 py-3 rounded-xl bg-amber-500/20 active:bg-amber-500 active:text-stone-950 border border-amber-500/40 text-amber-300 font-bold text-xs flex flex-col items-center justify-center gap-0.5 shadow-md active:scale-95 transition cursor-pointer select-none"
            >
              <span className="text-base">⬆️</span>
              <span className="text-[10px] odia-text">ଡିଆଁ (Jump)</span>
            </button>

            <button
              onPointerDown={slide}
              className="flex-1 py-3 rounded-xl bg-yellow-500/20 active:bg-yellow-500 active:text-stone-950 border border-yellow-500/40 text-yellow-300 font-bold text-xs flex flex-col items-center justify-center gap-0.5 shadow-md active:scale-95 transition cursor-pointer select-none"
            >
              <span className="text-base">⬇️</span>
              <span className="text-[10px] odia-text">ଗଡ଼ିବା (Slide)</span>
            </button>

            <button
              onPointerDown={moveRight}
              className="flex-1 py-3 rounded-xl bg-stone-800 active:bg-amber-500 active:text-stone-950 border border-stone-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-0.5 shadow-md active:scale-95 transition cursor-pointer select-none"
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
