import json, urllib.request, urllib.parse, urllib.error

ENV = r"C:\Users\afw14\OneDrive\Documents\JARVIS\.env"
env = {}
with open(ENV, encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1); env[k.strip()] = v.strip()
TOK = env["META_ACCESS_TOKEN"]; VER = "v21.0"; BASE = f"https://graph.facebook.com/{VER}"

def gg(path, params):
    params = dict(params); params["access_token"] = TOK
    url = f"{BASE}/{path}?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url) as r: return json.load(r)
    except urllib.error.HTTPError as e: return {"error": json.load(e)}

# campaign that owns Local SMB - WA = "Rielcode - WA Lead Gen" 120244415078360403
print("=== Campaign: Rielcode - WA Lead Gen ===")
print(json.dumps(gg("120244415078360403", {"fields":"name,daily_budget,lifetime_budget,budget_remaining,bid_strategy,status"}), indent=2, ensure_ascii=False))
print("\n=== Ad set: Local SMB - WA ===")
print(json.dumps(gg("120244417117510403", {"fields":"name,daily_budget,lifetime_budget,bid_amount,bid_strategy,billing_event,optimization_goal,status"}), indent=2, ensure_ascii=False))
