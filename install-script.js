/**
 * Installer shell script served to CLI clients (curl … | sh) at kasi.kasion.dev.
 * Kept as a JS string module so it bundles into the Worker like inline code
 * (a raw .sh Text module trips Cloudflare's upload WAF).
 */
export default `#!/usr/bin/env sh
set -eu

# Note: /plugin … are Claude Code / Cowork slash commands, NOT shell commands.
# A curl | sh pipe cannot run them — so this script prints the steps to paste
# into your Cowork / Claude Code session.

printf '\\n'
printf '🚀  Kasidit — Mindful AI coding framework for Claude Code / Cowork\\n'
printf '\\n'
printf 'Run these two commands inside your Cowork / Claude Code session:\\n'
printf '\\n'
printf '    /plugin marketplace add kasidit-wansudon/kasidit\\n'
printf '    /plugin install kasidit@kasidit\\n'
printf '\\n'
printf 'Then restart Cowork to apply.\\n'
printf '\\n'
printf 'Docs: https://github.com/kasidit-wansudon/kasidit\\n'
printf '\\n'
`;
