import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '../components/ui/input';
import { BookCard } from '../components/BookCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
}

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchBooks();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d046f807/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error searching books:', error);
      toast.error('Failed to search books');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (bookId: string) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(bookId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-black mb-8">Search Books</h1>

        <div className="relative mb-8">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by title, author, or genre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Searching...</p>
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No books found for "{query}"</p>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <p className="text-gray-600 mb-6">Found {results.length} results</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map(book => (
                <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
