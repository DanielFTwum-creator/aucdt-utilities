import React from 'react';
import { Link } from 'react-router-dom';

const Competition = () => {
    return (
        <section className="space overflow-hidden" id="pitch-competition" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="container">
                <div className="row gy-40 align-items-center">
                    <div className="col-lg-6">
                        <div className="ratio ratio-16x9 rounded" style={{ overflow: 'hidden' }}>
                            {/* Replace this image with your flyer when ready */}
                            <img src="/assets/img/pages/index.jpg" alt="Enactus Annual Competition Flyer" style={{ width: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <span className="sub-title after-none before-none">
                            <i className="far fa-heart text-theme"></i> Enactus Annual Competition
                        </span>
                        <h2 className="sec-title">Showcasing Student Innovation To Investors</h2>
                        <p className="sec-text">
                            Our annual competition gives tertiary students and individuals a platform to pitch
                            solutions with real-world impact. Connect with partners and investors ready to help scale.
                        </p>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            <Link to="/competition" className="th-btn">
                                View Competition Details <i className="fa-solid fa-arrow-up-right ms-2"></i>
                            </Link>
                            <Link to="/competition/2026" className="th-btn style2">
                                2026 Pitching Competition <i className="fa-solid fa-flag ms-2"></i>
                            </Link>
                            <Link to="/contact" className="th-btn style3">
                                Sponsor & Partner <i className="fa-solid fa-handshake ms-2"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Competition;


