import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { HeroCarousel } from '../components/HeroCarousel';
import { CollapsibleSection } from '../components/CollapsibleSection';
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

export function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    initializeBooks();
  }, []);

  const initializeBooks = async () => {
    try {
      // Initialize books data
      if (!initialized) {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-d046f807/init-books`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );
        setInitialized(true);
      }

      // Fetch books
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d046f807/books`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
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

  const featuredBooks = books.filter(book => book.rating >= 4.7);
  const bestsellers = books.filter(book => book.reviews > 600);
  const fictionBooks = books.filter(book => book.genre === 'Fiction');
  const fantasyBooks = books.filter(book => book.genre === 'Fantasy');
  const scienceFictionBooks = books.filter(book => book.genre === 'Science Fiction');
  const mysteryBooks = books.filter(book => book.genre === 'Mystery');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Products Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CollapsibleSection 
          title="Featured Books" 
          defaultExpanded={true}
          showViewAll={true}
          onViewAll={() => navigate('/products')}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.slice(0, 4).map(book => (
              <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Bestsellers" 
          defaultExpanded={true}
          showViewAll={true}
          onViewAll={() => navigate('/products')}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.slice(0, 4).map(book => (
              <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Fiction" 
          defaultExpanded={false}
          showViewAll={true}
          onViewAll={() => navigate('/products')}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fictionBooks.slice(0, 4).map(book => (
              <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Fantasy" 
          defaultExpanded={false}
          showViewAll={true}
          onViewAll={() => navigate('/products')}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fantasyBooks.slice(0, 4).map(book => (
              <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Science Fiction" 
          defaultExpanded={false}
          showViewAll={true}
          onViewAll={() => navigate('/products')}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {scienceFictionBooks.slice(0, 4).map(book => (
              <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Mystery & Thriller" 
          defaultExpanded={false}
          showViewAll={true}
          onViewAll={() => navigate('/products')}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mysteryBooks.slice(0, 4).map(book => (
              <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}