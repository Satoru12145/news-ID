'use client';
import { useEffect, useState } from 'react';
import NewsLayout from '../components/news-layout';
import { PropsNews } from '../context/props-type-news';
import { generateApiUrlTech } from '../context/api-utils';

export default function Tech() {
  const isClient = typeof window !== 'undefined';
  const [newsTech, setNewsTech] = useState([]);
  const [typeNewsData] = useState(() => {
    return isClient ? localStorage.getItem('newsCategory') || 'cnn' : 'cnn';
  });
  const apiUrl = generateApiUrlTech(typeNewsData);
  const handleDataNews = async () => {
    try {
      const res = await fetch(apiUrl);
      const newsData = res ? await res.json() : null;
      setNewsTech(newsData.data.posts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleDataNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeNewsData]);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-2 max-w-8xl mx-auto">
      {newsTech.map((news: PropsNews, idx: number) => {
        return (
          <div key={idx}>
            <NewsLayout
              newsLink={news.link}
              image={news.thumbnail}
              description={news.description}
              date={news.pubDate}
            />
          </div>
        );
      })}
    </div>
  );
}
