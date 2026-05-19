# Graph Report - google  (2026-05-19)

## Corpus Check
- 11 files · ~5,728 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 114 nodes · 171 edges · 9 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a5bf9ca7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]

## God Nodes (most connected - your core abstractions)
1. `getAuthenticatedClient()` - 11 edges
2. `printTable()` - 9 edges
3. `printJson()` - 9 edges
4. `printSuccess()` - 8 edges
5. `getYouTube()` - 8 edges
6. `dependencies` - 6 edges
7. `runAuthFlow()` - 6 edges
8. `bin` - 5 edges
9. `handleError()` - 5 edges
10. `uploadVideo()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `runAuthFlow()` --calls--> `open`  [INFERRED]
  auth/oauth.js → package.json
- `getCalendar()` --calls--> `getAuthenticatedClient()`  [EXTRACTED]
  gcal/index.js → auth/oauth.js
- `getDrive()` --calls--> `getAuthenticatedClient()`  [EXTRACTED]
  gdrive/index.js → auth/oauth.js
- `getGmail()` --calls--> `getAuthenticatedClient()`  [EXTRACTED]
  gmail/index.js → auth/oauth.js
- `getYouTube()` --calls--> `getAuthenticatedClient()`  [EXTRACTED]
  youtube/index.js → auth/oauth.js

## Communities (9 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (18): bin, gcal, gdrive, gmail, yt, dependencies, chalk, cli-table3 (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.26
Nodes (16): printInfo(), printJson(), printSuccess(), printTable(), comments, confirm(), deleteComment(), getAnalytics() (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (17): mockChannelsList, mockCommentsDelete, mockCommentsInsert, mockCommentsList, mockCommentThreadsList, mockCreateReadStream, mockExistsSync, mockExit (+9 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (8): data, label, msg, outPath, raw, rows, to, handleError()

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (10): currentStart, d, end, event, events, freqMap, newStart, now (+2 more)

### Community 5 - "Community 5"
Cohesion: 0.2
Nodes (8): getAuthenticatedClient(), getCalendar(), copyMeta, getDrive(), metadata, perm, writer, getGmail()

### Community 6 - "Community 6"
Cohesion: 0.24
Nodes (9): CONFIG_PATH, createOAuthClient(), __dirname, loadConfig(), runAuthFlow(), SCOPES, TOKEN_PATH, open (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (8): code:json ({), code:powershell (cd tools/google), code:block3 (gcal list --date today), Config, Google CLI Tools, Google Cloud Setup (one-time, ~5 min), Install, Usage

## Knowledge Gaps
- **61 isolated node(s):** `name`, `version`, `type`, `gcal`, `gmail` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `runAuthFlow()` connect `Community 6` to `Community 1`, `Community 4`?**
  _High betweenness centrality (0.211) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 0` to `Community 6`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **Why does `open` connect `Community 6` to `Community 0`?**
  _High betweenness centrality (0.198) - this node is a cross-community bridge._
- **What connects `name`, `version`, `type` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._