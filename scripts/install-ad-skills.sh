#!/usr/bin/env bash
# Install claude-ads + competitive-ads-extractor skills into ~/.claude (Linux/Arch)
# Run: bash install-ad-skills.sh
set -e
tmp="$(mktemp -d)"
dest="$HOME/.claude"
mkdir -p "$dest/skills" "$dest/agents"

echo "Cloning repos..."
git clone --depth 1 https://github.com/AgriciDaniel/claude-ads.git "$tmp/claude-ads"
git clone --depth 1 https://github.com/ComposioHQ/awesome-claude-skills.git "$tmp/awesome"

src="$tmp/claude-ads"
echo "Installing skills..."
cp -r "$src/ads" "$dest/skills/ads"
cp -r "$src/scripts" "$dest/skills/ads/scripts"
cp -r "$src/skills/." "$dest/skills/"
cp -r "$src/agents/." "$dest/agents/"
cp -r "$tmp/awesome/competitive-ads-extractor" "$dest/skills/competitive-ads-extractor"

rm -rf "$tmp"
n=$(ls -d "$dest"/skills/ads* "$dest"/skills/competitive* 2>/dev/null | wc -l)
echo "Done. $n ad skills installed to $dest/skills"
echo "Set token:  echo 'export META_ACCESS_TOKEN=your_token' >> ~/.bashrc && source ~/.bashrc"
