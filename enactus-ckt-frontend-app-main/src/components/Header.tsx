import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    return (
        <header className="th-header header-layout2">
            <div className="sticky-wrapper">
                {/* Main Menu Area */}
                <div className="container">
                    <div className="menu-area">
                        <div className="header-logo">
                            <Link to="/"><img src="/assets/img/logo/enactus.png?v=3" alt="Enactus CKT-UTAS" style={{height: '40px', width: 'auto'}} /></Link>
                        </div>
                        <div className="menu-area-wrap">
                            <nav className="main-menu d-none d-lg-block">
                                <ul>
                                    <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
                                    <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
                                    <li><NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>Projects</NavLink></li>
                                    <li><NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>Blog</NavLink></li>
                                    <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
                                </ul>
                            </nav>
                            <p className="header-notice">
                                {/* <img className="me-1" src="assets/img/icon/heart-icon.svg" alt="img" /> */}
                                Enactus CKT-UTAS: Student Social Entrepreneurs Driving Sustainable Impact.
                            </p>
                        </div>
                        <div className="header-button">
                            <Link to="/join" className="th-btn style3 d-xl-block d-none">
                                <i className="fas fa-heart me-2"></i>
                                Join Us
                            </Link>
                            <button type="button" className="icon-btn th-menu-toggle d-lg-none" onClick={() => setMobileOpen(true)} aria-label="Open Menu" aria-expanded={mobileOpen}>
                                <i className="far fa-bars"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-lg-none" style={{position:'fixed', inset:0, background: mobileOpen ? 'rgba(0,0,0,.4)' : 'transparent', pointerEvents: mobileOpen ? 'auto' : 'none', transition: 'background .2s ease'}} onClick={() => setMobileOpen(false)}>
                <nav role="navigation" aria-label="Mobile" style={{position:'absolute', top:0, right:0, height:'100%', width:'80%', maxWidth:320, background:'#fff', transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)', transition:'transform .2s ease', boxShadow:'0 0 20px rgba(0,0,0,.2)', padding:20}} onClick={(e)=>e.stopPropagation()}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <strong>Menu</strong>
                        <button type="button" className="icon-btn" onClick={() => setMobileOpen(false)} aria-label="Close Menu">
                            <i className="fal fa-times"></i>
                        </button>
                    </div>
                    <ul className="list-unstyled m-0">
                        <li className="mb-2"><NavLink to="/" onClick={() => setMobileOpen(false)} className={({isActive})=> isActive?'active':''}>Home</NavLink></li>
                        <li className="mb-2"><NavLink to="/about" onClick={() => setMobileOpen(false)} className={({isActive})=> isActive?'active':''}>About</NavLink></li>
                        <li className="mb-2"><NavLink to="/projects" onClick={() => setMobileOpen(false)} className={({isActive})=> isActive?'active':''}>Projects</NavLink></li>
                        <li className="mb-2"><NavLink to="/blog" onClick={() => setMobileOpen(false)} className={({isActive})=> isActive?'active':''}>Blog</NavLink></li>
                        <li className="mb-2"><NavLink to="/contact" onClick={() => setMobileOpen(false)} className={({isActive})=> isActive?'active':''}>Contact</NavLink></li>
                        <li className="mt-3"><Link to="/join" className="th-btn w-100" onClick={() => setMobileOpen(false)}>Join Us</Link></li>
                    </ul>
                </nav>
            </div> 
        </header>
    );
};

export default Header;

