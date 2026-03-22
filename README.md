# mcp-devutils

MCP server with **35 developer utilities** for Claude Desktop, Cursor, and any MCP-compatible AI assistant.

## Install

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

## Tools (35)

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
| `regex_test` | Test regex patterns with match details |
| `cron_explain` | Explain cron expressions + next run times |
| `hmac` | Generate HMAC signatures |
| `color_convert` | Convert hex ↔ RGB ↔ HSL colors |
| `semver_compare` | Compare semantic versions |
| `http_status` | Look up HTTP status code meanings |
| `slug` | Generate URL-safe slugs |
| `escape_html` | Escape/unescape HTML entities |
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

## Zero dependencies

Only requires `@modelcontextprotocol/sdk`. All tools use Node.js built-ins.

## Support

If this tool saves you time, consider supporting development:

- [Buy me a coffee](https://buymeacoffee.com/gl89tu25lp)
- [Tip via Stripe ($3)](https://buy.stripe.com/dRm8wP8R295Z9VyeN59Zm00)

## License

MIT
