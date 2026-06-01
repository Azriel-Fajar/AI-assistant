"""Flask dashboard for Meta ads + Messenger DMs. Run: flask --app meta.dashboard.app run"""
from flask import Flask, jsonify, render_template

from . import meta_api
from .meta_api import MetaError

app = Flask(__name__)


def _safe(fetch):
    """Return (data, error_message). Never raises to the view layer."""
    try:
        return fetch(), None
    except MetaError as e:
        return None, str(e)
    except Exception as e:  # last resort: don't leak a stack trace to the page
        return None, f"Unexpected error: {e}"


@app.route("/")
def index():
    ads, ads_err = _safe(meta_api.get_ads)
    dms, dms_err = _safe(meta_api.get_dms)
    return render_template("index.html", ads=ads, ads_err=ads_err, dms=dms, dms_err=dms_err)


@app.route("/api/ads")
def api_ads():
    ads, err = _safe(meta_api.get_ads)
    return (jsonify(error=err), 502) if err else jsonify(ads)


@app.route("/api/dms")
def api_dms():
    dms, err = _safe(meta_api.get_dms)
    return (jsonify(error=err), 502) if err else jsonify(dms)


@app.route("/api/thread")
def api_thread():
    """Client-side chat fetch. Prefers conversation id (fast path) from the inbox list,
    falls back to name lookup for direct links."""
    from flask import request

    tid = request.args.get("id")
    name = request.args.get("name", "")
    if tid:
        data, err = _safe(lambda: meta_api.get_thread_by_id(tid, name))
    else:
        data, err = _safe(lambda: meta_api.get_thread(name))
    return (jsonify(error=err), 502) if err else jsonify(data)


@app.route("/thread/<path:name>")
def thread(name):
    """Server-rendered fallback for shared/direct links (no id available)."""
    data, err = _safe(lambda: meta_api.get_thread(name))
    return render_template("thread.html", thread=data, error=err, name=name)
