import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const items = [
    { name: 'Dashboard', path: '/' },
    { name: 'Profile', path: '/profile' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' },
    { name: 'Logout', path: '/logout' },
  ]

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Home">
          <span className={styles.logoMark} aria-hidden />
          <span className={styles.brandText}>ReportMaker</span>
        </Link>
        <nav className={styles.links} aria-label="Main">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  styles.link,
                  isActive ? styles.linkActive : '',
                  item.path === '/logout' ? styles.linkLogout : '',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
              end={item.path === '/'}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
