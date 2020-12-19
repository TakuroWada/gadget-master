import React, { /* useState  , */ useEffect } from "react";
// import styles from "../assets/scss/RecommendedVideos.module.scss";
// import NoImage from "../assets/images/noimage.png";
//import axios from "axios";
//require("dotenv").config();
// const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

const RecommendedVideos: React.FC = () => {
  /*  const [videos, setVideos] = React.useState<any[]>([]);
  const [keyword, setKeyWord] = React.useState("ガジェット"); */

  useEffect(() => {
    //   /*  const url = `https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&q=${keyword}&maxResults=3&key=${YOUTUBE_API_KEY}`;
    //   axios
    //     .get(url)
    //     .then((response) => {
    //       setVideos(response.data.items);
    //     })
    //     .catch(() => {
    //       console.log("通信に失敗しました");
    //     }); */
  }, []);

  //console.log(videos);
  //const url = "https://www.youtube.com/embed/";

  return <p>test</p>;

  /*  (
    <div className={styles.video}>
      <h1 className={styles.title}>おすすめガジェット動画</h1>

      <div className={styles.video_list}>
        {videos.map((video) => (
          <div className={styles.video_card}>
            <iframe
              className={styles.video_img}
              title={video.id.title}
              id="ytplayer"
              src={url + video.id.videoId}
            />
            <p className={styles.video_title}>{video.snippet.title}</p>
          </div>
        ))}
      </div>
    </div>
  ); */
};

export default RecommendedVideos;
