import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

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

export function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d046f807/books/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBook(data);
      } else {
        toast.error('Book not found');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(book!.id, quantity);
      toast.success(`Added ${quantity} book(s) to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ImageWithFallback
                src={book.image}
                alt={book.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-black mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(book.rating)
                          ? 'fill-current text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span>{book.rating}</span>
                <span className="text-gray-500">({book.reviews} reviews)</span>
              </div>

              <div className="mb-4">
                <span 
                  className="inline-block px-3 py-1 rounded-full text-white text-sm"
                  style={{ backgroundColor: '#CF8852' }}
                >
                  {book.genre}
                </span>
              </div>

              <p className="text-gray-700 mb-6">{book.description}</p>

              <div className="mb-6">
                <span className="text-3xl text-black">₦{book.price.toLocaleString()}</span>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                </p>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  style={{ backgroundColor: '#CF8852' }}
                  className="text-white hover:opacity-90 flex-1"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
