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

require('dotenv').config();

const jwt_secret = process.env.JWT_SECRET;
const resetTokenSecret = process.env.RESET_TOKEN_SECRET;

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({ origin: 'http://localhost:3000', methods: 'GET,POST,DELETE', credentials: true }));

app.use(express.static(path.join(__dirname, '../public')));

mongoose.connect("mongodb://127.0.0.1/cropdb");

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
    name: String,
    email: String,
    phone: {
        type: String,
        unique: false
    },
    order: {
        type: String,
        unique: true
    },
    category: String,
    details: String
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

  const sampleProducts = [
    {
      name: "Ladies - Brown Rib-knit jumper",
      brand: "H&M",
      description: "Winter Collection New Modern Styles",
      price: 1049,
      mrp: 3498,
      image: [
        "https://adn-static1.nykaa.com/nykdesignstudio-images/tr:w-960,/pub/media/catalog/product/6/7/675e7b0ONLY-143654001_1.jpg?rnd=20200526195200",
        "https://adn-static1.nykaa.com/nykdesignstudio-images/tr:w-160,/pub/media/catalog/product/6/7/675e7b0ONLY-143654001_2.jpg?rnd=20200526195200",
        "https://adn-static1.nykaa.com/nykdesignstudio-images/tr:w-960,/pub/media/catalog/product/d/9/d9e87b0ONLY-143654002_1.jpg?rnd=20200526195200",
        "https://adn-static1.nykaa.com/nykdesignstudio-images/tr:w-160,/pub/media/catalog/product/d/9/d9e87b0ONLY-143654002_2.jpg?rnd=20200526195200"
      ],
      rating: 5,
      discount: "70% OFF",
      details:["Material: Cotton",
        "Pattern: Woven",
        "Occasion: Winter",
        "Closure Type: Drawstring",
        "Fit: Normal",
        "Neckline Type: Round Neck",
        "Sleeve Type: Full Sleeves",
        "Care Instructions: Wash With Similar Colors"
      ],
      category: "Jumper"
    },
    {
      name: "Women Burgundy Front-Open",
      brand: "Tokyo Talkies",
      description: "Winter Collection New Modern Styles",
      price: 899,
      mrp: 1999,
      image: [
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR6WBHr_YtMgyD2p_GKblmR4vmH4YMSkOtbB3SdRa18PUoKAyPGHYnqkZSCn2uCGlb5x8BLOmorvxMZHPAUtC1xVssXUX7ziTQ6LpqVItx5OEJ-aQdbHj2ifw&usqp=CAE"
      ],
      rating: 5,
      discount: "50% OFF",
      details:["Fabric-Polyester",
        "Length-Regular",
        "Manufacturing-Made in India"
      ],
      category: "Cardigan"
    },
    {
      name: "Winter Jackets Girls Hooded Hair Ball Wool Baby Clothes",
      brand: "H&M",
      description: "3 4 5 6 7 Years Toddler Kids",
      price: 1049,
      mrp: 3498,
      image: [
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRyBcNSu8wBwh9l4QWuYF-kCg-BISoXtCxJ40bDau69mmGcbN6q5p2xRW8OfMu1mHU54CI_Ciy-7YJugDwTCjXcvbFpTSFES4pZvyEpXOk&usqp=CAE"
      ],
      rating: 5,
      discount: "70% OFF",
      details:["Fabric-Polyester",
        "Length-Regular",
        "Manufacturing-Made in India"
      ],
      category: "Jacket"
    },
    {
      name: "Full Sleeve Solid Women Jacket",
      brand: "Christy World",
      description: "Winter Collection New Modern Styles",
      price: 399,
      mrp: 1499,
      image: [
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSbcI9yXfKgMc-eAOR9R_a9WJLtOZ377HdlQ00hz7t_nAe3kIVeM3pdz4JWJuKnj0VZN4QkrDlFmaHRvIUwes4Ezwcova9udjXBdhtGg5Gmu6_gYlyJKi-J&usqp=CAE"
      ],
      rating: 5,
      discount: "73% OFF",
      details:["Fabric-Polyester",
        "Length-Regular",
        "Manufacturing-Made in India"
      ],
      category: "Jacket"
    },
    {
      name: "Full Sleeves Woven Hooded Jacket - Off White",
      brand: "Babyhug",
      description: "Winter Collection New Modern Styles",
      price: 399,
      mrp: 1499,
      image: [
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQwbdqC-NIO8YqSyR92ToRAUUBL0ce950oRGgbMx3OQtedFlgWO8OBfx5w7ktwmAzLtDMPqfBYg0L3xGEBjPeWMdWKIVWDJ3TakxxNnRYwiUgon0gZ-hqEdnA&usqp=CAc"
      ],
      rating: 5,
      discount: "73% OFF",
      details:["Fabric-Polyester",
        "Length-Regular",
        "Manufacturing-Made in India"
      ],
      category: "Jacket"
    },
    {
      name: "Men Green Hooded Sweatshirt",
      brand: "HIGHLANDER",
      description: "Highlander Men Green Hooded Long Sleeve Pullover Sweat Shirt",
      price: 639,
      mrp: 1599,
      image: [
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcREs-013XOtUI6hZ_NOkUgHwe_fc2yaEk8nUN7zkTZ3zhazwKB376zA9WQP65A9p0czXqNdXrwsQ9xJ07M-goV8n-XdIMIFpwa2VRv_TR2SS0VLiVTwuFE__g&usqp=CAE",
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcREs-013XOtUI6hZ_NOkUgHwe_fc2yaEk8nUN7zkTZ3zhazwKB376zA9WQP65A9p0czXqNdXrwsQ9xJ07M-goV8n-XdIMIFpwa2VRv_TR2SS0VLiVTwuFE__g&usqp=CAE",
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRq9PKhu9BygtzTpPsaH5nwyYabMHkANHsUTvyXzW2B6Hm2ckl1FTRhAbofVRA1gjxfbLS71qu0zvG-bb7zuQUj_GnvlhIf",
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRyBeeh_LYAGzEXA0Zug7rrX9bYeTEDL26CsYUdq62Mv96A1QpbN4tPVeJpfDIuQHbu-wlRWaWrjVEF2DFWRGLV8C4g0gn-",
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQT8uIkX3ANcyDeV7EPf1o9eyxCXWC7TATl0KaYAGCQQ7vivtfQ6vWy7WGrWuDDO-WXmfZYOtdISnBNwOIDigqePnAnjxVyNQ"
      ],
      rating: 5,
      discount: "60% OFF",
      details:["Fabric-Polyester",
        "Sleeve Length-Long Sleeves",
        "Length-Regular",
        "Type-Pullover",
        "Manufacturing-Made in India"
      ],
      category: "T-shirt"
    },
    {
      name: "Black Solid Polyester Jacket For Men",
      brand: "Ben Martin",
      description: "Winter Collection New Modern Styles",
      price: 716,
      mrp: 899,
      image: [
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTUucg-FepC-pV9npDxFNql_v-DmzDT0oCGAon4t3BtV2O5fh95gj5GmwCGFdUzv8p4iXx0hEI-Y8YcYRJxZTmDofbXhE0M4AIkcDhglFk&usqp=CAE"
      ],
      rating: 5,
      discount: "20% OFF",
      category: "Jacket"
    },
    {
      name: "Baby / Toddler Trendy Stars Mesh Dress",
      brand: "YK",
      description: "Winter Collection New Modern Styles",
      price: 454,
      mrp: 1299,
      image: [
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSFzKeofBbt1LtBaqhraZegTNxpNfbsr5DnyB0ewQBhpUnDPId70_IEljjLgmoGAV17Q7N2tz8IC6RK1NUtC2UszhGVI05MU-QhHwtrdlYm"
      ],
      rating: 5,
      discount: "65% OFF",
      category: "Baby Dress"
    },
  ];
  
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
        res.cookie("isLoggedIn", true, { maxAge: 2 * 60 * 60 * 1000, secure: false });

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


  const storage = multer.memoryStorage();
  const upload = multer({ storage });
  
  app.post('/new-blog', authenticateToken, upload.single('image'), async (req, res) => {
    const { userName, productName, description } = req.body;
    const imgSrc = req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : { data: Buffer.from([]), contentType: '' };

    try {
        let blogDoc = await Blog.findOne({ userId: req.user._id });
        if (!blogDoc) {
            blogDoc = new Blog({ userId: req.user._id, blog: [] });
        }
        blogDoc.blog.push({
            userName,
            productName,
            description,
            imgSrc,
            createdAt: new Date(),
        });
        await blogDoc.save();
        res.status(201).json({ message: 'Blog post created successfully!' });
    } catch (error) {
        console.error('Error saving blog post:', error);
        res.status(500).json({ message: 'Error creating blog post' });
    }
});

app.get('/blog', async (req, res) => {
    try {
        const blogs = await Blog.find({}).populate('userId', 'name');

        const result = blogs.flatMap(blogDoc =>
            blogDoc.blog.map(blogEntry => ({
                _id: blogEntry._id,
                userName: blogDoc.userId.name,
                productName: blogEntry.productName,
                description: blogEntry.description,
                imgSrc: blogEntry.imgSrc,
                createdAt: blogEntry.createdAt
            }))
        );

        res.json(result);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Error fetching blogs' });
    }
});


app.delete('/blog/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const blogDoc = await Blog.findOneAndUpdate(
            { 'blog._id': id, userId: req.user._id },
            { $pull: { blog: { _id: id } } },
            { new: true }
        );

        if (!blogDoc) {
            return res.status(404).json({ message: 'Blog not found or user unauthorized' });
        }

        res.status(200).json({ message: 'Blog deleted successfully', blogs: blogDoc.blog });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Error deleting blog' });
    }
});


app.get('/blog-image/:id', async (req, res) => {
    try {
        const blog = await Blog.findOne({ 'blog._id': req.params.id }, { 'blog.$': 1 });

        if (!blog || !blog.blog[0] || !blog.blog[0].imgSrc || !blog.blog[0].imgSrc.data) {
            return res.status(404).json({ message: 'Image not found' });
        }

        const base64Image = blog.blog[0].imgSrc.data.toString('base64');
        const contentType = blog.blog[0].imgSrc.contentType;
        res.json({ base64Image, contentType });
    } catch (error) {
        console.error('Error serving image:', error);
        res.status(500).json({ message: 'Error serving image' });
    }
});

  app.get('/check-auth', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
  });

  function userId(req, res, next) {
    const token = req.cookies.jwt; // Correctly retrieve JWT from cookies
    console.log('Token received:', token);
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, jwt_secret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
  }
  app.get('/user', userId, async (req, res) => {
    try {
        const user = await Account.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const blogs = await Blog.find({ userId: req.user._id });

        const blogEntries = blogs.flatMap(blogDoc => blogDoc.blog.map(entry => ({
            _id: entry._id,
            userName: entry.userName,
            productName: entry.productName,
            description: entry.description,
            createdAt: entry.createdAt,
        })));

        res.json({ user, blogs: blogEntries });
    } catch (error) {
        console.error('Error fetching user details or blogs:', error);
        res.status(500).json({ message: 'Error fetching user details or blogs' });
    }
});




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
