'use client';
import { useEffect, useState, Suspense } from 'react';
import LoadingSkeleton from '../loading';
import { PropsNews } from '../context/props-type-news';
import NewsLayout from '../components/news-layout';
import { useSearchParams } from 'next/navigation';
import { categoryMapping } from '../context/category-mapping-news';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

export default function Search() {
  const isClient = typeof window !== 'undefined';
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [newsCategory] = useState(() => {
    return isClient ? localStorage.getItem('newsCategory') || 'cnn' : 'cnn';
  });
  const [news, setNews] = useState<PropsNews[]>([]);

  const handlerNewsData = async () => {
    try {
      const url = categoryMapping[newsCategory] || categoryMapping[''];
      const res = await fetch(url);
      const newsData = await res.json();
      setNews(newsData.data.posts);
    } catch (error) {
      console.log(error);
    }
  };
  const filterNewsData = news.filter((news) => {
    return query && news.description.toLowerCase().includes(query);
  });
  useEffect(() => {
    handlerNewsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsCategory]);
  const newsDataNotFound = filterNewsData.length === 0;
  return (
    <div>
      <Suspense fallback={<LoadingSkeleton />}>
        {newsDataNotFound ? (
          <div className="mx-auto flex flex-col items-center font-mono mt-24">
            <h1 className="text-2xl font-bold italic">Oopps News Not Found</h1>
            <ExclamationCircleIcon className="w-32 h-30 mt-2 text-red-400" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-2 max-w-8xl mx-auto">
            {filterNewsData.map((news: PropsNews, idx: number) => {
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
        )}
      </Suspense>
    </div>
  );
}
