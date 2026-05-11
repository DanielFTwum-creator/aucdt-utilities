import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="th-hero-wrapper hero-3" id="hero">
            <div className="shape-mockup hero-shape-3-1 d-lg-block d-none" data-top="20%" data-left="50%">
                <div className="color-masking">
                    <div className="masking-src" data-mask-src="assets/img/hero/hero-bg-shape2-3.png"></div>
                    <img src="assets/img/hero/hero-bg-shape2-3.png" alt="shape" />
                </div>
            </div>
            <div className="shape-mockup hero-shape-3-2 jump" data-top="25%" data-left="5%">
                <div className="color-masking">
                    <div className="masking-src" data-mask-src="assets/img/hero/hero-bg-shape2-1.png"></div>
                    <img src="assets/img/hero/hero-bg-shape2-1.png" alt="shape" />
                </div>
            </div>
            {/* Removed waving hand shape behind the logo */}

            <div className="container">
                <div className="row gx-40 align-items-start">
                    <div className="col-lg-6">
                        <div className="hero-style3 hero-style-mobile-bg">
                            <span className="sub-title after-none">Enactus CKT-UTAS</span>
                            <h1 className="hero-title">
                                <span className="title2">Transforming <span className="text-theme2 d-inline-block">Visions</span> Into Reality</span>
                            </h1>
                            <p className="hero-text">
                                We are a student social entrepreneurship club turning ideas into impact through innovation, leadership, and action. Together, we transform challenges into opportunities, and visions into reality.
                            </p>
                            <p className="hero-text" style={{ fontStyle: 'italic' }}>
                                “At Enactus CKT-UTAS, we believe that, out of despair blooms hope, the seed of transformative change. Our story is one of creativity, perseverance, and passion.”
                            </p>
                            <div className="btn-wrap">
                                <Link to="/projects" className="th-btn">
                                    Explore Our Projects<i className="fa-solid fa-arrow-up-right ms-2"></i>
                                </Link>
                                <Link to="/join" className="th-btn style2">
                                    Join Us<i className="fa-solid fa-arrow-up-right ms-2"></i>
                                </Link>
                            </div>
                            <div className="mt-4 d-lg-none text-center">
                                <img src="/assets/img/celebration/IMG_3579.jpg" alt="Celebration" style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }} />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="text-center text-lg-end hero-img-offset-lg d-none d-lg-block">
                            <img src="/assets/img/celebration/IMG_3579.jpg" alt="Celebration" style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;

