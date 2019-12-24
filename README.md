# Blog API

## Installation
- Install Python, Pipenv and Postgres on your machine
- Clone the repository `$ git clone https://github.com/Reda75/Blog_api.git`
- Change into the directory `$ cd /Blog_api`
- Activate the project virtual environment with `$ pipenv shell` command
- Install all required dependencies with `$ pipenv install`
- Export the required environment variables
  - `$ export FLASK_ENV=development`
  - `$ export DATABASE_URL=postgres://name:password@houst:port/blog_api_db`
  - `$ export JWT_SECRET_KEY=testtest`


- Start the app with `python run.py`
