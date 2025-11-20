import React, { useState } from 'react';
import { ThreeScene } from './components/ThreeScene';
import { GeminiOracle } from './components/GeminiOracle';
import { INITIAL_ASSETS } from './constants';
import { Asset } from './types';
import { Plus, X, Menu, ArrowUpRight } from 'lucide-react';

const App: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [newSymbol, setNewSymbol] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const totalPortfolioValue = assets.reduce((acc, curr) => acc + (curr.amount * curr.price), 0);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol || !newAmount || !newPrice) return;

    const newAsset: Asset = {
      id: Date.now().toString(),
      symbol: newSymbol.toUpperCase(),
      name: newSymbol.toUpperCase(),
      amount: parseFloat(newAmount),
      price: parseFloat(newPrice),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };

    setAssets([...assets, newAsset]);
    setNewSymbol('');
    setNewAmount('');
    setNewPrice('');
    setShowAddModal(false);
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden font-sans selection:bg-white selection:text-black">
      
      {/* Navigation Header */}
      <nav className="h-24 px-8 md:px-12 flex items-center justify-between z-20 bg-black absolute top-0 w-full border-b border-white/5">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
             <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="hidden md:flex gap-12 text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 font-sans">
          <a href="#" className="hover:text-white transition-colors">Thesis</a>
          <a href="#" className="hover:text-white transition-colors">What We Do</a>
          <a href="#" className="text-white border-b border-white pb-1">Portfolio</a>
        </div>
        <Menu className="md:hidden text-white" />
      </nav>

      {/* Main Split Content */}
      <main className="flex-grow flex flex-col md:flex-row relative mt-24">
        
        {/* Left Section: Liquid Digital Assets (3D) */}
        <div className="relative w-full md:w-1/2 h-[50vh] md:h-auto border-r border-white/10 group overflow-hidden bg-black">
          <div className="absolute top-12 left-12 z-10 pointer-events-none">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-4 font-bold">Portfolio Composition</p>
            <h2 className="font-serif text-4xl md:text-6xl leading-tight tracking-tight">
              Liquid Digital <br />
              Assets
            </h2>
            
            {/* Top Asset Tickers in UI */}
            <div className="mt-8 flex gap-6">
                {assets.slice(0, 2).map(asset => (
                    <div key={asset.id} className="flex items-center gap-2 text-sm font-mono text-gray-400">
                         <div className="w-2 h-2 rounded-full" style={{backgroundColor: asset.color}}></div>
                         <span className="text-white">{asset.name}</span>
                         <span className="opacity-50">{asset.symbol}</span>
                    </div>
                ))}
            </div>
          </div>
          
          {/* 3D Container */}
          <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <ThreeScene assets={assets} />
          </div>
        </div>

        {/* Right Section: Venture Equity (List) */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-auto flex flex-col bg-[#030303] relative">
          
          <div className="p-12 pb-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-4 font-bold">Strategic Investments</p>
            <h2 className="font-serif text-4xl md:text-6xl leading-tight tracking-tight mb-8">
              Venture <br/> Equity
            </h2>
          </div>

          <div className="flex-grow overflow-y-auto px-12 custom-scrollbar pb-20">
             {/* Venture Style List */}
             <div className="grid gap-0 mb-12 border-t border-white/10">
                {assets.map(asset => (
                  <div key={asset.id} className="flex justify-between items-center py-6 border-b border-white/10 group hover:bg-white/5 px-4 -mx-4 transition-all duration-300">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-1">
                             <span className="font-serif text-2xl">{asset.symbol}</span>
                             <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gray-400"/>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-gray-600">{asset.name} Protocol</span>
                    </div>
                    
                    <div className="text-right">
                       <div className="font-mono text-sm text-gray-300">${(asset.amount * asset.price).toLocaleString()}</div>
                       <div className="text-[10px] text-gray-600 font-mono">{asset.amount} UNITS</div>
                       
                       <button onClick={(e) => { e.stopPropagation(); removeAsset(asset.id); }} className="mt-2 text-[10px] text-red-900 hover:text-red-500 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all">
                            Divest
                       </button>
                    </div>
                  </div>
                ))}
             </div>

             {/* Gemini Oracle Section - Styled to fit Venture Theme */}
             <div className="mb-12">
                <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-6 font-bold border-b border-white/10 pb-2">AI Analyst Output</p>
                <GeminiOracle assets={assets} />
             </div>
             
             <button 
                  onClick={() => setShowAddModal(true)}
                  className="w-full py-4 border border-white/10 text-gray-400 text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Capital Injection
             </button>
          </div>
          
          {/* Footer Text */}
          <div className="absolute bottom-6 left-12 z-10 pointer-events-none">
            <p className="text-gray-600 text-[10px] font-serif italic opacity-50">
              "A MoonVault family office fund, we do not seek any outside capital."
            </p>
          </div>
        </div>
      </main>

      {/* Add Asset Modal - Minimalist */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#050505] border border-white/10 p-12 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                <X size={20} />
            </button>
            
            <h3 className="font-serif text-3xl mb-8">Capital Injection</h3>
            
            <form onSubmit={handleAddAsset} className="space-y-8">
              <div className="group relative">
                <input
                  type="text"
                  className="block w-full bg-transparent border-b border-gray-700 py-2 text-xl text-white focus:border-white outline-none transition-colors placeholder-transparent peer"
                  placeholder="BTC"
                  id="symbol"
                  value={newSymbol}
                  onChange={e => setNewSymbol(e.target.value)}
                  autoFocus
                />
                <label htmlFor="symbol" className="absolute left-0 -top-3.5 text-[10px] uppercase tracking-widest text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-[10px]">
                    Asset Ticker
                </label>
              </div>

              <div className="flex gap-8">
                <div className="flex-1 group relative">
                  <input
                    type="number"
                    className="block w-full bg-transparent border-b border-gray-700 py-2 text-xl text-white focus:border-white outline-none transition-colors placeholder-transparent peer"
                    placeholder="0.00"
                    id="amount"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                  />
                  <label htmlFor="amount" className="absolute left-0 -top-3.5 text-[10px] uppercase tracking-widest text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-[10px]">
                    Units
                  </label>
                </div>
                
                <div className="flex-1 group relative">
                  <input
                    type="number"
                    className="block w-full bg-transparent border-b border-gray-700 py-2 text-xl text-white focus:border-white outline-none transition-colors placeholder-transparent peer"
                    placeholder="0.00"
                    id="price"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                  />
                  <label htmlFor="price" className="absolute left-0 -top-3.5 text-[10px] uppercase tracking-widest text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-[10px]">
                    Cost Basis (USD)
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full py-4 text-xs uppercase tracking-[0.3em] bg-white text-black hover:bg-gray-200 transition-all font-bold">
                  Execute Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;