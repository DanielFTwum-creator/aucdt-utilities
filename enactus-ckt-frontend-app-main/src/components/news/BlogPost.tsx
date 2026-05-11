import React from 'react'
import { useParams, Link } from 'react-router-dom'

const posts = {
    'presidency-invite-2024': {
        title: 'Enactus CKT-UTAS visits Jubilee House after National Win',
        date: 'August 2024',
        tag: 'Recognition',
        hero: '/assets/img/president/IMG_5059.JPG',
        content: (
            <>
                <p>
                    After winning the 2024 Enactus National Expo, Enactus CKT-UTAS received an invitation from
                    H.E. Nana Addo Dankwa Akufo-Addo to the Jubilee House. The visit recognized the team’s
                    achievements and reaffirmed national support for youth-led innovation.
                </p>
                <p>
                    Discussions centered on scaling impactful student-led ventures across regions and strengthening
                    university-industry-government collaboration.
                </p>
            </>
        ),
    },
    'menstrual-health-outreach-2025': {
        title: 'Menstrual Health Outreach at Adabayeri JHS, Navrongo',
        date: 'June 2025',
        tag: 'Health',
        hero: '/assets/img/outreach/IMG_4864.jpg',
        content: (
            <>
                <p>
                    We visited Adabayeri JHS in the Upper East Region, Navrongo, to sensitize students on menstrual
                    health and hygiene. As part of the engagement, we distributed sanitary pads and educational
                    materials.
                </p>
                <p>
                    The outreach is part of our broader commitment to SDG 3 (Good Health and Well-being) and SDG 5
                    (Gender Equality).
                </p>
            </>
        ),
    },
    'hand-over-ceremony-2025': {
        title: 'Handover Ceremony, Awards & Dinner Night',
        date: 'July 2025',
        tag: 'Community',
        hero: '/assets/img/celebration/IMG_3610.jpg',
        content: (
            <>
                <p>
                    Enactus CKT-UTAS held its handover ceremony, awards, and dinner night to celebrate an impactful
                    year and usher in a new leadership team. Outstanding members and project leaders were recognized
                    for excellence and service.
                </p>
                <p>
                    The event marked the climax of the academic year and set the tone for new initiatives.
                </p>
            </>
        ),
    },
}

export default function BlogPost() {
    const { slug } = useParams()
    const post = posts[slug]

    if (!post) {
        return (
            <section className="space">
                <div className="container text-center">
                    <h1 className="sec-title">Post not found</h1>
                    <Link to="/blog" className="th-btn mt-2">Back to Blog</Link>
                </div>
            </section>
        )
    }

    return (
        <section className="space" data-bg-src="assets/img/bg/gray-bg2.png">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-9">
                        <div className="title-area text-center">
                            <span className="sub-title after-none before-none">
                                <i className="far fa-heart text-theme"></i> {post.tag}
                            </span>
                            <h1 className="sec-title">{post.title}</h1>
                            <div className="blog-meta"><i className="fas fa-calendar-days"></i> {post.date}</div>
                        </div>
                        <div className="mb-30">
                            <img src={post.hero} alt={post.title} style={{ width: '100%', borderRadius: 12 }} />
                        </div>
                        <div className="content">
                            {post.content}
                        </div>
                        <div className="text-center mt-30">
                            <Link to="/blog" className="th-btn">Back to Blog</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


