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

# which ad + creative is on Local SMB - WA adset
print("=== Ads on Local SMB - WA adset ===")
ads = gg("120244417117510403/ads", {"fields":"name,status,creative{id,name,call_to_action_type}"})
print(json.dumps(ads, indent=2, ensure_ascii=False))

# WA flows available on the WABA
print("\n=== WhatsApp flows on WABA 592818566478412 ===")
print(json.dumps(gg("592818566478412/flows", {"fields":"id,name,status,categories"}), indent=2, ensure_ascii=False))
