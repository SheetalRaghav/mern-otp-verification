const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://sheetalraghav0818:admin123@cluster0.k5ji0hk.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Successfully connected to databases");
}).catch((err) => {
  console.log("there was an error with db  : " + err);
});

// Create a User schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sheetalraghav068@gmail.com',
    pass: 'jbklkmizzfqykhfp',
  },
});

const User = mongoose.model('User', userSchema);

// Send OTP via email
const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sheetalraghav068@gmail.com',
        pass: 'jbklkmizzfqykhfp',
      },
    });

    const mailOptions = {
      from: 'sheetalraghav068@gmail.com',
      to: email,
      subject: 'OTP for login/register',
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};

// Register a new user
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP (4-digit)

    const otp = Math.floor(1000 + Math.random() * 9000);

    // Save the user to the database
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Send OTP via email
    await sendOTP(email, otp);
   res.json({ message: 'Registration successful. OTP sent to your email.' });
   } catch (error) {
     console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login with email and password
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      // Generate OTP (4-digit)
      const otp = Math.floor(1000 + Math.random() * 9000);

      // Send OTP via email
      await sendOTP(email, otp);

      return res.json({ message: 'Invalid email or password. OTP sent to your email.' });
    }

    res.json({ message: 'Login successful' });
  }
  catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify OTP for login/register
app.post('/verify', (req, res) => {
  try {
    const { email, otp } = req.body;
    res.json({ message: 'OTP verification successful' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


function generateOTP() {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // Generate and save OTP in the database
  const OTP = generateOTP();
  user.passwordResetOTP = OTP;
  await user.save();

  // Compose the email
  const mailOptions = {
    from: 'sheetalraghav068@gmail.com',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${OTP}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
    console.log('OTP sent:', info.response);
    res.status(200).json({ message: 'OTP sent successfully' });
  });
});

// Start the server
app.listen(3001, () => {
  console.log('Server started on port 3001');
});
