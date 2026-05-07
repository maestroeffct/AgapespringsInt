# Agapesprings International — Product Roadmap
### Confidential | For Presidents, C-Suite & Senior Leadership

---

## Executive Overview

This document outlines the strategic product roadmap for the **Agapesprings International Mobile Application**. The features detailed below represent a phased expansion of the platform from a content-delivery app into a full **digital ministry ecosystem** — deepening member engagement, enabling giving, personalising the experience per local church, and building long-term community infrastructure.

The roadmap is organised into **four phases** aligned to delivery priority and infrastructure dependency.

---

## Phase 1 — Foundation & Personalisation
> *Immediate priority — user registration, identity, and local church onboarding*

---

### 1.1 — User Authentication & Account System

**What it is:**
Members create a personal account using their email/password or social sign-in (Google, Apple). Their profile persists across devices and powers personalisation across the entire app.

**Why it matters:**
Without accounts, every user is anonymous. Accounts unlock giving history, personalised notifications, referral tracking, community features, and data the ministry can actually act on.

**Scope:**
- Email + password registration and login
- Google Sign-In (OAuth 2.0)
- Apple Sign-In (required by App Store guidelines)
- Email verification flow
- Forgot password / password reset
- Profile page: name, photo, phone, date of birth
- Secure JWT authentication with refresh tokens
- Backend: user records, hashed passwords, session management

---

### 1.2 — Local Church Selection at Onboarding *(New)*

**What it is:**
During first-time app setup, the user selects the Agapesprings local church (location) where they worship. This selection drives personalised content throughout the app, most critically — **which giving accounts are displayed** in the Giving screen.

**Why it matters:**
Different local churches have different bank accounts for Offering, Tithe, and Special Giving. Showing a Lekki local church member the Abuja account details (or vice versa) leads to misdirected transfers. Location-aware giving eliminates this confusion entirely.

**Scope:**
- Onboarding screen: "Select your local church" with a searchable list
- Local Church data managed from the admin dashboard (add/edit/remove local churches)
- Each local church has: name, address, phone, map link, and **giving accounts per category** (Offering, Tithe, Special, Building Fund, etc.)
- Each giving account has: bank name, account number, account name, currency, sort code
- User's local church preference stored in profile; changeable anytime from settings
- Giving screen dynamically loads accounts for the user's selected local church
- If no local church is selected, show a "Select your local church first" prompt
- Admin dashboard: manage local churches and their associated accounts per category

**Notification target URL:** `giving`

---

### 1.3 — Referral & Invite System

**What it is:**
Every registered member receives a unique referral code. When they invite someone and that person downloads the app and registers using the code, both parties receive a defined reward (digital badge, recognition, or future unlockable perk).

**Why it matters:**
Word-of-mouth is the most powerful growth channel for a church. A referral system turns every member into a growth agent, gamifies outreach, and creates trackable metrics for leadership to monitor community growth.

**Scope:**
- Unique referral code generated per user on registration
- Shareable invite link: `agapesprings.app/join?ref=CODE`
- Referral tracking: who referred whom, date, conversion status
- Reward system (Phase 1: digital badge/title shown on profile)
- Leaderboard (optional): top inviters of the month
- Admin dashboard: view referral stats, top referrers, total conversions

---

## Phase 2 — Community & Engagement
> *Building two-way interaction between members and the ministry*

---

### 2.1 — Devotional Comments & Reactions

**What it is:**
Members can leave comments, prayer requests, or reactions on daily devotional entries. Other members can reply and react (Amen, Praying, etc.).

**Why it matters:**
Devotionals are currently one-way — the ministry speaks, the member reads. Comments transform the devotional into a shared spiritual journey, increasing daily active usage and member retention.

**Scope:**
- Comment input on each devotional page
- Nested replies (one level deep)
- Reactions: Amen 🙏, Praying 🕊, Fire 🔥, Heart ❤️
- Comment moderation: admin can delete, hide, or flag comments
- Push notification: "Someone replied to your comment"
- Option to disable comments per devotional from admin dashboard
- Report comment feature for inappropriate content

---

### 2.2 — Testimony Submission

**What it is:**
Members can submit written or video testimonies directly from the app. Approved testimonies appear in the Testimony feed.

**Why it matters:**
Testimonies are a core part of church culture — they build faith, encourage others, and give leadership insight into what God is doing in the congregation. A digital submission pipeline replaces the current manual collection process.

**Scope:**
- Submission form: title, written testimony, optional video upload
- Moderation queue in admin dashboard (approve / reject / feature)
- Approved testimonies appear in the Testimonies screen
- "Featured" testimonies appear on the home screen

---

### 2.3 — Prayer Wall

**What it is:**
Members can post prayer requests to a shared wall. Other members can tap "I'm praying" to stand in agreement. Leaders can respond directly.

**Why it matters:**
The prayer wall creates a real-time spiritual community layer in the app, reinforces the sense of belonging, and gives pastoral staff a direct channel to minister to members' needs.

**Scope:**
- Post prayer request (text, optional name visibility toggle — anonymous option)
- "Praying for this" button with count
- Admin/pastor response thread
- Prayer requests expire after 30 days (configurable)
- Category tags: Health, Family, Finance, Career, etc.
- Reports: most-prayed-for topics per month

---

### 2.4 — Live Stream Interaction

**What it is:**
During a live stream, members can send real-time reactions, participate in live polls, and access the digital bulletin — all without leaving the stream screen.

**Why it matters:**
Live engagement metrics are a direct indicator of how many people are spiritually present. Interactive features transform passive viewers into active participants, increasing watch time and return visits.

**Scope:**
- Live reactions bar (floating emoji reactions during stream)
- Live poll: pastor/admin creates a poll, members vote, results shown in real-time
- Digital bulletin: PDF or rich text displayed during service
- Live attendance count (visible to admin, optionally to members)
- "Watch later" save button

---

## Phase 3 — Giving & Generosity
> *Digital offering infrastructure — the most critical financial feature*

---

### 3.1 — Online Giving (Paystack Integration)

**What it is:**
Members give directly in-app using debit card, bank transfer, USSD, or mobile money — powered by **Paystack** (Nigeria's leading payment infrastructure).

**Why it matters:**
Physical giving is constrained by attendance. Online giving removes the barrier of "I forgot cash" or "I wasn't at church this week." Churches with digital giving consistently see a 20–35% increase in total giving revenue.

**Technical approach:**
- Paystack checkout (PCI-DSS compliant — no card data touches the app)
- Giving categories: Offering, Tithe, Building Fund, Missions, Special Projects
- One-time or recurring giving (weekly, monthly)
- Currency: NGN primary; USD for diaspora members (via Paystack multi-currency)
- On success: giving recorded in backend with member ID, amount, category, timestamp
- Giving receipt sent by email/in-app

**Admin dashboard:**
- Total giving per category per period
- Top givers (anonymised in reports)
- Export to CSV for accounting

---

### 3.2 — Location-Aware Bank Account Display *(See 1.2)*

The Giving screen dynamically shows only the bank accounts relevant to the member's selected local church. Each local church maintains separate accounts per giving category, all managed from the admin dashboard.

---

### 3.3 — Giving History & Statements

**What it is:**
Each member has a personal giving record — every online transaction and (optionally) manually recorded offline gift. They can download a yearly giving statement for tax or personal records.

**Scope:**
- Giving history tab in profile screen
- Filter by: date range, category, amount
- Annual giving statement (PDF download)
- Admin can manually record offline (cash/bank transfer) gifts against a member profile

---

## Phase 4 — Growth & Intelligence
> *Data, outreach, and platform maturity*

---

### 4.1 — Smart Notification System (Templates + Scheduling)

**What it is:**
The admin can create recurring notification templates (Sunday service reminders, daily devotional nudges, event announcements) that fire automatically at scheduled times — per local church or broadcast globally.

**Current status:** ✅ *Already shipped in admin dashboard (v1.5)*

**Next evolution:**
- Local church-targeted notifications: send only to members of a specific local church
- Segment-based: send to new members only, or to inactive members (last opened > 30 days)
- Notification analytics: open rate, tap-through rate per notification

---

### 4.2 — Event Calendar

**What it is:**
A church calendar showing upcoming events per local church — services, conferences, programs, outreaches. Members can RSVP and add events to their phone calendar.

**Scope:**
- Admin creates events (title, date/time, location, description, banner image)
- Filter by local church
- RSVP button (tracks attendance intent)
- "Add to Calendar" — exports to iOS/Android calendar
- Event reminder notification (24h and 1h before)
- Push notification auto-sent to relevant local church members on new event creation

---

### 4.3 — Member Directory (Optional / Opt-in)

**What it is:**
A searchable directory of members who opt in to being visible. Members can connect, see shared local church, and send a prayer for each other.

**Privacy controls:**
- Opt-in only
- Members choose what to display: name, local church, profile photo
- Phone/email never shown publicly
- Admin can remove any member from the directory

---

### 4.4 — Analytics Dashboard for Leadership

**What it is:**
A leadership-facing analytics view in the admin dashboard showing key ministry health metrics.

**Metrics included:**
- Total registered members (daily/weekly/monthly growth)
- Active users (opened app in last 7 / 30 days)
- Local Church-wise member distribution
- Devotional open rate by day/month
- Most-listened sermons
- Live stream peak concurrent viewers
- Total giving per period by category
- Referral conversion funnel

---

## Appendix A — Technology Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native (iOS + Android) |
| Backend | NestJS (Node.js) + PostgreSQL |
| Authentication | JWT + Refresh Tokens, Google OAuth, Apple Sign-In |
| Payment | Paystack (NGN + USD) |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Media Storage | AWS S3 / Cloudflare R2 |
| Video Streaming | YouTube Live / Agora.io (for interactive) |
| Admin Dashboard | React + Vite + TypeScript + TailwindCSS |

---

## Appendix B — Delivery Phases Summary

| Phase | Features | Priority |
|---|---|---|
| **Phase 1** | Auth, Local Church Selection + Giving Accounts, Referral System | 🔴 Immediate |
| **Phase 2** | Devotional Comments, Testimony Submission, Prayer Wall, Live Interaction | 🟠 Q3 2025 |
| **Phase 3** | Online Giving (Paystack), Giving History & Statements | 🟡 Q3–Q4 2025 |
| **Phase 4** | Event Calendar, Smart Notifications (v2), Analytics, Member Directory | 🟢 Q1 2026 |

---

## Appendix C — Data & Privacy Compliance

- All user data stored securely with encryption at rest
- NDPR (Nigeria Data Protection Regulation) compliant data handling
- User data deletion request supported (GDPR-style right to erasure)
- No third-party advertising data sharing
- Payment data never stored — Paystack handles all card data (PCI-DSS Level 1)
- Minors (under 18): parental consent prompt during registration

---

*Prepared by: Development Team — Agapesprings International*
*Document version: 2.0 | Last updated: April 2026*
*Classification: Internal — Leadership Distribution Only*
