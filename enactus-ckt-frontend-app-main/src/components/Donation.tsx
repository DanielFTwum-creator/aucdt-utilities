import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from './projectsData';

const Donation = () => {
    return (
        <section className="space overflow-hidden" id="donation-sec">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="title-area text-center">
                            <span className="sub-title before-none after-none">
                                <i className="far fa-heart text-theme"></i> Our Projects
                            </span>
                            <h2 className="sec-title">Student-Led Ventures Creating Measurable Impact</h2>
                        </div>
                    </div>
                </div>
                <div className="row gy-30">
                    {projects.map((p, idx) => (
                        <div className="col-xl-6" key={p.slug}>
                        <div className="donation-card style3">
                            <div className="box-thumb">
                                    <img src={p.coverImage} alt={p.title} />
                                    <div className={`donation-card-tag ${idx % 2 === 1 ? 'bg-theme2' : ''}`}>❤️</div>
                                <div className="donation-card-shape" data-mask-src="assets/img/donation/donation-card-shape2-1.png"></div>
                            </div>
                            <div className="box-content">
                                <h3 className="box-title">
                                        <Link to={`/projects/${p.slug}`}>{p.title}</Link>
                                </h3>
                                    <p>{p.shortDescription}</p>
                                {/* <div className="donation-card_progress-wrap">
                                    <div className="progress">
                                        <div className="progress-bar" style={{ width: '85%' }}></div>
                                    </div>
                                    <div className="donation-card_progress-content">
                                        <span className="donation-card_raise">
                                                Raised <span className="donation-card_raise-number">—</span>
                                        </span>
                                        <span className="donation-card_goal">
                                                Goal <span className="donation-card_goal-number">—</span>
                                        </span>
                                    </div>
                                    </div> */}
                                    <div className="d-flex gap-2">
                                        <Link to={`/projects/${p.slug}`} className="th-btn style6">
                                    View Project <i className="fas fa-arrow-up-right ms-2"></i>
                                        </Link>
                                        {p.actionType === 'donate' ? (
                                            <Link to={`/projects/${p.slug}#donate`} className="th-btn">
                                                Donate <i className="fas fa-heart ms-2"></i>
                                            </Link>
                                        ) : (
                                            <Link to={`/projects/${p.slug}#partner`} className="th-btn">
                                                Partnership <i className="fas fa-handshake ms-2"></i>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Donation;

