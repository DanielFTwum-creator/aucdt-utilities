import React from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
    return (
        <section className="space overflow-hidden">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7">
                        <div className="title-area text-center">
                            <span className="sub-title after-none before-none">
                                <i className="far fa-heart text-theme"></i> Membership & Programmes
                            </span>
                            <h2 className="sec-title">Opportunities For Students To Learn, Build, And Lead</h2>
                        </div>
                    </div>
                </div>
                <div className="row gy-30 justify-content-center">
                    <div className="col-xl-12 col-lg-4 col-md-6">
                        <div className="price-card2">
                            <div className="price-card-title-wrap">
                                <h3 className="price-card_title">Campus Member</h3>
                                <p className="price-card_text">Join our open community of student innovators and changemakers.</p>
                            </div>
                            <div className="price-card-price-wrap">
                                <h4 className="price-card_price">Free</h4>
                            </div>
                            <div className="price-card_content">
                                <div className="checklist">
                                    <ul>
                                        <li><i className="fas fa-circle-check"></i> Access to meetings & workshops</li>
                                        <li><i className="fas fa-circle-check"></i> Project team placements</li>
                                        <li><i className="fas fa-circle-check"></i> Mentorship & career support</li>
                                        <li><i className="fas fa-circle-check"></i> National Expo participation</li>
                                    </ul>
                                </div>
                                <Link to="/join" className="th-btn style3 w-100">Join Enactus CKT-UTAS</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;

