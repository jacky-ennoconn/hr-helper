import React, { useState } from 'react';
import { Users, Shuffle, Grid, List, Download } from 'lucide-react';
import { shuffleArray, chunkArray } from '../utils/helpers';

interface GroupingSectionProps {
  nameList: string[];
}

const GroupingSection: React.FC<GroupingSectionProps> = ({ nameList }) => {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<string[][]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    if (nameList.length === 0) {
      alert("請先在名單管理輸入姓名！");
      return;
    }
    const shuffled = shuffleArray(nameList);
    const chunked = chunkArray(shuffled, groupSize);
    setGroups(chunked);
    setIsGenerated(true);
  };

  const downloadResults = () => {
    if (groups.length === 0) return;
    
    let content = "Group,Member\n";
    groups.forEach((group, groupIndex) => {
      group.forEach(member => {
        content += `Group ${groupIndex + 1},${member}\n`;
      });
    });

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'group_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Configuration Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              自動分組 (Auto Grouping)
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              總人數: {nameList.length} 人 | 預計產生: {Math.ceil(nameList.length / groupSize)} 組
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <span className="text-sm font-medium text-slate-600 px-2">每組人數:</span>
              <input
                type="number"
                min="1"
                max={nameList.length || 100}
                value={groupSize}
                onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 p-1.5 text-center text-sm font-bold text-slate-800 bg-white rounded border border-slate-300 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              立即分組 (Generate)
            </button>
            
            {isGenerated && (
              <button
                onClick={downloadResults}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                匯出 CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Visualization */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        {!isGenerated ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <Grid className="w-12 h-12 mb-2 opacity-20" />
            <p>設定人數並點擊「立即分組」查看結果</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
            {groups.map((group, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700">Group {idx + 1}</h3>
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {group.length} 人
                  </span>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {group.map((member, mIdx) => (
                      <li key={mIdx} className="flex items-center gap-3 text-slate-600 text-sm">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                          {mIdx + 1}
                        </div>
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupingSection;