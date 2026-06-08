import os, json, urllib.request, urllib.parse, sys

ENV = r"C:\Users\afw14\OneDrive\Documents\JARVIS\.env"
env = {}
with open(ENV, encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()

TOK = env["META_ACCESS_TOKEN"]
ACCT = env["META_AD_ACCOUNT_ID"]
if not ACCT.startswith("act_"):
    ACCT = "act_" + ACCT
VER = "v21.0"
BASE = f"https://graph.facebook.com/{VER}"

def gg(path, params):
    params = dict(params)
    params["access_token"] = TOK
    url = f"{BASE}/{path}?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        return {"error": json.load(e)}

out = {}
out["account"] = gg(ACCT, {"fields": "name,account_status,currency,amount_spent,balance,spend_cap"})
out["campaigns"] = gg(f"{ACCT}/campaigns", {"fields": "name,status,objective,effective_status,daily_budget,lifetime_budget", "limit": 100})
out["adsets"] = gg(f"{ACCT}/adsets", {"fields": "name,effective_status,optimization_goal,billing_event,daily_budget,start_time", "limit": 100})
out["ads"] = gg(f"{ACCT}/ads", {"fields": "name,effective_status,creative{title,body,object_type,call_to_action_type,image_url,video_id}", "limit": 100})
# account-level insights, last 30d
out["insights_30d"] = gg(f"{ACCT}/insights", {
    "fields": "impressions,reach,frequency,clicks,ctr,cpc,cpm,spend,actions,cost_per_action_type",
    "date_preset": "last_30d", "level": "account"})
# per-ad insights for fatigue/CTR
out["insights_per_ad"] = gg(f"{ACCT}/insights", {
    "fields": "ad_name,impressions,clicks,ctr,cpc,cpm,spend,frequency,actions",
    "date_preset": "last_30d", "level": "ad", "limit": 100})

print(json.dumps(out, indent=2, ensure_ascii=False))
