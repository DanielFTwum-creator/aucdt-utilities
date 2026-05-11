import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-wrapper footer-layout2">
            <div className="shape-mockup footer-bg-shape2-1 jump" data-left="0" data-top="0">
                <div className="color-masking2">
                    <div className="masking-src" data-mask-src="assets/img/shape/footer-bg-shape2-1.png"></div>
                    <img src="assets/img/shape/footer-bg-shape2-1.png" alt="img" />
                </div>
            </div>
            <div className="shape-mockup footer-bg-shape2-2 jump-reverse" data-right="0" data-bottom="0">
                <div className="color-masking">
                    <div className="masking-src" data-mask-src="assets/img/shape/footer-bg-shape2-2.png"></div>
                    <img src="assets/img/shape/footer-bg-shape2-2.png" alt="img" />
                </div>
            </div>
            <div className="widget-area space-top">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget footer-widget">
                                <div className="th-widget-about">
                                    <div className="about-logo">
                                        <Link to="/"><img src="/assets/img/logo/enactus.png?v=3" alt="Enactus CKT-UTAS" style={{height: '40px', width: 'auto'}} /></Link>
                                    </div>
                                    <p className="about-text mb-3">
                                        Enactus CKT-UTAS is a student club for social entrepreneurs, building sustainable solutions that improve lives.
                                    </p>
                                    <div className="info-card style2">
                                        <div className="box-icon bg-theme">
                                            <i className="fal fa-phone"></i>
                                        </div>
                                        <div className="box-content">
                                            <p className="box-text">Call us any time:</p>
                                            <h4 className="box-title"><a href="tel:16336547896">+233 50 606 3217</a></h4>
                                        </div>
                                    </div>
                                    <div className="info-card style2">
                                        <div className="box-icon bg-theme2">
                                            <i className="fal fa-envelope-open"></i>
                                        </div>
                                        <div className="box-content">
                                            <p className="box-text">Email us any time:</p>
                                            <h4 className="box-title"><a href="mailto:enactus@cktutas.edu.gh">enactus@cktutas.edu.gh</a></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-auto">
                            <div className="widget widget_nav_menu footer-widget">
                                <h3 className="widget_title">Quick Links</h3>
                                <div className="menu-all-pages-container">
                                    <ul className="menu">
                                        <li><Link to="/about">About Us</Link></li>
                                        <li><Link to="/blog">Our News</Link></li>
                                        <li><Link to="/projects">Our Projects</Link></li>
                                        <li><Link to="/privacy">Privacy policy</Link></li>
                                        <li><Link to="/contact">Contact Us</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-auto">
                            <div className="widget widget_nav_menu footer-widget">
                                <h3 className="widget_title">Our Service</h3>
                                <div className="menu-all-pages-container">
                                    <ul className="menu">
                                        <li><Link to="/join">Join Enactus</Link></li>
                                        <li><Link to="/about">Education & Training</Link></li>
                                        <li><Link to="/projects">Community Projects</Link></li>
                                        <li><Link to="/contact">Partnerships</Link></li>
                                        <li><Link to="/projects">Our Initiatives</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget newsletter-widget footer-widget">
                                <h3 className="widget_title">Newsletter</h3>
                                <p className="footer-text mb-4">
                                    Subscribe to Our Newsletter. Regular inspection and feedback mechanisms
                                </p>
                                <form className="newsletter-form">
                                    <div className="form-group style-dark">
                                        <input className="form-control" type="email" placeholder="Enter your email" required="" />
                                    </div>
                                    <button type="submit" className="th-btn style5">
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </form>
                                <div className="th-social style6">
                                    <a href="https://www.facebook.com/">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="https://www.twitter.com/">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="https://www.linkedin.com/">
                                        <i className="fab fa-linkedin-in"></i>
                                    </a>
                                    <a href="https://www.behance.com/">
                                        <i className="fab fa-behance"></i>
                                    </a>
                                    <a href="https://www.vimeo.com/">
                                        <i className="fab fa-vimeo-v"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-wrap bg-theme text-center">
                <div className="container">
                    <p className="copyright-text">
                        Copyright 2025 <Link to="/">Enactus CKT-UTAS</Link> All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

