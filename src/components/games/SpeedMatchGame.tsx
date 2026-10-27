import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, Flame, RotateCcw, Trophy, CheckCircle2, Sparkles, Clock, Zap } from 'lucide-react';
import { SPEED_MATCH_PAIRS, MatchPair } from '../../data/miniGamesData';
import { soundManager } from '../../utils/audio';
import { toOdiaNumber } from '../../utils/odiaNumerals';

interface TileItem {
  tileId: string;
  pairId: string;
  text: string;
  side: 'left' | 'right';
  categoryOdia: string;
  matched: boolean;
}

interface SpeedMatchGameProps {
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SpeedMatchGame: React.FC<SpeedMatchGameProps> = ({
  onBack,
  soundEnabled,
  onToggleSound
}) => {
  const TOTAL_SECONDS = 60;
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SECONDS);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [matchesCount, setMatchesCount] = useState<number>(0);

  const [tiles, setTiles] = useState<TileItem[]>([]);
  const [selectedTile, setSelectedTile] = useState<TileItem | null>(null);
  const [wrongPairIds, setWrongPairIds] = useState<string[]>([]);
  const [matchedAnimationIds, setMatchedAnimationIds] = useState<string[]>([]);

  const poolRef = useRef<MatchPair[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('skv_speedmatch_highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Start new game setup
  const startGame = useCallback(() => {
    // Shuffle all match pairs
    const shuffledPool = [...SPEED_MATCH_PAIRS].sort(() => Math.random() - 0.5);
    poolRef.current = shuffledPool;

    // Pick 4 pairs (8 tiles)
    const initialPairs = poolRef.current.splice(0, 4);
    const initialTiles: TileItem[] = [];

    initialPairs.forEach((p) => {
      initialTiles.push({
        tileId: `left-${p.id}`,
        pairId: p.id,
        text: p.left,
        side: 'left',
        categoryOdia: p.categoryOdia,
        matched: false
      });
      initialTiles.push({
        tileId: `right-${p.id}`,
        pairId: p.id,
        text: p.right,
        side: 'right',
        categoryOdia: p.categoryOdia,
        matched: false
      });
    });

    // Shuffle the 8 tiles
    setTiles(initialTiles.sort(() => Math.random() - 0.5));
    setTimeLeft(TOTAL_SECONDS);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setMatchesCount(0);
    setSelectedTile(null);
    setWrongPairIds([]);
    setMatchedAnimationIds([]);
    setIsGameOver(false);
    setIsPlaying(true);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  // Check high score on game over
  useEffect(() => {
    if (isGameOver && score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('skv_speedmatch_highscore', score.toString());
      } catch {
        // ignore storage error
      }
    }
  }, [isGameOver, score, highScore]);

  // Handle tile click
  const handleTileClick = (tile: TileItem) => {
    if (!isPlaying || tile.matched || wrongPairIds.includes(tile.tileId)) return;

    soundManager.playClick();

    // If no tile is currently selected
    if (!selectedTile) {
      setSelectedTile(tile);
      return;
    }

    // Tapping the same tile deselects it
    if (selectedTile.tileId === tile.tileId) {
      setSelectedTile(null);
      return;
    }

    // Two tiles selected: check if matching
    const isMatch = selectedTile.pairId === tile.pairId && selectedTile.tileId !== tile.tileId;

    if (isMatch) {
      // MATCH!
      soundManager.playCorrect();
      const currentCombo = combo + 1;
      setCombo(currentCombo);
      setMaxCombo((prev) => Math.max(prev, currentCombo));
      setMatchesCount((prev) => prev + 1);

      // Score calculation: 100 base + 50 combo bonus
      const pointsEarned = 100 + currentCombo * 50;
      setScore((prev) => prev + pointsEarned);

      // Trigger matched animation
      const matchedIds = [selectedTile.tileId, tile.tileId];
      setMatchedAnimationIds(matchedIds);

      // Replace matched tiles with new pair after 300ms
      setTimeout(() => {
        setTiles((prevTiles) => {
          // If pool still has pairs, take 1 pair and replace
          let newPair: MatchPair | undefined;
          if (poolRef.current.length > 0) {
            newPair = poolRef.current.shift();
          } else {
            // Reshuffle all pairs if pool empty
            poolRef.current = [...SPEED_MATCH_PAIRS].sort(() => Math.random() - 0.5);
            newPair = poolRef.current.shift();
          }

          if (newPair) {
            const newTile1: TileItem = {
              tileId: `left-${newPair.id}-${Date.now()}`,
              pairId: newPair.id,
              text: newPair.left,
              side: 'left',
              categoryOdia: newPair.categoryOdia,
              matched: false
            };
            const newTile2: TileItem = {
              tileId: `right-${newPair.id}-${Date.now()}`,
              pairId: newPair.id,
              text: newPair.right,
              side: 'right',
              categoryOdia: newPair.categoryOdia,
              matched: false
            };

            return prevTiles.map((t) => {
              if (t.tileId === matchedIds[0]) return newTile1;
              if (t.tileId === matchedIds[1]) return newTile2;
              return t;
            });
          }

          return prevTiles.map((t) =>
            matchedIds.includes(t.tileId) ? { ...t, matched: true } : t
          );
        });

        setMatchedAnimationIds([]);
        setSelectedTile(null);
      }, 350);
    } else {
      // WRONG MATCH
      soundManager.playWrong();
      setCombo(0);
      setWrongPairIds([selectedTile.tileId, tile.tileId]);

      setTimeout(() => {
        setWrongPairIds([]);
        setSelectedTile(null);
      }, 600);
    }
  };

  const timerPercent = Math.round((timeLeft / TOTAL_SECONDS) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white max-w-lg mx-auto w-full select-none">
      {/* Top Header */}
      <header className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 active:scale-95 transition-all cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5 odia-text">
              <span>ଶବ୍ଦ ଯୋଡ଼ି</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-md font-mono">
                SPEED MATCH
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 odia-text">
              ସମ୍ପର୍କିତ ଯୋଡ଼ାକୁ ଚୟନ କରି ମ୍ୟାଚ୍ କରନ୍ତୁ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">ହାଇସ୍କୋର</span>
            <span className="text-xs font-mono font-bold text-amber-400">{toOdiaNumber(highScore)}</span>
          </div>
        </div>
      </header>

      {/* Stats Bar (Timer, Score, Combo) */}
      <div className="bg-slate-850 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
        {/* Timer */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">ସମୟ ବାକି</span>
            <span className={`text-base font-black font-mono leading-none ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
              {toOdiaNumber(timeLeft)} ସେ.
            </span>
          </div>
        </div>

        {/* Combo Multiplier */}
        {combo > 1 && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 font-bold text-xs animate-bounce">
            <Flame className="w-3.5 h-3.5 fill-orange-400" />
            <span>{toOdiaNumber(combo)}x କମ୍ବୋ!</span>
          </div>
        )}

        {/* Current Score */}
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block font-medium">ମୋଟ ସ୍କୋର</span>
          <span className="text-lg font-black font-mono text-amber-400 leading-none">
            {toOdiaNumber(score)}
          </span>
        </div>
      </div>

      {/* Timer Progress Track */}
      <div className="w-full h-1.5 bg-slate-800">
        <div
          className={`h-full transition-all duration-300 ease-linear ${
            timeLeft <= 10 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-indigo-500'
          }`}
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Main Play Area */}
      <main className="flex-1 p-3.5 sm:p-4 flex flex-col justify-center">
        {!isPlaying && !isGameOver ? (
          /* Start Screen */
          <div className="text-center py-8 px-4 space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 text-3xl">
              ⚡
            </div>
            <div>
              <h2 className="text-2xl font-black odia-text text-white">
                ଶବ୍ଦ ଯୋଡ଼ି କନସେପ୍ଟ ମ୍ୟାଚ୍
              </h2>
              <p className="text-xs text-slate-300 odia-text mt-2 leading-relaxed max-w-xs mx-auto">
                ୬୦ ସେକେଣ୍ଡରେ ଯେତେ ସମ୍ଭବ ଅଧିକ ଯୋଡ଼ା (କବି-କାବ୍ୟ, ସୂତ୍ର, ବିଜ୍ଞାନ ନିୟମ, ମସିହା) ମ୍ୟାଚ୍ କରି ସର୍ବାଧିକ ସ୍କୋର କରନ୍ତୁ!
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 max-w-xs mx-auto text-left text-xs space-y-2 text-slate-300 odia-text">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[10px] font-bold">୧</span>
                <span>ପ୍ରଥମେ ଗୋଟିଏ କାର୍ଡ ଉପରେ ଟ୍ୟାପ୍ କରନ୍ତୁ।</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[10px] font-bold">୨</span>
                <span>ତା’ପରେ ତାର ସଠିକ୍ ସମ୍ପର୍କିତ କାର୍ଡ ଛୁଅନ୍ତୁ।</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[10px] font-bold">୩</span>
                <span>ଲଗାତାର ଠିକ୍ ମ୍ୟାଚ୍ କଲେ କମ୍ବୋ ବୋନସ୍ ମିଳିବ! 🔥</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full max-w-xs h-13 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-98 text-slate-950 font-black text-base shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 mx-auto cursor-pointer transition-all odia-text"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>ଖେଳ ଆରମ୍ଭ କରନ୍ତୁ (Start 60s Run)</span>
            </button>
          </div>
        ) : (
          /* Active Card Grid (8 Tiles) */
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 max-w-md mx-auto w-full my-auto">
            {tiles.map((tile) => {
              const isSelected = selectedTile?.tileId === tile.tileId;
              const isWrong = wrongPairIds.includes(tile.tileId);
              const isMatched = matchedAnimationIds.includes(tile.tileId);

              let cardStyle = 'bg-slate-800/90 border-slate-700 text-slate-100 hover:border-slate-500';

              if (isSelected) {
                cardStyle = 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400 scale-[1.02]';
              } else if (isWrong) {
                cardStyle = 'bg-rose-900/40 border-rose-500 text-rose-200 animate-shake';
              } else if (isMatched) {
                cardStyle = 'bg-emerald-600/40 border-emerald-400 text-emerald-200 scale-95 opacity-80';
              }

              return (
                <button
                  key={tile.tileId}
                  onClick={() => handleTileClick(tile)}
                  disabled={!isPlaying || isMatched}
                  className={`min-h-[82px] sm:min-h-[92px] p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer active:scale-95 relative overflow-hidden ${cardStyle}`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {tile.categoryOdia}
                  </span>
                  <span className="text-sm sm:text-base font-bold odia-text leading-snug">
                    {tile.text}
                  </span>

                  {isMatched && (
                    <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-2xs flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-in zoom-in" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-850 rounded-3xl p-6 max-w-xs w-full text-center border border-slate-700 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30 text-3xl">
              🏆
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                ସମୟ ସମାପ୍ତ!
              </span>
              <h3 className="text-2xl font-black text-white odia-text mt-1">
                ଅଭିନନ୍ଦନ!
              </h3>
            </div>

            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 odia-text">ସର୍ବାଧିକ ସ୍କୋର:</span>
                <span className="text-base font-mono font-bold text-amber-400">
                  {toOdiaNumber(score)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 odia-text">ମୋଟ ଯୋଡ଼ି ମ୍ୟାଚ୍:</span>
                <span className="font-mono font-bold text-white">
                  {toOdiaNumber(matchesCount)} ଟି
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 odia-text">ସର୍ବୋଚ୍ଚ କମ୍ବୋ:</span>
                <span className="font-mono font-bold text-orange-400">
                  {toOdiaNumber(maxCombo)}x 🔥
                </span>
              </div>
              {score >= highScore && score > 0 && (
                <div className="pt-2 text-amber-300 font-bold text-center border-t border-slate-700 odia-text">
                  🎉 ନୂଆ ବ୍ୟକ୍ତିଗତ ରେକର୍ଡ (New High Score)!
                </div>
              )}
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={startGame}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer odia-text"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ପୁଣି ଥରେ ଖେଳନ୍ତୁ (Play Again)</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onBack();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 active:scale-95 text-xs font-semibold cursor-pointer odia-text"
              >
                ଗେମ୍ସ ମେନୁକୁ ଫେରନ୍ତୁ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
