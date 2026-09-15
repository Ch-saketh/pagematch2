import os
import sys
import importlib.util

# Set current server directory in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Load the production Flask instance from app.py
app_py_path = os.path.join(current_dir, "app.py")
spec = importlib.util.spec_from_file_location("server_main_app", app_py_path)
server_main_app = importlib.util.module_from_spec(spec)
sys.modules["server_main_app"] = server_main_app
spec.loader.exec_module(server_main_app)

# WSGI application callable for Gunicorn / Render
app = server_main_app.app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)
