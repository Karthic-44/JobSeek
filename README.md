# Job Seeking Platform

# Jobseek

A job board where job seekers search and apply for jobs, recruiters post jobs and see who applied, and admins manage the whole site.

## Features

**Job seekers**
- Search jobs by title, company or skill, with matches highlighted in the results
- Filter by category, and share a search through its URL
- Read the full job description, then apply with an optional resume link
- See your applications and withdraw one

**Recruiters**
- Post, edit and delete jobs
- See everyone who applied to a job, with email and resume link

**Admins**
- Everything a recruiter can do
- Add, rename and delete categories
- Create recruiter accounts
- See site totals (jobs, categories, applications, recruiters)

## Tech stack

| Part | Technology |
|------|------------|
| API | Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA, Bean Validation |
| Auth | JWT stored in an HTTP-only cookie, BCrypt password hashing |
| Database | MySQL, or in-memory H2 for development |
| Front end | React 19, Vite, Tailwind CSS 4, React Router, Axios |

## Project structure

```
.
├── pom.xml
├── src/main/java/com/karthic/JobSeekingPlatform/
│   ├── controller/      REST endpoints
│   ├── service/         business logic
│   ├── repositories/    Spring Data JPA repositories
│   ├── model/           database entities
│   ├── payload/         request and response objects (DTOs)
│   ├── security/        security rules, JWT filter and utilities, demo data
│   └── Exception/       error handling
├── src/main/resources/
│   ├── application.properties       default settings (MySQL)
│   └── application-dev.properties   development settings (H2)
└── frontend/
    └── src/
        ├── pages/       one file per screen (dashboard screens are in pages/dashboard)
        ├── components/  layout, route guard, shared UI pieces
        ├── api.js       Axios setup and error messages
        ├── auth.jsx     sign-in state
        └── index.css    colours and fonts
```

## Getting started

### What you need

- Java 21 or newer (`java -version` to check)
- Node.js 20 or newer (`node -v` to check)
- MySQL only if you don't want to use the development database

### 1. Start the back end

From the project root (the folder with `pom.xml`):

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

On Windows use `mvnw.cmd` instead of `./mvnw`.

The `dev` profile uses an in-memory H2 database and creates demo accounts and sample jobs. Everything is lost when you stop the app. The API runs on http://localhost:8080.

### 2. Start the front end

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

In development, Vite forwards every `/api` request to the back end, so there is nothing to configure. If the back end runs on another port, start the front end with:

```bash
VITE_API_PROXY=http://localhost:8081 npm run dev
```

### Demo accounts

These are created when `SEED_DEMO_DATA` is `true`, which is the default.

| Username | Password | Role |
|----------|----------|------|
| `user` | `password123` | Job seeker |
| `recruiter` | `recruiter123` | Recruiter |
| `admin` | `admin123` | Admin |

## Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `DB_URL` | `jdbc:mysql://localhost:3306/jobseek` | Database connection |
| `DB_USERNAME` | `root` | Database user |
| `DB_PASSWORD` | `root` | Database password |
| `JWT_SECRET` | development-only text | Signs login tokens. **Set your own (32+ characters) for any real use.** |
| `JWT_COOKIE_SECURE` | `false` | Set `true` when the site is served over HTTPS |
| `FRONTEND_URL` | `http://localhost:5173` | Origin allowed to call the API (no trailing slash) |
| `SEED_DEMO_DATA` | `true` | Create the demo accounts on startup. Set `false` in production. |
| `ADMIN_PASSWORD` | `admin123` | Password for the seeded `admin` account |

The front end reads one optional variable, `VITE_API_URL` (see `frontend/.env.example`). Leave it empty in development. Set it to your API's address when the front end and API are hosted on different domains. In that case the login cookie also needs `SameSite=None; Secure`, which you change in `JwtUtils`.

## Building for production

```bash
cd frontend
npm run build        # output goes to frontend/dist
```

Serve `frontend/dist` from any static host and make sure `/api` reaches the Spring Boot app, either through a reverse proxy on the same domain or with `VITE_API_URL`. Before deploying, set `JWT_SECRET`, `JWT_COOKIE_SECURE=true`, `FRONTEND_URL`, `ADMIN_PASSWORD`, and decide whether to turn off `SEED_DEMO_DATA`.

## API overview

All endpoints start with `/api`. Lists are paged with `pageNumber`, `pageSize`, `sortBy` and `sortOrder`.

**Open to everyone**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/public/jobs` | List jobs. Optional `keyword` and `categoryId`. |
| GET | `/public/jobs/{id}` | One job |
| GET | `/public/categories` | List categories |
| POST | `/auth/signup` | Create an account. `role` may be `["recruiter"]`. |
| POST | `/auth/signin` | Sign in and set the login cookie |
| POST | `/auth/signout` | Clear the login cookie |

**Signed-in users**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/auth/user` | The current user |
| POST | `/user/applications` | Apply to a job (`jobId`, optional `resumeURL`) |
| GET | `/user/applications` | Your applications |
| DELETE | `/user/applications/{id}` | Withdraw one of your applications |

**Recruiters and admins**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/recruiter/job` | Post a job |
| PUT | `/recruiter/job/{id}` | Edit a job |
| DELETE | `/recruiter/job/{id}` | Delete a job and its applications |
| GET | `/recruiter/jobs/{id}/applications` | Applicants for a job |

**Admins only**

| Method | Path | Description |
|--------|------|-------------|
| POST, PUT, DELETE | `/admin/categories`, `/admin/categories/{id}` | Manage categories |
| GET | `/auth/recruiters` | List recruiters |
| GET | `/admin/app/analytics` | Site totals |
| POST, PUT, DELETE, GET | `/admin/users/...` | Manage users |

## Screenshots

### Homepage
<img width="1914" height="943" alt="Homepage" src="https://github.com/user-attachments/assets/37a00c22-86ef-49b5-9eaa-6e082ae04ea9" />

## Applications
<img width="1913" height="941" alt="applications" src="https://github.com/user-attachments/assets/8f77eb8a-7b27-4f83-8d74-4a34aba92f40" />

## Post a job
<img width="1919" height="948" alt="post a job" src="https://github.com/user-attachments/assets/a226016c-b120-4548-8a65-c3a9f941df39" />

## Dashboard
<img width="1915" height="945" alt="dashboard" src="https://github.com/user-attachments/assets/680b41e3-5ec0-4fc7-ada6-52a66bfdb4d7" />



