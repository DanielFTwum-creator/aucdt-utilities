import React from 'react';

const Video = () => {
    return (
        <div className="video-area-3">
            <div className="shape-mockup video-bg-shape3-1" data-top="0" data-left="0" data-bottom="0">
                <img src="assets/img/shape/video_bg_shape3_1.png" alt="img" />
            </div>
            <div className="shape-mockup video-bg-shape3-2" data-top="0" data-right="0" data-bottom="0">
                <img src="assets/img/shape/video_bg_shape3_2.png" alt="img" />
            </div>
            <div className="video-thumb3-1 video-box-center">
                <img src="assets/img/normal/video-thumb3-1.png" alt="img" />
                <a href="https://www.youtube.com/watch?v=_sI_Ps7JSEk" className="play-btn style7 popup-video">
                    <i className="fa-sharp fa-solid fa-play"></i>
                </a>
            </div>
        </div>
    );
};

export default Video;

