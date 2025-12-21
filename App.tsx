import React, { useState, useEffect, useMemo } from 'react';
import { Mantra, LogEntry } from './types';
import { StorageService } from './services/storage';
import { BuddhaHeader } from './components/BuddhaHeader';
import { HistoryView } from './components/HistoryView';
import { InputModal } from './components/InputModal';
import { UserModal } from './components/UserModal';
import { EditMantraModal } from './components/EditMantraModal';
import { DateSettingModal } from './components/DateSettingModal';
import { SheetSettingsModal } from './components/SheetSettingsModal';
import { Pin, Plus, History, Edit2, Settings, CalendarClock, Sparkles, Filter } from 'lucide-react';

// --- Sub-component: Mantra Card ---
interface MantraCardProps {
  mantra: Mantra;
  displayCount: number;
  isPeriodActive: boolean;
  onTogglePin: (id: string) => void;
  onEdit: (mantra: Mantra) => void;
  onAddCount: (mantra: Mantra) => void;
}

const MantraCard: React.FC<MantraCardProps> = ({ 
  mantra, 
  displayCount, 
  isPeriodActive, 
  onTogglePin, 
  onEdit, 
  onAddCount 
}) => {
  // If period is active, we calculate percentage based on the PERIOD count vs target
  // If no period, we use TOTAL count vs target
  const percentage = (mantra.targetCount && mantra.targetCount > 0) 
    ? Math.min(100, Math.round((displayCount / mantra.targetCount) * 100)) 
    : 0;

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex items-center justify-between min-h-[100px] ${mantra.isPinned ? 'border border-amber-200 bg-amber-50/30' : ''}`}>
       {/* Progress Bar Background */}
       {mantra.targetCount && (
         <div className="absolute bottom-0 left-0 h-1 bg-amber-500/20 w-full">
           <div 
             className="h-full bg-amber-500 transition-all duration-500" 
             style={{ width: `${percentage}%` }}
           />
         </div>
       )}

       {/* Left Info Section */}
       <div className="flex-1 pr-4 z-10">
         <div className="flex items-center gap-2 mb-1">
           <h3 className={`text-lg font-bold line-clamp-1 ${mantra.isPinned ? 'text-amber-900' : 'text-stone-800'}`}>
             {mantra.name}
           </h3>
           <button 
             onClick={() => onTogglePin(mantra.id)}
             className={`p-1.5 rounded-full touch-manipulation flex-shrink-0 ${mantra.isPinned ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-400 active:bg-stone-200'}`}
             title={mantra.isPinned ? "取消置頂" : "置頂"}
           >
             <Pin size={16} className={mantra.isPinned ? 'fill-amber-600' : ''} />
           </button>
         </div>
         <div className="flex items-baseline gap-2 flex-wrap">
           <span className={`text-2xl font-serif font-medium ${isPeriodActive ? 'text-amber-700' : 'text-stone-900'}`}>
             {displayCount.toLocaleString()}
           </span>
           
           {/* If showing period count, also show lifetime total */}
           {isPeriodActive && (
              <span className="text-stone-400 text-xs mt-1">
                (總累積: {mantra.totalCount.toLocaleString()})
              </span>
           )}

           {mantra.targetCount && (
             <span className="text-stone-400 text-xs mt-1">
               / {mantra.targetCount.toLocaleString()} 
               {isPeriodActive ? ' (區間目標)' : ''} 
               <span className="ml-1 text-amber-600 font-bold">{percentage}%</span>
             </span>
           )}
         </div>
       </div>

       {/* Top Right Tools - Always visible on mobile, hover on desktop */}
       <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20">
           <button 
             onClick={() => onEdit(mantra)}
             className="p-2 md:p-1.5 bg-stone-100 active:bg-stone-200 text-stone-500 rounded-full touch-manipulation"
             title="編輯"
           >
             <Edit2 size={16} className="md:w-3.5 md:h-3.5" />
           </button>
       </div>

       {/* Right Action Button */}
       <button 
         onClick={() => onAddCount(mantra)}
         className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 flex-shrink-0 z-10 ${mantra.isPinned ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-stone-900 hover:bg-black text-white'}`}
         title="增加次數"
       >
         <Plus size={24} />
       </button>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [userName, setUserName] = useState<string>('善信');
  const [userGroup, setUserGroup] = useState<string>('');
  const [globalDateRange, setGlobalDateRange] = useState<{name?: string, start?: string, end?: string}>({});
  const [sheetUrl, setSheetUrl] = useState<string>('');
  
  // UI States
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  
  const [selectedMantra, setSelectedMantra] = useState<Mantra | null>(null); // For Adding Count
  const [editingMantra, setEditingMantra] = useState<Mantra | null>(null); // For Editing Settings
  const [newItemName, setNewItemName] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Load initial data and handle URL parameters for auto-configuration
  useEffect(() => {
    // 1. Load Local Data
    setMantras(StorageService.getMantras());
    setLogs(StorageService.getLogs());
    setUserName(StorageService.getUserName());
    const savedGroup = StorageService.getUserGroup();
    setUserGroup(savedGroup);
    setGlobalDateRange(StorageService.getGlobalDateRange());
    setSheetUrl(StorageService.getGoogleSheetUrl());

    // 2. Check URL Parameters (Magic Link Logic)
    // Allows sending a link like: https://app-url.com/?script=URL&group=GroupA
    const params = new URLSearchParams(window.location.search);
    const scriptParam = params.get('script');
    const groupParam = params.get('group');
    
    let configChanged = false;

    if (scriptParam) {
      StorageService.setGoogleSheetUrl(scriptParam);
      setSheetUrl(scriptParam);
      configChanged = true;
    }

    if (groupParam) {
      StorageService.setUserGroup(groupParam);
      setUserGroup(groupParam);
      configChanged = true;
    }

    // Clean URL if we processed parameters (Remove query string to keep URL clean)
    if (configChanged) {
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }

  }, []);

  // Handlers
  const handleAddNewMantra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newMantra = StorageService.addMantra(newItemName);
    setMantras(prev => [...prev, newMantra]);
    setNewItemName('');
    setIsAddingNew(false);
  };

  const handleTogglePin = (id: string) => {
    const updated = StorageService.togglePin(id);
    setMantras(updated);
  };

  const handleAddCount = (amount: number) => {
    if (selectedMantra) {
      const result = StorageService.incrementMantra(selectedMantra.id, amount);
      setMantras(result.updatedMantras);
      setLogs(result.updatedLogs);
      setSelectedMantra(null);
    }
  };

  const handleSaveUser = (name: string, group: string) => {
    StorageService.setUserName(name);
    StorageService.setUserGroup(group);
    setUserName(name);
    setUserGroup(group);
    setIsUserModalOpen(false);
  };

  const handleUpdateMantra = (id: string, updates: Partial<Mantra>) => {
    const updated = StorageService.updateMantra(id, updates);
    setMantras(updated);
    setEditingMantra(null);
  };

  const handleResetMantra = (id: string) => {
    const updated = StorageService.resetMantra(id);
    setMantras(updated);
    setEditingMantra(null);
  };

  const handleSaveGlobalDateRange = (name: string | undefined, start: string | undefined, end: string | undefined) => {
    StorageService.setGlobalDateRange(name, start, end);
    setGlobalDateRange({ name, start, end });
    setIsDateModalOpen(false);
  };

  const handleSaveSheetUrl = (url: string) => {
    StorageService.setGoogleSheetUrl(url);
    setSheetUrl(url);
    setIsSheetModalOpen(false);
  };

  // --- Calculations ---
  
  // Calculate period counts based on globalDateRange
  const periodCounts = useMemo(() => {
     const counts: Record<string, number> = {};
     mantras.forEach(m => counts[m.id] = 0);

     const hasRange = globalDateRange.start || globalDateRange.end;
     
     if (!hasRange) {
         // optimization: just use totalCount if no range
         mantras.forEach(m => counts[m.id] = m.totalCount);
         return counts;
     }

     const start = globalDateRange.start ? new Date(globalDateRange.start).setHours(0,0,0,0) : -8640000000000000;
     const end = globalDateRange.end ? new Date(globalDateRange.end).setHours(23,59,59,999) : 8640000000000000;

     logs.forEach(log => {
         const t = new Date(log.timestamp).getTime();
         if (t >= start && t <= end) {
             counts[log.mantraId] = (counts[log.mantraId] || 0) + log.amount;
         }
     });
     
     return counts;
  }, [logs, mantras, globalDateRange]);

  const isPeriodActive = !!(globalDateRange.start || globalDateRange.end || globalDateRange.name);

  // Sorting: Pinned first, then Created Date
  const pinnedMantras = useMemo(() => {
    return mantras.filter(m => m.isPinned);
  }, [mantras]);

  const otherMantras = useMemo(() => {
    return mantras.filter(m => !m.isPinned).sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [mantras]);

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-800 pb-20">
      <BuddhaHeader />

      <div className="max-w-3xl mx-auto px-4 -mt-10 relative z-10">
        {/* Header / User Info */}
        <div className="flex items-center justify-between mb-6">
          <div 
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm pl-2 pr-4 py-2 rounded-full shadow-sm cursor-pointer hover:bg-white transition-colors"
            onClick={() => setIsUserModalOpen(true)}
          >
            <div className={`text-white font-bold text-xs px-3 py-1.5 rounded-full flex-shrink-0 ${sheetUrl ? 'bg-amber-500' : 'bg-stone-400'}`}>
              {sheetUrl ? '已連線' : '單機版'}
            </div>
            <div className="flex items-baseline gap-1 truncate">
              {userGroup && (
                <span className="text-xs text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                  {userGroup}
                </span>
              )}
              <span className="font-bold text-stone-700">{userName}</span>
            </div>
            <Settings size={14} className="text-stone-400 flex-shrink-0 ml-1" />
          </div>

          <div className="flex gap-2">
             <button 
               onClick={() => setIsDateModalOpen(true)}
               className={`p-3 bg-white hover:bg-stone-50 text-stone-600 rounded-full shadow-sm transition-all ${isPeriodActive ? 'ring-2 ring-amber-400 text-amber-600' : ''}`}
               title="設定願力期限"
             >
               <CalendarClock size={20} />
             </button>
             <button 
               onClick={() => setIsHistoryOpen(true)}
               className="p-3 bg-white hover:bg-stone-50 text-stone-600 rounded-full shadow-sm transition-all"
               title="檢視紀錄"
             >
               <History size={20} />
             </button>
          </div>
        </div>

        {/* Global Date Banner */}
        {isPeriodActive && (
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl mb-6 flex flex-col md:flex-row md:items-center justify-between text-sm text-amber-800 animate-fade-in shadow-sm gap-2">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
               <div className="flex items-center gap-2">
                 <Filter size={16} />
                 {globalDateRange.name && (
                   <span className="font-bold text-amber-900 border-r border-amber-200 pr-3 mr-1">
                     {globalDateRange.name}
                   </span>
                 )}
               </div>
               
               <span className="text-amber-700/80 text-xs md:text-sm">
                 {globalDateRange.start ? new Date(globalDateRange.start).toLocaleDateString() : '起初'} 
                 {' ~ '} 
                 {globalDateRange.end ? new Date(globalDateRange.end).toLocaleDateString() : '迄今'}
               </span>
            </div>
            <button 
              onClick={() => handleSaveGlobalDateRange(undefined, undefined, undefined)}
              className="text-amber-400 hover:text-amber-600 text-xs px-2 self-end md:self-auto"
            >
              清除/重設
            </button>
          </div>
        )}

        {/* ---------------- PINNED SECTION ---------------- */}
        {pinnedMantras.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Sparkles size={16} className="text-amber-500" />
              <h2 className="text-sm font-bold text-amber-700 uppercase tracking-wider">精進重點</h2>
            </div>
            <div className="space-y-4">
              {pinnedMantras.map(mantra => (
                <MantraCard 
                  key={mantra.id}
                  mantra={mantra}
                  displayCount={periodCounts[mantra.id] || 0}
                  isPeriodActive={isPeriodActive}
                  onTogglePin={handleTogglePin}
                  onEdit={setEditingMantra}
                  onAddCount={setSelectedMantra}
                />
              ))}
            </div>
            
            {/* Visual Divider */}
            <div className="my-8 flex items-center gap-4 opacity-50">
              <div className="h-px bg-stone-300 flex-1"></div>
              <span className="text-stone-400 text-xs font-serif">❖</span>
              <div className="h-px bg-stone-300 flex-1"></div>
            </div>
          </div>
        )}

        {/* ---------------- OTHERS SECTION ---------------- */}
        <div className="space-y-4">
          {pinnedMantras.length > 0 && (
             <div className="px-1 mb-2">
                <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">日常定課</h2>
             </div>
          )}
          
          {otherMantras.map(mantra => (
            <MantraCard 
              key={mantra.id}
              mantra={mantra}
              displayCount={periodCounts[mantra.id] || 0}
              isPeriodActive={isPeriodActive}
              onTogglePin={handleTogglePin}
              onEdit={setEditingMantra}
              onAddCount={setSelectedMantra}
            />
          ))}

          {/* Add New Button */}
          {!isAddingNew ? (
            <button 
              onClick={() => setIsAddingNew(true)}
              className="w-full py-4 border-2 border-dashed border-stone-300 text-stone-400 font-bold rounded-2xl hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Plus size={20} />
              新增定課項目
            </button>
          ) : (
            <form onSubmit={handleAddNewMantra} className="bg-white rounded-2xl p-5 shadow-lg border-2 border-amber-400 animate-fade-in mt-4">
              <input 
                 type="text" 
                 value={newItemName}
                 onChange={(e) => setNewItemName(e.target.value)}
                 className="w-full p-3 bg-stone-50 border-b-2 border-stone-200 focus:border-amber-500 outline-none text-lg font-bold mb-4"
                 placeholder="輸入項目名稱..."
                 autoFocus
              />
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 py-3 text-stone-500 font-bold hover:bg-stone-100 rounded-xl"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 shadow-md"
                >
                  確認新增
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modals */}
      {isHistoryOpen && <HistoryView logs={logs} onClose={() => setIsHistoryOpen(false)} />}
      
      {selectedMantra && (
        <InputModal 
          mantra={selectedMantra} 
          onClose={() => setSelectedMantra(null)} 
          onConfirm={handleAddCount}
        />
      )}

      {isUserModalOpen && (
        <UserModal 
          currentName={userName} 
          currentGroup={userGroup}
          onClose={() => setIsUserModalOpen(false)} 
          onSave={handleSaveUser}
        />
      )}

      {editingMantra && (
        <EditMantraModal 
          mantra={editingMantra} 
          onClose={() => setEditingMantra(null)} 
          onSave={handleUpdateMantra}
          onReset={handleResetMantra}
        />
      )}

      {isDateModalOpen && (
        <DateSettingModal 
          currentDateRange={globalDateRange} 
          onClose={() => setIsDateModalOpen(false)} 
          onSave={handleSaveGlobalDateRange}
        />
      )}

      {isSheetModalOpen && (
        <SheetSettingsModal 
          currentUrl={sheetUrl}
          onClose={() => setIsSheetModalOpen(false)}
          onSave={handleSaveSheetUrl}
        />
      )}
    </div>
  );
};

export default App;