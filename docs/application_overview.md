# Application Overview: Pages and Functionalities

This document provides a detailed breakdown of all pages in the **Cultural Ambassador Award** platform and their core functions.

## 🌎 Public Pages
| Page | Path | Functionality |
| :--- | :--- | :--- |
| **Home** | `/` | Hero video carousel, **Submission Countdown**, **Global Leaderboard**, featured nominees, and announcement popups. |
| **Nominees** | `/nominees` | Searchable directory of all nominees. Filter by **Category** and **Scope** (Local vs. Worldwide). |
| **Nominee Profile** | `/nominees/[id]` | Full biography, **Media Gallery** (images/videos), and the **Voting Interface** for registered users. |
| **Categories** | `/categories` | Overview of the different award disciplines (e.g., Traditional Dance, Poetry). |
| **Submit** | `/submit` | Public form for nominating oneself or others. Handles file/photo uploads and detailed bios. |
| **Cultural Insights** | `/cultural-insight` | Educational blog/articles about Ethiopian cultural heritage. |
| **About** | `/about` | Project mission, vision, and organizational information. |
| **Contact** | `/contact` | Inquiry form for user support and coordination. |
| **Voting Rules** | `/voting-rules` | Guidelines and policies governing the fair voting process. |
| **Legal** | `/terms`, `/privacy`| Terms of service and privacy policies. |

## 🔐 Authentication & User Area
| Page | Path | Functionality |
| :--- | :--- | :--- |
| **Auth** | `/login`, `/register` | Secure entry points for users via Supabase/Clerk. |
| **User Dashboard** | `/dashboard` | A personalized workspace for registered participants to view their **submission status**. |

## 🛠️ Administrative Dashboard (`/admin`)
*Accessible only to `admin` and `superadmin` roles.*

| Page | Path | Functionality |
| :--- | :--- | :--- |
| **Admin Home** | `/admin` | Real-time statistics (Total Votes, Users, Submissions) and a feed of recent activity. |
| **Submissions** | `/admin/submissions`| Workflow for review (Approve/Reject) of public nominations. |
| **Analytics** | `/admin/analytics` | Interactive charts showing voting trends and engagement data. |
| **Nominees** | `/admin/nominees` | Full CRUDS for managing nominee profiles and their media assets. |
| **Categories** | `/admin/categories`| Manage award categories, display order, and associated imagery. |
| **Insights** | `/admin/insights` | CMS for creating and publishing Cultural Insight articles. |
| **Popups** | `/admin/popups` | Control system for dynamic homepage announcement modals. |
| **Ads** | `/admin/ads` | Setup for sidebar banners and marketing links. |
| **Participants** | `/admin/participants`| Management of registered users and their assigned roles. |
| **Settings** | `/admin/settings` | Global platform configuration and maintenance controls. |
