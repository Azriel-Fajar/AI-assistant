import json, urllib.request, urllib.parse, urllib.error

ENV = r"C:\Users\afw14\OneDrive\Documents\JARVIS\.env"
env = {}
with open(ENV, encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1); env[k.strip()] = v.strip()
TOK = env["META_ACCESS_TOKEN"]; VER = "v21.0"; BASE = f"https://graph.facebook.com/{VER}"

CAMPAIGN = "120244415078360403"  # Rielcode - WA Lead Gen
NEW_DAILY = "50000"  # IDR, minor units not used for IDR (zero-decimal currency)

data = urllib.parse.urlencode({"daily_budget": NEW_DAILY, "access_token": TOK}).encode()
url = f"{BASE}/{CAMPAIGN}"
req = urllib.request.Request(url, data=data, method="POST")
try:
    with urllib.request.urlopen(req) as r:
        print("POST result:", json.load(r))
except urllib.error.HTTPError as e:
    print("ERROR:", json.load(e))

# verify
vurl = f"{BASE}/{CAMPAIGN}?" + urllib.parse.urlencode({"fields":"name,daily_budget","access_token":TOK})
with urllib.request.urlopen(vurl) as r:
    print("Verify:", json.load(r))
