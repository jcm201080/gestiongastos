from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

DATA_FILE = "data/gastos.json"

# Crear archivo si no existe
if not os.path.exists("data"):
    os.makedirs("data")

if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump({"personas": [], "gastos": []}, f)


def cargar_datos():
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def guardar_datos(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/datos", methods=["GET"])
def obtener_datos():
    return jsonify(cargar_datos())


@app.route("/guardar", methods=["POST"])
def guardar():
    data = request.json
    guardar_datos(data)
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)