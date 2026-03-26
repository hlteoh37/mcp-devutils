# mcp-devutils

[![npm version](https://img.shields.io/npm/v/mcp-devutils)](https://www.npmjs.com/package/mcp-devutils)
[![npm downloads](https://img.shields.io/npm/dw/mcp-devutils)](https://www.npmjs.com/package/mcp-devutils)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

MCP server with **45 developer utilities** for Claude Desktop, Cursor, Windsurf, and any MCP-compatible AI assistant.

**16 tools free forever** + **try all 29 pro tools 3 times each** — [unlock permanently for $5](https://buy.stripe.com/bJe00jgjugyr5Fi5cv9Zm05) (one-time).

> "Generate a UUID" · "Hash this password with SHA-256" · "Decode this JWT" · "What does 0 15 10 * * ? mean in cron?" · "Convert this JSON to CSV" · "Diff these two configs"
>
> Just ask your AI assistant — mcp-devutils handles it instantly, no browser tabs needed.

## Install

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "devutils": {
      "command": "npx",
      "args": ["-y", "mcp-devutils"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in your project or `~/.cursor/mcp.json` globally:

```json
{
  "mcpServers": {
    "devutils": {
      "command": "npx",
      "args": ["-y", "mcp-devutils"]
    }
  }
}
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "devutils": {
      "command": "npx",
      "args": ["-y", "mcp-devutils"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add devutils -- npx -y mcp-devutils
```

### VS Code (Copilot / Continue / Cline)

Add to `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "devutils": {
      "command": "npx",
      "args": ["-y", "mcp-devutils"]
    }
  }
}
```

## Unlock Pro (29 extra tools) — $5 one-time

1. **[Buy Pro License ($5)](https://buy.stripe.com/bJe00jgjugyr5Fi5cv9Zm05)**
2. Your license key is emailed within 1 hour
3. Add it to your MCP config:

```json
{
  "mcpServers": {
    "devutils": {
      "command": "npx",
      "args": ["-y", "mcp-devutils"],
      "env": {
        "MCP_DEVUTILS_KEY": "DU.xxxxx.xxxxx"
      }
    }
  }
}
```

## Free Tools (16)

| Tool | Description |
|------|-------------|
| `uuid` | Generate UUID v4 (batch support) |
| `hash` | Hash text (md5, sha1, sha256) |
| `base64` | Encode/decode base64 |
| `timestamp` | Convert Unix ↔ ISO 8601 dates |
| `jwt_decode` | Decode JWT tokens (header + payload) |
| `random_string` | Generate random strings/passwords |
| `url_encode` | URL encode/decode |
| `json_format` | Pretty-print or minify JSON |
| `yaml_json` | Convert between YAML and JSON (auto-detects format) |
| `regex_test` | Test regex patterns with match details |
| `cron_explain` | Explain cron expressions + next run times |
| `hmac` | Generate HMAC signatures |
| `color_convert` | Convert hex ↔ RGB ↔ HSL colors |
| `http_status` | Look up HTTP status code meanings |
| `slug` | Generate URL-safe slugs |
| `escape_html` | Escape/unescape HTML entities |
| `devutils_status` | Show license status and remaining trial uses |

## Pro Tools (29)

| Tool | Description |
|------|-------------|
| `semver_compare` | Compare semantic versions |
| `chmod_calc` | Convert numeric ↔ symbolic permissions |
| `diff` | Compare two text strings |
| `number_base` | Convert decimal/hex/octal/binary |
| `lorem_ipsum` | Generate placeholder text |
| `word_count` | Count chars, words, lines, bytes |
| `cidr` | Parse CIDR notation (network, broadcast, hosts) |
| `case_convert` | Convert camelCase/snake_case/PascalCase/kebab-case |
| `markdown_toc` | Generate table of contents from markdown |
| `env_parse` | Parse and validate .env files |
| `ip_info` | Analyze IP addresses (type, class, private/public) |
| `password_strength` | Analyze password entropy and strength |
| `data_size` | Convert between bytes/KB/MB/GB/TB (SI + IEC) |
| `string_escape` | Escape strings for JSON/CSV/regex/SQL/shell |
| `nanoid` | Generate compact, URL-safe unique IDs |
| `csv_json` | Convert between CSV and JSON |
| `hex_encode` | Hex encode/decode text |
| `char_info` | Unicode character info (codepoint, UTF-8 bytes, HTML entity) |
| `byte_count` | Count string bytes in UTF-8/UTF-16/ASCII |
| `json_diff` | Compare two JSON objects — show added/removed/changed |
| `jwt_create` | Create HS256 JWT tokens for API testing |
| `sql_format` | Format SQL queries with proper indentation |
| `json_query` | Extract values from JSON using dot-notation paths |
| `epoch_convert` | Convert epoch timestamps across multiple timezones |
| `aes_encrypt` | AES-256-CBC encrypt text with any key |
| `aes_decrypt` | Decrypt AES-256-CBC encrypted text |
| `rsa_keygen` | Generate RSA key pairs (1024/2048/4096-bit) |
| `scrypt_hash` | Hash passwords with scrypt (RFC 7914) |
| `regex_replace` | Find & replace with regex + capture groups |

## Also available as a VS Code extension

Prefer tools in your editor sidebar? **[DevUtils for VS Code](https://hlteoh37.github.io/devutils-vscode/)** — same 45 tools, native VS Code UI. Works on selected text, activity bar panel, keyboard shortcuts.

## Minimal dependencies

Only requires `@modelcontextprotocol/sdk` and `js-yaml`. All other tools use Node.js built-ins.

## Support

- **[Get Pro ($5)](https://buy.stripe.com/bJe00jgjugyr5Fi5cv9Zm05)** — unlock all 45 tools
- [Buy Me a Coffee](https://buymeacoffee.com/gl89tu25lp)

## License

MIT
