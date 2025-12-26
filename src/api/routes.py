"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, bcrypt, Vehicle, Driver, Store, Route
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint("api", __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/hello", methods=["POST", "GET"])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/signup", methods=["POST"])
def handle_signup():
    body = request.get_json()  # Recibe el nombre, email y password del front

    user_exists = User.query.filter_by(email=body["email"]).first()
    if user_exists:
        return jsonify({"msg": "El usuario ya existe"}), 400

    pw_hash = bcrypt.generate_password_hash(body["password"]).decode("utf-8")

    # 2. Crear nueva instancia de User
    new_user = User(
        email=body["email"],
        password=pw_hash,
        fullname=body.get("fullname"),  # Nota: En producción usa hashing (bcrypt)
        is_active=True,
    )

    # 3. Guardar en la DB
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado con exito"}), 201


@api.route("/login", methods=["POST"])
def handle_login():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")

    user = User.query.filter_by(email=email).first()

    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Email o contraseña incorrectos"}), 401

    # Creamos el token usando el ID del usuario como identidad
    access_token = create_access_token(identity=str(user.id))

    return jsonify(
        {"msg": "Login exitoso", "token": access_token, "user_id": user.id}
    ), 200


@api.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():  # <--- Cambia 'Miranda():' por 'def get_profile():'
    # Obtiene el ID del usuario desde el token
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({"id": user.id, "email": user.email}), 200


# --- ENDPOINTS DE VEHÍCULOS ---


@api.route("/vehicles", methods=["GET"])
@jwt_required()
def get_vehicles():
    vehicles = Vehicle.query.all()
    return jsonify([v.serialize() for v in vehicles]), 200


@api.route("/vehicles", methods=["POST"])
@jwt_required()
def add_vehicle():
    data = request.json
    # Agregamos data.get("brand")
    new_vehicle = Vehicle(
        brand=data.get("brand"),  # <--- Faltaba esto
        model=data.get("model"),
        plate=data.get("plate"),
        type=data.get("type"),
        status="disponible",
    )
    db.session.add(new_vehicle)
    db.session.commit()
    return jsonify(
        {"msg": "Vehículo registrado", "vehicle": new_vehicle.serialize()}
    ), 201


@api.route("/vehicles/<int:id>", methods=["PUT", "DELETE"])
@jwt_required()
def handle_vehicle(id):
    vehicle = Vehicle.query.get(id)
    if not vehicle:
        return jsonify({"msg": "No encontrado"}), 404

    if request.method == "DELETE":
        db.session.delete(vehicle)
        db.session.commit()
        return jsonify({"msg": "Eliminado"}), 200

    if request.method == "PUT":
        data = request.json
        vehicle.plate = data.get("plate", vehicle.plate)
        vehicle.model = data.get("model", vehicle.model)
        vehicle.status = data.get("status", vehicle.status)
        db.session.commit()
        return jsonify(vehicle.serialize()), 200


# --- ENDPOINTS DE CHOFERES ---


@api.route("/drivers", methods=["GET"])
@jwt_required()
def get_drivers():
    drivers = Driver.query.all()
    return jsonify([d.serialize() for d in drivers]), 200


@api.route("/drivers", methods=["POST"])
@jwt_required()
def add_driver():
    body = request.get_json()
    new_driver = Driver(
        fullname=body["fullname"],
        license_id=body["license_id"],
        phone=body.get("phone"),
        status="activo",
    )
    db.session.add(new_driver)
    db.session.commit()
    return jsonify({"msg": "Chofer registrado", "driver": new_driver.serialize()}), 201


@api.route("/drivers/<int:id>", methods=["PUT", "DELETE"])
@jwt_required()
def handle_driver(id):
    driver = Driver.query.get(id)
    if not driver:
        return jsonify({"msg": "No encontrado"}), 404

    if request.method == "DELETE":
        db.session.delete(driver)
        db.session.commit()
        return jsonify({"msg": "Eliminado"}), 200

    if request.method == "PUT":
        data = request.json
        driver.fullname = data.get("fullname", driver.fullname)
        driver.status = data.get("status", driver.status)
        db.session.commit()
        return jsonify(driver.serialize()), 200


# --- ENDPOINTS DE TIENDAS / CLIENTES ---


@api.route("/stores", methods=["POST"])
@jwt_required()
def add_store():
    body = request.get_json()
    new_store = Store(
        name=body["name"],
        address=body["address"],
        latitude=body.get("latitude"),
        longitude=body.get("longitude"),
    )
    db.session.add(new_store)
    db.session.commit()
    return jsonify({"msg": "Tienda creada", "store": new_store.serialize()}), 201


# --- ENDPOINTS DE RUTAS DE DESPACHO ---


@api.route("/routes", methods=["GET"])
@jwt_required()
def get_routes():
    routes = Route.query.all()
    return jsonify([r.serialize() for r in routes]), 200


@api.route("/routes", methods=["POST"])
@jwt_required()
def create_route():
    body = request.get_json()
    # Aquí puedes asignar chofer y vehículo por sus IDs
    new_route = Route(
        name=body["name"],
        driver_id=body.get("driver_id"),
        vehicle_id=body.get("vehicle_id"),
        status="pendiente",
        progress=0,
    )
    db.session.add(new_route)
    db.session.commit()
    return jsonify(
        {"msg": "Ruta creada y asignada", "route": new_route.serialize()}
    ), 201
