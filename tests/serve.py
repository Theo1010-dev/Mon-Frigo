"""Petit serveur web local pour les tests (port libre choisi tout seul)."""
import threading, http.server, socketserver, functools, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')


def start(directory=DIST, port=0):
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    socketserver.TCPServer.allow_reuse_address = True
    s = socketserver.ThreadingTCPServer(('127.0.0.1', port), functools.partial(Q, directory=directory))
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return f'http://127.0.0.1:{s.server_address[1]}/'
