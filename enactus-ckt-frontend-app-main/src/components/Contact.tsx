import React from 'react';

const Contact = () => {
    return (
        <section className="space">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7">
                        <div className="title-area text-center">
                            <span className="sub-title after-none before-none"><i className="far fa-heart text-theme"></i> Contact Us</span>
                            <h2 className="sec-title">Get In Touch With Enactus CKT-UTAS</h2>
                            <p className="sec-text">We’d love to hear from you. Reach out for partnerships, membership, or general enquiries.</p>
                        </div>
                    </div>
                </div>
                <div className="row gy-30">
                    <div className="col-lg-6">
                        <div className="info-card style2">
                            <div className="box-icon bg-theme"><i className="fal fa-phone"></i></div>
                            <div className="box-content">
                                <p className="box-text">Call us any time</p>
                                <h4 className="box-title"><a href="tel:+233506063217">+233 50 606 3217</a></h4>
                            </div>
                        </div>
                        <div className="info-card style2">
                            <div className="box-icon bg-theme2"><i className="fal fa-envelope-open"></i></div>
                            <div className="box-content">
                                <p className="box-text">Email us</p>
                                <h4 className="box-title"><a href="mailto:enactus@cktutas.edu.gh">enactus@cktutas.edu.gh</a></h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <form className="contact-form">
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <input type="text" className="form-control" name="name" placeholder="Name" />
                                </div>
                                <div className="form-group col-md-6">
                                    <input type="email" className="form-control" name="email" placeholder="Email" />
                                </div>
                                <div className="form-group col-12">
                                    <input type="text" className="form-control" name="subject" placeholder="Subject" />
                                </div>
                                <div className="form-group col-12">
                                    <textarea className="form-control" name="message" rows="5" placeholder="Message" />
                                </div>
                                <div className="form-group col-12">
                                    <button className="th-btn style3" type="submit">Send Message</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;




