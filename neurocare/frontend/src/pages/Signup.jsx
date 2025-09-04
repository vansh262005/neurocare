import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

function Signup() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    parentName: '',
    parentEmail: '',
    parentPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          parentName: form.parentName,
          parentEmail: form.parentEmail,
          parentPhone: form.parentPhone
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Create Account</h2>
        {error && <p className="mb-4 text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'password', 'confirm', 'parentName', 'parentEmail', 'parentPhone'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize" htmlFor={field}>{field === 'confirm' ? 'Confirm Password' : field}</label>
              <input
                type={field.includes('password') ? 'password' : 'text'}
                id={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required={field !== 'parentPhone'}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-primary focus:border-primary"
              />
            </div>
          ))}
          <button disabled={loading} className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-indigo-600 disabled:opacity-50">
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">Already have an account? <Link to="/" className="text-primary hover:underline">Log in</Link></p>
      </div>
    </div>
  );
}

export default Signup;