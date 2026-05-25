import { useState, useEffect, FormEvent, ReactNode } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface CourseForm {
  course_code: string
  course_name: string
  credit_hours: number
  department_id: string | number
  level: number
  semester: number
  programme_id: string | number
}

interface Course extends CourseForm {
  id: number
  course_id?: number
  department_name?: string
  department?: string
  status?: string
}

interface Department { id: number; name: string }
interface Programme { id: number; name: string }

const EMPTY_FORM: CourseForm = {
  course_code: '', course_name: '', credit_hours: 3,
  department_id: '', level: 100, semester: 1, programme_id: ''
}

export default function Courses() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [loading, setLoading] = useState(true)
  const [filterDept, setFilterDept] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [selected, setSelected] = useState<Course | null>(null)
  const [form, setForm] = useState<CourseForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const isAdmin = ['registrar', 'qa_officer'].includes(user?.role)
  const isRegistrar = user?.role === 'registrar'

  const load = async () => {
    setLoading(true)
    try {
      if (isAdmin) {
        const params: any = {}
        if (filterDept) params.department_id = filterDept
        if (filterLevel) params.level = filterLevel
        const [c, d, p] = await Promise.all([
          axios.get(`${API}/courses`, { params }),
          axios.get(`${API}/courses/departments`),
          axios.get(`${API}/courses/programmes`)
        ])
        setCourses(c.data)
        setDepartments(d.data)
        setProgrammes(p.data)
      } else {
        const r = await axios.get(`${API}/users/${user?.id}/courses`)
        setCourses(r.data.map((c: any) => ({ ...c, id: c.course_id })))
      }
    } catch (err) {
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filterDept, filterLevel])

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setSelected(null)
    setModal('add')
  }

  const openEdit = (course: Course) => {
    setSelected(course)
    setForm({
      course_code: course.course_code,
      course_name: course.course_name,
      credit_hours: course.credit_hours,
      department_id: course.department_id,
      level: course.level,
      semester: course.semester,
      programme_id: course.programme_id || ''
    })
    setModal('edit')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal === 'add') {
        await axios.post(`${API}/courses`, form)
        toast.success('Course created successfully')
      } else {
        await axios.put(`${API}/courses/${selected?.id}`, form)
        toast.success('Course updated')
      }
      setModal(null)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Delete "${course.course_code}: ${course.course_name}"? This cannot be undone.`)) return
    try {
      await axios.delete(`${API}/courses/${course.id}`)
      toast.success('Course deleted')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cannot delete this course')
    }
  }

  const f = (k: keyof CourseForm, v: any) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>{isAdmin ? 'All Courses' : 'My Assigned Courses'}</h1>
          <p>{isAdmin ? 'Complete course catalogue across all departments' : 'Courses assigned to you for this academic year'}</p>
        </div>
        {isRegistrar && (
          <button className="btn btn-primary" onClick={openAdd}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Course
          </button>
        )}
      </div>

      <div className="card">
        {isAdmin && (
          <div className="filter-bar" style={{ marginBottom: 14 }}>
            <select className="form-control" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select className="form-control" value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
              <option value="">All Levels</option>
              {[100, 200, 300, 400].map(l => <option key={l} value={l}>Level {l}</option>)}
            </select>
            <span style={{ fontSize: 13, color: 'var(--tuc-muted)', alignSelf: 'center' }}>{courses.length} courses</span>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <h3>No courses found</h3>
            <p>{isAdmin ? 'No courses match the selected filters.' : 'No courses have been assigned to you yet.'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table role="table" aria-label="Courses">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Course Name</th>
                  <th scope="col">Department</th>
                  <th scope="col">Level</th>
                  <th scope="col">Sem</th>
                  <th scope="col">Credits</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--tuc-maroon)', fontSize: 12 }}>
                        {c.course_code}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{c.course_name}</td>
                    <td>
                      <span className="badge badge-draft" style={{ fontSize: 11 }}>
                        {c.department_name || c.department || ''}
                      </span>
                    </td>
                    <td>L{c.level}</td>
                    <td>S{c.semester}</td>
                    <td style={{ textAlign: 'center' }}>{c.credit_hours}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {!isAdmin && (
                          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/courses/${c.id}/enter-scores`)}>
                            Enter Scores
                          </button>
                        )}
                        {isRegistrar && (
                          <>
                            <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>Edit</button>
                            <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626', border: 'none' }} onClick={() => handleDelete(c)}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.currentTarget === e.target && setModal(null)}>
          <div className="modal" style={{ maxWidth: 600 }} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-header">
              <h2 className="modal-title" id="modal-title">{modal === 'add' ? 'Add New Course' : 'Edit Course'}</h2>
              <button className="btn-icon" onClick={() => setModal(null)} aria-label="Close dialog">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Course Code *</label>
                  <input className="form-control" value={form.course_code} onChange={e => f('course_code', e.target.value.toUpperCase())} required placeholder="e.g. DMCD231" style={{ fontFamily: 'monospace' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Credit Hours</label>
                  <select className="form-control" value={form.credit_hours} onChange={e => f('credit_hours', parseInt(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Course Name *</label>
                <input className="form-control" value={form.course_name} onChange={e => f('course_name', e.target.value)} required placeholder="e.g. Corporate Identity" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select className="form-control" value={form.department_id} onChange={e => f('department_id', e.target.value)} required>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Programme</label>
                  <select className="form-control" value={form.programme_id} onChange={e => f('programme_id', e.target.value)}>
                    <option value="">None</option>
                    {programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Level *</label>
                  <select className="form-control" value={form.level} onChange={e => f('level', parseInt(e.target.value))} required>
                    {[100, 200, 300, 400].map(l => <option key={l} value={l}>Level {l}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Semester *</label>
                  <select className="form-control" value={form.semester} onChange={e => f('semester', parseInt(e.target.value))} required>
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : modal === 'add' ? 'Create Course' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
