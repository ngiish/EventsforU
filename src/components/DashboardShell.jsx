import React from "react"
import "../DashboardShell.scss"

/**
 * Pure UI shell matching the screenshot.
 * No data or business logic here. Use `children` for your existing content.
 */
export default function DashboardShell({
  title = "Welcome to EventsForU",
  children,
  stats = [],
  sidebar = {
    logoText: "",
    items: [
      { key: "home", label: "Home", active: true },
      { key: "create", label: "Create Event" },
      { key: "users", label: "User Management" },
    ],
    profile: { name: "Your Name", plan: "Free Plan", email: "you@example.com" },
  },
}) {
  return (
    <div className="dash">
      <aside className="dash__sidebar">
        <div className="dash__brand">
          <div className="brand__logo" aria-hidden="true">{sidebar.logoText}</div>
        </div>

        <nav className="dash__nav" aria-label="Primary">
          {sidebar.items.map((item) => (
            <a
              key={item.key}
              href="#"
              className={`nav__item${item.active ? " nav__item--active" : ""}`}
              aria-current={item.active ? "page" : undefined}
            >
              <span className="nav__icon" aria-hidden="true">▣</span>
              <span className="nav__label">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="dash__profile">
          <div className="profile__avatar" aria-hidden="true">👤</div>
          <div className="profile__name">{sidebar.profile.name}</div>
          <div className="profile__email">{sidebar.profile.email}</div>
          <div className="profile__plan">{sidebar.profile.plan}</div>
        </div>

        <div className="dash__cta">
          <a className="btn btn--primary" href="#">Getting Started</a>
        </div>

        <div className="dash__notice">
          <p className="notice__text">
            You are currently on a <strong>free plan</strong> with basic limits.
          </p>
        </div>

        <div className="dash__footer">
          <a className="btn btn--outline" href="#">UPGRADE - View Plans</a>
        </div>
      </aside>

      <main className="dash__main">
        <header className="dash__header" role="heading" aria-level={1}>
          <h1 className="dash__title">{title}</h1>
          <div className="dash__actions">
            <button className="icon-btn" aria-label="Notifications">🔔</button>
            <button className="icon-btn" aria-label="Grid">▦</button>
          </div>
        </header>

        <section className="card card--panel">
          <div className="card__head">
            <div className="card__title-wrap">
              <h2 className="card__title">Your Events</h2>
              <p className="card__subtitle">Select an event to view detail</p>
            </div>
            {stats?.length ? (
              <div className="card__stats">
                {stats.map((s, i) => (
                  <div key={i} className="stat">
                    <div className="stat__value">{s.value}</div>
                    <div className="stat__label">{s.label}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="card__body">{children}</div>
        </section>
      </main>
    </div>
  )
}
