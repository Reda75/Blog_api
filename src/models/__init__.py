#src/models/__init__.py

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
# initialize our db
db = SQLAlchemy()
SQLALCHEMY_TRACK_MODIFICATIONS = False
bcrypt = Bcrypt()