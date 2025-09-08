from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import get_db

bcrypt = Bcrypt()
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    senha = bcrypt.generate_password_hash(data.get("senha")).decode("utf-8")

    conn = get_db()
    cur = conn.cursor()
    
    try:
        cur.execute("INSERT INTO users (email, senha) VALUES (?, ?)", (email, senha))
        conn.commit()
    except:
        return jsonify({"msg": "Usuário já existe"}), 400
    return jsonify({"msg": "Usuário criado com sucesso!"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    senha = data.get("senha")

    conn = get_db()
    cur  = conn.cursor()
    cur.execute("SELECT id, senha FROM users WHERE email=?", (email,))
    user = cur.fetchone()

    if user and bcrypt.check_password_hash(user["senha"], senha):
        token = create_access_token(identity=str(user["id"]))
        return jsonify({"token": token})
    return jsonify({"msg": "Credenciais inválidas"}), 401

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    return jsonify({"id": int(user_id)})