# Graph Report - my-video  (2026-05-29)

## Corpus Check
- 18 files · ~216,239 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 94 nodes · 105 edges · 11 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `25ba31ab`
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
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 11 edges
2. `dependencies` - 7 edges
3. `devDependencies` - 7 edges
4. `Remotion video` - 6 edges
5. `scripts` - 5 edges
6. `Commands` - 5 edges
7. `sp()` - 4 edges
8. `AdProps` - 3 edges
9. `RemotionRoot()` - 2 edges
10. `Arc()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (11 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (12): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib, module, noEmit, noUnusedLocals (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (11): description, license, name, private, repository, scripts, build, dev (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.18
Nodes (10): code:console (npm i), code:console (npm run dev), code:console (npx remotion render), code:console (npx remotion upgrade), Commands, Docs, Help, Issues (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (7): AdBase(), AdProps, angles, LOGO_PATH, theme, ids, RemotionRoot()

### Community 4 - "Community 4"
Cohesion: 0.24
Nodes (6): Logo(), codeStyle, subtitle, title, word, myCompSchema

### Community 5 - "Community 5"
Cohesion: 0.32
Nodes (4): Arc(), arcLength, Atom(), myCompSchema2

### Community 6 - "Community 6"
Cohesion: 0.29
Nodes (7): dependencies, react, react-dom, remotion, @remotion/cli, @remotion/zod-types, zod

### Community 7 - "Community 7"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, prettier, @remotion/eslint-config-flat, @types/react, @types/web, typescript

### Community 10 - "Community 10"
Cohesion: 0.24
Nodes (5): PromoAd(), Scene1(), Scene2(), Scene4(), sp()

## Knowledge Gaps
- **47 isolated node(s):** `name`, `version`, `description`, `repository`, `license` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 6` to `Community 1`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 7` to `Community 1`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._