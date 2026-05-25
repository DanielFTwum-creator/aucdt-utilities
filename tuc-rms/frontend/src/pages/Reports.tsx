import { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Reports() {
  const [report, setReport] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [filterProg, setFilterProg] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/students/meta/programmes`).then(r => setProgrammes(r.data)).catch(() => {});
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterProg) params.programme_id = filterProg;
      if (filterLevel) params.level = filterLevel;
      const r = await axios.get(`${API}/reports/class-report`, { params });
      setReport(r.data);
    } catch (err) {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => { e.preventDefault(); loadReport(); };

  const gpaColor = (gpa) => {
    const g = parseFloat(gpa);
    if (!g) return 'var(--tuc-muted)';
    if (g >= 3.5) return '#16a34a';
    if (g >= 3.0) return '#2563eb';
    if (g >= 2.5) return '#d97706';
    return '#dc2626';
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Class Performance Reports</h1>
          <p>Academic performance overview across all programmes and levels</p>
        </div>
        <button className="btn btn-outline no-print" onClick={() => window.print()}>Print Report</button>
      </div>

      <div className="card no-print" style={{ marginBottom: 16 }}>
        <form onSubmit={handleFilter} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Programme</label>
            <select className="form-control" value={filterProg} onChange={e => setFilterProg(e.target.value)}>
              <option value="">All Programmes</option>
              {programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Level</label>
            <select className="form-control" value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
              <option value="">All Levels</option>
              {[100,200,300,400].map(l => <option key={l} value={l}>Level {l}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" type="submit">Generate Report</button>
        </form>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}><div className="spinner" /></div>
      ) : report.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <h3>No Report Data</h3>
            <p>No approved results found for the selected filters.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--tuc-maroon)' }}>{report.length}</div>
                <div style={{ fontSize: 12, color: 'var(--tuc-muted)' }}>Total Students</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#16a34a' }}>
                  {report.filter(r => parseFloat(r.gpa) >= 3.5).length}
                </div>
                <div style={{ fontSize: 12, color: 'var(--tuc-muted)' }}>First Class</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#2563eb' }}>
                  {report.filter(r => parseFloat(r.gpa) >= 3.0 && parseFloat(r.gpa) < 3.5).length}
                </div>
                <div style={{ fontSize: 12, color: 'var(--tuc-muted)' }}>Second Class Upper</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--tuc-gold)' }}>
                  {(report.reduce((s, r) => s + (parseFloat(r.avg_score) || 0), 0) / (report.filter(r => r.avg_score).length || 1)).toFixed(1)}%
                </div>
                <div style={{ fontSize: 12, color: 'var(--tuc-muted)' }}>Class Average</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrapper" style={{ borderRadius: 12 }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Index No.</th>
                    <th>Student Name</th>
                    <th>Programme</th>
                    <th>Level</th>
                    <th style={{ textAlign: 'center' }}>Courses</th>
                    <th style={{ textAlign: 'center' }}>Avg Score</th>
                    <th style={{ textAlign: 'center' }}>Passed</th>
                    <th style={{ textAlign: 'center' }}>Failed</th>
                    <th style={{ textAlign: 'center' }}>GPA</th>
                    <th style={{ textAlign: 'center' }}>Class</th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((r, i) => {
                    const gpa = parseFloat(r.gpa) || 0;
                    let cls = '—', clsColor = '#aaa';
                    if (gpa >= 3.5) { cls = 'First Class'; clsColor = '#16a34a'; }
                    else if (gpa >= 3.0) { cls = '2nd Upper'; clsColor = '#2563eb'; }
                    else if (gpa >= 2.5) { cls = '2nd Lower'; clsColor = '#d97706'; }
                    else if (gpa >= 2.0) { cls = 'Third Class'; clsColor = '#ea580c'; }
                    else if (gpa > 0) { cls = 'Pass'; clsColor = '#6b7280'; }
                    return (
                      <tr key={i}>
                        <td style={{ color: 'var(--tuc-muted)', fontSize: 12 }}>{i + 1}</td>
                        <td><span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--tuc-maroon)', fontSize: 12 }}>{r.index_number}</span></td>
                        <td style={{ fontWeight: 500 }}>{r.full_name}</td>
                        <td style={{ fontSize: 12, maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.programme}</td>
                        <td>L{r.level}</td>
                        <td style={{ textAlign: 'center' }}><span className="badge badge-info">{r.courses_taken || 0}</span></td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{r.avg_score ? parseFloat(r.avg_score).toFixed(1) : '—'}%</td>
                        <td style={{ textAlign: 'center' }}><span className="badge badge-success">{r.passed || 0}</span></td>
                        <td style={{ textAlign: 'center' }}>{r.failed > 0 ? <span className="badge badge-danger">{r.failed}</span> : <span style={{ color: '#aaa' }}>0</span>}</td>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: gpaColor(r.gpa) }}>{r.gpa ? parseFloat(r.gpa).toFixed(2) : '—'}</td>
                        <td style={{ textAlign: 'center', color: clsColor, fontWeight: 600, fontSize: 12 }}>{cls}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
