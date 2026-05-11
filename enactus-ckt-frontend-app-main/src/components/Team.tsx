import React from 'react';

const Team = () => {
    return (
        <section className="space" id="team-sec" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="shape-mockup team-bg-shape3-1 d-xxl-block d-none" data-top="0%" data-left="0%" data-bottom="0">
                <img src="assets/img/shape/team_bg_shape3_1.png" alt="img" />
            </div>
            <div className="shape-mockup team-bg-shape3-2 d-xxl-block d-none" data-top="0%" data-right="0%" data-bottom="0">
                <img src="assets/img/shape/team_bg_shape3_2.png" alt="img" />
            </div>
            <div className="shape-mockup team-bg-shape3-3 spin d-xxl-block d-none" data-top="15%" data-left="20%">
                <div className="color-masking2">
                    <div className="masking-src" data-mask-src="assets/img/shape/team_bg_shape3_3.png"></div>
                    <img src="assets/img/shape/team_bg_shape3_3.png" alt="img" />
                </div>
            </div>
            <div className="shape-mockup team-bg-shape3-4 jump d-xxl-block d-none" data-top="18%" data-right="10%">
                <img src="assets/img/shape/team_bg_shape3_4.png" alt="img" />
            </div>
            <div className="shape-mockup team-bg-shape3-5 spin d-xxl-block d-none" data-bottom="18%" data-left="10%">
                <img src="assets/img/shape/team_bg_shape3_5.png" alt="img" />
            </div>
            <div className="shape-mockup team-bg-shape3-6 spin d-xxl-block d-none" data-bottom="10%" data-right="10%">
                <div className="color-masking">
                    <div className="masking-src" data-mask-src="assets/img/shape/team_bg_shape3_6.png"></div>
                    <img src="assets/img/shape/team_bg_shape3_6.png" alt="img" />
                </div>
            </div>
            <div className="container">
                <div className="title-area text-center">
                    <span className="sub-title after-none before-none">
                        <i className="far fa-heart text-theme"></i> Team
                    </span>
                    <h2 className="sec-title">Behind every project is a team of dreamers and doers.</h2>
                    <p className="mt-10">
                        40+ student leaders • 30+ community volunteers engaged • United by one purpose: Transforming visions into reality.
                    </p>
                </div>
                <div className="row g-4 mt-2">
                    {[
                        { img: 'assets/img/president/IMG_5055.JPG', role: 'Chapter President', dept: 'Leadership & Strategy' },
                        { img: 'assets/img/outreach/IMG_4878.jpg', role: 'Project Director', dept: 'Programmes & Partnerships' },
                        { img: 'assets/img/outreach/IMG_4893.jpg', role: 'Finance Director', dept: 'Budget & Operations' },
                        { img: 'assets/img/outreach/IMG_4895.jpg', role: 'Communications Lead', dept: 'Media & Outreach' },
                    ].map((m, i) => (
                        <div className="col-12 col-sm-6 col-lg-3" key={i}>
                            <div className="th-team team-card3 h-100">
                                <div className="team-img">
                                    <img src={m.img} alt={m.role} />
                                </div>
                                <div className="team-card-content">
                                    <h3 className="box-title">{m.role}</h3>
                                    <span className="team-desig">{m.dept}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;

