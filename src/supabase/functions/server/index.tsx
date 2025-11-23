import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors())
app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Initialize books data
app.get('/make-server-d046f807/init-books', async (c) => {
  try {
    const existing = await kv.get('books_initialized')
    if (existing) {
      return c.json({ message: 'Books already initialized' })
    }

    const books = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        price: 2500,
        description: 'A classic novel set in the Jazz Age that explores themes of decadence, idealism, resistance to change, and excess. The story primarily concerns the young and mysterious millionaire Jay Gatsby and his quixotic passion for the beautiful Daisy Buchanan.',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        stock: 15,
        rating: 4.5,
        reviews: 328
      },
      {
        id: '2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        price: 3000,
        description: 'A gripping tale of racial inequality and childhood innocence. The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        stock: 20,
        rating: 4.8,
        reviews: 456
      },
      {
        id: '3',
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        price: 4500,
        description: 'An epic high-fantasy novel that follows the hobbit Frodo Baggins as he and the Fellowship embark on a quest to destroy the One Ring and ensure the destruction of its maker, the Dark Lord Sauron.',
        image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
        stock: 12,
        rating: 4.9,
        reviews: 892
      },
      {
        id: '4',
        title: '1984',
        author: 'George Orwell',
        genre: 'Science Fiction',
        price: 2800,
        description: 'A dystopian social science fiction novel that follows the life of Winston Smith, a low-ranking member of "the Party," who is frustrated by the omnipresent eyes of the party.',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
        stock: 18,
        rating: 4.7,
        reviews: 672
      },
      {
        id: '5',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        price: 2200,
        description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet, the protagonist of the book, who learns about the repercussions of hasty judgments.',
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        stock: 25,
        rating: 4.6,
        reviews: 534
      },
      {
        id: '6',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        price: 3200,
        description: 'A fantasy novel that follows the quest of home-loving Bilbo Baggins, the hobbit, to win a share of the treasure guarded by Smaug the dragon.',
        image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
        stock: 22,
        rating: 4.8,
        reviews: 721
      },
      {
        id: '7',
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        price: 3500,
        description: 'The first novel in the Harry Potter series follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday.',
        image: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=400',
        stock: 30,
        rating: 4.9,
        reviews: 1024
      },
      {
        id: '8',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        genre: 'Fiction',
        price: 2400,
        description: 'A story about a few days in the life of a troubled teenager, Holden Caulfield, who has been expelled from prep school and is wandering around New York City.',
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
        stock: 16,
        rating: 4.3,
        reviews: 389
      },
      {
        id: '9',
        title: 'The Chronicles of Narnia',
        author: 'C.S. Lewis',
        genre: 'Fantasy',
        price: 4000,
        description: 'A series of seven fantasy novels that narrate the history of the magical land of Narnia and the adventures of various children who play central roles.',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        stock: 14,
        rating: 4.7,
        reviews: 645
      },
      {
        id: '10',
        title: 'Brave New World',
        author: 'Aldous Huxley',
        genre: 'Science Fiction',
        price: 2600,
        description: 'A dystopian novel set in a futuristic World State, whose citizens are environmentally engineered into an intelligence-based social hierarchy.',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
        stock: 19,
        rating: 4.4,
        reviews: 412
      },
      {
        id: '11',
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        genre: 'Fiction',
        price: 1500,
        description: 'A philosophical book that tells the story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.',
        image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
        stock: 28,
        rating: 4.6,
        reviews: 567
      },
      {
        id: '12',
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Science Fiction',
        price: 3800,
        description: 'A science fiction novel set in the distant future amidst a huge interstellar empire, telling the story of young Paul Atreides.',
        image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400',
        stock: 17,
        rating: 4.8,
        reviews: 789
      },
      {
        id: '13',
        title: 'The Book Thief',
        author: 'Markus Zusak',
        genre: 'Historical Fiction',
        price: 3100,
        description: 'Set in Nazi Germany, it tells the story of Liesel Meminger, a young girl living with her foster family who steals books to share with others.',
        image: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400',
        stock: 21,
        rating: 4.7,
        reviews: 623
      },
      {
        id: '14',
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        genre: 'Science Fiction',
        price: 2900,
        description: 'A dystopian novel about a young girl who volunteers to participate in a televised death match in order to save her sister.',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        stock: 24,
        rating: 4.5,
        reviews: 891
      },
      {
        id: '15',
        title: 'The Fault in Our Stars',
        author: 'John Green',
        genre: 'Romance',
        price: 2300,
        description: 'A touching story about two teenage cancer patients who fall in love after meeting at a support group.',
        image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400',
        stock: 26,
        rating: 4.4,
        reviews: 734
      },
      {
        id: '16',
        title: 'The Da Vinci Code',
        author: 'Dan Brown',
        genre: 'Mystery',
        price: 3300,
        description: 'A mystery thriller novel that follows symbologist Robert Langdon as he investigates a murder in the Louvre Museum.',
        image: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400',
        stock: 20,
        rating: 4.2,
        reviews: 512
      },
      {
        id: '17',
        title: 'The Girl with the Dragon Tattoo',
        author: 'Stieg Larsson',
        genre: 'Mystery',
        price: 3400,
        description: 'A psychological thriller about a journalist and a computer hacker who investigate a 40-year-old disappearance.',
        image: 'https://images.unsplash.com/photo-1485322551133-3a4c27a9d925?w=400',
        stock: 18,
        rating: 4.5,
        reviews: 678
      },
      {
        id: '18',
        title: 'The Kite Runner',
        author: 'Khaled Hosseini',
        genre: 'Historical Fiction',
        price: 2700,
        description: 'A powerful story of friendship set against the backdrop of tumultuous events in Afghanistan.',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        stock: 23,
        rating: 4.6,
        reviews: 589
      },
      {
        id: '19',
        title: 'The Help',
        author: 'Kathryn Stockett',
        genre: 'Historical Fiction',
        price: 2800,
        description: 'Set in Mississippi during the 1960s, the story follows three women who dare to cross boundaries.',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        stock: 19,
        rating: 4.7,
        reviews: 612
      },
      {
        id: '20',
        title: 'Gone Girl',
        author: 'Gillian Flynn',
        genre: 'Mystery',
        price: 3200,
        description: 'A psychological thriller about a woman who goes missing on her fifth wedding anniversary.',
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        stock: 22,
        rating: 4.3,
        reviews: 701
      },
      {
        id: '21',
        title: 'The Handmaid\'s Tale',
        author: 'Margaret Atwood',
        genre: 'Science Fiction',
        price: 2900,
        description: 'A dystopian novel set in a totalitarian society where women have been stripped of all their rights.',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        stock: 17,
        rating: 4.6,
        reviews: 534
      },
      {
        id: '22',
        title: 'The Road',
        author: 'Cormac McCarthy',
        genre: 'Science Fiction',
        price: 2500,
        description: 'A post-apocalyptic novel following a father and son as they journey through a devastated landscape.',
        image: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=400',
        stock: 15,
        rating: 4.4,
        reviews: 445
      }
    ]

    await kv.set('books', books)
    await kv.set('books_initialized', true)
    
    return c.json({ message: 'Books initialized successfully', count: books.length })
  } catch (error) {
    console.log('Error initializing books:', error)
    return c.json({ error: 'Failed to initialize books' }, 500)
  }
})

// Get all books
app.get('/make-server-d046f807/books', async (c) => {
  try {
    const books = await kv.get('books') || []
    return c.json(books)
  } catch (error) {
    console.log('Error fetching books:', error)
    return c.json({ error: 'Failed to fetch books' }, 500)
  }
})

// Get single book
app.get('/make-server-d046f807/books/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const books = await kv.get('books') || []
    const book = books.find((b: any) => b.id === id)
    
    if (!book) {
      return c.json({ error: 'Book not found' }, 404)
    }
    
    return c.json(book)
  } catch (error) {
    console.log('Error fetching book:', error)
    return c.json({ error: 'Failed to fetch book' }, 500)
  }
})

// Search books
app.get('/make-server-d046f807/search', async (c) => {
  try {
    const query = c.req.query('q')?.toLowerCase() || ''
    const books = await kv.get('books') || []
    
    const results = books.filter((book: any) => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query)
    )
    
    return c.json(results)
  } catch (error) {
    console.log('Error searching books:', error)
    return c.json({ error: 'Failed to search books' }, 500)
  }
})

// User registration
app.post('/make-server-d046f807/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })
    
    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }
    
    return c.json({ user: data.user })
  } catch (error) {
    console.log('Error during signup:', error)
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

// Get user cart
app.get('/make-server-d046f807/cart', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const cart = await kv.get(`cart:${user.id}`) || []
    return c.json(cart)
  } catch (error) {
    console.log('Error fetching cart:', error)
    return c.json({ error: 'Failed to fetch cart' }, 500)
  }
})

// Add to cart
app.post('/make-server-d046f807/cart', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const { bookId, quantity } = await c.req.json()
    const cart = await kv.get(`cart:${user.id}`) || []
    
    const existingItem = cart.find((item: any) => item.bookId === bookId)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ bookId, quantity })
    }
    
    await kv.set(`cart:${user.id}`, cart)
    return c.json(cart)
  } catch (error) {
    console.log('Error adding to cart:', error)
    return c.json({ error: 'Failed to add to cart' }, 500)
  }
})

// Update cart item
app.put('/make-server-d046f807/cart/:bookId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const bookId = c.req.param('bookId')
    const { quantity } = await c.req.json()
    const cart = await kv.get(`cart:${user.id}`) || []
    
    const item = cart.find((item: any) => item.bookId === bookId)
    if (item) {
      item.quantity = quantity
      await kv.set(`cart:${user.id}`, cart)
    }
    
    return c.json(cart)
  } catch (error) {
    console.log('Error updating cart:', error)
    return c.json({ error: 'Failed to update cart' }, 500)
  }
})

// Remove from cart
app.delete('/make-server-d046f807/cart/:bookId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const bookId = c.req.param('bookId')
    const cart = await kv.get(`cart:${user.id}`) || []
    
    const updatedCart = cart.filter((item: any) => item.bookId !== bookId)
    await kv.set(`cart:${user.id}`, updatedCart)
    
    return c.json(updatedCart)
  } catch (error) {
    console.log('Error removing from cart:', error)
    return c.json({ error: 'Failed to remove from cart' }, 500)
  }
})

// Create order
app.post('/make-server-d046f807/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const { items, total, shippingAddress } = await c.req.json()
    
    const orders = await kv.get(`orders:${user.id}`) || []
    const order = {
      id: `order-${Date.now()}`,
      userId: user.id,
      items,
      total,
      shippingAddress,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    orders.push(order)
    await kv.set(`orders:${user.id}`, orders)
    
    // Clear cart after order
    await kv.set(`cart:${user.id}`, [])
    
    return c.json(order)
  } catch (error) {
    console.log('Error creating order:', error)
    return c.json({ error: 'Failed to create order' }, 500)
  }
})

// Get user orders
app.get('/make-server-d046f807/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const orders = await kv.get(`orders:${user.id}`) || []
    return c.json(orders)
  } catch (error) {
    console.log('Error fetching orders:', error)
    return c.json({ error: 'Failed to fetch orders' }, 500)
  }
})

Deno.serve(app.fetch)
