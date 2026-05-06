import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from './projectsData';

const Projects = () => {
    return (
        <div className="space" id="projects">
            <div className="container">
                <div className="title-area text-center mb-40">
                    <span className="sub-title after-none before-none">
                        <i className="text-theme far fa-heart"></i> Our Projects
                    </span>
                    <h2 className="sec-title">What We’re Working On</h2>
                </div>
                <div className="row gy-30">
                    {projects.map((p) => (
                        <div className="col-md-6 col-lg-4" key={p.slug}>
                            <div className="project-card">
                                <div className="project-thumb">
                                    <img src={p.coverImage} alt={p.title} />
                                </div>
                                <div className="project-content">
                                    <h3 className="box-title">{p.title}</h3>
                                    <p className="mb-2">{p.shortDescription}</p>
                                    <div className="d-flex gap-2">
                                        <Link className="th-btn style2" to={`/projects/${p.slug}`}>
                                            Read More <i className="fa-solid fa-arrow-up-right ms-2"></i>
                                        </Link>
                                        {p.actionType === 'donate' ? (
                                            <Link className="th-btn" to={`/projects/${p.slug}#donate`}>
                                                Donate <i className="fa-solid fa-heart ms-2"></i>
                                            </Link>
                                        ) : (
                                            <Link className="th-btn" to={`/projects/${p.slug}#partner`}>
                                                Partnership <i className="fa-solid fa-handshake ms-2"></i>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="row g-2">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div className="col-4" key={`${p.slug}-ph-${i}`}>
                                            <div className="ratio ratio-1x1" style={{ background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 12 }}>
                                                <span>Photo {i}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;


