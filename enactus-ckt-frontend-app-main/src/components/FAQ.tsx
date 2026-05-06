import React from 'react';

const FAQ = () => {
    return (
        <div className="overflow-hidden space" id="faq-sec">
            <div className="container">
                <div className="row gy-60 align-items-center">
                    <div className="col-xl-7">
                        <div className="title-area">
                            <span className="sub-title after-none before-none">
                                <i className="far fa-heart text-theme"></i> FAQ
                            </span>
                            <h2 className="sec-title">Frequently Asked Questions</h2>
                            <p className="sec-text">
                                Find answers to common questions about our organization, programmes, and how you can get involved.
                            </p>
                        </div>
                        <div className="accordion" id="faqAccordion">
                            <div className="accordion-card style2">
                                <div className="accordion-header" id="collapse-item-1">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-1" aria-expanded="true" aria-controls="collapse-1">
                                        What are Enactus CKT-UTAS’s recent achievements?
                                    </button>
                                </div>
                                <div id="collapse-1" className="accordion-collapse collapse show" aria-labelledby="collapse-item-1" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        <p className="faq-text">
                                            We have won the Enactus National Expo four consecutive times from 2021 to 2024.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-card style2">
                                <div className="accordion-header" id="collapse-item-2">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-2" aria-expanded="false" aria-controls="collapse-2">
                                        How do I become a member?
                                    </button>
                                </div>
                                <div id="collapse-2" className="accordion-collapse collapse" aria-labelledby="collapse-item-2" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        <p className="faq-text">
                                            Purchase a form or voucher and attend an interview. Membership decisions are made after the interview.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-card style2">
                                <div className="accordion-header" id="collapse-item-3">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-3" aria-expanded="false" aria-controls="collapse-3">
                                        Do members pay dues?
                                    </button>
                                </div>
                                <div id="collapse-3" className="accordion-collapse collapse" aria-labelledby="collapse-item-3" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        <p className="faq-text">
                                            Yes. Members pay a small due per semester to support activities and operations.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-card style2">
                                <div className="accordion-header" id="collapse-item-4">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-4" aria-expanded="false" aria-controls="collapse-4">
                                        What SDGs does Enactus CKT-UTAS work on?
                                    </button>
                                </div>
                                <div id="collapse-4" className="accordion-collapse collapse" aria-labelledby="collapse-item-4" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        <p className="faq-text">
                                            We have tackled 13+ UN Sustainable Development Goals through our projects and community engagements.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-5">
                        <div className="faq-img-box2">
                            <div className="img1">
                                <img src="assets/img/normal/faq_2_1.png" alt="img" />
                            </div>
                            <div className="faq-img-shape">
                                <img src="assets/img/shape/faq-shape2-1.png" alt="img" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;

