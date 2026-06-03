import sys, json
from graphify.extract import collect_files, extract
from graphify.cache import check_semantic_cache
from pathlib import Path

detect = json.loads(Path(".graphify_detect.json").read_text())

code_files = []
for f in detect.get("files", {}).get("code", []):
    p = Path(f)
    if p.is_dir():
        code_files.extend(collect_files(p))
    else:
        code_files.append(p)

if code_files:
    result = extract(code_files)
    Path(".graphify_ast.json").write_text(json.dumps(result, indent=2))
    print("AST nodes:", len(result["nodes"]), "edges:", len(result["edges"]))
else:
    Path(".graphify_ast.json").write_text(json.dumps({"nodes":[],"edges":[],"input_tokens":0,"output_tokens":0}))
    print("No code files")

all_files = [f for files in detect["files"].values() for f in files]
cached_nodes, cached_edges, cached_hyperedges, uncached = check_semantic_cache(all_files)
if cached_nodes or cached_edges:
    Path(".graphify_cached.json").write_text(json.dumps({"nodes": cached_nodes, "edges": cached_edges, "hyperedges": cached_hyperedges}))
Path(".graphify_uncached.txt").write_text("\n".join(uncached))
print("Cache hit:", len(all_files)-len(uncached), "need extraction:", len(uncached))
