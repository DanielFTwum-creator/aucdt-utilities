import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
    return (
        <section className="space" id="blog-sec" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7">
                        <div className="title-area text-center">
                            <span className="sub-title after-none before-none">
                                <i className="far fa-heart text-theme"></i> Our Blog
                            </span>
                            <h2 className="sec-title">Latest News & Updates</h2>
                            <p className="sec-text">
                                Stay informed about our latest projects, success stories, and community impact through our blog.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row gy-30">
                    <div className="col-xl-6">
                        <div className="blog-card style2">
                            <div className="blog-img">
                                <Link to="/blog/presidency-invite-2024">
                                    <img src="/assets/img/president/IMG_5059.JPG" alt="Presidency Invite" />
                                </Link>
                            </div>
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <Link to="/blog/presidency-invite-2024"><i className="fas fa-calendar-days"></i>August 2024</Link>
                                    <Link to="/blog/presidency-invite-2024"><i className="fas fa-tags"></i>Recognition</Link>
                                </div>
                                <h3 className="box-title">
                                    <Link to="/blog/presidency-invite-2024">Enactus CKT-UTAS visits Jubilee House after National Win</Link>
                                </h3>
                                <p className="blog-text">
                                    After winning the 2024 Enactus National Expo, our team was invited by H.E. Nana Addo Dankwa Akufo-Addo to the Jubilee House.
                                </p>
                                <Link to="/blog/presidency-invite-2024" className="th-btn">
                                    Read More <i className="fas fa-arrow-up-right ms-2"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="blog-card style2">
                            <div className="blog-img">
                                <Link to="/blog/menstrual-health-outreach-2025">
                                    <img src="/assets/img/outreach/IMG_4864.jpg" alt="Menstrual Health Outreach" />
                                </Link>
                            </div>
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <Link to="/blog/menstrual-health-outreach-2025"><i className="fas fa-calendar-days"></i>June 2025</Link>
                                    <Link to="/blog/menstrual-health-outreach-2025"><i className="fas fa-tags"></i>Health</Link>
                                </div>
                                <h3 className="box-title">
                                    <Link to="/blog/menstrual-health-outreach-2025">Menstrual Health Outreach at Adabayeri JHS, Navrongo</Link>
                                </h3>
                                <p className="blog-text">
                                    Sensitization on menstrual hygiene and distribution of sanitary pads to students in the Upper East Region.
                                </p>
                                <Link to="/blog/menstrual-health-outreach-2025" className="th-btn">
                                    Read More <i className="fas fa-arrow-up-right ms-2"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-12">
                        <div className="blog-card style2">
                            <div className="blog-img">
                                <Link to="/blog/hand-over-ceremony-2025">
                                    <img src="/assets/img/celebration/IMG_3610.jpg" alt="Handover and Awards Night" />
                                </Link>
                            </div>
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <Link to="/blog/hand-over-ceremony-2025"><i className="fas fa-calendar-days"></i>July 2025</Link>
                                    <Link to="/blog/hand-over-ceremony-2025"><i className="fas fa-tags"></i>Community</Link>
                                </div>
                                <h3 className="box-title">
                                    <Link to="/blog/hand-over-ceremony-2025">Handover Ceremony, Awards & Dinner Night</Link>
                                </h3>
                                <p className="blog-text">
                                    Celebrating leadership transition and outstanding contributions as we close the academic year.
                                </p>
                                <Link to="/blog/hand-over-ceremony-2025" className="th-btn">
                                    Read More <i className="fas fa-arrow-up-right ms-2"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blog;

