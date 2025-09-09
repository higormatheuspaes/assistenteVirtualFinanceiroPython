from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.auth import auth_bp, bcrypt
from database import init_db

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "chave-super-secreta"

bcrypt.init_app(app)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# inicializar banco
init_db()

# registrar rotas
app.register_blueprint(auth_bp, url_prefix="/auth")

if __name__ == "__main__":
    app.run(debug=True)
