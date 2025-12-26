from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    fullname = db.Column(db.String(100), nullable=True)
    is_active = db.Column(db.Boolean(), default=True)

    # Relación: Un usuario puede ser el creador/admin de muchos camiones o rutas
    def serialize(self):
        return {"id": self.id, "email": self.email, "fullname": self.fullname}


class Vehicle(db.Model):
    __tablename__ = "vehicle"
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(50), nullable=False)  # Ejemplo: Toyota
    model = db.Column(db.String(50), nullable=False)  # Ejemplo: Dyna
    type = db.Column(db.String(50), nullable=False)  # Ejemplo: Pickup
    plate = db.Column(db.String(20), unique=True, nullable=False)  # Placa única
    status = db.Column(
        db.String(20), default="disponible"
    )  # disponible, en ruta, mantenimiento

    def serialize(self):
        return {
            "id": self.id,
            "brand": self.brand,
            "model": self.model,
            "plate": self.plate,
            "status": self.status,
        }


class Driver(db.Model):
    __tablename__ = "driver"
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    license_id = db.Column(db.String(50), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    status = db.Column(db.String(20), default="activo")  # activo, libre, vacaciones

    def serialize(self):
        return {
            "id": self.id,
            "fullname": self.fullname,
            "license_id": self.license_id,
            "status": self.status,
            "phone": self.phone,
        }


class Store(db.Model):
    __tablename__ = "store"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(250), nullable=False)
    latitude = db.Column(db.Float, nullable=True)  # Para el mapa de Google
    longitude = db.Column(db.Float, nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "coords": {"lat": self.latitude, "lng": self.longitude},
        }


class Route(db.Model):
    __tablename__ = "route"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # Ejemplo: "Ruta Norte Caracas"
    status = db.Column(
        db.String(20), default="pendiente"
    )  # pendiente, en progreso, completada
    progress = db.Column(db.Integer, default=0)  # Porcentaje de 0 a 100

    # LLAVES FORÁNEAS: Aquí es donde se une la magia
    driver_id = db.Column(db.Integer, db.ForeignKey("driver.id"), nullable=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey("vehicle.id"), nullable=True)

    # Relaciones para acceder a los datos fácilmente
    driver = db.relationship("Driver", backref="routes")
    vehicle = db.relationship("Vehicle", backref="routes")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "status": self.status,
            "progress": self.progress,
            "driver": self.driver.fullname if self.driver else "Sin asignar",
            "vehicle_plate": self.vehicle.plate if self.vehicle else "Sin asignar",
        }
