import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '0e177e2d43e349d6bda16c49b4e50781'; // Replace with your actual API key
const API_URL = 'https://newsapi.org/v2/top-headlines?language=en&pageSize=3'; // Changed pageSize to 3

interface NewsItem {
  title: string;
  url: string;
  urlToImage: string | null;
  source: {
    name: string;
  };
}

const WorldNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}&apiKey=${API_KEY}`);
        setNews(response.data.articles);
      } catch (err) {
        setError('Error fetching news. Please try again later.');
        console.error('Error fetching news:', err);
      }
    };

    fetchNews();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="world-news">
      {news.map((item, index) => (
        <div key={index} className="card mb-3">
          <div className="row g-0">
            {item.urlToImage && (
              <div className="col-md-4">
                <img src={item.urlToImage} className="img-fluid rounded-start" alt={item.title} style={{ objectFit: 'cover', height: '100%' }} />
              </div>
            )}
            <div className={item.urlToImage ? "col-md-8" : "col-md-12"}>
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">
                  <small className="text-muted">Source: {item.source.name}</small>
                </p>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorldNews;