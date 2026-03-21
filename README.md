# mcp-devutils

An MCP (Model Context Protocol) server with developer utilities. Use it directly with Claude Desktop, Cursor, or any MCP-compatible client.

## Tools

| Tool | Description |
|------|-------------|
| `uuid` | Generate UUID v4 (up to 10 at once) |
| `hash` | Hash text with md5, sha1, or sha256 |
| `base64` | Encode or decode base64 |
| `timestamp` | Convert between Unix timestamps and ISO 8601 |
| `jwt_decode` | Decode JWT token payload (no verification) |
| `random_string` | Generate random strings/passwords |
| `url_encode` | URL encode or decode strings |
| `json_format` | Pretty-print or minify JSON |
| `regex_test` | Test regex patterns against strings |
| `cron_explain` | Explain cron expressions in plain English + next 5 runs |
| `hmac` | Generate HMAC signatures (SHA-256, SHA-512, etc.) |
| `color_convert` | Convert colors between hex, RGB, and HSL |
| `semver_compare` | Compare two semantic versions |

## Installation

```bash
npm install -g mcp-devutils
```

Or use directly with `npx`:

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

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "devutils": {
      "command": "mcp-devutils"
    }
  }
}
```

Or with npx (no install needed):

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

## Usage with Cursor

Add to your Cursor MCP settings:

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

## Tool Examples

### uuid
Generate one or more UUIDs:
- `count`: Number of UUIDs to generate (1–10, default: 1)

### hash
Hash text with a chosen algorithm:
- `text`: Text to hash (required)
- `algorithm`: `md5`, `sha1`, or `sha256` (default: sha256)

### base64
Encode or decode base64:
- `text`: Input text (required)
- `action`: `encode` or `decode` (default: encode)

### timestamp
Convert timestamps:
- `value`: Unix timestamp or ISO date string (leave empty for current time)

### jwt_decode
Decode a JWT without verifying the signature:
- `token`: JWT string (required)
- Returns header, payload, expiry info

### random_string
Generate random strings:
- `length`: String length (default: 16, max: 256)
- `charset`: `alphanumeric`, `alpha`, `numeric`, `hex`, `password`, or `url-safe`

### url_encode
Encode or decode URLs:
- `text`: Input text (required)
- `action`: `encode` or `decode` (default: encode)

### json_format
Format or minify JSON:
- `json`: JSON string (required)
- `action`: `format` or `minify` (default: format)
- `indent`: Spaces for indentation (default: 2)

### regex_test
Test regex patterns:
- `pattern`: Regex pattern (required)
- `text`: String to test against (required)
- `flags`: Regex flags like `g`, `i`, `gi` (optional)

### cron_explain
Explain a cron expression in plain English and show the next 5 scheduled runs:
- `expression`: 5-field cron expression (required), e.g. `*/15 9-17 * * 1-5`

### hmac
Generate an HMAC signature:
- `message`: Message to sign (required)
- `key`: Secret key (required)
- `algorithm`: `sha256`, `sha512`, `sha1`, or `md5` (default: sha256)
- `encoding`: `hex` or `base64` (default: hex)

### color_convert
Convert colors between formats:
- `color`: Color string (required) — accepts `#ff5733`, `rgb(255,87,51)`, or `hsl(11,100%,60%)`
- Returns all three formats

### semver_compare
Compare two semantic versions:
- `version1`: First version (required), e.g. `1.2.3`
- `version2`: Second version (required), e.g. `2.0.0`
- Returns comparison result and parsed components

## License

MIT — [Hong Teoh](https://github.com/hlteoh37)

## Support

If this tool saves you time, consider buying me a coffee:
[buymeacoffee.com/gl89tu25lp](https://buymeacoffee.com/gl89tu25lp)
