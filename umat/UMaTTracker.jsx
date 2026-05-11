import { useState, useEffect, useMemo } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const STATIC_ITEMS = [
  {id:1,p:"gen",rec:"Reformat all documents to GTEC standard using UMaT BSc EEE as template",dec:"rej",act:"TUC GTEC-approved template (BA JDT, BA Product Design) is more current than UMaT Appendix E. TUC template is the formatting baseline — not UMaT's.",auth:true},
  {id:2,p:"gen",rec:"Align grading to UMaT system (A=80-100, B=70-79, C=60-69, D=50-59, F=<50)",dec:"anote",act:"TUC to adopt GTEC-aligned grading. Confirm whether UMaT grading differs from GTEC's own standard before applying.",tuc:true},
  {id:3,p:"gen",rec:"Update all references to within last 5 years; reorder most recent first; adopt UMaT referencing style",dec:"acc",act:"Accept. Update all course reading lists. Use UMaT referencing standard (Author, Year, Title, Publisher)."},
  {id:4,p:"gen",rec:"Update staff details to GTEC standard (per Appendix C sample)",dec:"acc",act:"Accept. Staff table to include rank, qualifications, specialisation, courses, workload and teaching experience."},
  {id:5,p:"gen",rec:"Produce a Conduct of Examination policy document",dec:"acc",act:"Accept. TUC to draft standalone policy covering grading, resit registration and examination conduct."},
  {id:6,p:"gen",rec:"Review entry requirements to meet GTEC minimums (3 core + 3 elective credit passes at WASSCE/SSSCE)",dec:"acc",act:"Accept. Entry requirements for all three programmes to be revised per GTEC/NCTE Appendix D standards."},
  {id:7,p:"gen",rec:"Ensure no semester exceeds 21 credit hours total",dec:"acc",act:"Accept. All three curricula to be audited semester-by-semester; over-credit semesters to be restructured."},
  {id:8,p:"gen",rec:"Include staff publications in all three documents",dec:"acc",act:"Accept. Staff CVs and publication lists in UMaT referencing format to be appended to all three curricula."},
  {id:9,p:"gen",rec:"Introduce Programming with C# for Microsoft application development",dec:"par",act:"Partial. Consider as an elective. Core language stack (Python, C++) already present. Validate industry demand and staffing capacity first."},
  {id:10,p:"gen",rec:"Interchange AUCE 232 Digital Systems Design with AUCE 244 Circuit Theory (Circuit Theory is a prerequisite)",dec:"acc",act:"Accept. Circuit Theory provides foundational content needed before Digital Systems Design."},
  {id:11,p:"gen",rec:"Correct course code of AUCE CE 355 Data Structures and Algorithms",dec:"acc",act:"Accept. Typographical correction to be fixed in the final curriculum document."},
  {id:12,p:"gen",rec:"Move AUCE 486 Control Systems to Year Three",dec:"acc",act:"Accept. Sequencing improvement aligned with the prerequisite chain."},
  {id:13,p:"gen",rec:"Split AUCE 481 Project Work into Project Work I (Yr4 Sem7, TPC 2-6-5) and Project Work II (Yr4 Sem8, TPC 2-8-6)",dec:"acc",act:"Accept. Splitting increases research rigour and improves postgraduate readiness."},
  {id:14,p:"eee",rec:"Introduce Organisational Leadership and Management as a new course",dec:"acc",act:"Accept. Aligns with TUC graduate employability and leadership development goals."},
  {id:15,p:"eee",rec:"Reduce AUCDT 115 Introduction to African Art and Culture to TPC 1-0-1",dec:"anote",act:"Accept the TPC reduction. Retain the course — it reflects TUC institutional identity and Pan-African academic values.",tuc:true},
  {id:16,p:"eee",rec:"Reduce AUCDT 116 Communication Skills I to TPC 2-1-2",dec:"acc",act:"Accept. The reduction aligns credit hours to actual contact time."},
  {id:17,p:"eee",rec:"Reduce AUCDT 126 Communication Skills II to TPC 2-1-2",dec:"acc",act:"Accept. Consistent with the Communication Skills I reduction."},
  {id:18,p:"eee",rec:"Replace AUEE 231 Literature in English I with General Psychology",dec:"anote",act:"Accept. A short technical writing component may be retained within another course to preserve English literacy development.",tuc:true},
  {id:19,p:"eee",rec:"Split AUEE 238 Transformers and DC Machines into two separate courses",dec:"acc",act:"Accept. Content is voluminous; splitting reduces student overload and improves assessment granularity."},
  {id:20,p:"eee",rec:"Replace AUEE 241 Literature in English II with AUEE 471 Supervised Industrial Training",dec:"acc",act:"Accept. Industrial training provides far greater career-readiness value at this level."},
  {id:21,p:"eee",rec:"Replace AUEE 242 Field Trip and Technical Report Writing I with Critical Thinking and Integrated Thoughts",dec:"acc",act:"Accept. Critical Thinking is a more academically robust course with wider application."},
  {id:22,p:"eee",rec:"Rename AUEE 354 Artificial Intelligence to 'Artificial Intelligence in Engineering'",dec:"acc",act:"Accept. The renamed title better scopes the course to engineering application contexts."},
  {id:23,p:"eee",rec:"Rename AUEE 363 Field Trip and Technical Report Writing II (conditional on item 21)",dec:"acc",act:"Accept — contingent on implementing recommendation 21."},
  {id:24,p:"eee",rec:"Remove AUEE 361 Public Relations from curriculum",dec:"anote",act:"Accept removal from core. Consider retaining as an elective — PR skills remain valuable for engineering graduates.",tuc:true},
  {id:25,p:"eee",rec:"Remove AUEE 364 Principles of Economics from curriculum",dec:"par",act:"Partial. Consider consolidating key economic literacy into Business Entrepreneurship rather than full removal."},
  {id:26,p:"eee",rec:"Move AUEE 477 Corporate Social Responsibility from Yr4 Sem7 to Yr4 Sem8",dec:"acc",act:"Accept. Sequencing adjustment only."},
  {id:27,p:"eee",rec:"Split AUEE 481 Project Work into Project Work I (Yr4 Sem7) and Project Work II (Yr4 Sem8)",dec:"acc",act:"Accept. Mirrors the CSE programme project work restructuring."},
  {id:28,p:"eee",rec:"Move AUEE 483 Business Entrepreneurship from Yr4 Sem8 to Yr3 Sem6",dec:"acc",act:"Accept. Earlier exposure to entrepreneurship better prepares students for Year 4 project work."},
  {id:29,p:"ict",rec:"Rewrite National Relevance section to reflect ICT mandate — currently a verbatim copy of CSE text",dec:"acc",act:"Accept. The current text is a clear error to be corrected in the revised document."},
  {id:30,p:"ict",rec:"Rewrite Programme Aims to align with ICT field; make more concise",dec:"acc",act:"Accept. Rewrite to emphasise information systems, networking, digital infrastructure and ICT management."},
  {id:31,p:"ict",rec:"Add Linear Algebra in Year 1 as a prerequisite for Robotics and advanced courses",dec:"acc",act:"Accept. Linear Algebra is foundational for AI, ML and Robotics. Its absence at Year 1 is a meaningful curriculum gap."},
  {id:32,p:"ict",rec:"Rename AUIT 125 Computer Programming I and AUIT 231 Programming II to language-specific course names",dec:"anote",act:"Accept the principle. TUC to confirm the language stack (Python, C++, Java) before finalising course names.",tuc:true},
  {id:33,p:"ict",rec:"Move AUIT 472 Artificial Intelligence from Yr4 Sem7 to Year 3; rename to 'Artificial Intelligence in Engineering'",dec:"acc",act:"Accept. Earlier AI exposure aligns with industry adoption pace and provides better grounding for Year 4 project work."},
  {id:34,p:"ict",rec:"Absorb AUIT 483 Machine Learning into AUIT 472 Artificial Intelligence",dec:"par",act:"Partial. ML content is now too broad to absorb into one course. Consider a dedicated Data Science and ML course instead."},
  {id:35,p:"ict",rec:"Rename AUIT 482 Data Mining and Warehousing to 'Introduction to Data Mining and Warehousing'; reduce content; move to Yr4 Sem7",dec:"acc",act:"Accept. Reduction in scope and renaming reflects the student level and programme focus appropriately."},
  {id:36,p:"ict",rec:"Rename AUIT 475 Project Work I/Thesis to 'Project Work I' (TPC 2-6-5)",dec:"acc",act:"Accept. Consistent with project work restructuring across all programmes."},
  {id:37,p:"ict",rec:"Rename AUIT 485 Project Work II/Thesis to 'Project Work II' (TPC 2-8-6)",dec:"acc",act:"Accept. Consistent naming and TPC allocation."},
];

const PROG_LABEL = { gen: "General", eee: "BSc EEE", ict: "BSc ICT" };
const PROG_FULL = { gen: "General (all programmes)", eee: "BSc Electrical & Electronic Engineering", ict: "BSc Information & Communication Technology" };
const DEC_LABEL = { acc: "Accept", anote: "Accept + note", rej: "Superseded", par: "Partial" };

const STATUS_CONFIG = {
  not_started: { label: "Not started", bg: "#f1f0ec", color: "#666", dot: "#aaa" },
  in_progress:  { label: "In progress", bg: "#e3eefa", color: "#1455a0", dot: "#1a6bb5" },
  done:         { label: "Done",        bg: "#e6f4ea", color: "#1e6e2e", dot: "#2d7a3a" },
  blocked:      { label: "Blocked",     bg: "#fde8e8", color: "#9b2828", dot: "#b53a3a" },
};

const DEC_CONFIG = {
  acc:   { label: "Accept",       bg: "#e6f4ea", color: "#1e6e2e" },
  anote: { label: "Accept + note",bg: "#e3eefa", color: "#1455a0" },
  rej:   { label: "Superseded",   bg: "#fde8e8", color: "#9b2828" },
  par:   { label: "Partial",      bg: "#fef3e2", color: "#8a5200" },
};

const PROG_CONFIG = {
  gen: { bg: "#f0ede8", color: "#5a5040" },
  eee: { bg: "#e3eefa", color: "#1455a0" },
  ict: { bg: "#e1f5ee", color: "#0f6e56" },
};

const LS_KEY = "umat-tracker-v1";

function loadTracking() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
}

function initItems() {
  const saved = loadTracking();
  return STATIC_ITEMS.map(item => ({
    ...item,
    owner: "",
    status: "not_started",
    dueDate: "",
    notes: "",
    changelog: [],
    ...(saved[item.id] || {}),
  }));
}

function Badge({ bg, color, children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 999,
      fontSize: 11, fontWeight: 600,
      background: bg, color,
      whiteSpace: "nowrap", letterSpacing: ".01em",
    }}>{children}</span>
  );
}

function StatusDot({ status }) {
  const cfg = STATUS_CONFIG[status];
  return <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, display: "inline-block", flexShrink: 0 }} />;
}

function KpiChip({ label, value, color, onClick, active }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "flex-start",
      padding: "10px 16px", borderRadius: 10,
      border: active ? `2px solid ${color}` : "1.5px solid #e8e6e0",
      background: active ? color + "12" : "#fff",
      cursor: "pointer", transition: "all .15s", minWidth: 90,
    }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#9a9a9a", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>{label}</span>
      <span style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </button>
  );
}

function ChangelogEntry({ entry }) {
  const d = new Date(entry.timestamp);
  const fmt = d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid #f0ede8", fontSize: 12, color: "#444" }}>
      <span style={{ color: "#9a9a9a", marginRight: 8, fontFamily: "monospace" }}>{fmt}</span>
      <strong style={{ color: "#222" }}>{entry.field}</strong>
      {entry.oldValue && <span style={{ color: "#9a9a9a" }}> · was <em>{entry.oldValue || "—"}</em></span>}
      <span style={{ color: "#555" }}> → <strong>{entry.newValue || "—"}</strong></span>
    </div>
  );
}

function WorkloadCard({ owner, items }) {
  const byProg = { gen: 0, eee: 0, ict: 0 };
  const byStatus = { not_started: 0, in_progress: 0, done: 0, blocked: 0 };
  items.forEach(i => { byProg[i.p]++; byStatus[i.status]++; });
  const isUnassigned = !owner;

  return (
    <div style={{
      background: "#fff", border: "1px solid #e8e6e0", borderRadius: 12,
      padding: "1rem 1.25rem", opacity: isUnassigned ? 0.7 : 1,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: isUnassigned ? "#f0ede8" : "#e3eefa",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700,
          color: isUnassigned ? "#9a9a9a" : "#1455a0",
        }}>
          {isUnassigned ? "?" : owner.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{isUnassigned ? "Unassigned" : owner}</div>
          <div style={{ fontSize: 12, color: "#9a9a9a" }}>{items.length} item{items.length !== 1 ? "s" : ""}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {Object.entries(byProg).filter(([,v]) => v > 0).map(([k, v]) => (
          <span key={k} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: PROG_CONFIG[k].bg, color: PROG_CONFIG[k].color, fontWeight: 600 }}>
            {PROG_LABEL[k]}: {v}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {Object.entries(byStatus).filter(([,v]) => v > 0).map(([k, v]) => (
          <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, padding: "2px 8px", borderRadius: 6, background: STATUS_CONFIG[k].bg, color: STATUS_CONFIG[k].color, fontWeight: 600 }}>
            <StatusDot status={k} /> {STATUS_CONFIG[k].label}: {v}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 4, flexWrap: "wrap" }}>
        {items.map(i => (
          <span key={i.id} style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "#f4f3ef", color: "#777", fontWeight: 600 }}>#{i.id}</span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState(initItems);
  const [progFilter, setProgFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [kpiFilter, setKpiFilter] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [changelogProg, setChangelogProg] = useState("all");
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const tracking = {};
    items.forEach(item => {
      tracking[item.id] = { owner: item.owner, status: item.status, dueDate: item.dueDate, notes: item.notes, changelog: item.changelog };
    });
    localStorage.setItem(LS_KEY, JSON.stringify(tracking));
    setLastSaved(new Date());
  }, [items]);

  function updateItem(id, field, value) {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const oldValue = String(item[field] || "");
      const newValue = String(value || "");
      if (oldValue === newValue) return item;
      const entry = { timestamp: new Date().toISOString(), field, oldValue, newValue };
      return { ...item, [field]: value, changelog: [...item.changelog, entry] };
    }));
  }

  const counts = useMemo(() => ({
    total: items.length,
    done: items.filter(i => i.status === "done").length,
    in_progress: items.filter(i => i.status === "in_progress").length,
    blocked: items.filter(i => i.status === "blocked").length,
  }), [items]);

  const filteredItems = useMemo(() => {
    let list = items;
    if (progFilter !== "all") list = list.filter(i => i.p === progFilter);
    if (statusFilter !== "all") list = list.filter(i => i.status === statusFilter);
    if (kpiFilter) list = list.filter(i => i.status === kpiFilter);
    return list;
  }, [items, progFilter, statusFilter, kpiFilter]);

  const allChangelog = useMemo(() => {
    const entries = [];
    items.forEach(item => {
      item.changelog.forEach(e => entries.push({ ...e, itemId: item.id, itemRec: item.rec, itemProg: item.p }));
    });
    entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return entries.filter(e => {
      if (changelogProg !== "all" && e.itemProg !== changelogProg) return false;
      if (dateFrom && e.timestamp < dateFrom) return false;
      if (dateTo && e.timestamp > dateTo + "T23:59:59") return false;
      return true;
    });
  }, [items, changelogProg, dateFrom, dateTo]);

  const workloadGroups = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      const key = item.owner.trim().toLowerCase();
      const display = item.owner.trim();
      if (!groups[key]) groups[key] = { owner: display, items: [] };
      groups[key].items.push(item);
    });
    const unassigned = groups[""] || { owner: "", items: [] };
    const assigned = Object.entries(groups)
      .filter(([k]) => k !== "")
      .sort((a, b) => b[1].items.length - a[1].items.length)
      .map(([, v]) => v);
    return { assigned, unassigned };
  }, [items]);

  function exportCSV() {
    const headers = ["ID","Programme","Decision","Status","Owner","Due Date","Recommendation","Rationale","Notes"];
    const rows = items.map(i => [
      i.id, PROG_LABEL[i.p], DEC_LABEL[i.dec], STATUS_CONFIG[i.status].label,
      i.owner, i.dueDate,
      `"${i.rec.replace(/"/g,'""')}"`,
      `"${i.act.replace(/"/g,'""')}"`,
      `"${i.notes.replace(/"/g,'""')}"`,
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "umat-tuc-tracker.csv";
    a.click();
  }

  async function exportPDF() {
    try {
      const button = document.querySelector('button[data-pdf-export]');
      if (button) button.disabled = true;

      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      let yPos = margin;

      // Header
      pdf.setFontSize(18);
      pdf.text("UMaT Curriculum Recommendations Tracker", margin, yPos);
      yPos += 12;

      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Generated: ${new Date().toLocaleString('en-GB')}`, margin, yPos);
      yPos += 10;

      // Summary stats
      pdf.setTextColor(0);
      pdf.setFontSize(11);
      pdf.text("Summary Statistics", margin, yPos);
      yPos += 8;
      pdf.setFontSize(9);
      const stats = [
        `Total Items: ${counts.total}`,
        `Completed: ${counts.done} (${Math.round(counts.done / counts.total * 100)}%)`,
        `In Progress: ${counts.in_progress}`,
        `Blocked: ${counts.blocked}`,
      ];
      stats.forEach(stat => {
        pdf.text(stat, margin + 5, yPos);
        yPos += 6;
      });
      yPos += 4;

      // Items by programme
      pdf.setFontSize(11);
      pdf.text("Items by Programme", margin, yPos);
      yPos += 8;
      pdf.setFontSize(9);
      ["gen", "eee", "ict"].forEach(prog => {
        const count = items.filter(i => i.p === prog).length;
        pdf.text(`${PROG_FULL[prog]}: ${count}`, margin + 5, yPos);
        yPos += 6;
      });
      yPos += 6;

      // Table of items
      pdf.setFontSize(12);
      pdf.text("Implementation Progress", margin, yPos);
      yPos += 10;

      pdf.setFontSize(8);
      const tableStartY = yPos;
      const colWidths = [8, 16, 110, 18, 8, 20, 8];
      const colLabels = ["#", "Prog", "Recommendation", "Decision", "Owner", "Status", "Due"];

      // Table header
      pdf.setFillColor(100, 100, 100);
      pdf.rect(margin, yPos - 3.5, pageWidth - 2 * margin, 5, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont(undefined, 'bold');
      let xPos = margin;
      colLabels.forEach((label, i) => {
        pdf.text(label, xPos + 1, yPos, { maxWidth: colWidths[i] - 2 });
        xPos += colWidths[i];
      });
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      yPos += 7;

      // Table rows
      items.forEach((item, idx) => {
        if (yPos > pageHeight - margin - 10) {
          pdf.addPage();
          yPos = margin;
        }

        xPos = margin;
        const rowData = [
          item.id.toString(),
          PROG_LABEL[item.p],
          item.rec.substring(0, 130) + (item.rec.length > 130 ? '…' : ''),
          DEC_LABEL[item.dec],
          item.owner || '—',
          STATUS_CONFIG[item.status].label,
          item.dueDate || '—',
        ];

        pdf.setFillColor(idx % 2 === 0 ? 245 : 255);
        pdf.rect(margin, yPos - 4, pageWidth - 2 * margin, 8, 'F');

        rowData.forEach((data, i) => {
          pdf.text(data.toString(), xPos + 1, yPos, { maxWidth: colWidths[i] - 2 });
          xPos += colWidths[i];
        });
        yPos += 8;
      });

      // Save PDF with timestamp
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      const filename = `umat-tuc-tracker_${dateStr}_${timeStr}.pdf`;
      pdf.save(filename);

      if (button) button.disabled = false;
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Failed to export PDF. Please try again.');
    }
  }

  const styles = {
    page: { fontFamily: "'IBM Plex Sans', system-ui, sans-serif", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a1a" },
    topBar: { position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #e8e6e0", padding: "10px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
    title: { fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, color: "#111", letterSpacing: "-.01em", marginRight: "auto", whiteSpace: "nowrap" },
    section: { maxWidth: 1200, margin: "0 auto", padding: "2rem 24px 1rem" },
    sectionHead: { fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: "#111", marginBottom: 4, letterSpacing: "-.02em" },
    sectionSub: { fontSize: 13, color: "#6b6b6b", marginBottom: 16 },
    card: { background: "#fff", border: "1px solid #e8e6e0", borderRadius: 14, overflow: "hidden" },
    filterRow: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 },
    chip: (on) => ({
      padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600,
      cursor: "pointer", border: on ? "1.5px solid #1a6bb5" : "1px solid #ddd",
      background: on ? "#1a6bb5" : "#fff", color: on ? "#fff" : "#555",
      fontFamily: "inherit", transition: "all .15s",
    }),
    th: { fontSize: 10, fontWeight: 700, color: "#9a9a9a", textAlign: "left", padding: "10px 14px", letterSpacing: ".07em", textTransform: "uppercase", whiteSpace: "nowrap", background: "#fafaf8", borderBottom: "1px solid #e8e6e0" },
    td: { padding: "12px 14px", verticalAlign: "top", borderBottom: "1px solid #f0ede8", fontSize: 13 },
    input: { border: "1px solid #e0ddd8", borderRadius: 6, padding: "4px 8px", fontSize: 12, fontFamily: "inherit", background: "#fafaf8", color: "#222", width: "100%", outline: "none" },
    select: { border: "1px solid #e0ddd8", borderRadius: 6, padding: "4px 8px", fontSize: 12, fontFamily: "inherit", background: "#fafaf8", color: "#222", outline: "none", cursor: "pointer" },
  };

  const statusRowBg = { not_started: "transparent", in_progress: "#f0f6ff", done: "#f0fbf3", blocked: "#fff5f5" };

  return (
    <div style={styles.page}>
      {/* Google Fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=IBM+Plex+Sans:wght@400;500;600&display=swap" />

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <div style={styles.title}>UMaT · TUC Tracker</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <KpiChip label="Total" value={counts.total} color="#1a6bb5" onClick={() => setKpiFilter(null)} active={!kpiFilter} />
          <KpiChip label="Done" value={counts.done} color="#2d7a3a" onClick={() => setKpiFilter(kpiFilter === "done" ? null : "done")} active={kpiFilter === "done"} />
          <KpiChip label="In progress" value={counts.in_progress} color="#1a6bb5" onClick={() => setKpiFilter(kpiFilter === "in_progress" ? null : "in_progress")} active={kpiFilter === "in_progress"} />
          <KpiChip label="Blocked" value={counts.blocked} color="#b53a3a" onClick={() => setKpiFilter(kpiFilter === "blocked" ? null : "blocked")} active={kpiFilter === "blocked"} />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
          {lastSaved && <span style={{ fontSize: 11, color: "#9a9a9a" }}>Saved {lastSaved.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>}
          <button onClick={exportPDF} data-pdf-export style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#333" }}>
            Export PDF ↓
          </button>
          <button onClick={exportCSV} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#333" }}>
            Export CSV ↓
          </button>
        </div>
      </div>

      {/* SECTION 1 — PROGRESS TABLE */}
      <div style={styles.section} id="s1">
        <div style={styles.sectionHead}>Implementation progress</div>
        <div style={styles.sectionSub}>37 action items · edit owner, status and due date inline · click row to expand notes and audit log</div>

        <div style={styles.filterRow}>
          {[["all","All (37)"],["gen","General"],["eee","BSc EEE"],["ict","BSc ICT"]].map(([k,l]) => (
            <button key={k} style={styles.chip(progFilter===k && !kpiFilter)} onClick={() => { setProgFilter(k); setKpiFilter(null); }}>{l}</button>
          ))}
          <span style={{ margin: "0 4px", color: "#ddd" }}>|</span>
          {[["all","Any status"],["not_started","Not started"],["in_progress","In progress"],["done","Done"],["blocked","Blocked"]].map(([k,l]) => (
            <button key={k} style={styles.chip(statusFilter===k && !kpiFilter)} onClick={() => { setStatusFilter(k); setKpiFilter(null); }}>{l}</button>
          ))}
        </div>

        <div style={styles.card}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 36 }} />
              <col style={{ width: 88 }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: 110 }} />
              <col style={{ width: 130 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 110 }} />
              <col style={{ width: 36 }} />
            </colgroup>
            <thead>
              <tr>
                {["#","Scope","Recommendation","Decision","Owner","Status","Due date",""].map((h,i) => (
                  <th key={i} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                let lastProg = null;
                return filteredItems.flatMap(item => {
                  const rows = [];
                  if (item.p !== lastProg) {
                    lastProg = item.p;
                    rows.push(
                      <tr key={`grp-${item.p}`}>
                        <td colSpan={8} style={{ background: "#f4f3ef", fontSize: 10, fontWeight: 700, color: "#777", padding: "8px 14px", letterSpacing: ".08em", textTransform: "uppercase", borderBottom: "1px solid #e8e6e0" }}>
                          {PROG_FULL[item.p]}
                        </td>
                      </tr>
                    );
                  }
                  const isExpanded = expandedId === item.id;
                  rows.push(
                    <tr key={item.id} style={{ background: statusRowBg[item.status], cursor: "pointer" }}
                      onClick={e => { if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return; setExpandedId(isExpanded ? null : item.id); }}>
                      <td style={{ ...styles.td, color: "#bbb", fontWeight: 700, fontSize: 12 }}>{item.id}</td>
                      <td style={styles.td}>
                        <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: PROG_CONFIG[item.p].bg, color: PROG_CONFIG[item.p].color }}>
                          {PROG_LABEL[item.p]}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontSize: 12, lineHeight: 1.55, color: "#222" }}>
                        {item.rec}
                        {(item.auth || item.tuc) && (
                          <div style={{ marginTop: 5, display: "flex", flexDirection: "column", gap: 3 }}>
                            {item.auth && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: "#fef3e2", color: "#8a5200", fontWeight: 600, width: "fit-content" }}>Template authority: TUC supersedes UMaT</span>}
                            {item.tuc && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: "#e3eefa", color: "#1455a0", fontWeight: 600, width: "fit-content" }}>TUC-specific consideration</span>}
                          </div>
                        )}
                      </td>
                      <td style={styles.td}>
                        <Badge bg={DEC_CONFIG[item.dec].bg} color={DEC_CONFIG[item.dec].color}>{DEC_LABEL[item.dec]}</Badge>
                      </td>
                      <td style={styles.td} onClick={e => e.stopPropagation()}>
                        <input
                          style={styles.input}
                          placeholder="Assign…"
                          value={item.owner}
                          onChange={e => updateItem(item.id, "owner", e.target.value)}
                          onBlur={e => updateItem(item.id, "owner", e.target.value.trim())}
                        />
                      </td>
                      <td style={styles.td} onClick={e => e.stopPropagation()}>
                        <select
                          style={{ ...styles.select, background: STATUS_CONFIG[item.status].bg, color: STATUS_CONFIG[item.status].color }}
                          value={item.status}
                          onChange={e => updateItem(item.id, "status", e.target.value)}
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </td>
                      <td style={styles.td} onClick={e => e.stopPropagation()}>
                        <input
                          type="date"
                          style={styles.input}
                          value={item.dueDate}
                          onChange={e => updateItem(item.id, "dueDate", e.target.value)}
                        />
                      </td>
                      <td style={{ ...styles.td, textAlign: "center", color: isExpanded ? "#1a6bb5" : "#bbb", fontSize: 14 }}>
                        {isExpanded ? "▲" : "▼"}
                      </td>
                    </tr>
                  );

                  if (isExpanded) {
                    rows.push(
                      <tr key={`exp-${item.id}`}>
                        <td colSpan={8} style={{ background: "#fafaf8", padding: "16px 20px", borderBottom: "1px solid #e8e6e0" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9a9a", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6 }}>TUC Rationale</div>
                              <div style={{ fontSize: 13, color: "#444", lineHeight: 1.65, marginBottom: 16 }}>{item.act}</div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9a9a", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6 }}>Notes</div>
                              <textarea
                                style={{ ...styles.input, resize: "vertical", minHeight: 72, lineHeight: 1.5 }}
                                placeholder="Add implementation notes…"
                                value={item.notes}
                                onChange={e => updateItem(item.id, "notes", e.target.value)}
                              />
                            </div>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#9a9a9a", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6 }}>
                                Change log ({item.changelog.length})
                              </div>
                              {item.changelog.length === 0
                                ? <div style={{ fontSize: 12, color: "#bbb" }}>No changes recorded yet.</div>
                                : [...item.changelog].reverse().map((e, i) => <ChangelogEntry key={i} entry={e} />)
                              }
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  return rows;
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2 — AUDIT TRAIL */}
      <div style={{ ...styles.section, paddingTop: "2.5rem" }} id="s2">
        <div style={styles.sectionHead}>Compliance audit trail</div>
        <div style={styles.sectionSub}>Reverse-chronological log of all field changes across all items</div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
          <div style={styles.filterRow}>
            {[["all","All programmes"],["gen","General"],["eee","BSc EEE"],["ict","BSc ICT"]].map(([k,l]) => (
              <button key={k} style={styles.chip(changelogProg===k)} onClick={() => setChangelogProg(k)}>{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "#666" }}>
            <span>From</span>
            <input type="date" style={{ ...styles.input, width: 140 }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <span>To</span>
            <input type="date" style={{ ...styles.input, width: 140 }} value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>

        <div style={{ ...styles.card, padding: "0 20px" }}>
          {allChangelog.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#bbb", fontSize: 13 }}>
              No changes recorded yet. Edit owner, status or due date on any item above to begin the audit trail.
            </div>
          ) : allChangelog.map((e, i) => {
            const d = new Date(e.timestamp);
            const fmt = d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
            return (
              <div key={i} style={{ padding: "12px 0", borderBottom: i < allChangelog.length - 1 ? "1px solid #f0ede8" : "none", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 11, color: "#9a9a9a", whiteSpace: "nowrap", fontFamily: "monospace", paddingTop: 2 }}>{fmt}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 5, background: "#f0ede8", color: "#666", fontWeight: 700 }}>#{e.itemId}</span>
                    <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 5, background: PROG_CONFIG[e.itemProg].bg, color: PROG_CONFIG[e.itemProg].color, fontWeight: 600 }}>{PROG_LABEL[e.itemProg]}</span>
                    <span style={{ fontSize: 12, color: "#222", fontWeight: 600 }}>{e.field}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    <span style={{ textDecoration: "line-through", color: "#bbb" }}>{e.oldValue || "—"}</span>
                    <span style={{ margin: "0 6px", color: "#bbb" }}>→</span>
                    <span style={{ color: "#222", fontWeight: 500 }}>{e.newValue || "—"}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#9a9a9a", marginTop: 2 }}>
                    {e.itemRec.length > 80 ? e.itemRec.slice(0, 77) + "…" : e.itemRec}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3 — STAFF WORKLOAD */}
      <div style={{ ...styles.section, paddingTop: "2.5rem", paddingBottom: "3rem" }} id="s3">
        <div style={styles.sectionHead}>Staff workload</div>
        <div style={styles.sectionSub}>Grouped by assigned owner · updates as owners are edited above</div>

        {workloadGroups.assigned.length === 0 && workloadGroups.unassigned.items.length === 0 ? (
          <div style={{ ...styles.card, padding: "2rem", textAlign: "center", color: "#bbb", fontSize: 13 }}>
            No owners assigned yet. Add names in the Owner column above.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {workloadGroups.assigned.map((g, i) => <WorkloadCard key={i} owner={g.owner} items={g.items} />)}
            {workloadGroups.unassigned.items.length > 0 && (
              <WorkloadCard owner="" items={workloadGroups.unassigned.items} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
