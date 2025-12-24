import React, { useState, useEffect, useCallback } from 'react';
import { Gift, Play, RotateCw, Trash2, Award, Settings2 } from 'lucide-react';
import { WinnerRecord } from '../types';

interface LuckyDrawSectionProps {
  nameList: string[];
}

const LuckyDrawSection: React.FC<LuckyDrawSectionProps> = ({ nameList }) => {
  const [winners, setWinners] = useState<WinnerRecord[]>([]);
  const [currentName, setCurrentName] = useState<string>("Ready?");
  const [isDrawing, setIsDrawing] = useState(false);
  const [allowRepeat, setAllowRepeat] = useState(false);
  
  // Confetti effect helper could go here, but keeping it simple with CSS animations first

  const availableList = useCallback(() => {
    if (allowRepeat) return nameList;
    const winnerNames = new Set(winners.map(w => w.name));
    return nameList.filter(name => !winnerNames.has(name));
  }, [nameList, winners, allowRepeat]);

  const startDraw = () => {
    const candidates = availableList();
    if (candidates.length === 0) {
      alert("所有人都已經中獎了！(Everyone has won!)");
      return;
    }

    setIsDrawing(true);
    let counter = 0;
    // Speed up then slow down logic could be implemented, but linear fast is good for simple web apps
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      setCurrentName(candidates[randomIndex]);
      counter++;
      
      // Stop condition
      if (counter > 20) { 
        clearInterval(interval);
        // Final random pick
        const finalIndex = Math.floor(Math.random() * candidates.length);
        const winnerName = candidates[finalIndex];
        setCurrentName(winnerName);
        
        setWinners(prev => [{
          id: crypto.randomUUID(),
          name: winnerName,
          timestamp: new Date()
        }, ...prev]);
        
        setIsDrawing(false);
      }
    }, 100); // 100ms switch speed
  };

  const resetWinners = () => {
    if (window.confirm("確定要清空中獎名單嗎？")) {
      setWinners([]);
      setCurrentName("Ready?");
    }
  };

  const candidatesCount = availableList().length;

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
      {/* Left: Control & Display */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Gift className="w-6 h-6 text-pink-500" />
                幸運抽獎 (Lucky Draw)
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                剩餘候選人: <span className="font-semibold text-indigo-600">{candidatesCount}</span> 人
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Settings2 className="w-4 h-4 text-slate-400" />
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={allowRepeat}
                  onChange={(e) => setAllowRepeat(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="text-sm font-medium text-slate-600">允許重複中獎</span>
              </label>
            </div>
          </div>

          {/* Main Stage */}
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
             {/* Decorative circles */}
             <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
             <div className="absolute bottom-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full translate-x-10 translate-y-10"></div>
             
             <div className={`text-center transition-all duration-300 transform ${isDrawing ? 'scale-110' : 'scale-100'}`}>
                <div className="text-white text-opacity-80 text-lg font-medium mb-2 uppercase tracking-widest">The Winner Is</div>
                <div className="text-4xl md:text-6xl font-black text-white drop-shadow-lg px-4 break-words max-w-2xl">
                  {currentName}
                </div>
             </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={startDraw}
              disabled={isDrawing || candidatesCount === 0}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-full font-bold text-lg shadow-lg hover:shadow-indigo-200 transition-all transform active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              {isDrawing ? "Drawing..." : "開始抽獎 (Start)"}
            </button>
          </div>
        </div>
      </div>

      {/* Right: Winner List */}
      <div className="w-full md:w-80 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            中獎名單 ({winners.length})
          </h3>
          {winners.length > 0 && (
            <button 
              onClick={resetWinners}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              title="清除名單"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50/50">
          {winners.length === 0 ? (
            <div className="h-32 flex flex-col items-center justify-center text-slate-400">
              <span className="text-sm">等待幸運兒...</span>
            </div>
          ) : (
            winners.map((winner, index) => (
              <div 
                key={winner.id} 
                className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm animate-in slide-in-from-top-2"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                  {winners.length - index}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 truncate">{winner.name}</div>
                  <div className="text-xs text-slate-400">
                    {winner.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LuckyDrawSection;