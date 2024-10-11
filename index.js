const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://recover-ease.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("assignment");
    const collection = db.collection("users");
    const allReliefGoods = db.collection("AllReliefGoods");
    const donationCollection = db.collection("donation");
    const supplyCollection = db.collection("supply");
    const newsletterCollection = db.collection("newsletter");
    const contactUsCollection = db.collection("contactUs");
    const testimonialCollection = db.collection("testimonial");
    const volunteerCollection = db.collection("volunteer");
    const commentCollection = db.collection("comment");

    // User Registration
    app.post("/api/v1/register", async (req, res) => {
      const { name, email, password } = req.body;

      // Check if email already exists
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into the database
      await collection.insertOne({
        name,
        email,
        password: hashedPassword,
        role: "user",
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    });

    // User Login
    app.post("/api/v1/login", async (req, res) => {
      const { email, password } = req.body;

      // Find user by email
      const user = await collection.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { email: user.email, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.EXPIRES_IN,
        }
      );

      res.json({
        success: true,
        message: "Login successful",
        token,
      });
    });

    // ==============================================================

    // Get All users
    app.get("/api/v1/users", async (req, res) => {
      const cursor = collection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get all relief goods data
    app.get("/api/v1/all-relief-goods", async (req, res) => {
      const cursor = allReliefGoods.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get single relief goods data
    app.get("/api/v1/all-relief-goods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allReliefGoods.findOne(query);
      res.send(result);
    });

    // post donation information
    app.post("/api/v1/donation", async (req, res) => {
      const { name, email, amount } = req.body;
      await donationCollection.insertOne({
        name,
        email,
        amount,
      });
      res.status(201).json({
        success: true,
        message: "Donation complete successfully.",
      });
    });

    // get donation information
    app.get("/api/v1/donation", async (req, res) => {
      const cursor = donationCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Create supply post
    app.post("/api/v1/supply", async (req, res) => {
      const { imageUrl, category, title, amount, description } = req.body;
      await supplyCollection.insertOne({
        imageUrl,
        category,
        title,
        amount,
        description,
      });
      res.status(201).json({
        success: true,
        message: "Supply post added successfully.",
      });
    });

    // get supply post
    app.get("/api/v1/supply", async (req, res) => {
      const cursor = supplyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // update supply
    app.put("/api/v1/supply/:id", async (req, res) => {
      const id = req.params.id;
      const supplyInfo = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          imageUrl: supplyInfo.imageUrl,
          category: supplyInfo.category,
          title: supplyInfo.title,
          amount: supplyInfo.amount,
          description: supplyInfo.description,
        },
      };
      const options = { upsert: true };
      const result = await supplyCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // delete supply
    app.delete("/api/v1/supply/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await supplyCollection.deleteOne(query);

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Supply not found" });
      }

      res.json({ message: "Supply deleted successfully" });
    });

    // post Newsletter subscription
    app.post("/api/v1/newsletter", async (req, res) => {
      const { name, email } = req.body;
      // Check if email already exists
      const existingUser = await newsletterCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already subscribed to our newsletter.",
        });
      }

      await newsletterCollection.insertOne({
        name,
        email,
      });
      res.status(201).json({
        success: true,
        message: "Newsletter subscription complete successfully.",
      });
    });

    // Get All Newsletter subscription
    app.get("/api/v1/newsletter", async (req, res) => {
      const cursor = newsletterCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // post Contact us
    app.post("/api/v1/contact-us", async (req, res) => {
      const { name, email, message } = req.body;

      await contactUsCollection.insertOne({
        name,
        email,
        message,
      });
      res.status(201).json({
        success: true,
        message: "Message send successfully.",
      });
    });

    // Get All Contact us Messages
    app.get("/api/v1/contact-us", async (req, res) => {
      const cursor = contactUsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // post testimonial
    app.post("/api/v1/testimonial", async (req, res) => {
      const { name, email, image, position, company, review } = req.body;
      await testimonialCollection.insertOne({
        name,
        email,
        image,
        position,
        company,
        review,
      });
      res.status(201).json({
        success: true,
        message: "Testimonial added successfully.",
      });
    });

    // Get All testimonial
    app.get("/api/v1/testimonial", async (req, res) => {
      const cursor = testimonialCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // post Volunteer
    app.post("/api/v1/volunteer", async (req, res) => {
      const { name, email, image, phone, location, occupation } = req.body;

      const existingUser = await volunteerCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Sorry, this user is already registered as a volunteer.",
        });
      }

      await volunteerCollection.insertOne({
        name,
        email,
        image,
        phone,
        location,
        occupation,
      });
      res.status(201).json({
        success: true,
        message: "Volunteer added successfully.",
      });
    });

    // get volunteer
    app.get("/api/v1/volunteer", async (req, res) => {
      const cursor = volunteerCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // post comment
    app.post("/api/v1/comment", async (req, res) => {
      const { name, email, message } = req.body;

      await commentCollection.insertOne({
        name,
        email,
        message,
      });
      res.status(201).json({
        success: true,
        message: "Comment post successfully.",
      });
    });

    // get comment
    app.get("/api/v1/comment", async (req, res) => {
      const cursor = commentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});
