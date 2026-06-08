import json, urllib.request, urllib.parse, urllib.error

ENV = r"C:\Users\afw14\OneDrive\Documents\JARVIS\.env"
env = {}
with open(ENV, encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1); env[k.strip()] = v.strip()
TOK = env["META_ACCESS_TOKEN"]; ACCT = env["META_AD_ACCOUNT_ID"]
if not ACCT.startswith("act_"): ACCT = "act_" + ACCT
VER = "v21.0"; BASE = f"https://graph.facebook.com/{VER}"

def gg(path, params):
    params = dict(params); params["access_token"] = TOK
    url = f"{BASE}/{path}?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url) as r: return json.load(r)
    except urllib.error.HTTPError as e: return {"error": json.load(e)}

print("=== CAMPAIGNS ===")
for c in gg(f"{ACCT}/campaigns", {"fields":"name,effective_status,daily_budget,objective","limit":50}).get("data", []):
    print(f"[{c.get('effective_status')}] budget={c.get('daily_budget')} | {c.get('name')}")

print("\n=== AD SETS ===")
for a in gg(f"{ACCT}/adsets", {"fields":"name,effective_status,daily_budget,optimization_goal,destination_type","limit":50}).get("data", []):
    print(f"[{a.get('effective_status')}] dest={a.get('destination_type')} budget={a.get('daily_budget')} | {a.get('name')}")

print("\n=== ADS ===")
for a in gg(f"{ACCT}/ads", {"fields":"name,effective_status","limit":50}).get("data", []):
    print(f"[{a.get('effective_status')}] | {a.get('name')}")
