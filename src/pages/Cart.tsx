import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
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
  price: number;
  image: string;
  stock: number;
}

interface CartItemWithBook {
  bookId: string;
  quantity: number;
  book: Book;
}

export function Cart() {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart } = useCart();
  const { user, accessToken } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCartItems();
  }, [cart, user]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const items = await Promise.all(
        cart.map(async (item) => {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-d046f807/books/${item.bookId}`,
            {
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`
              }
            }
          );
          const book = await response.json();
          return { ...item, book };
        })
      );
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (bookId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(bookId, newQuantity);
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const handleRemove = async (bookId: string) => {
    try {
      await removeFromCart(bookId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      const items = cartItems.map(item => ({
        bookId: item.bookId,
        title: item.book.title,
        quantity: item.quantity,
        price: item.book.price
      }));

      const total = cartItems.reduce(
        (sum, item) => sum + item.book.price * item.quantity,
        0
      );

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d046f807/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            items,
            total,
            shippingAddress: 'Default Address' // In a real app, collect this from user
          })
        }
      );

      if (response.ok) {
        toast.success('Order placed successfully!');
        navigate('/');
      } else {
        toast.error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-black mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some books to get started!</p>
          <Button
            onClick={() => navigate('/')}
            style={{ backgroundColor: '#CF8852' }}
            className="text-white hover:opacity-90"
          >
            Browse Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-black mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cartItems.map((item) => (
                <div
                  key={item.bookId}
                  className="flex gap-4 p-6 border-b border-gray-200 last:border-b-0"
                >
                  <ImageWithFallback
                    src={item.book.image}
                    alt={item.book.title}
                    className="w-24 h-32 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="text-black mb-1">{item.book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.book.author}</p>
                    <p className="text-black">₦{item.book.price.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.bookId)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>

                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => handleUpdateQuantity(item.bookId, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.bookId, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-black mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-black">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-black">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-black">Total</span>
                  <span className="text-black">₦{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                style={{ backgroundColor: '#CF8852' }}
                className="w-full text-white hover:opacity-90"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
