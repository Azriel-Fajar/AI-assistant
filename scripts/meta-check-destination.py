import json, urllib.request, urllib.parse, urllib.error

ENV = r"C:\Users\afw14\OneDrive\Documents\JARVIS\.env"
env = {}
with open(ENV, encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
TOK = env["META_ACCESS_TOKEN"]
VER = "v21.0"
BASE = f"https://graph.facebook.com/{VER}"

def gg(path, params):
    params = dict(params); params["access_token"] = TOK
    url = f"{BASE}/{path}?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        return {"error": json.load(e)}

# creative IDs from audit
creatives = {
    "Website Ad 1 (creative)": "27334981786136169",
    "WA Convos v3 (creative)": "1454383546704023",
    "WA Lead Gen v2 (creative)": "1358573752854437",
}
for label, cid in creatives.items():
    print("==== " + label + " ====")
    r = gg(cid, {"fields": "name,object_type,call_to_action_type,object_story_spec,asset_feed_spec,effective_object_story_id"})
    print(json.dumps(r, indent=2, ensure_ascii=False))
    print()

# adset-level destination_type + promoted_object for the active SMB adset
adsets = {
    "Local SMB - WA adset": "120244417117510403",
    "Convos v3 adset": "120244972994200403",
}
for label, aid in adsets.items():
    print("==== " + label + " ====")
    r = gg(aid, {"fields": "name,destination_type,promoted_object,optimization_goal"})
    print(json.dumps(r, indent=2, ensure_ascii=False))
    print()
