# 💸 Gastos por JCM

Aplicación web para gestionar gastos compartidos de forma sencilla, rápida y sin complicaciones.

Perfecta para:
- Viajes
- Fines de semana
- Cenas entre amigos
- Compartir gastos sin líos

---

## 🚀 Funcionalidades

✅ Añadir personas  
✅ Añadir múltiples gastos (concepto, cantidad, fecha)  
✅ Edición y eliminación de gastos  
✅ Cálculo automático:
- Total gastado
- Gasto por persona
- Quién debe y quién recibe  

✅ Guardado automático (persistencia en servidor)  
✅ Exportar / importar datos en JSON  
✅ Reinicio de sesión con confirmación (modal)  

---

## 🛠️ Tecnologías

- Python (Flask)
- HTML5
- CSS3 (diseño oscuro personalizado)
- JavaScript (vanilla)

---

## 📂 Estructura del proyecto
gestiongastos/
│
├── app.py
├── data/
│ └── gastos.json
│
├── templates/
│ └── index.html
│
├── static/
│ ├── css/
│ │ └── style.css
│ └── js/
│ └── app.js


---

## ▶️ Cómo ejecutar

```bash
# activar entorno virtual
source venv/bin/activate

# instalar dependencias
pip install flask

# ejecutar
python app.py

🌐 Demo

👉 Próximamente en producción

👨‍💻 Autor

Desarrollado por Jesús C.M.

🌐 https://jesuscmweb.com

💡 Futuras mejoras
Crear salas compartidas (código)
Acceso multiusuario desde móvil
Base de datos (SQLite / MySQL)
Sistema de login
Cálculo automático de pagos entre usuarios
📜 Licencia

Uso libre para proyectos personales y educativos.


---

# 🚀 2. SUBIR A GIT

## 👉 Inicializar repo

```bash
git init
git add .
git commit -m "Primer commit - Gastos por JCM"