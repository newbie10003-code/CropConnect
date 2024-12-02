const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });
const FormData = require('form-data');
require('dotenv').config();
const fetch = require('node-fetch');

const jwt_secret = process.env.JWT_SECRET;
const resetTokenSecret = process.env.RESET_TOKEN_SECRET;

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: 'https://crop--connect.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Allow credentials (cookies, headers)
};
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, '../public')));

//mongoose.connect("mongodb://127.0.0.1/cropdb");

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const loginSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const Login = mongoose.model("login", loginSchema);

const accountSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    type: { 
        type: String,
        enum: ['farmer', 'customer'],
        required: true
    },
    gender: String,
    age: Number,
    country: String,
    address: String,
    password: String,
    repassword: String,
    tokens: [{
        t: {
            type: String,
            required: true
        }
    }],
    resetToken: String,
    resetTokenExpire: Date 
});
const Account = mongoose.model("Account", accountSchema);

const querySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    query: { type: String, required: true },
  });
const Query = mongoose.model("Query", querySchema);

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    dateSubscribed: {
        type: Date,
        default: Date.now
    }
});
const Newsletter = mongoose.model("Newsletter", newsletterSchema);

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        },
        name: String,
        image: String,
        price: Number,
        mrp: Number,
        size: String
    }]
});
const Cart = mongoose.model("Cart", cartSchema);

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    mrp: { 
      type: Number,
      required: true,
    },
    image: [{ 
      type: String,
      required: true,
    }],
    rating: {
      type: Number,
      required: true,
    },
    discount: {
      type: String,
      required: true,
    },
    details:[{
        type: String,
        required: true
    }],
    stock: {
      type: Number,
      default: 0, 
    },
    category: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Product = mongoose.model('Product', productSchema);

 /* Product.insertMany(sampleProducts)
  .then(() => console.log('Sample products added successfully'))
  .catch(err => console.error('Error inserting sample products:', err));
*/

  /*Product.insertMany(sampleProducts)
    .then(() => console.log("Sample products added"))
    .catch(err => console.error(err));
  */

const blogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    blog: [{
        userName: { type: String, required: true },
        productName: { type: String, required: true },
        description: { type: String, required: true },
        imgSrc: {
            data: Buffer,
            contentType: String,
        },
        createdAt: { type: Date, default: Date.now }
    }]
});

const Blog = mongoose.model('Blog', blogSchema);

const validateEmail = (req, res, next) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    next(); 
};

const validatePhone = (req, res, next) => {
    const phoneRegex = /^\d{10}$/; 
    if (!phoneRegex.test(req.body.phone)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
    }
    next();
};

function validateToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;  // Invalid token
    }
}

app.post('/validate-token', (req, res) => {
    const { token } = req.body;

    const user = validateToken(token);
    if (user) {
        return res.json(user);  // User details
    } else {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
});


app.post("/login", async (req, res) => {
    const { name, password } = req.body;
    const user = await Account.findOne({ name });

    if (!user) {
        return res.status(400).json({ success: false, message: "User not registered!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        const token = jwt.sign({ _id: user._id, name: user.name, type: user.type }, jwt_secret, { expiresIn: '2h' });
        
        res.cookie("jwt", token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000, secure: false });
        res.cookie("isLoggedIn", true, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000, secure: false });

        return res.status(200).json({ 
            success: true, 
            message: "Login successful!", 
            user: { 
                name: user.name, 
                type: user.type 
            } 
        });
    } else {
        return res.status(400).json({ success: false, message: "Invalid credentials!" });
    }
});


app.post('/logout', (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(0), 
        httpOnly: true,  
        secure: false,
    });
    
    res.cookie('isLoggedIn', '', {
        expires: new Date(0),
        secure: false,
    });
    res.status(200).json({ message: 'Logged out successfully' });
});


app.post("/signup", validateEmail, async (req, res) => {
    try {
        const { name, email, number, gender, age, country, address, password, confirmpassword, type } = req.body;

        // Check for valid user type
        if (!['farmer', 'customer'].includes(type)) {
            return res.status(400).json({ message: 'User type must be either "farmer" or "customer"' });
        }

        const existingUser = await Account.findOne({ $or: [{ name }, { phone: number }, { email }] });

        if (existingUser) {
            if (existingUser.name === name) {
                return res.status(400).json({ message: 'Username is already taken' });
            } else if (existingUser.phone === number) {
                return res.status(400).json({ message: 'Phone number is already registered' });
            } else if (existingUser.email === email) {
                return res.status(400).json({ message: 'Email is already registered' });
            }
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
            });
        }

        const hash_password = await bcrypt.hash(password, 10);

        const newuser = new Account({
            name,
            email,
            phone: number,
            gender,
            age,
            country,
            address,
            type, // Set user type
            password: hash_password,
            repassword: hash_password
        });

        const token = jwt.sign({ _id: newuser._id, name: newuser.name, type: newuser.type }, jwt_secret, { expiresIn: '2h' });
        newuser.tokens = newuser.tokens.concat({ t: token });

        res.cookie("jwt", token, { httpOnly: true });
        await newuser.save();

        return res.status(201).json({ success: true, message: `Account created as ${type} and logged in` });

    } catch (error) {
        console.error('Error during signup:', error);

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already registered` });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(', ') });
        }

        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});


app.post("/forgot-password", validateEmail, async (req, res) => {
    const { email } = req.body;
    const user = await Account.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ _id: user._id }, resetTokenSecret, { expiresIn: '1h' });
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 3600000; 
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
        from: 'krproject00@example.com',
        to: user.email,
        subject: 'Password Reset',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`
    };

    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error sending email' });
        }
        res.status(200).json({ message: 'Password reset link sent' });
    });
});


app.post("/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ message: "Token and password are required" });
        }

        const decoded = jwt.verify(token, jwt_secret);
        const user = await Account.findOne({
            _id: decoded._id,
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.repassword = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });

    } catch (error) {
        console.error("Error in /reset-password:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


app.post("/newsletter",async (req,res)=>{

    const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        const newSubscriber = new Newsletter({ email });
        await newSubscriber.save();

    const mailOptions = {
        from: 'krproject00@example.com',
        to: req.body.email,
        subject: 'NewsLetters Registration',
        html:'<div><h2>You have been registerd for newsletters,Get E-mails updates on our latest shop and special offers !!! </h2><img src="cid:unique" ></div>',
        attachments:[{
            filename:"6122731.jpg",
            path:"C:/Users/KAJAL/miniproject/public/images/6122731.jpg",
            cid:"unique",
        }]
    };

    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.redirect("/index.html");
})

app.use(cookieParser());
app.use(express.json());

const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log('Token received:', token);
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, jwt_secret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};


app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'An error occurred while fetching the products' });
    }
});

app.get('/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'An error occurred while fetching the product' });
    }
});
  

app.post("/cart/add", authenticateToken, async (req, res) => {
    const { productId, quantity, name, image, price, mrp, size } = req.body;
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            const itemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId && item.size === size
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity, name, image, price, mrp, size });
            }

            await cart.save();
        } else {
            const newCart = new Cart({
                userId,
                items: [{ productId, quantity, name, image, price, mrp, size }]
            });

            await newCart.save();
        }

        res.status(200).json({ message: 'Item added to cart' });

    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'An error occurred while adding to cart' });
    }
});

app.post("/cart/remove", authenticateToken, async (req, res) => {
    const { productId, size } = req.body;
    const userId = req.user._id;
    console.log('product: ', productId);
    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const updatedItems = cart.items.filter(
            item => item.productId.toString() !== productId || item.size !== size
        );

        if (updatedItems.length === cart.items.length) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items = updatedItems;
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart' });

    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'An error occurred while removing from cart' });
    }
});


app.post('/cart/update', authenticateToken, async (req, res) => {
    const { productId, quantity, size } = req.body;
    const userId = req.user._id;
    console.log('product: ', productId);
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId && item.size === size
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity > 0) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            cart.items.splice(itemIndex, 1); // Remove item if quantity is 0 or less
        }

        await cart.save();

        res.status(200).json({ message: 'Cart updated successfully', cart });

    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'An error occurred while updating the cart' });
    }
});

app.get("/cart", authenticateToken, async (req, res) => {
    const userId = req.user._id;
  
    try {
      const cart = await Cart.findOne({ userId });
  
      if (cart) {
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: 'Cart not found' });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'An error occurred while fetching the cart' });
    }
  });

  
  app.get('/check-auth', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
  });

  function userId(req, res, next) {
    const token = req.cookies.jwt;
    console.log('Token received:', token);  // Debugging: Log token received
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, jwt_secret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;  // Attach user details to the request
        next();
    });
}

// Crop disease prediction endpoint
app.post('/crop-disease', authenticateToken,upload.single('image'), userId, async (req, res) => {
    try {
        const userDetails = req.user;
        console.log('User details:', userDetails); 
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Prepare form-data with image and user details
        const formData = new FormData();
        formData.append('image', req.file.buffer, {
            filename: 'image.jpg',
            contentType: req.file.mimetype,
        });
        formData.append('user_details', JSON.stringify(userDetails));

        // Make a POST request to the Flask server
        const flaskResponse = await fetch('http://127.0.0.1:5001/crop-disease-predict', {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders(),
            timeout: 30000, 

        });

        if (!flaskResponse.ok) {
            const errorText = await flaskResponse.text();
            return res.status(400).json({ error: `Flask server error: ${errorText}` });
        }

        const predictionData = await flaskResponse.json();
        res.json({
            prediction: predictionData.prediction,
            download_url: predictionData.download_url, 
            message: 'Prediction successful'
        });
    } catch (error) {
        console.error('Error during prediction:', error);
        res.status(500).json({ error: 'An error occurred during prediction' });
    }
});
app.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await Account.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const userDetails = req.user;

        // Send JSON data in the body, not FormData
        const response = await fetch('http://127.0.0.1:5001/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Set Content-Type to application/json
            },
            body: JSON.stringify({ user_details: userDetails })  
        });

        if (!response.ok) {
            return res.status(500).json({ message: 'Failed to fetch reports from Flask server' });
        }

        const reportsData = await response.json();
        res.json({
            user,
            reports: reportsData.reports, 
        });
    } catch (error) {
        console.error('Error fetching user details, blogs, or reports:', error);
        res.status(500).json({ message: 'Error fetching user details, blogs, or reports' });
    }
});

app.post('/contact', async (req, res) => {
    try {
      const { name, email, phone, query } = req.body;
  
      if (!name || !email || !phone || !query) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      const newQuery = new Query({
        name,
        email,
        phone,
        query,
      });
  
      await newQuery.save();
  
      res.status(201).json({ message: 'Your query has been submitted successfully!' });
    } catch (error) {
      console.error('Error saving query:', error);
      res.status(500).json({ message: 'Failed to submit the query. Please try again later.' });
    }
  });
  
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
