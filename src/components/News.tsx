import React, { useState, useEffect } from "react";
import styles from "../assets/scss/News.module.scss";
import NoImage from "../assets/images/noimage.png";

const News: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    getNews();
  }, []);

  const getNews = async () => {
    let url =
      "https://newsapi.org/v2/top-headlines?" +
      "country=jp&" +
      "category=technology&" +
      "apiKey=e7625c80fa734a29bde3884e86f62b0c";
    try {
      let req = new Request(url);
      const result = await fetch(req);
      const jsondata = await result.json();
      setNews(jsondata.articles);
      console.log(jsondata.articles);
    } catch (e) {
      console.log(e);
    }
  };

  const imageCheck = (imgUrl: string) => {
    return true;
  };

  return (
    <div className={styles.news}>
      <h1 className={styles.title}>TecNews</h1>
      <div className={styles.news_list}>
        {news.map((item) => (
          <div className={styles.news_card}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {imageCheck(item.urlToImage) ? (
                <img
                  className={styles.news_img}
                  src={item.urlToImage}
                  alt={item.title}
                />
              ) : (
                <img
                  className={styles.news_img}
                  src={NoImage}
                  alt={item.title}
                />
              )}

              <span className={styles.news_title}>{item.title}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
