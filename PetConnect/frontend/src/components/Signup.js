// Signup.js
import React, { useState } from 'react';
import './Signup.css';
import axios from 'axios';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password
      });

      alert(res.data.message || 'Signup successful!');

      const user = res.data.user;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', user._id);
      localStorage.setItem('userRole', user.role || 'user');
      localStorage.setItem('userName', user.name);
      if (user.avatar) {
        localStorage.setItem('userAvatar', 'http://localhost:5000' + user.avatar);
      }

      window.location.href = '/profile';
    } catch (err) {
      const data = err.response?.data;
      alert(data?.message || data?.details || data?.error || err.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-page">
      <div className="animated-blobs">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>

      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>🐶 Join the Pack 🐾</h2>
        <p className="subtitle">Be part of something paw-some.</p>
        <label>Name</label>
        <input
          type="text"
          value={name}
          required
          onChange={e => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Create Account</button>
        <div className="signup-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
}





















// // Signup.js
// import React, { useState } from 'react';
// import './Signup.css';
// import axios from 'axios';

// export default function Signup() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/signup', {
//         name,
//         email,
//         password
//       });

//       alert(res.data.message || 'Signup successful!');

//       // Store user info in localStorage (like login)
//       const user = res.data.user;
//       localStorage.setItem('userId', user._id);
//       localStorage.setItem('userRole', user.role || 'user');
//       localStorage.setItem('userName', user.name);
//       if (user.avatar) {
//         localStorage.setItem('userAvatar', 'http://localhost:5000' + user.avatar);
//       }

//       // Redirect to profile page
//       window.location.href = '/profile';

//     } catch (err) {
//       alert(err.response?.data?.message || 'Signup failed');
//     }
//   };

//   return (
//     <div className="signup-page">
//       <form className="signup-form" onSubmit={handleSubmit}>
//         <h2>Sign Up</h2>
//         <label>Name</label>
//         <input
//           type="text"
//           value={name}
//           required
//           onChange={e => setName(e.target.value)}
//         />

//         <label>Email</label>
//         <input
//           type="email"
//           value={email}
//           required
//           onChange={e => setEmail(e.target.value)}
//         />

//         <label>Password</label>
//         <input
//           type="password"
//           value={password}
//           required
//           onChange={e => setPassword(e.target.value)}
//         />

//         <button type="submit">Create Account</button>
//         <div className="signup-link">
//           Already have an account? <a href="/login">Login</a>
//         </div>
//       </form>
//     </div>
//   );
// }
