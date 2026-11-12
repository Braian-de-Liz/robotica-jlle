# Graph Report - robotica-jlle  (2026-11-11)

## Corpus Check
- Corpus is ~9,757 words - fits in a single context window. You may not need a graph.

## Summary
- 256 nodes · 289 edges · 28 communities (12 shown, 16 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- API Server & Dependencies
- Frontend Dev Dependencies
- Database Schema (Domain Tables)
- API TypeScript Config
- Frontend App TS Config
- Frontend Build & Lint Docs
- Frontend Node TS Config
- API NPM Scripts
- React App Runtime
- Brand Assets & Icons
- Database Connection Layer
- Frontend NPM Scripts
- Frontend TS Project Refs

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 20 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 15 edges
4. `scripts` - 12 edges
5. `Icon Sprite Sheet (SVG <symbol> Set)` - 7 edges
6. `React + TypeScript + Vite template stack` - 6 edges
7. `scripts` - 5 edges
8. `Bun runtime toolchain` - 5 edges
9. `Purple Gradient Brand Palette (#7e14ff / #863bff / #aa3bff)` - 5 edges
10. `drizzle-orm` - 4 edges

## Surprising Connections (you probably didn't know these)
- `bun check (type check)` --semantically_similar_to--> `Type-aware lint rule tiers`  [INFERRED] [semantically similar]
  README.md → frontend/README.md
- `api (Bun backend service)` --conceptually_related_to--> `React + TypeScript + Vite template stack`  [INFERRED]
  README.md → frontend/README.md
- `Site Favicon (Purple Gradient Fluted Mark)` --semantically_similar_to--> `Vite Logo Asset (Purple Gradient Variant)`  [INFERRED] [semantically similar]
  frontend/public/favicon.svg → frontend/src/assets/vite.svg
- `Hero Illustration — Exploded Stacked Plates` --conceptually_related_to--> `Purple Gradient Brand Palette (#7e14ff / #863bff / #aa3bff)`  [INFERRED]
  frontend/src/assets/hero.png → frontend/public/favicon.svg
- `React Logo Asset (Official Atom Logo)` --conceptually_related_to--> `Purple Gradient Brand Palette (#7e14ff / #863bff / #aa3bff)`  [INFERRED]
  frontend/src/assets/react.svg → frontend/public/favicon.svg

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Frontend build & lint toolchain (React + TS + Vite + ESLint)** — frontend_readme_react_typescript_vite_stack, frontend_readme_vite_plugin_react, frontend_readme_react_compiler, frontend_readme_eslint_config, frontend_index_html_shell [INFERRED 0.85]
- **HTML shell to React mount pipeline** — frontend_index_html_shell, frontend_index_html_main_tsx, frontend_index_html_root_mount, frontend_index_html_favicon [EXTRACTED 0.90]
- **Bun development workflow commands** — readme_bun_runtime, readme_bun_install, readme_entry_index_ts, readme_bun_check, readme_bun_fmt [EXTRACTED 0.90]
- **Purple Gradient Brand Asset Family (favicon, Vite mark, hero art, outline icons)** — frontend_public_favicon_favicon, frontend_src_assets_vite_vitelogo, frontend_src_assets_hero_heroimage, frontend_public_icons_iconsprite, frontend_public_favicon_purplegradientpalette [INFERRED 0.85]
- **Social & Community Link Icon Set bundled in icons.svg** — frontend_public_icons_iconsprite, frontend_public_icons_blueskyicon, frontend_public_icons_discordicon, frontend_public_icons_githubicon, frontend_public_icons_xicon, frontend_public_icons_socialicon [EXTRACTED 1.00]

## Communities (28 total, 16 thin omitted)

### Community 0 - "API Server & Dependencies"
Cohesion: 0.06
Nodes (39): dependencies, fastify@5.12.7, @fastify/cookie@11.1.3, @fastify/cors@11.3.1, @fastify/jwt@10.2.5, @fastify/multipart@10.1.6, @fastify/rate-limit@11.2.1, @fastify/swagger@9.9.2 (+31 more)

### Community 1 - "Frontend Dev Dependencies"
Cohesion: 0.08
Nodes (37): devDependencies, @babel/core@^7.29.7, babel-plugin-react-compiler@^1.0.0, eslint@^10.14.0, @eslint/js@^10.0.1, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.7, globals@^17.13.0 (+29 more)

### Community 2 - "Database Schema (Domain Tables)"
Cohesion: 0.08
Nodes (24): avaliacao, cargo, cargoNomeEnum, checklistOperacional, contribuicaoFornecedor, convidadoAcesso, edicaoEvento, edicaoStatusEnum (+16 more)

### Community 3 - "API TypeScript Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, allowJs, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 4 - "Frontend App TS Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 5 - "Frontend Build & Lint Docs"
Cohesion: 0.14
Nodes (16): favicon.svg reference, /src/main.tsx module entry, #root mount point, index.html (Vite HTML entry shell), ESLint flat config (eslint.config.js), eslint-plugin-react-dom, eslint-plugin-react-x, React + TypeScript + Vite template stack (+8 more)

### Community 6 - "Frontend Node TS Config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 7 - "API NPM Scripts"
Cohesion: 0.17
Nodes (12): scripts, check, comp, compT, db:generate, db:migrate, db:push, db:studio (+4 more)

### Community 8 - "React App Runtime"
Cohesion: 0.21
Nodes (6): dependencies, react@^19.3.1, react-dom@^19.3.1, App(), react, react-dom

### Community 9 - "Brand Assets & Icons"
Cohesion: 0.18
Nodes (12): Site Favicon (Purple Gradient Fluted Mark), Purple Gradient Brand Palette (#7e14ff / #863bff / #aa3bff), Bluesky Icon Symbol, Discord Icon Symbol, Documentation Link Icon Symbol, GitHub Icon Symbol, Icon Sprite Sheet (SVG <symbol> Set), Generic Social (Person + Star) Icon Symbol (+4 more)

### Community 10 - "Database Connection Layer"
Cohesion: 0.18
Nodes (8): drizzle-orm@1.0.0-rc.5, fastify-plugin@6.0.1, DrizzleDB, fastify, FastifyInstance, op, drizzle-orm, fastify-plugin

### Community 11 - "Frontend NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

## Knowledge Gaps
- **13 isolated node(s):** `bun install (dependency install)`, `bun fmt (code formatting)`, `eslint-plugin-react-x`, `eslint-plugin-react-dom`, `favicon.svg reference` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 145 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `drizzle-orm` connect `Database Connection Layer` to `API Server & Dependencies`, `Database Schema (Domain Tables)`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `bun install (dependency install)`, `bun fmt (code formatting)`, `eslint-plugin-react-x` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API Server & Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06363636363636363 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `API NPM Scripts` to `API Server & Dependencies`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `Frontend Dev Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07948717948717948 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `API Server & Dependencies` to `Database Connection Layer`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `Database Schema (Domain Tables)` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._