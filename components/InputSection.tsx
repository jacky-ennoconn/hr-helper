import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, AlertTriangle, Trash2, UserPlus, Users, RotateCcw } from 'lucide-react';
import { generateMockData, parseCSVOrText } from '../utils/helpers';

interface InputSectionProps {
  nameList: string[];
  setNameList: (list: string[]) => void;
  onContinue: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({ nameList, setNameList, onContinue }) => {
  const [inputText, setInputText] = useState("");
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync prop list to text area on mount (if list exists but text is empty)
  useEffect(() => {
    if (nameList.length > 0 && inputText === "") {
      setInputText(nameList.join('\n'));
    }
  }, [nameList, inputText]);

  // Analyze duplicates whenever list changes
  useEffect(() => {
    const seen = new Set();
    const dups = new Set<string>();
    nameList.forEach(name => {
      if (seen.has(name)) {
        dups.add(name);
      }
      seen.add(name);
    });
    setDuplicates(Array.from(dups));
  }, [nameList]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    const parsed = parseCSVOrText(text);
    setNameList(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text); // Replace current text
      setNameList(parseCSVOrText(text));
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleMockData = () => {
    const mock = generateMockData();
    const text = mock.join('\n');
    setInputText(text);
    setNameList(mock);
  };

  const removeDuplicates = () => {
    const unique = Array.from(new Set(nameList));
    setNameList(unique);
    setInputText(unique.join('\n'));
  };

  const clearAll = () => {
    setInputText("");
    setNameList([]);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-shrink-0">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
          <Users className="w-6 h-6 text-indigo-600" />
          名單管理 (List Management)
        </h2>
        <p className="text-slate-500 text-sm">
          請輸入姓名，每行一個，或使用逗號分隔。支援 CSV 檔案匯入。
        </p>
      </div>

      <div className="flex-1 min-h-0 flex gap-6 flex-col md:flex-row">
        {/* Left: Input Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              匯入 CSV (Import)
            </button>
            <input
              type="file"
              accept=".csv,.txt"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
            
            <button
              onClick={handleMockData}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 text-indigo-700 text-sm font-medium transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              使用模擬名單 (Demo Data)
            </button>

             <button
              onClick={clearAll}
              className="ml-auto flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              清空
            </button>
          </div>

          <textarea
            className="flex-1 w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none font-mono text-sm leading-relaxed shadow-inner"
            placeholder="請在此貼上姓名..."
            value={inputText}
            onChange={handleTextChange}
          />
        </div>

        {/* Right: Preview & Validation */}
        <div className="w-full md:w-80 flex flex-col gap-4">
           {/* Summary Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">名單概覽</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600">總人數</span>
              <span className="text-2xl font-bold text-slate-800">{nameList.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">重複人數</span>
              <span className={`text-lg font-bold ${duplicates.length > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                {duplicates.length}
              </span>
            </div>
          </div>

          {/* Duplicate Warning */}
          {duplicates.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-in slide-in-from-right-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 text-sm">發現重複姓名</h4>
                  <p className="text-amber-700 text-xs mt-1 mb-3">
                    系統偵測到 {duplicates.length} 個重複項目。建議移除以確保抽籤公平性。
                  </p>
                  <button
                    onClick={removeDuplicates}
                    className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    一鍵移除重複 (Remove All)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preview List */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-3 bg-slate-50 border-b border-slate-200">
               <h3 className="text-xs font-semibold text-slate-500 uppercase">預覽 (Preview)</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {nameList.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  尚無資料
                </div>
              ) : (
                <ul className="space-y-1">
                  {nameList.map((name, idx) => {
                    const isDup = duplicates.includes(name);
                    return (
                      <li 
                        key={`${name}-${idx}`} 
                        className={`text-sm px-3 py-2 rounded flex items-center justify-between group ${
                          isDup ? 'bg-amber-50 text-amber-900' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{name}</span>
                        {isDup && <span className="text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">重複</span>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;