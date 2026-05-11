import React from 'react'

export default function CompetitionDetails() {
    return (
        <section className="space" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-9">
                        <div className="title-area text-center">
                            <span className="sub-title after-none before-none">
                                <i className="far fa-heart text-theme"></i> Enactus Annual Competition
                            </span>
                            <h1 className="sec-title">Competition Details</h1>
                            <p className="sec-text">Everything you need to know about our annual Enactus competition.</p>
                        </div>

                        <div className="card p-4 mb-30">
                            <h3 className="box-title mb-10">Areas of Focus</h3>
                            <ul className="list-unstyled ms-3 mb-0">
                                <li>• Entrepreneurship and innovation for good</li>
                                <li>• Sustainable development and circular economy</li>
                                <li>• Financial inclusion and livelihoods</li>
                                <li>• Health, education, and community development</li>
                                <li>• Climate action, clean water, and sanitation</li>
                            </ul>
                        </div>

                        <div className="row g-3 mb-30">
                            <div className="col-md-6">
                                <div className="card p-4 h-100">
                                    <h3 className="box-title mb-10">Eligibility</h3>
                                    <p className="mb-0">Open to tertiary students in the Upper East Region. Individuals and team entries are allowed.</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card p-4 h-100">
                                    <h3 className="box-title mb-10">Format</h3>
                                    <ul className="mb-0 ms-3">
                                        <li>• 5–8 minute pitch + Q&A</li>
                                        <li>• Judges score on impact, feasibility, sustainability</li>
                                        <li>• Top finalists receive mentorship and support</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="card p-4 mb-30">
                            <h3 className="box-title mb-10">Top 3 Projects (Latest Edition)</h3>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="p-3 rounded h-100" style={{ background: '#f8faff' }}>
                                        <h4 className="h5 mb-5">1st Place</h4>
                                        <p className="mb-1"><strong>Project:</strong> Project Alpha</p>
                                        <p className="mb-1"><strong>Team:</strong> Team Horizon</p>
                                        <p className="mb-0">A brief description of the winning solution and its impact.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded h-100" style={{ background: '#f8faff' }}>
                                        <h4 className="h5 mb-5">2nd Place</h4>
                                        <p className="mb-1"><strong>Project:</strong> Project Beta</p>
                                        <p className="mb-1"><strong>Team:</strong> Team Catalyst</p>
                                        <p className="mb-0">A concise description of the project and the community it serves.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded h-100" style={{ background: '#f8faff' }}>
                                        <h4 className="h5 mb-5">3rd Place</h4>
                                        <p className="mb-1"><strong>Project:</strong> Project Gamma</p>
                                        <p className="mb-1"><strong>Team:</strong> Team Nova</p>
                                        <p className="mb-0">Short description highlighting the solution and expected outcomes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <a href="/competition/2026" className="th-btn">See 2026 Pitching Competition</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


