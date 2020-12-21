import React, { useEffect } from "react";
import styles from "../assets/scss/RecommendedVideos.module.scss";
import axios from "axios";
require("dotenv").config();
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
interface VIDEOS {
  id: string;
  title: string;
}

const localVideos: VIDEOS[] = [
  {
    id: "hIWvWiARjfk",
    title:
      "Realme 7 Pro 開封レビュー！2.9万円でコスパ最強スマホがバカ売れ中！？有機EL 65W急速充電 クアッドカメラ ステレオスピーカー",
  },
  {
    id: "SrnLZra9FW0",
    title:
      "こんなスマホが欲しい！ガジェット好きの理想のスマホ=(Pixel+iPhone+Xperia)÷3",
  },
  {
    id: "RWEw2Vrt-6s",
    title: "QZT 超小型カメラ 型番：L27",
  },
  {
    id: "eDaNRWm0RFQ",
    title: "【オンライン スマホ活用講座】Androidスマホ入門編　Wi-Fiの設定",
  },
  {
    id: "VCKNUKjmT2Q",
    title: "【オンライン スマホ活用講座】Androidスマホ入門編　メールについて",
  },
  {
    id: "MghTPppIO0A",
    title: "おすすめガジェット3つ紹介！キーボードとかイヤホンとか！",
  },
];

const RecommendedVideos: React.FC = () => {
  const [videos, setVideos] = React.useState<any[]>([]);
  const keyword = "ガジェット + PC | カメラ | イヤホン | 最新 | スマホ";

  useEffect(() => {
    const url = `https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&order=date&categoryId=GCU2NpZW5jZSAmIEVkdWNhdGlvbg&q=${keyword}&maxResults=12&key=${YOUTUBE_API_KEY}`;

    axios
      .get(url)
      .then((response) => {
        setVideos(response.data.items);
      })
      .catch(() => {
        console.log("通信に失敗しました");
      });
  }, []);

  const url = "https://www.youtube.com/embed/";

  return (
    <div className={styles.video}>
      <h1 className={styles.title}>おすすめガジェット動画</h1>
      <div className={styles.video_list}>
        {videos !== []
          ? videos.map((video) => (
              <div className={styles.video_card}>
                <iframe
                  className={styles.video_img}
                  title={video.snippet.title}
                  id="ytplayer"
                  src={url + video.id.videoId}
                />
                <p className={styles.video_title}>{video.snippet.title}</p>
              </div>
            ))
          : localVideos.map((video) => (
              <div className={styles.video_card}>
                <iframe
                  className={styles.video_img}
                  title={video.title}
                  id="ytplayer"
                  src={url + video.id}
                />
                <p className={styles.video_title}>{video.title}</p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default RecommendedVideos;
