import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import CustomButton from '../buttons/CustomButton'
import { serverUrl } from '../../../config.mjs'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (error) setError('')
    switch (name) {
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      default:
        break
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('All fields are required')
      return
    }
    setError('')
    try {
      const response = await axios.post(
        `${serverUrl}/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        navigate('/')
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong. Try again.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>
            Sign in with your email and password to continue to your workspace.
          </p>
        </header>

        {error && (
          <p className={styles.alertError} role="alert">
            {error}
          </p>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              className={styles.input}
              placeholder="you@company.com"
              value={email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={handleChange}
            />
          </div>

          <div className={styles.footer}>
            <CustomButton text="Sign in" style={styles.submitBtn} />
          </div>
        </form>

        <p className={styles.signupPrompt}>
          Don&apos;t have an account?
          <Link to="/signup" className={styles.signupLink}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
