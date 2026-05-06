import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectBySlug } from './projectsData';

const ProjectDetails = () => {
    const { slug } = useParams();
    const project = getProjectBySlug(slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!project) {
        return (
            <div className="space">
                <div className="container text-center">
                    <h2 className="sec-title">Project not found</h2>
                    <Link to="/projects" className="th-btn mt-3">Back to Projects</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space">
            <div className="container">
                <div className="row gy-40 align-items-start">
                    <div className="col-lg-6">
                        <img src={project.coverImage} alt={project.title} style={{ width: '100%', borderRadius: '16px' }} />
                    </div>
                    <div className="col-lg-6">
                        <span className="sub-title after-none before-none"><i className="text-theme far fa-heart"></i> Project</span>
                        <h2 className="sec-title">{project.title}</h2>
                        <p className="mb-20">{project.fullDescription}</p>

                        {project.actionType === 'donate' ? (
                            <div id="donate" className="project-cta card p-3">
                                <h4 className="box-title">Support This Project</h4>
                                <p className="mb-2"><strong>MoMo Number:</strong> {project.finance.momoNumber}</p>
                                <p className="mb-2"><strong>Finance Director:</strong> {project.finance.directorName}</p>
                                <p className="mb-3"><strong>Contact:</strong> {project.finance.phone}</p>
                                <a href={`tel:${project.finance.phone.replace(/\s/g, '')}`} className="th-btn">
                                    Call Finance Director
                                </a>
                            </div>
                        ) : (
                            <div id="partner" className="project-cta card p-3">
                                <h4 className="box-title">Partner With Us</h4>
                                <p className="mb-2"><strong>Project Director:</strong> {project.projectDirector.name}</p>
                                <p className="mb-2"><strong>Phone:</strong> {project.projectDirector.phone}</p>
                                <p className="mb-3"><strong>Email:</strong> {project.projectDirector.email}</p>
                                <div className="d-flex gap-2">
                                    <a href={`tel:${project.projectDirector.phone.replace(/\s/g, '')}`} className="th-btn">Call</a>
                                    <a href={`mailto:${project.projectDirector.email}`} className="th-btn style2">Email</a>
                                </div>
                            </div>
                        )}

                        <div className="mt-3">
                            <Link to="/projects" className="link-btn style2">Back to Projects <i className="fa-solid fa-arrow-up-right ms-2"></i></Link>
                        </div>
                    </div>
                </div>

                {/* Images below come from project.gallery in src/components/projectsData.js.
                    Add '/assets/...' image paths to that gallery array to display them here. */}
                <div className="title-area text-center mt-40">
                    <h3 className="sec-title">Project Photo Gallery</h3>
                    <p className="sec-text">Drop image paths into the project "gallery" array to show them here.</p>
                </div>

                {project.gallery && project.gallery.length > 0 ? (
                    <div className="row gy-20">
                        {project.gallery.map((src, idx) => (
                            <div className="col-6 col-md-4 col-lg-3" key={idx}>
                                <img src={src} alt={`${project.title} ${idx + 1}`} style={{ width: '100%', borderRadius: 12 }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="row gy-20">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                            <div className="col-6 col-md-4 col-lg-3" key={i}>
                                <div className="ratio ratio-1x1" style={{ background: '#f8fafc', borderRadius: 12, border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    <span>Image {i}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;


