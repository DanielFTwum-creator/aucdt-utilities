import React from 'react'
import { Link } from 'react-router-dom'

const alumniList = [
    {
        name: 'Aminu Salifu',
        year: 'Class of 2022',
        role: 'Product Manager, Fintech',
        photo: '/assets/img/team/team_3_1.png',
        essay: 'Led sustainable finance projects; now building inclusive financial products at scale.'
    },
    {
        name: 'Naomi Asante',
        year: 'Class of 2021',
        role: 'Founder, AgriTech Startup',
        photo: '/assets/img/team/team_3_2.png',
        essay: 'Scaled soil-health innovation from campus prototype to regional adoption.'
    },
    {
        name: 'Daniel Owusu',
        year: 'Class of 2023',
        role: 'CSR Analyst',
        photo: '/assets/img/team/team_3_3.png',
        essay: 'Drives corporate impact programmes aligned to SDGs and shared value.'
    },
    {
        name: 'Akosua Boatemaa',
        year: 'Class of 2024',
        role: 'Operations Associate, HealthTech',
        photo: '/assets/img/team/team_3_4.png',
        essay: 'Streamlines service delivery for underserved communities.'
    }
]

export default function Alumni({ compact = true }) {
    return (
        <section className="space" id="alumni-sec" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="container">
                <div className="title-area text-center">
                    <span className="sub-title after-none before-none">
                        <i className="far fa-heart text-theme"></i> Alumni
                    </span>
                    <h2 className="sec-title">Our Alumni: Building Impact Beyond Campus</h2>
                    <p className="sec-text">Stories of leadership, entrepreneurship, and social impact after Enactus.</p>
                </div>

                <div className="row g-4">
                    {(compact ? alumniList.slice(0, 4) : alumniList).map((alum, i) => (
                        <div className="col-12 col-sm-6 col-lg-3" key={i}>
                            <div className="card h-100" style={{ border: 'none', boxShadow: '0 10px 24px rgba(18, 38, 63, 0.08)', borderRadius: 16 }}>
                                <div className="ratio ratio-1x1" style={{ overflow: 'hidden', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                                    <img src={alum.photo} alt={alum.name} style={{ width: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="p-3">
                                    <h3 className="h5 mb-1">{alum.name}</h3>
                                    <div className="text-muted mb-1">{alum.year}</div>
                                    <div className="fw-semibold mb-2">{alum.role}</div>
                                    <p className="mb-0" style={{ color: '#5f6c7b' }}>{alum.essay}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {compact && (
                    <div className="text-center mt-30">
                        <Link to="/alumni" className="th-btn">View All Alumni</Link>
                    </div>
                )}
            </div>
        </section>
    )
}


