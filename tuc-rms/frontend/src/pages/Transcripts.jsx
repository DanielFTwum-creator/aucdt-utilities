import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Transcripts() {
  const [search, setSearch]           = useState('');
  const [student, setStudent]         = useState(null);
  const [results, setResults]         = useState([]);
  const [programmes, setProgrammes]   = useState([]);
  const [filterProg, setFilterProg]   = useState('');
  const [students, setStudents]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [loadingTx, setLoadingTx]     = useState(false);
  const printRef = useRef();

  useEffect(() => {
    axios.get(`${API}/students/meta/programmes`).then(r => setProgrammes(r.data)).catch(() => {});
  }, []);

  const searchStudents = async (e) => {
    e.preventDefault();
    if (!search.trim() && !filterProg) return;
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (filterProg)    params.programme_id = filterProg;
      const r = await axios.get(`${API}/students`, { params });
      setStudents(r.data);
      setStudent(null);
      setResults([]);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const loadTranscript = async (s) => {
    setStudent(s);
    setLoadingTx(true);
    try {
      const r = await axios.get(`${API}/results/transcript/${s.id}`);
      setResults(r.data);
    } catch {
      toast.error('Failed to load transcript');
    } finally {
      setLoadingTx(false);
    }
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Transcript - ${student?.full_name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Times New Roman', serif; padding: 2cm; font-size: 11pt; color: #111; }
          .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #6b0020; padding-bottom: 14px; }
          .header h1 { font-size: 16pt; font-weight: 700; color: #6b0020; letter-spacing: 0.5px; }
          .header h2 { font-size: 12pt; margin-top: 2px; color: #444; font-weight: 400; }
          .header .sub { font-size: 10pt; color: #666; margin-top: 4px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; margin: 16px 0 20px; }
          .meta-row { font-size: 10.5pt; }
          .meta-row strong { display: inline-block; width: 130px; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 10pt; }
          thead tr { background: #6b0020; color: white; }
          th { padding: 6px 8px; text-align: left; font-weight: 600; }
          td { padding: 5px 8px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) td { background: #f9f9f9; }
          .section-header { background: #f0e8ea !important; }
          .section-header td { font-weight: 700; color: #6b0020; font-size: 10.5pt; padding: 7px 8px; }
          .grade { font-weight: 700; }
          .pass { color: #166534; }
          .fail { color: #dc2626; }
          .summary { margin-top: 20px; border: 1px solid #ccc; border-radius: 6px; padding: 14px 18px; }
          .summary-row { display: flex; justify-content: space-between; font-size: 11pt; padding: 3px 0; }
          .summary-row strong { color: #6b0020; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; margin-top: 60px; }
          .sig-block { border-top: 1px solid #333; padding-top: 6px; text-align: center; font-size: 10pt; color: #444; }
          .footer { text-align: center; font-size: 9.5pt; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }
          @media print { body { padding: 1cm; } }
        </style>
      </head>
      <body>
      ${printRef.current.innerHTML}
      </body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  // Group results by level and semester
  const grouped = results.reduce((acc, r) => {
    const key = `Level ${r.level} — Semester ${r.semester}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const totalCredits  = results.filter(r => r.remarks === 'PASS').reduce((s, r) => s + (r.credit_hours || 3), 0);
  const totalAttempted = results.reduce((s, r) => s + (r.credit_hours || 3), 0);
  const cgpa = results.length
    ? (results.reduce((s, r) => s + (parseFloat(r.grade_point) || 0) * (r.credit_hours || 3), 0) / totalAttempted).toFixed(2)
    : null;

  const gradeColor = (g) => {
    if (['A', 'B+'].includes(g)) return '#166534';
    if (['B', 'C+'].includes(g)) return '#1d4ed8';
    if (['C', 'D+', 'D'].includes(g)) return '#b45309';
    return '#dc2626';
  };

  return (
    <div>
      <div className="page-header">
        <h1>Student Transcripts</h1>
        <p>Search for a student to generate or print their academic transcript</p>
      </div>

      <div className="card">
        <form onSubmit={searchStudents} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="form-control"
              placeholder="Search by name or index number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 34 }}
            />
          </div>
          <select className="form-control" style={{ width: 240 }} value={filterProg} onChange={e => setFilterProg(e.target.value)}>
            <option value="">All Programmes</option>
            {programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {students.length > 0 && !student && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Index No.</th>
                  <th>Full Name</th>
                  <th>Programme</th>
                  <th>Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--tuc-maroon)', fontSize: 12 }}>
                        {s.index_number}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{s.full_name}</td>
                    <td style={{ fontSize: 13 }}>{s.programme}</td>
                    <td>Level {s.level}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => loadTranscript(s)}>
                        View Transcript
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {student && (
        <div className="card" style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--tuc-maroon)' }}>
                {student.full_name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--tuc-muted)', marginTop: 2 }}>
                {student.index_number} &mdash; {student.programme}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" onClick={() => { setStudent(null); setResults([]); }}>
                Back to Search
              </button>
              <button className="btn btn-primary" onClick={handlePrint} disabled={!results.length}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Print Transcript
              </button>
            </div>
          </div>

          {loadingTx ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <div className="spinner" />
            </div>
          ) : results.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              <h3>No approved results found</h3>
              <p>This student has no published results yet.</p>
            </div>
          ) : (
            <div ref={printRef}>
              <div className="header" style={{ textAlign: 'center', marginBottom: 20, borderBottom: '2px solid var(--tuc-maroon)', paddingBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--tuc-maroon)' }}>
                  TECHBRIDGE UNIVERSITY COLLEGE
                </div>
                <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>Official Academic Transcript</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>Results Management System</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', marginBottom: 20 }}>
                {[
                  ['Student Name', student.full_name],
                  ['Index Number', student.index_number],
                  ['Programme', student.programme],
                  ['Level', `Level ${student.level}`],
                  ['Academic Year', '2025/2026'],
                  ['Status', student.status?.toUpperCase() || 'ACTIVE'],
                ].map(([l, v]) => (
                  <div key={l} style={{ fontSize: 12, display: 'flex', gap: 6 }}>
                    <span style={{ width: 120, color: '#555', flexShrink: 0 }}>{l}:</span>
                    <span style={{ fontWeight: 600, color: '#111' }}>{v}</span>
                  </div>
                ))}
              </div>

              {Object.entries(grouped).map(([section, rows]) => {
                const semCredits = rows.reduce((s, r) => s + (r.credit_hours || 3), 0);
                const semEarned  = rows.filter(r => r.remarks === 'PASS').reduce((s, r) => s + (r.credit_hours || 3), 0);
                const semGpa     = rows.length
                  ? (rows.reduce((s, r) => s + (parseFloat(r.grade_point) || 0) * (r.credit_hours || 3), 0) / semCredits).toFixed(2)
                  : '-';
                return (
                  <div key={section} style={{ marginBottom: 18 }}>
                    <div style={{
                      fontWeight: 700, fontSize: 13, color: 'var(--tuc-maroon)',
                      background: '#f0e8ea', padding: '7px 10px', borderRadius: '6px 6px 0 0',
                      borderBottom: '2px solid var(--tuc-maroon)'
                    }}>
                      {section}
                    </div>
                    <div className="table-wrapper" style={{ marginTop: 0 }}>
                      <table style={{ borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Course Name</th>
                            <th style={{ textAlign: 'center' }}>Credits</th>
                            <th style={{ textAlign: 'center' }}>Class</th>
                            <th style={{ textAlign: 'center' }}>Exam</th>
                            <th style={{ textAlign: 'center' }}>Total</th>
                            <th style={{ textAlign: 'center' }}>Grade</th>
                            <th style={{ textAlign: 'center' }}>GP</th>
                            <th style={{ textAlign: 'center' }}>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((r, i) => (
                            <tr key={i}>
                              <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12 }}>{r.course_code}</td>
                              <td>{r.course_name}</td>
                              <td style={{ textAlign: 'center' }}>{r.credit_hours || 3}</td>
                              <td style={{ textAlign: 'center' }}>{r.class_score ?? '-'}</td>
                              <td style={{ textAlign: 'center' }}>{r.exam_score ?? '-'}</td>
                              <td style={{ textAlign: 'center', fontWeight: 700 }}>{r.total_score}</td>
                              <td style={{ textAlign: 'center', fontWeight: 700, color: gradeColor(r.grade) }}>{r.grade}</td>
                              <td style={{ textAlign: 'center' }}>{r.grade_point}</td>
                              <td style={{ textAlign: 'center' }}>
                                <span className={`badge ${r.remarks === 'PASS' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 10 }}>
                                  {r.remarks}
                                </span>
                              </td>
                            </tr>
                          ))}
                          <tr style={{ background: '#f5f5f5', fontWeight: 600, fontSize: 12 }}>
                            <td colSpan={2} style={{ color: '#444' }}>Semester Summary</td>
                            <td style={{ textAlign: 'center' }}>{semCredits}</td>
                            <td colSpan={3} style={{ textAlign: 'center', color: 'var(--tuc-maroon)' }}>
                              GPA: {semGpa}
                            </td>
                            <td colSpan={3} style={{ textAlign: 'center', color: '#555' }}>
                              Credits Earned: {semEarned}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              <div style={{ border: '1px solid var(--tuc-border)', borderRadius: 8, padding: '12px 16px', marginTop: 16, display: 'flex', gap: 40, justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888' }}>Credits Attempted</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--tuc-maroon)' }}>{totalAttempted}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888' }}>Credits Earned</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#166534' }}>{totalCredits}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888' }}>CGPA</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#1d4ed8' }}>{cgpa}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 50, marginTop: 50 }}>
                {['Registrar', 'Head of Department', 'Student Signature'].map(role => (
                  <div key={role} style={{ borderTop: '1px solid #333', paddingTop: 6, textAlign: 'center', fontSize: 11, color: '#555' }}>
                    {role}
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', fontSize: 10.5, color: '#999', marginTop: 24, borderTop: '1px solid #eee', paddingTop: 10 }}>
                This is an official document of Techbridge University College. Any alterations render this document invalid.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
