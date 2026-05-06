import React from 'react';

const Brand = () => {
    return (
        <div className="bg-theme-dark overflow-hidden brand-area-1" data-mask-src="assets/img/shape/brand-bg-shape1.png">
            <div className="container">
                <div className="brand-wrap1 text-center">
                    <h3 className="brand-wrap-title text-white">
                        Over the years, these companies <span className="text-theme2"><span className="counter-number">Supported </span></span> us
                    </h3>
                    <div className="row g-3 justify-content-center align-items-center">
                        {[ 
                            { src: '/assets/img/brand/fidelity.png', alt: 'Fidelity' },
                            { src: '/assets/img/brand/GCB.png', alt: 'GCB' },
                            { src: '/assets/img/brand/republic.jpg', alt: 'Republic Bank' },
                            { src: '/assets/img/brand/SRC-RITSO.jpg', alt: 'SRC RITSO' },
                            { src: '/assets/img/brand/triteq.jpg', alt: 'Triteq' },
                        ].map((b, i) => (
                            <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={i}>
                                <div className="brand-box" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 16 }}>
                                    <img className="brand-logo" src={b.src} alt={b.alt} style={{ maxHeight: 50, width: 'auto' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Brand;

