import React, { useState } from "react";
import { COURSE_OVERVIEW, LEARNING_OUTCOMES, COURSE_MODULES, SUPPORT_SYSTEMS, ACCESSIBILITY_FEATURES, QUALITY_ASSURANCE } from "../data";
import { BookOpen, Award, Layers, Users, ShieldCheck, Heart, Calendar, Search, CheckCircle, ChevronDown, ChevronUp, CheckSquare, Square, RefreshCw, FileText, Download } from "lucide-react";

export default function SyllabusViewer() {
  const [selectedTab, setSelectedTab] = useState<"syllabus" | "support" | "accessibility" | "qa" | "doc">("syllabus");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [completedWeeks, setCompletedWeeks] = useState<Record<number, boolean>>(() => {
    // Let's initialize with week 1 completed for visual demo
    return { 1: true };
  });

  const toggleWeekExpand = (weekNum: number) => {
    setExpandedWeeks((prev) => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  const toggleWeekComplete = (weekNum: number) => {
    setCompletedWeeks((prev) => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  const resetProgress = () => {
    setCompletedWeeks({});
  };

  // Filter modules/weeks based on search
  const filteredModules = COURSE_MODULES.map((module) => {
    const filteredWeeks = module.weeks.filter((week) => {
      const matchText = `${week.title} ${week.theory.join(" ")} ${week.practice.join(" ")} ${week.assessment}`.toLowerCase();
      return matchText.includes(searchQuery.toLowerCase());
    });
    return { ...module, weeks: filteredWeeks };
  }).filter((module) => module.weeks.length > 0);

  const totalWeeksCount = COURSE_MODULES.reduce((sum, mod) => sum + mod.weeks.length, 0);
  const completedWeeksCount = Object.values(completedWeeks).filter(Boolean).length;
  const progressPercentage = Math.round((completedWeeksCount / totalWeeksCount) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Course Header Banner */}
      <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
        {/* Abstract design elements */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-emerald-500/15 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-500/25">
              Extended Curriculum
            </span>
            <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-medium font-mono">
              14 Weeks
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-2">
            AI Fundamentals &amp; Practical Applications
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            A comprehensive, blended learning journey with 60% hands-on work, portfolio-based assessments, and continuous mentorship.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 block mb-0.5">Assessment Format</span>
              <span className="font-semibold text-slate-200">{COURSE_OVERVIEW.assessment}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Practical Split</span>
              <span className="font-semibold text-slate-200">{COURSE_OVERVIEW.format}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Prerequisites</span>
              <span className="font-semibold text-slate-200">Python &amp; Basic Mathematics</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Learning Progress</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-emerald-400 font-mono">{progressPercentage}% Complete</span>
                <span className="text-slate-500">({completedWeeksCount}/{totalWeeksCount} weeks)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex space-x-1">
          <button
            onClick={() => setSelectedTab("syllabus")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              selectedTab === "syllabus"
                ? "bg-white text-slate-900 border border-slate-200 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Weekly Syllabus
          </button>
          <button
            onClick={() => setSelectedTab("support")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              selectedTab === "support"
                ? "bg-white text-slate-900 border border-slate-200 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Support Systems
          </button>
          <button
            onClick={() => setSelectedTab("accessibility")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              selectedTab === "accessibility"
                ? "bg-white text-slate-900 border border-slate-200 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Heart className="w-3.5 h-3.5" /> Accessibility
          </button>
          <button
            onClick={() => setSelectedTab("qa")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              selectedTab === "qa"
                ? "bg-white text-slate-900 border border-slate-200 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> QA Framework
          </button>
          <button
            onClick={() => setSelectedTab("doc")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              selectedTab === "doc"
                ? "bg-white text-slate-900 border border-slate-200 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-500" /> AITOPIA Manual (HTML)
          </button>
        </div>

        {/* Learning Outcome Badges */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Formative continuous feedback loop enabled</span>
        </div>
      </div>

      {/* Main Tab Contents */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* TAB 1: SYLLABUS */}
        {selectedTab === "syllabus" && (
          <div className="space-y-6">
            {/* Search and Progress tracker */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search theory, practice workshops, assessments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Your Course Progress</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-24 md:w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-800 font-mono">{progressPercentage}%</span>
                  </div>
                </div>
                {completedWeeksCount > 0 && (
                  <button 
                    onClick={resetProgress}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Reset learning checklist"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Modules List */}
            {filteredModules.length === 0 ? (
              <div className="text-center py-12 text-slate-400 italic text-sm">
                No syllabus contents found matching "{searchQuery}"
              </div>
            ) : (
              filteredModules.map((module, mIdx) => (
                <div key={mIdx} className="space-y-3">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-800">{module.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{module.description}</p>
                  </div>

                  <div className="space-y-2.5">
                    {module.weeks.map((week) => {
                      const isExpanded = !!expandedWeeks[week.weekNum];
                      const isCompleted = !!completedWeeks[week.weekNum];

                      return (
                        <div 
                          key={week.weekNum} 
                          className={`border rounded-xl transition-all duration-150 ${
                            isCompleted 
                              ? "border-emerald-200 bg-emerald-50/10" 
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          {/* Week Header */}
                          <div 
                            onClick={() => toggleWeekExpand(week.weekNum)}
                            className="p-4 flex items-center justify-between cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWeekComplete(week.weekNum);
                                }}
                                className="text-slate-400 hover:text-emerald-600 transition-colors p-0.5 rounded-md hover:bg-slate-100 cursor-pointer"
                              >
                                {isCompleted ? (
                                  <CheckSquare className="w-5 h-5 text-emerald-500 fill-emerald-100/30" />
                                ) : (
                                  <Square className="w-5 h-5" />
                                )}
                              </button>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Week {week.weekNum}</span>
                                <h4 className="text-xs font-semibold text-slate-800 mt-0.5">{week.title}</h4>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {isCompleted && (
                                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 fill-emerald-100" /> Completed
                                </span>
                              )}
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </div>
                          </div>

                          {/* Week Details Body */}
                          {isExpanded && (
                            <div className="px-4 pb-4 border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                              {/* Left column: Theory */}
                              <div className="md:col-span-5 space-y-2">
                                <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                  <Layers className="w-3 h-3 text-slate-400" /> Lecture &amp; Theory
                                </span>
                                <ul className="space-y-1.5 list-disc list-inside text-slate-600 pl-1 leading-relaxed">
                                  {week.theory.map((t, idx) => (
                                    <li key={idx}>
                                      {t.startsWith("NEW:") ? (
                                        <span className="inline-flex items-center gap-1">
                                          <span className="font-mono text-[9px] bg-amber-500/10 text-amber-600 font-bold px-1 rounded">NEW</span>
                                          <span>{t.replace("NEW:", "").trim()}</span>
                                        </span>
                                      ) : t}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Middle column: Practice */}
                              <div className="md:col-span-4 space-y-2">
                                <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                  <CheckSquare className="w-3 h-3 text-slate-400" /> Hands-on Practice
                                </span>
                                <ul className="space-y-1.5 list-disc list-inside text-slate-600 pl-1 leading-relaxed">
                                  {week.practice.map((p, idx) => (
                                    <li key={idx}>
                                      {p.startsWith("NEW:") ? (
                                        <span className="inline-flex items-center gap-1">
                                          <span className="font-mono text-[9px] bg-amber-500/10 text-amber-600 font-bold px-1 rounded">NEW</span>
                                          <span>{p.replace("NEW:", "").trim()}</span>
                                        </span>
                                      ) : p}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Right column: Assessment */}
                              <div className="md:col-span-3 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100 h-fit">
                                <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                  <Award className="w-3.5 h-3.5 text-amber-500" /> Weekly Assessment
                                </span>
                                <p className="text-slate-600 leading-relaxed text-[11px]">
                                  {week.assessment}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: SUPPORT SYSTEMS */}
        {selectedTab === "support" && (
          <div className="space-y-6">
            <p className="text-xs text-slate-500 leading-relaxed">
              To support students on this 14-week path, we have established multiple integrated pipelines ranging from tech workspaces to direct industry partnerships.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUPPORT_SYSTEMS.map((sys, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
                  <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-amber-500 rounded-full"></span> {sys.category}
                  </h4>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600">
                    {sys.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ACCESSIBILITY */}
        {selectedTab === "accessibility" && (
          <div className="space-y-6">
            <p className="text-xs text-slate-500 leading-relaxed">
              We are dedicated to supporting diverse learning differences, inclusive cultural settings, and global non-Western ethics framework representations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACCESSIBILITY_FEATURES.map((feature, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
                  <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-emerald-500 rounded-full"></span> {feature.category}
                  </h4>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600">
                    {feature.items.map((item, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-3">
              <span className="text-lg leading-none">🌍</span>
              <div>
                <h5 className="font-bold text-slate-800 mb-1">Global &amp; Multicultural AI Perspectives</h5>
                <p className="leading-relaxed text-[11px]">
                  Special emphasis is set on Module 4 on non-Western approaches to ethics, global data regulations, and inclusive local datasets representing varied geographies. Our integration of traditional Ghanaian art and flute models (Atɛntɛbɛn) acts as a living prototype of inclusive, multicultural engineering.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: QA FRAMEWORK */}
        {selectedTab === "qa" && (
          <div className="space-y-6">
            <p className="text-xs text-slate-500 leading-relaxed">
              Continuous educational quality assurance processes and quarterly metrics managed in collaboration with industry advisory boards.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* QA Process */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wide">
                  Continuous Improvement Process
                </h4>
                <ul className="mt-3 space-y-2 text-xs text-slate-600">
                  {QUALITY_ASSURANCE.process.map((p, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-slate-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Success Metrics */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wide">
                  Success Evaluation Metrics
                </h4>
                <ul className="mt-3 space-y-2 text-xs text-slate-600">
                  {QUALITY_ASSURANCE.metrics.map((m, mIdx) => (
                    <li key={mIdx} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-slate-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Implementation Roadmap */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Implementation Roadmap
              </h4>
              <div className="relative border-l-2 border-slate-200 pl-4 ml-2 space-y-6">
                {QUALITY_ASSURANCE.roadmap.map((phase, pIdx) => (
                  <div key={pIdx} className="relative">
                    {/* Circle timeline indicator */}
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-slate-300 bg-white"></div>
                    
                    <h5 className="text-xs font-bold text-slate-800">{phase.phase}</h5>
                    <ul className="mt-1.5 space-y-1 text-slate-600 text-[11px]">
                      {phase.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5">
                          <span>•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DETAILED HTML DOCUMENTATION */}
        {selectedTab === "doc" && (
          <div className="space-y-6 h-full flex flex-col min-h-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
              <div>
                <span className="bg-emerald-500/15 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/25">
                  Academic System Manual
                </span>
                <h4 className="text-sm font-bold text-slate-100 mt-1.5">
                  AITOPIA HTML Documentation &amp; Syllabus Manual
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xl leading-relaxed">
                  A comprehensive standalone manual covering software architecture topology, 14-week machine learning syllabus models, traditional Atɛntɛbɛn bamboo flute scales, and continuous peer QA frameworks.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <a
                  href="/aitopia_documentation.html"
                  download="AITOPIA_System_Documentation.html"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer text-decoration-none"
                >
                  <Download className="w-3.5 h-3.5" /> Download Standalone HTML
                </a>
                <a
                  href="/aitopia_documentation.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer text-decoration-none"
                >
                  Open in New Tab
                </a>
              </div>
            </div>

            {/* Embedded Documentation Iframe Viewer */}
            <div className="flex-1 min-h-[480px] bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-inner flex flex-col relative">
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>预览: aitopia_documentation.html</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live Sandboxed Frame
                </span>
              </div>
              <iframe
                src="/aitopia_documentation.html"
                title="AITOPIA System Documentation"
                className="flex-1 w-full border-none bg-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
