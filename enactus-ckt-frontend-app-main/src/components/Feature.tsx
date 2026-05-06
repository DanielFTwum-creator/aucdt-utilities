import React from 'react';

const Feature = () => {
    return (
        <section className="feature-area-1 position-relative space-bottom">
            <div className="feature-bg-wrap" data-bg-src="assets/img/bg/gray-bg2.png" data-mask-src="assets/img/bg/feature-bg-mask-1.png">
                <div className="feature-bg-shape1-1"></div>
            </div>
            <div className="container">
                <div className="row gy-30 gx-30 justify-content-end">
                    <div className="col-12 pb-2">
                        <div className="alert alert-light text-center fw-semibold" role="alert" style={{ background: 'rgba(255,215,0,.15)' }}>
                            40+ Student Leaders | 1200+ Volunteer Hours | 13 SDGs Tackled | 800+ km Traveled
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4">
                        <div className="feature-card">
                            <div className="feature-card-bg-shape">
                            </div>
                            <div className="box-icon">
                                <img src="assets/img/icon/feature-icon1-2.svg" alt="Innovation icon" />
                            </div>
                            <h3 className="box-title">Innovation In Action</h3>
                            <p className="box-text">
                                Student-led prototypes and ventures tackling sustainability and livelihoods with practical, scalable solutions.
                            </p>

                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4">
                        <div className="feature-card">
                            <div className="feature-card-bg-shape">
                            </div>
                            <div className="box-icon">
                                <img src="assets/img/icon/service-icon/service-card-icon1-3.svg" alt="Leadership icon" />
                            </div>
                            <h3 className="box-title">Entrepreneurial Leadership</h3>
                            <p className="box-text">
                                Building leaders who use business as a force for good to create measurable impact.
                            </p>

                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4">
                        <div className="feature-card">
                            <div className="feature-card-bg-shape">
                            </div>
                            <div className="box-icon">
                                <img src="assets/img/icon/service-icon/service-card-icon1-1.svg" alt="Community icon" />
                            </div>
                            <h3 className="box-title">Community Impact</h3>
                            <p className="box-text">
                                Co-creating change with local communities through education, inclusion, and sustainable practices.
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Feature;

