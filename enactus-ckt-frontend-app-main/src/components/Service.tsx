import React from 'react';
import { Link } from 'react-router-dom';

const Service = () => {
    return (
        <section className="overflow-hidden space" id="service-sec" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="shape-mockup service-bg-shape2-1 d-xxl-inline-block d-none" data-bottom="0" data-left="0">
                <img src="assets/img/shape/service_bg_shape3_1.png" alt="img" />
            </div>
            <div className="container">
                <div className="row gx-80">
                    <div className="col-xl-6">
                        <div className="service-wrap2">
                            <div className="title-area">
                                <span className="sub-title after-none before-none">
                                    <i className="far fa-heart text-theme"></i> What We Do
                                </span>
                                <h2 className="sec-title">Empowering Student Entrepreneurs To Build Sustainable Solutions</h2>
                                <p className="sec-text">
                                    We apply entrepreneurial thinking to solve social and environmental challenges. From product design to market validation, we turn classroom knowledge into real-world impact.
                                </p>
                            </div>
                            <div className="service-bg-shape2-2">
                                <img src="assets/img/service/service-thumb3-1.png" alt="img" />
                                <div className="service-bg-shape2-3">
                                    <div className="color-masking2">
                                        <div className="masking-src" data-mask-src="assets/img/shape/service_bg_shape3_2.png"></div>
                                        <img src="assets/img/shape/service_bg_shape3_2.png" alt="img" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="row gy-30">
                            <div className="col-12">
                                <div className="service-card2">
                                    <div className="service-card-icon">
                                        <img src="assets/img/icon/service-icon/service-card-icon1-1.svg" alt="Icon" />
                                    </div>
                                    <div className="box-content">
                                        <h3 className="box-title"><Link to="/about">Product & Prototype Labs</Link></h3>
                                        <p className="box-text">
                                            Share stories and experiences from current volunteers to inspire others to join. Allow user to sign up for volunteer opportunities.
                                        </p>
                                        <Link to="/about" className="icon-btn">
                                            <i className="fas fa-arrow-up-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="service-card2">
                                    <div className="service-card-icon">
                                        <img src="assets/img/icon/service-icon/service-card-icon1-2.svg" alt="Icon" />
                                    </div>
                                    <div className="box-content">
                                        <h3 className="box-title"><Link to="/about">Training & Leadership</Link></h3>
                                        <p className="box-text">
                                            Share stories and experiences from current volunteers to inspire others to join. Allow user to sign up for volunteer opportunities.
                                        </p>
                                        <Link to="/about" className="icon-btn">
                                            <i className="fas fa-arrow-up-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="service-card2">
                                    <div className="service-card-icon">
                                        <img src="assets/img/icon/service-icon/service-card-icon1-3.svg" alt="Icon" />
                                    </div>
                                    <div className="box-content">
                                        <h3 className="box-title"><Link to="/about">Community Partnerships</Link></h3>
                                        <p className="box-text">
                                            Share stories and experiences from current volunteers to inspire others to join. Allow user to sign up for volunteer opportunities.
                                        </p>
                                        <Link to="/about" className="icon-btn">
                                            <i className="fas fa-arrow-up-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Service;

