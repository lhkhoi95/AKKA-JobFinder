# AKKA Job Finder - Overview
 Our web application simplifies the hiring process for employers and job seekers. Employers can easily create job listings and find qualified candidates while job seekers can access thousands of job listings and manage their applications all in one place.
 

# Images Demo
### Recruiter - Login
![recruiter_login](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/fb6147cb-f24b-482d-8974-310ae06a8f14)

### Recruiter - Profile
![recruiter_profile](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/5be8d247-8af2-4eb9-8a1e-d7143da04bfa)

### Recruiter - Membership
![recruiter_membership](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/8aec9182-44f3-4ed1-9c0e-dcc663b33758)

### Recruiter - Post Job
![recruiter_post_job](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/f3768527-5441-46c1-a3e3-55a1dc92f9b9)

### Recruiter - Edit Posted Job
![recruiter_edit_job](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/aa483a11-805d-4d22-a490-47a15d1e5b9c)

### Candidate - Login
![candidate_login](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/49aaacd5-0d36-499d-b9cf-e041d332745f)

### Candidate - Add Profile
![candidate_profile](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/415da7a5-89c8-4937-9918-af634782aa70)

### Candidate - Education
![candidate_education](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/5cfe7bbb-619b-44c0-8106-8f9ec39dd748)

### Candidate - Skills & Experience
![candidate_skill_experience](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/cbae718a-28dc-4b44-9a26-bd08a3e8a729)

### Candidate - Upload Resume
![candidate_resume](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/0a48c38f-7ce5-4768-9ed4-1f373fef7704)

### Candidate - Final Review
![candidate_review](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/6f1793e1-7bf3-4dfd-b7eb-650a18494879)

### Candidate - Apply Job
![candidate_apply_job](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/488dbc03-2c0b-4d04-96c5-84f594e0d22b)

### Candidate - Track Applied Jobs
![candidate_application_tracking](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/8ebec349-2a30-4490-95c8-3778382152f8)

### Recruiter - Process Applicants
![recruiter_process_applicants](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/cd583046-702e-4ce2-b775-d4684907b559)
![recruiter_process_applicants](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/cc166f40-0026-40f1-99aa-e0accc06fd5f)
![recruiter_accepts_candidate](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/1f8165d6-2877-4f63-88f2-50c22570493b)

### Candidate - Accepted
![candidate_got_accepted](https://github.com/lhkhoi95/AKKA-JobFinder/assets/59894272/31bd6073-3250-4c53-b938-7889e387627b)


## Technologies
1) ReactJS - Front end
2) Flask - Back end

Clone the project using this command:
`https://github.com/lhkhoi95/AKKA-JobFinder`

## Installation Guide
### Softwares Requirements:
1) Visual Studio Code
2) NodeJS
3) Python

### Python Virtual Environment Installation:
Open a new terminal and type the following commands:<br />
`cd server` <br />
Windows OS: <br/>
`python -m venv venv` <br />
`source venv/Scripts/activate`<br />
MacOS: <br/>
`python3 -m venv venv` <br />
`source venv/bin/activate`<br />
The (venv) indicates you have activated the virtual environment.

### Adding secret keys
Under the server/code directory, create a file named `.env` and add these 2 secret keys: <br/>
`JWT_SECRET_KEY=your_secret_key` <br/>
`SECRET_KEY=your_secret_key`

#### Back-end libraries installation:
`cd code` <br />
`pip install -r requirements.txt` <br />
Windows OS: <br/>
`python app.py` <br />
MacOS: <br/>
`python3 app.py` <br />
That should start the back-end server.


#### Front-end libraries installation:
Open another terminal and type the following commands (make sure you are in the root folder):<br />
`cd client`<br />
`npm install --legacy-peer-deps`<br />
`npm start`<br />

That should start the front-end server, and the landing page will be automatically opened by the default browser.
