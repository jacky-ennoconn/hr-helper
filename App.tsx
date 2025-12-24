import React, { useState } from 'react';
import { Gift, Users, List, Sparkles } from 'lucide-react';
import InputSection from './components/InputSection';
import LuckyDrawSection from './components/LuckyDrawSection';
import GroupingSection from './components/GroupingSection';
import { AppTab } from './types';

const App = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.INPUT);
  const [nameList, setNameList] = useState<string[]>([]);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.INPUT:
        return (
          <InputSection 
            nameList={nameList} 
            setNameList={setNameList} 
            onContinue={() => setActiveTab(AppTab.DRAW)}
          />
        );
      case AppTab.DRAW:
        return <LuckyDrawSection nameList={nameList} />;
      case AppTab.GROUPS:
        return <GroupingSection nameList={nameList} />;
      default:
        return null;
    }
  };

  const navItems = [
    { id: AppTab.INPUT, label: '名單管理', sub: 'Input List', icon: List },
    { id: AppTab.DRAW, label: '獎品抽籤', sub: 'Lucky Draw', icon: Gift },
    { id: AppTab.GROUPS, label: '自動分組', sub: 'Grouping', icon: Users },
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">TeamSync</h1>
            <p className="text-xs text-slate-500 font-medium">HR Tool Suite</p>
          </div>
        </div>
        
        <div className="text-xs text-slate-400">
          v1.0.0
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col py-6 flex-shrink-0">
          <div className="px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <div className="hidden md:block text-left">
                    <div className={`text-sm font-semibold ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {item.label}
                    </div>
                    <div className={`text-[10px] font-medium uppercase tracking-wider ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                      {item.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-auto px-6 hidden md:block">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Current List</p>
              <p className="text-2xl font-bold text-slate-800">{nameList.length}</p>
              <p className="text-xs text-slate-400">Total Candidates</p>
            </div>
          </div>
        </nav>

        {/* Dynamic Content */}
        <main className="flex-1 p-6 md:p-8 overflow-hidden bg-slate-50/50">
          <div className="h-full max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;