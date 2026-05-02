#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter db push

# Sync to GitHub backup. GITHUB_TOKEN must be set as a project secret.
if [ -z "$GITHUB_TOKEN" ]; then
  echo "ERROR: GITHUB_TOKEN secret is not set. Cannot sync to GitHub." >&2
  exit 1
fi

# Use GIT_ASKPASS to pass credentials without embedding the token in the remote URL.
ASKPASS=$(mktemp)
chmod +x "$ASKPASS"
cat > "$ASKPASS" << 'ASKPASS_EOF'
#!/bin/bash
case "$1" in
  *sername*) echo "x-access-token" ;;
  *assword*) echo "$GITHUB_TOKEN" ;;
esac
ASKPASS_EOF

cleanup() {
  rm -f "$ASKPASS"
  git remote remove github 2>/dev/null || true
}
trap cleanup EXIT

git remote remove github 2>/dev/null || true
git remote add github "https://github.com/nullcove/smart-notes-app.git"
# Fetch first so --force-with-lease knows the current remote state before overwriting.
GIT_ASKPASS="$ASKPASS" GIT_TERMINAL_PROMPT=0 git fetch github main 2>/dev/null || true
GIT_ASKPASS="$ASKPASS" GIT_TERMINAL_PROMPT=0 git push github main --force-with-lease
