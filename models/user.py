from extensions import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin, db.Model):
    __tablename__ = 'users'  # Explicit table name for clarity

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)  # Email must be unique and non-nullable
    password_hash = db.Column(db.String(256))  # Store hashed passwords
    name = db.Column(db.String(100), nullable=False)  # Name should not be nullable
    tasks = db.relationship('Task', backref='user', lazy=True)  # Relationship with Task model
    oauth_id = db.Column(db.String(100))  # ID from OAuth provider
    oauth_provider = db.Column(db.String(20), nullable=True)  # 'google' or 'local'
    email_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(100))
    token_expiration = db.Column(db.DateTime)

    def set_password(self, password):
        """Hashes and sets the user's password."""
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        """Checks if the provided password matches the stored hash."""
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f"<User {self.email}>"
