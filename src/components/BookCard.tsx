import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

interface BookCardProps {
  book: Book;
  onAddToCart?: (bookId: string) => void;
}

export function BookCard({ book, onAddToCart }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/book/${book.id}`}>
        <ImageWithFallback
          src={book.image}
          alt={book.title}
          className="w-full h-64 object-cover"
        />
      </Link>
      
      <div className="p-4">
        <Link to={`/book/${book.id}`}>
          <h3 className="text-black mb-1 hover:underline line-clamp-1">{book.title}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-current text-yellow-500" />
          <span className="text-sm">{book.rating}</span>
          <span className="text-sm text-gray-500">({book.reviews})</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-black">₦{book.price.toLocaleString()}</span>
        </div>

        <div className="flex gap-2">
          <Link to={`/book/${book.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              style={{ borderColor: '#CF8852', color: '#CF8852' }}
            >
              <Eye className="w-4 h-4 mr-1" />
              Details
            </Button>
          </Link>
          {onAddToCart && (
            <Button
              size="sm"
              style={{ backgroundColor: '#CF8852' }}
              className="text-white hover:opacity-90 flex-1"
              onClick={() => onAddToCart(book.id)}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}