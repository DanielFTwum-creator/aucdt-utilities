import { useState, useEffect } from 'react';
import PROMPT_DATA from '../still-her-baby-afrocentric-database.json';
import { Copy, Check, Film, Clock, Camera, Palette, Download } from 'lucide-react';

// Icon Components
const CopyIcon = () => <Copy size={16} />;
const CheckIcon = () => <Check size={16} />;
const FilmIcon = () => <Film size={24} />;
const ClockIcon = () => <Clock size={16} />;
const CameraIcon = () => <Camera size={16} />;
const PaletteIcon = () => <Palette size={16} />;
const DownloadIcon = () => <Download size={16} />;

// Main Dashboard Component
const StillHerBabyDashboard = () => {
    const [scenes, setScenes] = useState([]);
    const [selectedScene, setSelectedScene] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [filterSection, setFilterSection] = useState('ALL');
    const [projectInfo, setProjectInfo] = useState(null);

    useEffect(() => {
        setScenes(PROMPT_DATA.scenes);
        setProjectInfo(PROMPT_DATA.project);
    }, []);

    const sections = ['ALL', ...new Set(scenes.map(s => s.section).filter(Boolean))];
    const filteredScenes = filterSection === 'ALL' 
        ? scenes 
        : scenes.filter(s => s.section === filterSection);

    const copyToClipboard = async (scene) => {
        const promptData = {
            id: scene.id,
            timestamp: scene.timestamp,
            lyric: scene.lyric,
            prompt: scene.prompt,
            duration: scene.duration,
            cameraMovement: scene.cameraMovement,
            cameraAngle: scene.cameraAngle,
            lighting: scene.lighting,
            colorGrade: scene.colorGrade,
            mood: scene.mood,
            visualElements: scene.visualElements,
            transition: scene.transition
        };

        try {
            await navigator.clipboard.writeText(JSON.stringify(promptData, null, 2));
            setCopiedId(scene.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Copied to clipboard!');
        }
    };

    const exportAllPrompts = () => {
        const dataStr = JSON.stringify({ scenes: filteredScenes }, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `still-her-baby-prompts-${filterSection.toLowerCase()}.json`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Header */}
            <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <FilmIcon />
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Still Her Baby
                                </h1>
                                <p className="text-slate-400 text-sm">Video Generation Prompt Manager</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right text-sm">
                                <div className="text-slate-400">Duration</div>
                                <div className="text-xl font-bold text-blue-400">4:15</div>
                            </div>
                            <div className="text-right text-sm">
                                <div className="text-slate-400">Scenes</div>
                                <div className="text-xl font-bold text-purple-400">{scenes.length}</div>
                            </div>
                            <button
                                onClick={exportAllPrompts}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                <DownloadIcon />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filter Tabs */}
                <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
                    {sections.map(section => (
                        <button
                            key={section}
                            onClick={() => setFilterSection(section)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                                filterSection === section
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                        >
                            {(section || '').replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>

                {/* Scene Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScenes.map((scene) => (
                        <div
                            key={scene.id}
                            className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer"
                            onClick={() => setSelectedScene(scene)}
                        >
                            {/* Scene Header */}
                            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 border-b border-slate-700">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg text-blue-400">{scene.id}</h3>
                                        <p className="text-xs text-slate-400 uppercase mt-1">{scene.section}</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(scene);
                                        }}
                                        className={`p-2 rounded-lg transition-all ${
                                            copiedId === scene.id
                                                ? 'bg-green-600 text-white'
                                                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                        }`}
                                    >
                                        {copiedId === scene.id ? <CheckIcon /> : <CopyIcon />}
                                    </button>
                                </div>
                            </div>

                            {/* Scene Info */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <ClockIcon />
                                    <span className="text-slate-300">{scene.timestamp}</span>
                                    <span className="text-slate-500">({scene.duration}s)</span>
                                </div>

                                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                    <p className="text-sm italic text-slate-300">"{scene.lyric}"</p>
                                </div>

                                <div className="flex items-start gap-2 text-xs">
                                    <CameraIcon />
                                    <div className="flex-1">
                                        <div className="text-slate-400">Camera</div>
                                        <div className="text-slate-300">{scene.cameraMovement}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 text-xs">
                                    <PaletteIcon />
                                    <div className="flex-1">
                                        <div className="text-slate-400">Mood</div>
                                        <div className="text-slate-300">{scene.mood}</div>
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                    <div className="text-xs text-slate-400 mb-1">Prompt</div>
                                    <p className="text-xs text-slate-300 line-clamp-3">
                                        {scene.prompt}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {(scene.visualElements || []).slice(0, 3).map((element, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-400"
                                        >
                                            {element}
                                        </span>
                                    ))}
                                    {(scene.visualElements || []).length > 3 && (
                                        <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-400">
                                            +{(scene.visualElements || []).length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedScene && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedScene(null)}
                >
                    <div
                        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 z-10">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-blue-400">{selectedScene.id}</h2>
                                    <p className="text-slate-400 mt-1">{selectedScene.section}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <ClockIcon />
                                            {selectedScene.timestamp}
                                        </span>
                                        <span>Duration: {selectedScene.duration}s</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copyToClipboard(selectedScene)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                    >
                                        {copiedId === selectedScene.id ? (
                                            <>
                                                <CheckIcon />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <CopyIcon />
                                                Copy JSON
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setSelectedScene(null)}
                                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-2">LYRIC</h3>
                                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                    <p className="text-lg italic text-slate-200">"{selectedScene.lyric}"</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-2">PROMPT</h3>
                                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                    <p className="text-slate-200 leading-relaxed">{selectedScene.prompt}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">CAMERA MOVEMENT</h3>
                                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                                        <p className="text-slate-200">{selectedScene.cameraMovement}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">CAMERA ANGLE</h3>
                                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                                        <p className="text-slate-200">{selectedScene.cameraAngle}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">LIGHTING</h3>
                                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                                        <p className="text-slate-200">{selectedScene.lighting}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">COLOR GRADE</h3>
                                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                                        <p className="text-slate-200">{selectedScene.colorGrade}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-2">MOOD</h3>
                                <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                                    <p className="text-slate-200">{selectedScene.mood}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-2">VISUAL ELEMENTS</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(selectedScene.visualElements || []).map((element, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200"
                                        >
                                            {element}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-2">TRANSITION</h3>
                                <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                                    <p className="text-slate-200">{selectedScene.transition}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StillHerBabyDashboard;
