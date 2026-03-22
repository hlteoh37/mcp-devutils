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
| `http_status` | Look up HTTP status code meaning and usage |
| `slug` | Generate URL-safe slugs from text |
| `escape_html` | Escape or unescape HTML entities |
| `chmod_calc` | Convert between numeric and symbolic Unix permissions |
| `diff` | Compare two texts and show differences line by line |
| `number_base` | Convert numbers between decimal, hex, octal, and binary |
| `lorem_ipsum` | Generate placeholder lorem ipsum text |
| `word_count` | Count characters, words, lines, and bytes in text |
| `cidr` | Parse CIDR notation — network, broadcast, host range |
| `case_convert` | Convert between camelCase, snake_case, PascalCase, kebab-case, CONSTANT_CASE, Title Case |
| `markdown_toc` | Generate table of contents from markdown headings |

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

### http_status
Look up HTTP status codes:
- `code`: HTTP status code (required), e.g. `404`, `502`
- Returns status name, category, and description

### slug
Generate URL-safe slugs:
- `text`: Text to slugify (required)
- `separator`: Word separator (default: `-`)

### escape_html
Escape or unescape HTML entities:
- `text`: Input text (required)
- `action`: `escape` or `unescape` (default: escape)

### chmod_calc
Convert Unix file permissions:
- `permission`: Numeric (e.g. `755`) or symbolic (e.g. `rwxr-xr-x`) (required)
- Returns both formats plus owner/group/other breakdown

### diff
Compare two texts:
- `text1`: Original text (required)
- `text2`: Modified text (required)
- Returns line-by-line diff with added/removed/unchanged summary

### number_base
Convert numbers between bases:
- `value`: Number string (required) — prefix `0x` for hex, `0o` for octal, `0b` for binary, or plain decimal
- Returns decimal, hex, octal, and binary representations

### lorem_ipsum
Generate placeholder text:
- `count`: Number of units (default: 1, max: 20)
- `unit`: `paragraphs`, `sentences`, or `words` (default: paragraphs)

### word_count
Analyze text:
- `text`: Input text (required)
- Returns character count, word count, line count, and byte size

### cidr
Parse CIDR notation:
- `notation`: CIDR string (required), e.g. `192.168.1.0/24`
- Returns network, netmask, broadcast, host range, total hosts

### case_convert
Convert between naming conventions:
- `text`: Input text (required), e.g. `myVariableName` or `my-variable-name`
- `to`: Target case (required) — `camel`, `snake`, `pascal`, `kebab`, `constant`, or `title`
- Returns converted text plus all format variants

### markdown_toc
Generate a table of contents:
- `markdown`: Markdown text (required)
- `max_depth`: Maximum heading level to include (default: 3)
- Returns formatted TOC with anchor links

## See Also

- [mcp-apitools](https://www.npmjs.com/package/mcp-apitools) — 8 API & web dev utilities: HTTP status codes, MIME types, JWT creation, mock data, CORS headers, cookie parsing
- [mcp-texttools](https://www.npmjs.com/package/mcp-texttools) — 10 text transformation tools: case convert, slugify, word count, lorem ipsum, regex replace, markdown strip
- [mcp-mathtools](https://www.npmjs.com/package/mcp-mathtools) — 12 math & statistics tools: arithmetic, statistics, unit conversion, financial calculations, matrices
- [mcp-datetime](https://www.npmjs.com/package/mcp-datetime) — 10 date & time tools: timezone conversion, date math, cron explanation, business days
- [mcp-quick-calc](https://www.npmjs.com/package/mcp-quick-calc) — 5 calculator tools: currency conversion, percentages, compound interest, unit conversion, loan payments
- **[mcp-all-tools](https://www.npmjs.com/package/mcp-all-tools)** — All 54+ tools in a single MCP server

## License

MIT — [Hong Teoh](https://github.com/hlteoh37)

## Support

If this tool saves you time, consider buying me a coffee:
[buymeacoffee.com/gl89tu25lp](https://buymeacoffee.com/gl89tu25lp)
