# AKKA Job Finder
 Our web application simplifies the hiring process for employers and job seekers. Employers can easily create job listings and find qualified candidates while job seekers can access thousands of job listings and manage their applications all in one place.
 
## Technologies
1) ReactJS - Front end
2) Flask - Back end

Clone the project using this command:
`git clone https://github.com/hnguyen-sjsu/job-portal`

## Installation Guide
### Softwares Requirements:
1) Visual Studio Code
2) NodeJS
3) Python

### Python Virtual Environment Installation:
Open a new terminal and type the following commands:<br />
`cd server` <br />
`python -m venv venv` <br />
Windows OS:
`source venv/Scripts/activate`<br />
MacOS:
`source venv/bin/activate`<br />
The (venv) indicates you have activated the virtual environment.

#### Back-end libraries installation:
`cd code` <br />
`pip install -r requirements.txt` <br />
`python app.py` <br />
That should start the back-end server.

#### Front-end libraries installation:
Open another terminal and type the following commands (make sure you are in the root folder):<br />
`cd client`<br />
`npm install --legacy-peer-deps`<br />
`npm start`<br />

That should start the front-end server, and the landing page will be automatically opened by the default browser.
