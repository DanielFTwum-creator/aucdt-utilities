import React, { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  WandIcon 
} from './components/Icons';
import ControlGroup from './components/ControlGroup';
import SelectField from './components/SelectField';
import OutputCard from './components/OutputCard';
import ThemeSwitcher from './components/ThemeSwitcher';
import AdminPanel from './components/AdminPanel';
import TestDashboard from './components/TestDashboard';
import { 
  GARMENT_OPTIONS, 
  STYLE_OPTIONS, 
  COLOR_OPTIONS, 
  FABRIC_OPTIONS, 
  DETAIL_OPTIONS, 
  SETTING_OPTIONS,
  LIGHTING_OPTIONS,
  MOOD_OPTIONS,
  ETHNICITY_OPTIONS,
  INITIAL_STATE,
  INITIAL_ETHNICITIES
} from './constants';
import { DesignState, GeneratedOutput, Theme, AuditLog } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'admin' | 'tests'>('generator');
  const [theme, setTheme] = useState<Theme>('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  
  const [design, setDesign] = useState<DesignState>({
    ...INITIAL_STATE,
    ethnicities: { ...INITIAL_ETHNICITIES },
  } as DesignState);

  const [output, setOutput] = useState<GeneratedOutput>({
    textPrompt: 'Click "Generate Prompt" to create your fashion design prompt...',
    jsonConfig: '{ }'
  });

  // Theme effect application
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-slate-900 text-white' : 
                              theme === 'high-contrast' ? 'bg-white text-black contrast-125' : 
                              'bg-slate-50 text-slate-900';
  }, [theme]);

  const addLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      user: isAuthenticated ? 'Admin' : 'Guest',
      action,
      details
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  const handleDesignChange = (field: keyof DesignState, value: string) => {
    setDesign(prev => ({ ...prev, [field]: value }));
    // Optional: Log every change? Might be too verbose. Logging generation instead.
  };

  const toggleEthnicity = (id: string) => {
    setDesign(prev => ({
      ...prev,
      ethnicities: {
        ...prev.ethnicities,
        [id]: !prev.ethnicities[id]
      }
    }));
  };

  const handleAdminLogin = (success: boolean) => {
    setIsAuthenticated(success);
    addLog(success ? 'ADMIN_LOGIN_SUCCESS' : 'ADMIN_LOGIN_FAIL', success ? 'User authenticated successfully' : 'Invalid password attempt');
  };

  const generatePrompt = () => {
    // 1. Get enabled ethnicities
    const activeEthnicities = ETHNICITY_OPTIONS
      .filter(opt => design.ethnicities[opt.id])
      .map(opt => opt.value);

    // 2. Select one random ethnicity for the text prompt
    const selectedEthnicity = activeEthnicities.length > 0
      ? activeEthnicities[Math.floor(Math.random() * activeEthnicities.length)]
      : "diverse ethnicity";

    // 3. Construct text prompt
    const textPrompt = `${selectedEthnicity} fashion model wearing ${design.style} ${design.garment} with ${design.detail}, ${design.fabric} fabric, ${design.color}, ${design.setting}, ${design.lighting}, ${design.mood} atmosphere, professional fashion photography, high fashion editorial, diverse representation, inclusive beauty standards, 8k quality, detailed textures`;

    const negativePrompt = "caucasian only, single ethnicity, homogeneous, low quality, blurry, distorted, amateur, poor lighting";

    // 4. Construct JSON config
    const jsonConfig = {
      prompt: textPrompt,
      negative_prompt: negativePrompt,
      diversity_guidance: {
        ethnicity_pool: activeEthnicities,
        selected_ethnicity: selectedEthnicity,
        include_representation: true,
        bias_mitigation: "active"
      },
      design_details: {
        garment_type: design.garment,
        style: design.style,
        color_palette: design.color,
        fabric: design.fabric,
        key_detail: design.detail
      },
      atmosphere: {
        setting: design.setting,
        lighting: design.lighting,
        mood: design.mood
      },
      quality_settings: {
        cfg_scale: 7.5,
        steps: 30,
        sampler: "DPM++ 2M Karras",
        resolution: "1024x1024"
      },
      ethical_ai: {
        diversity_enabled: true,
        bias_check: true,
        representation_priority: "high"
      }
    };

    const finalJson = JSON.stringify(jsonConfig, null, 2);

    setOutput({
      textPrompt,
      jsonConfig: finalJson
    });

    addLog('GENERATE_PROMPT', `Generated prompt for ${design.garment} in ${design.style}`);
  };

  // Generate initial prompt on mount
  useEffect(() => {
    generatePrompt();
    addLog('SYSTEM_INIT', 'Application initialized');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Styles based on theme
  const getMainBg = () => {
    if (theme === 'dark') return 'bg-slate-800 border-slate-700';
    if (theme === 'high-contrast') return 'bg-white border-4 border-black';
    return 'bg-white border-slate-100';
  };

  const getHeaderBg = () => {
    if (theme === 'high-contrast') return 'bg-black text-white border-b-4 border-white';
    return 'bg-slate-900 text-white';
  };

  const getContainerClass = () => {
    if (theme === 'dark') return 'bg-slate-900 min-h-screen text-slate-100';
    if (theme === 'high-contrast') return 'bg-white min-h-screen text-black';
    return 'bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 min-h-screen';
  };

  return (
    <div className={`${getContainerClass()} p-4 md:p-8 font-sans transition-colors duration-500`}>
      <div className={`max-w-7xl mx-auto rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        
        {/* Header */}
        <header className={`${getHeaderBg()} p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6`}>
          <div className="relative z-10 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2 flex items-center justify-center md:justify-start gap-3 tracking-tight">
              <SparklesIcon className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
              FashionPrompt AI
            </h1>
            <p className="opacity-80 text-lg font-light">
              Professional Fashion Design Generator v2.0
            </p>
          </div>

          <div className="flex flex-col gap-4 items-end relative z-10">
            <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
            <nav className="flex bg-white/10 backdrop-blur-md rounded-full p-1" role="tablist">
              {[
                { id: 'generator', label: 'Generator' },
                { id: 'tests', label: 'System Tests' },
                { id: 'admin', label: 'Admin' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-indigo-900 shadow-md' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-0">
          {activeTab === 'generator' && (
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Controls */}
              <div className={`lg:col-span-5 p-6 md:p-8 space-y-6 lg:border-r ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
                <ControlGroup title="Garment Type">
                  <SelectField
                    id="garment"
                    label="Select Garment"
                    value={design.garment}
                    options={GARMENT_OPTIONS}
                    onChange={(val) => handleDesignChange('garment', val)}
                  />
                </ControlGroup>

                <ControlGroup title="Style & Aesthetic">
                  <SelectField
                    id="style"
                    label="Fashion Style"
                    value={design.style}
                    options={STYLE_OPTIONS}
                    onChange={(val) => handleDesignChange('style', val)}
                  />
                </ControlGroup>

                <ControlGroup title="Design Details">
                  <div className="space-y-4">
                    <SelectField
                      id="color"
                      label="Primary Colour Palette"
                      value={design.color}
                      options={COLOR_OPTIONS}
                      onChange={(val) => handleDesignChange('color', val)}
                    />
                    <SelectField
                      id="fabric"
                      label="Fabric/Texture"
                      value={design.fabric}
                      options={FABRIC_OPTIONS}
                      onChange={(val) => handleDesignChange('fabric', val)}
                    />
                    <SelectField
                      id="detail"
                      label="Key Detail"
                      value={design.detail}
                      options={DETAIL_OPTIONS}
                      onChange={(val) => handleDesignChange('detail', val)}
                    />
                  </div>
                </ControlGroup>

                <ControlGroup 
                  title="Diversity Settings" 
                  badge={
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      Inclusive
                    </span>
                  }
                >
                  <label className={`block mb-3 text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    Model Ethnicity (Select Multiple)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {ETHNICITY_OPTIONS.map((item) => (
                      <label key={item.id} className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors group ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={design.ethnicities[item.id]}
                            onChange={() => toggleEthnicity(item.id)}
                            className="peer h-5 w-5 rounded border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500/20 focus:ring-4 transition-all"
                          />
                        </div>
                        <span className={`font-medium text-sm transition-colors ${theme === 'dark' ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-indigo-700'}`}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </ControlGroup>

                <ControlGroup title="Setting & Atmosphere">
                  <div className="space-y-4">
                    <SelectField
                      id="setting"
                      label="Location"
                      value={design.setting}
                      options={SETTING_OPTIONS}
                      onChange={(val) => handleDesignChange('setting', val)}
                    />
                    <SelectField
                      id="lighting"
                      label="Lighting"
                      value={design.lighting}
                      options={LIGHTING_OPTIONS}
                      onChange={(val) => handleDesignChange('lighting', val)}
                    />
                    <SelectField
                      id="mood"
                      label="Mood"
                      value={design.mood}
                      options={MOOD_OPTIONS}
                      onChange={(val) => handleDesignChange('mood', val)}
                    />
                  </div>
                </ControlGroup>

                <button
                  onClick={generatePrompt}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xl font-bold py-5 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <WandIcon className="w-6 h-6" />
                  Generate Prompt
                </button>
              </div>

              {/* Output */}
              <div className={`lg:col-span-7 p-6 md:p-8 flex flex-col gap-6 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className="flex-grow">
                  <OutputCard 
                    title="📝 Generated Text Prompt" 
                    content={output.textPrompt} 
                  />
                </div>
                <div className="flex-grow">
                  <OutputCard 
                    title="🔧 JSON Configuration" 
                    content={output.jsonConfig} 
                    isJson 
                  />
                </div>
                <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-indigo-900/30 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'}`}>
                  <h4 className={`font-bold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'}`}>
                    <span className="text-xl">💡</span> Workshop Tips
                  </h4>
                  <ul className={`space-y-2 text-sm md:text-base ml-1 ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-800/80'}`}>
                    <li className="flex items-start gap-2">
                      <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-indigo-400 flex-shrink-0"></span>
                      Always select multiple ethnicities to ensure diverse outputs across batches.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-indigo-400 flex-shrink-0"></span>
                      Experiment with CFG scale (7-12) for different levels of prompt adherence.
                    </li>
                  </ul>
                </div>
              </div>
            </main>
          )}

          {activeTab === 'tests' && (
             <div className="p-8 bg-slate-50 min-h-[600px]">
               <TestDashboard currentState={design} />
             </div>
          )}

          {activeTab === 'admin' && (
             <div className="p-8 bg-slate-50 min-h-[600px]">
               <AdminPanel 
                 logs={auditLogs} 
                 isAuthenticated={isAuthenticated} 
                 onLogin={handleAdminLogin} 
               />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
