import os
import sys
import importlib.util

# Add server directory to sys.path
root_dir = os.path.dirname(os.path.abspath(__file__))
server_dir = os.path.join(root_dir, "server")
if server_dir not in sys.path:
    sys.path.insert(0, server_dir)

# Load app from server/wsgi.py safely without circular import
server_wsgi_path = os.path.join(server_dir, "wsgi.py")
spec = importlib.util.spec_from_file_location("server_wsgi_module", server_wsgi_path)
server_wsgi = importlib.util.module_from_spec(spec)
sys.modules["server_wsgi_module"] = server_wsgi
spec.loader.exec_module(server_wsgi)

app = server_wsgi.app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)
