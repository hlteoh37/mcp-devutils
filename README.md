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

## License

MIT — [Hong Teoh](https://github.com/hlteoh37)

## Support

If this tool saves you time, consider buying me a coffee:
[buymeacoffee.com/gl89tu25lp](https://buymeacoffee.com/gl89tu25lp)
