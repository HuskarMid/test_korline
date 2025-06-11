"use client";

import { useGetNewsQuery } from "../model/api";
import { useCallback, useRef, useState, useEffect } from "react";
import { Loading } from "../../../shared/Loading/Loading";
import { NewsItem } from "@/modules/NewsItem";
import { NewsItemType } from "@/modules/NewsItem/ui/NewsItem";

interface DayGroup {
    day: string;
    posts: NewsItemType[];
}

const HomePage = () => {
    const { data, isLoading, error, refetch } = useGetNewsQuery({ year: 2023, month: 2 });
    const [step, setStep] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [postsPerDay, setPostsPerDay] = useState<{ [key: string]: number }>({});
    if(data) {
        console.log(data.response.docs[0]);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setStep(prev => prev + 1);
        setIsLoadingMore(false);
    };

    const handleLoadMorePosts = (day: string, totalPosts: number) => {
        setPostsPerDay(prev => {
            const currentCount = prev[day] || Math.ceil(totalPosts / 3);
            const nextCount = Math.min(currentCount + Math.ceil(totalPosts / 3), totalPosts);
            return {
                ...prev,
                [day]: nextCount
            };
        });
    };

    const prepairedData = useCallback(() => {
        if (!data?.response.docs) return [];
        
        const posts = data.response.docs.map((article: any): NewsItemType => ({
            title: article.source,
            text: article.abstract,
            time: article.pub_date,
            link: article.web_url
        }));

        const groupedByDay = posts.reduce((acc: { [key: string]: NewsItemType[] }, post: NewsItemType) => {
            const date = new Date(post.time);
            const dayKey = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
            
            if (!acc[dayKey]) {
                acc[dayKey] = [];
            }
            acc[dayKey].push(post);
            return acc;
        }, {});

        return Object.entries(groupedByDay).map(([day, posts]): DayGroup => ({
            day,
            posts: posts as NewsItemType[]
        }));
    }, [data]);

    const displayedArticles = prepairedData().slice(0, step + 1);
    const hasMore = step + 1 < prepairedData().length;

    const mainRef = useInterSection(handleLoadMore);
    const dayRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const day = entry.target.getAttribute('data-day');
                    const totalPosts = entry.target.getAttribute('data-total');
                    if (day && totalPosts) {
                        handleLoadMorePosts(day, parseInt(totalPosts));
                    }
                }
            });
        });

        Object.values(dayRefs.current).forEach(ref => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => observer.disconnect();
    }, [displayedArticles]);

    if (isLoading) {return <div className="flex justify-center items-center h-screen"><Loading /></div>;}
    if (error) {return <div>Ошибка при загрузке данных</div>;}
    if (!data) {return <div>Нет данных</div>;}

    return (
        <div>
            <div className="pl-[20px] pr-[20px]">
                {displayedArticles.map((dayGroup: DayGroup, index) => {
                    const totalPosts = dayGroup.posts.length;
                    const visibleCount = postsPerDay[dayGroup.day] || Math.ceil(totalPosts / 3);
                    const visiblePosts = dayGroup.posts.slice(0, visibleCount);
                    const hasMorePosts = visibleCount < totalPosts;

                    return (
                        <div key={index} className="mb-8">
                            <h2 className="text-xl font-bold mb-[11px] mt-[11px]">{`News for ` + dayGroup.day}</h2>
                            {visiblePosts.map((article: NewsItemType, postIndex: number) => (
                                <NewsItem key={`${index}-${postIndex}`} {...article} />
                            ))}
                            {hasMorePosts && (
                                <div 
                                    ref={(el: HTMLDivElement | null) => {
                                        dayRefs.current[dayGroup.day] = el;
                                    }}
                                    data-day={dayGroup.day}
                                    data-total={totalPosts}
                                    className="h-[20px] my-[20px]"
                                >
                                    {isLoadingMore && <div>Загрузка...</div>}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {hasMore && (
                <div ref={mainRef} className="h-[20px] my-[20px]">
                    {isLoadingMore && <div>Загрузка...</div>}
                </div>
            )}
        </div>
    );
};

export default HomePage;

export function useInterSection(onIntersect: () => void) {

  const unsubscribe = useRef(() => {});

  return useCallback((el: HTMLDivElement | null) => {
      const observer = new IntersectionObserver(entries => {
          entries.forEach(intersection => {
              if (intersection.isIntersecting) {
                  onIntersect();
              }
          })
      });
      if(el) {
          observer.observe(el);
          unsubscribe.current = () => observer.disconnect();
      } else {
          unsubscribe.current();
      }
  }, [])
}