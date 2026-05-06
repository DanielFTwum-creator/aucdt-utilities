import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="overflow-hidden space" id="about-sec">
            <div className="shape-mockup about-bg-shape2-1 jump-reverse d-lg-inline-block d-none" data-top="10%" data-right="5%">
                <img src="assets/img/shape/heart-shape1.png" alt="shape" />
            </div>
            <div className="shape-mockup about-bg-shape3-1 jump" data-bottom="20%" data-right="5%">
                <div className="color-masking2">
                    <div className="masking-src" data-mask-src="assets/img/shape/about_shape3_1.png"></div>
                    <img src="assets/img/shape/about_shape3_1.png" alt="img" />
                </div>
            </div>
            <div className="container">
                <div className="row gy-60 align-items-center">
                    <div className="col-xl-6">
                        <div className="img-box3">
                            <div className="img1">
                                <img src="assets/img/outreach/IMG_4864.jpg" alt="Enactus President" />
                            </div>
                            <div className="img2 jump">
                                <img src="assets/img/president/IMG_5055.JPG" alt="Enactus Team" />
                            </div>
                            <div className="about-shape3-1 jump-reverse">
                                <div className="color-masking2">
                                    <div className="masking-src" data-mask-src="assets/img/shape/about_shape1_1.png"></div>
                                    <img src="assets/img/shape/about_shape1_1.png" alt="img" />
                                </div>
                            </div>
                            <div className="year-counter movingX">
                                <div className="year-counter_number">
                                    <strong>Join Us</strong> – Be part of our impact journey
                                </div>
                                <Link to="/join" className="link-btn style2">Join Us Now</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="title-area mb-40">
                            <span className="sub-title after-none before-none">
                                <i className="text-theme far fa-heart"></i> About Us
                            </span>
                            <h2 className="sec-title">Who We Are</h2>
                            <p>
                                Enactus CKT-UTAS is the student chapter of Enactus International at C.K. Tedam University of Technology and Applied Sciences (Navrongo, Ghana). We are a community of young innovators, leaders, and changemakers dedicated to developing entrepreneurial solutions that uplift livelihoods and protect our environment.
                            </p>
                        </div>
                        <div className="about-wrap3">
                            <h4 className="box-title">Our Mission</h4>
                            <p className="mb-20">
                                To use entrepreneurial action to create a better, more sustainable world while developing the next generation of entrepreneurial leaders.
                            </p>

                            <h4 className="box-title">Our Vision</h4>
                            <p className="mb-20">
                                A world where business and innovation serve as a force for good, empowering communities to thrive sustainably.
                            </p>

                            <h4 className="box-title">Our Values</h4>
                            <ul className="mb-20">
                                <li><strong>Innovation</strong> – finding creative solutions to real-world problems.</li>
                                <li><strong>Sustainability</strong> – ensuring long-term social and environmental impact.</li>
                                <li><strong>Collaboration</strong> – working together with students, communities, and partners.</li>
                                <li><strong>Impact</strong> – creating measurable change that improves lives.</li>
                            </ul>

                            <h4 className="box-title">Our Achievements</h4>
                            <div className="achievements-grid mb-30">
                                <div className="achievement-card">
                                    <div className="achievement-icon"><i className="fa-solid fa-users"></i></div>
                                    <div className="achievement-value"><span className="counter-number">40</span>+</div>
                                    <div className="achievement-label">Student Leaders</div>
                                </div>
                                <div className="achievement-card">
                                    <div className="achievement-icon"><i className="fa-regular fa-clock"></i></div>
                                    <div className="achievement-value"><span className="counter-number">1200</span>+</div>
                                    <div className="achievement-label">Volunteer Hours</div>
                                </div>
                                <div className="achievement-card">
                                    <div className="achievement-icon"><i className="fa-solid fa-globe"></i></div>
                                    <div className="achievement-value"><span className="counter-number">13</span></div>
                                    <div className="achievement-label">SDGs Tackled</div>
                                </div>
                                <div className="achievement-card">
                                    <div className="achievement-icon"><i className="fa-solid fa-route"></i></div>
                                    <div className="achievement-value"><span className="counter-number">800</span>+</div>
                                    <div className="achievement-label">Km Traveled</div>
                                </div>
                            </div>

                            <div className="btn-wrap mt-30">
                                <Link to="/about" className="th-btn style3 style-radius">
                                    Learn More <i className="fa-solid fa-arrow-up-right ms-2"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

