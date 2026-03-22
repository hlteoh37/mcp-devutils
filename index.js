#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import crypto from "crypto";

const server = new Server(
  { name: "mcp-devutils", version: "1.5.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "uuid",
        description: "Generate a UUID v4",
        inputSchema: {
          type: "object",
          properties: {
            count: {
              type: "number",
              description: "Number of UUIDs to generate (default: 1, max: 10)"
            }
          }
        }
      },
      {
        name: "hash",
        description: "Hash text using md5, sha1, or sha256",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to hash" },
            algorithm: {
              type: "string",
              enum: ["md5", "sha1", "sha256"],
              description: "Hash algorithm (default: sha256)"
            }
          },
          required: ["text"]
        }
      },
      {
        name: "base64",
        description: "Encode or decode base64",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to encode or decode" },
            action: {
              type: "string",
              enum: ["encode", "decode"],
              description: "Action: encode or decode (default: encode)"
            }
          },
          required: ["text"]
        }
      },
      {
        name: "timestamp",
        description: "Convert between Unix timestamps and ISO 8601 dates",
        inputSchema: {
          type: "object",
          properties: {
            value: {
              type: "string",
              description: "Unix timestamp (number) or ISO date string to convert. Leave empty for current time."
            }
          }
        }
      },
      {
        name: "jwt_decode",
        description: "Decode a JWT token (no signature verification, just decode the payload)",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT token to decode" }
          },
          required: ["token"]
        }
      },
      {
        name: "random_string",
        description: "Generate a random string or password",
        inputSchema: {
          type: "object",
          properties: {
            length: { type: "number", description: "Length of the string (default: 16)" },
            charset: {
              type: "string",
              enum: ["alphanumeric", "alpha", "numeric", "hex", "password", "url-safe"],
              description: "Character set to use (default: alphanumeric)"
            }
          }
        }
      },
      {
        name: "url_encode",
        description: "URL encode or decode a string",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to encode or decode" },
            action: {
              type: "string",
              enum: ["encode", "decode"],
              description: "Action: encode or decode (default: encode)"
            }
          },
          required: ["text"]
        }
      },
      {
        name: "json_format",
        description: "Format (pretty-print) or minify JSON",
        inputSchema: {
          type: "object",
          properties: {
            json: { type: "string", description: "JSON string to format or minify" },
            action: {
              type: "string",
              enum: ["format", "minify"],
              description: "Action: format or minify (default: format)"
            },
            indent: { type: "number", description: "Indent spaces for format (default: 2)" }
          },
          required: ["json"]
        }
      },
      {
        name: "regex_test",
        description: "Test a regex pattern against a string",
        inputSchema: {
          type: "object",
          properties: {
            pattern: { type: "string", description: "Regular expression pattern" },
            text: { type: "string", description: "Text to test against" },
            flags: { type: "string", description: "Regex flags (e.g. 'gi' for global case-insensitive)" }
          },
          required: ["pattern", "text"]
        }
      },
      {
        name: "cron_explain",
        description: "Explain a cron expression in plain English and show the next 5 run times",
        inputSchema: {
          type: "object",
          properties: {
            expression: { type: "string", description: "Cron expression (5 fields: minute hour day month weekday)" }
          },
          required: ["expression"]
        }
      },
      {
        name: "hmac",
        description: "Generate an HMAC signature for a message",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string", description: "Message to sign" },
            key: { type: "string", description: "Secret key" },
            algorithm: {
              type: "string",
              enum: ["sha256", "sha512", "sha1", "md5"],
              description: "Hash algorithm (default: sha256)"
            },
            encoding: {
              type: "string",
              enum: ["hex", "base64"],
              description: "Output encoding (default: hex)"
            }
          },
          required: ["message", "key"]
        }
      },
      {
        name: "color_convert",
        description: "Convert colors between hex, RGB, and HSL formats",
        inputSchema: {
          type: "object",
          properties: {
            color: { type: "string", description: "Color value (e.g. '#ff5733', 'rgb(255,87,51)', 'hsl(11,100%,60%)')" }
          },
          required: ["color"]
        }
      },
      {
        name: "semver_compare",
        description: "Compare two semantic versions or check if a version satisfies a range",
        inputSchema: {
          type: "object",
          properties: {
            version1: { type: "string", description: "First version (e.g. '1.2.3')" },
            version2: { type: "string", description: "Second version to compare against (e.g. '1.3.0')" }
          },
          required: ["version1", "version2"]
        }
      },
      {
        name: "http_status",
        description: "Look up HTTP status code meaning, category, and common usage",
        inputSchema: {
          type: "object",
          properties: {
            code: { type: "number", description: "HTTP status code (e.g. 404, 502)" }
          },
          required: ["code"]
        }
      },
      {
        name: "slug",
        description: "Generate a URL-safe slug from text",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to slugify" },
            separator: { type: "string", description: "Word separator (default: '-')" }
          },
          required: ["text"]
        }
      },
      {
        name: "escape_html",
        description: "Escape or unescape HTML entities",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to escape or unescape" },
            action: {
              type: "string",
              enum: ["escape", "unescape"],
              description: "Action: escape or unescape (default: escape)"
            }
          },
          required: ["text"]
        }
      },
      {
        name: "chmod_calc",
        description: "Convert between numeric and symbolic Unix file permissions (e.g. 755 ↔ rwxr-xr-x)",
        inputSchema: {
          type: "object",
          properties: {
            permission: { type: "string", description: "Numeric (e.g. '755') or symbolic (e.g. 'rwxr-xr-x') permission" }
          },
          required: ["permission"]
        }
      },
      {
        name: "diff",
        description: "Compare two text strings and show the differences line by line",
        inputSchema: {
          type: "object",
          properties: {
            text1: { type: "string", description: "First text (original)" },
            text2: { type: "string", description: "Second text (modified)" }
          },
          required: ["text1", "text2"]
        }
      },
      {
        name: "number_base",
        description: "Convert numbers between decimal, hexadecimal, octal, and binary",
        inputSchema: {
          type: "object",
          properties: {
            value: { type: "string", description: "Number to convert (prefix with 0x for hex, 0o for octal, 0b for binary, or plain decimal)" }
          },
          required: ["value"]
        }
      },
      {
        name: "lorem_ipsum",
        description: "Generate placeholder lorem ipsum text",
        inputSchema: {
          type: "object",
          properties: {
            count: { type: "number", description: "Number of units to generate (default: 1)" },
            unit: {
              type: "string",
              enum: ["paragraphs", "sentences", "words"],
              description: "Unit type (default: paragraphs)"
            }
          }
        }
      },
      {
        name: "word_count",
        description: "Count characters, words, lines, and bytes in text",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to analyze" }
          },
          required: ["text"]
        }
      },
      {
        name: "cidr",
        description: "Parse CIDR notation and show network address, broadcast, host range, and number of hosts",
        inputSchema: {
          type: "object",
          properties: {
            notation: { type: "string", description: "CIDR notation (e.g. '192.168.1.0/24')" }
          },
          required: ["notation"]
        }
      },
      {
        name: "case_convert",
        description: "Convert text between camelCase, snake_case, PascalCase, kebab-case, CONSTANT_CASE, and Title Case",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to convert (e.g. 'myVariableName' or 'my-variable-name')" },
            to: {
              type: "string",
              enum: ["camel", "snake", "pascal", "kebab", "constant", "title"],
              description: "Target case format"
            }
          },
          required: ["text", "to"]
        }
      },
      {
        name: "markdown_toc",
        description: "Generate a table of contents from markdown headings",
        inputSchema: {
          type: "object",
          properties: {
            markdown: { type: "string", description: "Markdown text to extract headings from" },
            max_depth: { type: "number", description: "Maximum heading depth to include (default: 3)" }
          },
          required: ["markdown"]
        }
      },
      {
        name: "env_parse",
        description: "Parse and validate .env file contents — shows keys, detects issues like missing values, duplicate keys, or invalid lines",
        inputSchema: {
          type: "object",
          properties: {
            content: { type: "string", description: ".env file content to parse and validate" }
          },
          required: ["content"]
        }
      },
      {
        name: "ip_info",
        description: "Parse and analyze an IP address — shows type (IPv4/IPv6), class, whether private/public/loopback/link-local",
        inputSchema: {
          type: "object",
          properties: {
            ip: { type: "string", description: "IP address to analyze (e.g. '192.168.1.1' or '::1')" }
          },
          required: ["ip"]
        }
      },
      {
        name: "password_strength",
        description: "Analyze password strength — calculates entropy, checks length, character diversity, and common patterns",
        inputSchema: {
          type: "object",
          properties: {
            password: { type: "string", description: "Password to analyze" }
          },
          required: ["password"]
        }
      },
      {
        name: "data_size",
        description: "Convert between data size units (bytes, KB, MB, GB, TB, PB) with both decimal (SI) and binary (IEC) representations",
        inputSchema: {
          type: "object",
          properties: {
            value: { type: "number", description: "Numeric value to convert" },
            unit: {
              type: "string",
              enum: ["B", "KB", "MB", "GB", "TB", "PB", "KiB", "MiB", "GiB", "TiB", "PiB"],
              description: "Source unit (default: B for bytes)"
            }
          },
          required: ["value"]
        }
      },
      {
        name: "string_escape",
        description: "Escape or unescape strings for various contexts: JSON, CSV, regex, SQL, or shell",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to escape or unescape" },
            format: {
              type: "string",
              enum: ["json", "csv", "regex", "sql", "shell"],
              description: "Target format to escape for"
            },
            action: {
              type: "string",
              enum: ["escape", "unescape"],
              description: "Action: escape or unescape (default: escape)"
            }
          },
          required: ["text", "format"]
        }
      },
      {
        name: "nanoid",
        description: "Generate compact, URL-safe unique IDs (like UUID but shorter). Customizable length and alphabet.",
        inputSchema: {
          type: "object",
          properties: {
            length: { type: "number", description: "ID length (default: 21)" },
            alphabet: { type: "string", description: "Custom alphabet (default: A-Za-z0-9_-)" },
            count: { type: "number", description: "Number of IDs to generate (default: 1, max: 10)" }
          }
        }
      },
      {
        name: "csv_json",
        description: "Convert between CSV and JSON. CSV→JSON parses CSV text into an array of objects. JSON→CSV converts an array of objects to CSV.",
        inputSchema: {
          type: "object",
          properties: {
            input: { type: "string", description: "CSV text or JSON string to convert" },
            direction: { type: "string", enum: ["csv_to_json", "json_to_csv"], description: "Conversion direction" },
            delimiter: { type: "string", description: "CSV delimiter (default: comma)" }
          },
          required: ["input", "direction"]
        }
      },
      {
        name: "hex_encode",
        description: "Encode text to hexadecimal or decode hex back to text",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to encode or hex string to decode" },
            action: { type: "string", enum: ["encode", "decode"], description: "Action (default: encode)" }
          },
          required: ["text"]
        }
      },
      {
        name: "char_info",
        description: "Get Unicode character info — codepoint, name category, UTF-8 bytes, HTML entity for each character in the input",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Characters to analyze (1-20 chars)" }
          },
          required: ["text"]
        }
      },
      {
        name: "byte_count",
        description: "Count the byte length of a string in UTF-8, UTF-16, and ASCII. Useful for checking API payload sizes and database field limits.",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to measure" }
          },
          required: ["text"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "uuid": {
        const count = Math.min(Math.max(1, args?.count || 1), 10);
        const uuids = Array.from({ length: count }, () => crypto.randomUUID());
        return {
          content: [{ type: "text", text: uuids.join("\n") }]
        };
      }

      case "hash": {
        const { text, algorithm = "sha256" } = args;
        const hash = crypto.createHash(algorithm).update(text, "utf8").digest("hex");
        return {
          content: [{ type: "text", text: `${algorithm}: ${hash}` }]
        };
      }

      case "base64": {
        const { text, action = "encode" } = args;
        let result;
        if (action === "encode") {
          result = Buffer.from(text, "utf8").toString("base64");
        } else {
          result = Buffer.from(text, "base64").toString("utf8");
        }
        return {
          content: [{ type: "text", text: result }]
        };
      }

      case "timestamp": {
        const { value } = args || {};
        let output = [];
        if (!value) {
          const now = new Date();
          output.push(`Current Unix timestamp: ${Math.floor(now.getTime() / 1000)}`);
          output.push(`Current ISO 8601: ${now.toISOString()}`);
          output.push(`Current UTC: ${now.toUTCString()}`);
        } else if (/^\d+(\.\d+)?$/.test(value.trim())) {
          const unix = parseFloat(value.trim());
          const ms = unix > 1e10 ? unix : unix * 1000;
          const date = new Date(ms);
          output.push(`Unix: ${Math.floor(unix)}`);
          output.push(`ISO 8601: ${date.toISOString()}`);
          output.push(`UTC: ${date.toUTCString()}`);
        } else {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            throw new Error(`Invalid date/timestamp: ${value}`);
          }
          output.push(`ISO 8601: ${date.toISOString()}`);
          output.push(`Unix timestamp: ${Math.floor(date.getTime() / 1000)}`);
          output.push(`UTC: ${date.toUTCString()}`);
        }
        return {
          content: [{ type: "text", text: output.join("\n") }]
        };
      }

      case "jwt_decode": {
        const { token } = args;
        const parts = token.trim().split(".");
        if (parts.length !== 3) {
          throw new Error("Invalid JWT: must have 3 parts separated by dots");
        }
        const decodeB64 = (str) => {
          const padded = str + "=".repeat((4 - (str.length % 4)) % 4);
          return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
        };
        const header = JSON.parse(decodeB64(parts[0]));
        const payload = JSON.parse(decodeB64(parts[1]));
        const result = {
          header,
          payload,
          signature: parts[2],
          note: "Signature NOT verified — decode only"
        };
        if (payload.exp) {
          const expDate = new Date(payload.exp * 1000);
          result.expires = expDate.toISOString();
          result.expired = expDate < new Date();
        }
        if (payload.iat) {
          result.issued_at = new Date(payload.iat * 1000).toISOString();
        }
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      }

      case "random_string": {
        const { length = 16, charset = "alphanumeric" } = args || {};
        const len = Math.min(Math.max(1, length), 256);
        const charsets = {
          alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
          alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
          numeric: "0123456789",
          hex: "0123456789abcdef",
          password: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?",
          "url-safe": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
        };
        const chars = charsets[charset] || charsets.alphanumeric;
        const bytes = crypto.randomBytes(len);
        let result = "";
        for (let i = 0; i < len; i++) {
          result += chars[bytes[i] % chars.length];
        }
        return {
          content: [{ type: "text", text: result }]
        };
      }

      case "url_encode": {
        const { text, action = "encode" } = args;
        let result;
        if (action === "encode") {
          result = encodeURIComponent(text);
        } else {
          result = decodeURIComponent(text);
        }
        return {
          content: [{ type: "text", text: result }]
        };
      }

      case "json_format": {
        const { json, action = "format", indent = 2 } = args;
        const parsed = JSON.parse(json);
        let result;
        if (action === "minify") {
          result = JSON.stringify(parsed);
        } else {
          result = JSON.stringify(parsed, null, Math.min(Math.max(0, indent), 8));
        }
        return {
          content: [{ type: "text", text: result }]
        };
      }

      case "regex_test": {
        const { pattern, text, flags = "" } = args;
        const regex = new RegExp(pattern, flags);
        const matches = [];
        let match;
        if (flags.includes("g")) {
          while ((match = regex.exec(text)) !== null) {
            matches.push({
              match: match[0],
              index: match.index,
              groups: match.groups || null
            });
            if (match.index === regex.lastIndex) regex.lastIndex++;
          }
        } else {
          match = regex.exec(text);
          if (match) {
            matches.push({
              match: match[0],
              index: match.index,
              groups: match.groups || null,
              captures: match.slice(1)
            });
          }
        }
        const result = {
          pattern,
          flags: flags || "(none)",
          text,
          matched: matches.length > 0,
          match_count: matches.length,
          matches
        };
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      }

      case "cron_explain": {
        const { expression } = args;
        const parts = expression.trim().split(/\s+/);
        if (parts.length !== 5) {
          throw new Error("Cron expression must have 5 fields: minute hour day month weekday");
        }
        const [minute, hour, day, month, weekday] = parts;
        const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const MONTHS = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        function describeField(val, fieldName) {
          if (val === "*") return `every ${fieldName}`;
          if (val.includes("/")) {
            const [base, step] = val.split("/");
            return base === "*" ? `every ${step} ${fieldName}s` : `every ${step} ${fieldName}s starting at ${base}`;
          }
          if (val.includes(",")) return `${fieldName}s ${val}`;
          if (val.includes("-")) return `${fieldName}s ${val.split("-")[0]} through ${val.split("-")[1]}`;
          return `${fieldName} ${val}`;
        }

        const explanation = [];
        explanation.push(`Expression: ${expression}`);
        explanation.push("");
        explanation.push("Schedule:");
        explanation.push(`  Minute: ${describeField(minute, "minute")}`);
        explanation.push(`  Hour: ${describeField(hour, "hour")}`);
        explanation.push(`  Day: ${describeField(day, "day")}`);
        explanation.push(`  Month: ${describeField(month, "month")}`);
        if (weekday !== "*") {
          const wdNames = weekday.split(",").map(w => WEEKDAYS[parseInt(w)] || w).join(", ");
          explanation.push(`  Weekday: ${wdNames}`);
        } else {
          explanation.push(`  Weekday: every day of the week`);
        }

        // Compute next 5 run times
        explanation.push("");
        explanation.push("Next 5 runs:");
        function matchesCron(date, parts) {
          const [m, h, d, mo, wd] = parts;
          function matches(val, actual, max) {
            if (val === "*") return true;
            if (val.includes("/")) {
              const [base, step] = val.split("/");
              const start = base === "*" ? 0 : parseInt(base);
              return (actual - start) % parseInt(step) === 0 && actual >= start;
            }
            if (val.includes(",")) return val.split(",").map(Number).includes(actual);
            if (val.includes("-")) {
              const [lo, hi] = val.split("-").map(Number);
              return actual >= lo && actual <= hi;
            }
            return parseInt(val) === actual;
          }
          return matches(m, date.getMinutes()) &&
                 matches(h, date.getHours()) &&
                 matches(d, date.getDate()) &&
                 matches(mo, date.getMonth() + 1) &&
                 matches(wd, date.getDay());
        }
        const now = new Date();
        let cursor = new Date(now);
        cursor.setSeconds(0, 0);
        cursor.setMinutes(cursor.getMinutes() + 1);
        let found = 0;
        const limit = 525960; // max 1 year of minutes
        for (let i = 0; i < limit && found < 5; i++) {
          if (matchesCron(cursor, parts)) {
            explanation.push(`  ${cursor.toISOString()}`);
            found++;
          }
          cursor.setMinutes(cursor.getMinutes() + 1);
        }
        if (found === 0) explanation.push("  (no runs found in next year)");

        return {
          content: [{ type: "text", text: explanation.join("\n") }]
        };
      }

      case "hmac": {
        const { message, key, algorithm = "sha256", encoding = "hex" } = args;
        const hmac = crypto.createHmac(algorithm, key).update(message, "utf8").digest(encoding);
        return {
          content: [{ type: "text", text: `HMAC-${algorithm.toUpperCase()} (${encoding}): ${hmac}` }]
        };
      }

      case "color_convert": {
        const { color } = args;
        let r, g, b;
        const hexMatch = color.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
        const rgbMatch = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        const hslMatch = color.match(/^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)$/i);

        if (hexMatch) {
          let hex = hexMatch[1];
          if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
          r = parseInt(hex.slice(0, 2), 16);
          g = parseInt(hex.slice(2, 4), 16);
          b = parseInt(hex.slice(4, 6), 16);
        } else if (rgbMatch) {
          r = parseInt(rgbMatch[1]);
          g = parseInt(rgbMatch[2]);
          b = parseInt(rgbMatch[3]);
        } else if (hslMatch) {
          const h = parseInt(hslMatch[1]) / 360;
          const s = parseInt(hslMatch[2]) / 100;
          const l = parseInt(hslMatch[3]) / 100;
          if (s === 0) {
            r = g = b = Math.round(l * 255);
          } else {
            const hue2rgb = (p, q, t) => {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1/6) return p + (q - p) * 6 * t;
              if (t < 1/2) return q;
              if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
            g = Math.round(hue2rgb(p, q, h) * 255);
            b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
          }
        } else {
          throw new Error("Unrecognized color format. Use hex (#ff5733), rgb(255,87,51), or hsl(11,100%,60%)");
        }

        // RGB to HSL
        const rn = r / 255, gn = g / 255, bn = b / 255;
        const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
        let h, s, l = (max + min) / 2;
        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
            case gn: h = ((bn - rn) / d + 2) / 6; break;
            case bn: h = ((rn - gn) / d + 4) / 6; break;
          }
        }

        const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        const output = [
          `Input: ${color}`,
          `HEX: ${hex}`,
          `RGB: rgb(${r}, ${g}, ${b})`,
          `HSL: hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
        ];
        return {
          content: [{ type: "text", text: output.join("\n") }]
        };
      }

      case "semver_compare": {
        const { version1, version2 } = args;
        function parse(v) {
          const match = v.match(/^v?(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
          if (!match) throw new Error(`Invalid semver: ${v}`);
          return { major: parseInt(match[1]), minor: parseInt(match[2]), patch: parseInt(match[3]), pre: match[4] || null };
        }
        const v1 = parse(version1);
        const v2 = parse(version2);

        function compare(a, b) {
          if (a.major !== b.major) return a.major - b.major;
          if (a.minor !== b.minor) return a.minor - b.minor;
          if (a.patch !== b.patch) return a.patch - b.patch;
          if (a.pre && !b.pre) return -1;
          if (!a.pre && b.pre) return 1;
          if (a.pre && b.pre) return a.pre < b.pre ? -1 : a.pre > b.pre ? 1 : 0;
          return 0;
        }

        const cmp = compare(v1, v2);
        const relation = cmp < 0 ? "less than" : cmp > 0 ? "greater than" : "equal to";
        const symbol = cmp < 0 ? "<" : cmp > 0 ? ">" : "=";

        const output = [
          `${version1} ${symbol} ${version2}`,
          `${version1} is ${relation} ${version2}`,
          "",
          `v1: major=${v1.major} minor=${v1.minor} patch=${v1.patch}${v1.pre ? ` pre=${v1.pre}` : ""}`,
          `v2: major=${v2.major} minor=${v2.minor} patch=${v2.patch}${v2.pre ? ` pre=${v2.pre}` : ""}`
        ];
        return {
          content: [{ type: "text", text: output.join("\n") }]
        };
      }

      case "http_status": {
        const { code } = args;
        const statuses = {
          100: ["Continue", "Informational", "The server has received the request headers and the client should proceed to send the request body."],
          101: ["Switching Protocols", "Informational", "The server is switching protocols as requested by the client (e.g. to WebSocket)."],
          200: ["OK", "Success", "The request succeeded. Standard response for successful HTTP requests."],
          201: ["Created", "Success", "The request succeeded and a new resource was created. Typical for POST requests."],
          202: ["Accepted", "Success", "The request has been accepted for processing, but processing is not complete."],
          204: ["No Content", "Success", "The request succeeded but there is no content to return. Common for DELETE requests."],
          301: ["Moved Permanently", "Redirection", "The resource has been permanently moved to a new URL. Clients should update bookmarks."],
          302: ["Found", "Redirection", "The resource temporarily resides at a different URL. Client should continue using the original URL."],
          304: ["Not Modified", "Redirection", "The resource has not been modified since the last request. Used for caching."],
          307: ["Temporary Redirect", "Redirection", "The request should be repeated with the same method at a different URL."],
          308: ["Permanent Redirect", "Redirection", "The resource has permanently moved. The request method should not change."],
          400: ["Bad Request", "Client Error", "The server cannot process the request due to malformed syntax or invalid parameters."],
          401: ["Unauthorized", "Client Error", "Authentication is required. The client must provide valid credentials."],
          403: ["Forbidden", "Client Error", "The server understood the request but refuses to authorize it. Authentication won't help."],
          404: ["Not Found", "Client Error", "The requested resource could not be found on the server."],
          405: ["Method Not Allowed", "Client Error", "The HTTP method is not allowed for the requested resource."],
          408: ["Request Timeout", "Client Error", "The server timed out waiting for the request from the client."],
          409: ["Conflict", "Client Error", "The request conflicts with the current state of the resource. Common in concurrent updates."],
          410: ["Gone", "Client Error", "The resource is no longer available and no forwarding address is known."],
          413: ["Payload Too Large", "Client Error", "The request body exceeds the server's size limit."],
          415: ["Unsupported Media Type", "Client Error", "The server does not support the media type of the request body."],
          422: ["Unprocessable Entity", "Client Error", "The request was well-formed but semantically invalid. Common in validation errors."],
          429: ["Too Many Requests", "Client Error", "The client has sent too many requests in a given time period (rate limiting)."],
          500: ["Internal Server Error", "Server Error", "An unexpected condition was encountered on the server."],
          501: ["Not Implemented", "Server Error", "The server does not support the functionality required to fulfill the request."],
          502: ["Bad Gateway", "Server Error", "The server received an invalid response from an upstream server."],
          503: ["Service Unavailable", "Server Error", "The server is temporarily unable to handle the request (overload or maintenance)."],
          504: ["Gateway Timeout", "Server Error", "The server did not receive a timely response from an upstream server."]
        };
        const info = statuses[code];
        if (!info) {
          const category = code >= 100 && code < 200 ? "Informational" : code < 300 ? "Success" : code < 400 ? "Redirection" : code < 500 ? "Client Error" : code < 600 ? "Server Error" : "Unknown";
          return { content: [{ type: "text", text: `${code}: Unknown status code\nCategory: ${category}` }] };
        }
        return {
          content: [{ type: "text", text: `${code} ${info[0]}\nCategory: ${info[1]}\nDescription: ${info[2]}` }]
        };
      }

      case "slug": {
        const { text, separator = "-" } = args;
        const slug = text.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/[\s-]+/g, separator);
        return { content: [{ type: "text", text: slug }] };
      }

      case "escape_html": {
        const { text, action = "escape" } = args;
        let result;
        if (action === "escape") {
          result = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
        } else {
          result = text
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&gt;/g, ">")
            .replace(/&lt;/g, "<")
            .replace(/&amp;/g, "&");
        }
        return { content: [{ type: "text", text: result }] };
      }

      case "chmod_calc": {
        const { permission } = args;
        const numericMatch = permission.match(/^[0-7]{3,4}$/);
        const symbolicMatch = permission.match(/^([r-][w-][xsS-])([r-][w-][xsS-])([r-][w-][xtT-])$/);

        if (numericMatch) {
          const digits = permission.length === 4 ? permission : "0" + permission;
          const special = parseInt(digits[0]);
          const owner = parseInt(digits[1]);
          const group = parseInt(digits[2]);
          const other = parseInt(digits[3]);

          function toSymbolic(val, pos, specialBit) {
            let r = (val & 4) ? "r" : "-";
            let w = (val & 2) ? "w" : "-";
            let x = (val & 1) ? "x" : "-";
            if (specialBit) {
              if (pos === "owner" && (special & 4)) x = (val & 1) ? "s" : "S";
              if (pos === "group" && (special & 2)) x = (val & 1) ? "s" : "S";
              if (pos === "other" && (special & 1)) x = (val & 1) ? "t" : "T";
            }
            return r + w + x;
          }

          const sym = toSymbolic(owner, "owner", true) + toSymbolic(group, "group", true) + toSymbolic(other, "other", true);
          const desc = [];
          desc.push(`Numeric: ${permission}`);
          desc.push(`Symbolic: ${sym}`);
          desc.push(`Owner: ${["---","--x","-w-","-wx","r--","r-x","rw-","rwx"][owner]} (${owner})`);
          desc.push(`Group: ${["---","--x","-w-","-wx","r--","r-x","rw-","rwx"][group]} (${group})`);
          desc.push(`Other: ${["---","--x","-w-","-wx","r--","r-x","rw-","rwx"][other]} (${other})`);
          return { content: [{ type: "text", text: desc.join("\n") }] };
        } else if (symbolicMatch) {
          function fromSymbolic(s) {
            let val = 0;
            if (s[0] === "r") val += 4;
            if (s[1] === "w") val += 2;
            if (s[2] === "x" || s[2] === "s" || s[2] === "t") val += 1;
            return val;
          }
          const o = fromSymbolic(symbolicMatch[1]);
          const g = fromSymbolic(symbolicMatch[2]);
          const t = fromSymbolic(symbolicMatch[3]);
          const numeric = `${o}${g}${t}`;
          return { content: [{ type: "text", text: `Symbolic: ${permission}\nNumeric: ${numeric}\nOwner: ${o}, Group: ${g}, Other: ${t}` }] };
        } else {
          throw new Error("Invalid permission. Use numeric (e.g. '755') or symbolic (e.g. 'rwxr-xr-x')");
        }
      }

      case "diff": {
        const { text1, text2 } = args;
        const lines1 = text1.split("\n");
        const lines2 = text2.split("\n");
        const output = [];
        const maxLen = Math.max(lines1.length, lines2.length);

        // Simple line-by-line diff
        let added = 0, removed = 0, unchanged = 0;
        for (let i = 0; i < maxLen; i++) {
          const l1 = i < lines1.length ? lines1[i] : undefined;
          const l2 = i < lines2.length ? lines2[i] : undefined;
          if (l1 === l2) {
            output.push(`  ${l1}`);
            unchanged++;
          } else {
            if (l1 !== undefined) { output.push(`- ${l1}`); removed++; }
            if (l2 !== undefined) { output.push(`+ ${l2}`); added++; }
          }
        }

        const summary = `\n--- Summary: ${added} added, ${removed} removed, ${unchanged} unchanged`;
        return { content: [{ type: "text", text: output.join("\n") + summary }] };
      }

      case "number_base": {
        const { value } = args;
        let num;
        const v = value.trim();
        if (v.startsWith("0x") || v.startsWith("0X")) num = parseInt(v, 16);
        else if (v.startsWith("0o") || v.startsWith("0O")) num = parseInt(v.slice(2), 8);
        else if (v.startsWith("0b") || v.startsWith("0B")) num = parseInt(v.slice(2), 2);
        else num = parseInt(v, 10);
        if (isNaN(num)) throw new Error(`Invalid number: ${value}`);
        const output = [
          `Decimal:     ${num}`,
          `Hexadecimal: 0x${num.toString(16).toUpperCase()}`,
          `Octal:       0o${num.toString(8)}`,
          `Binary:      0b${num.toString(2)}`
        ];
        return { content: [{ type: "text", text: output.join("\n") }] };
      }

      case "lorem_ipsum": {
        const { count = 1, unit = "paragraphs" } = args || {};
        const sentences = [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
          "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
          "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.",
          "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit.",
          "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.",
          "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis."
        ];
        const n = Math.min(Math.max(1, count), 20);
        let result;
        if (unit === "words") {
          const allWords = sentences.join(" ").split(/\s+/);
          const words = [];
          for (let i = 0; i < n; i++) words.push(allWords[i % allWords.length]);
          result = words.join(" ");
        } else if (unit === "sentences") {
          const out = [];
          for (let i = 0; i < n; i++) out.push(sentences[i % sentences.length]);
          result = out.join(" ");
        } else {
          const paras = [];
          for (let i = 0; i < n; i++) {
            const start = (i * 3) % sentences.length;
            const para = [];
            for (let j = 0; j < 5; j++) para.push(sentences[(start + j) % sentences.length]);
            paras.push(para.join(" "));
          }
          result = paras.join("\n\n");
        }
        return { content: [{ type: "text", text: result }] };
      }

      case "word_count": {
        const { text } = args;
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, "").length;
        const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
        const lines = text.split("\n").length;
        const bytes = Buffer.byteLength(text, "utf8");
        const output = [
          `Characters: ${chars}`,
          `Characters (no spaces): ${charsNoSpaces}`,
          `Words: ${words}`,
          `Lines: ${lines}`,
          `Bytes (UTF-8): ${bytes}`
        ];
        return { content: [{ type: "text", text: output.join("\n") }] };
      }

      case "cidr": {
        const { notation } = args;
        const match = notation.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/);
        if (!match) throw new Error("Invalid CIDR notation. Use format: 192.168.1.0/24");
        const octets = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseInt(match[4])];
        const prefix = parseInt(match[5]);
        if (octets.some(o => o < 0 || o > 255) || prefix < 0 || prefix > 32) {
          throw new Error("Invalid IP address or prefix length");
        }
        const ip = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
        const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
        const network = (ip & mask) >>> 0;
        const broadcast = (network | ~mask) >>> 0;
        const firstHost = prefix >= 31 ? network : (network + 1) >>> 0;
        const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;
        const hostCount = prefix >= 31 ? (prefix === 32 ? 1 : 2) : Math.pow(2, 32 - prefix) - 2;
        const toIP = (n) => `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`;
        const output = [
          `CIDR: ${notation}`,
          `Network: ${toIP(network)}`,
          `Netmask: ${toIP(mask)}`,
          `Broadcast: ${toIP(broadcast)}`,
          `First host: ${toIP(firstHost)}`,
          `Last host: ${toIP(lastHost)}`,
          `Total hosts: ${hostCount}`,
          `Prefix length: /${prefix}`
        ];
        return { content: [{ type: "text", text: output.join("\n") }] };
      }

      case "case_convert": {
        const { text, to } = args;
        // Split input into words regardless of input format
        const words = text
          .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase splits
          .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // ABCDef -> ABC Def
          .replace(/[-_]/g, " ")
          .split(/\s+/)
          .filter(w => w.length > 0)
          .map(w => w.toLowerCase());
        let result;
        switch (to) {
          case "camel":
            result = words[0] + words.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join("");
            break;
          case "pascal":
            result = words.map(w => w[0].toUpperCase() + w.slice(1)).join("");
            break;
          case "snake":
            result = words.join("_");
            break;
          case "kebab":
            result = words.join("-");
            break;
          case "constant":
            result = words.map(w => w.toUpperCase()).join("_");
            break;
          case "title":
            result = words.map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
            break;
          default:
            throw new Error(`Unknown case: ${to}`);
        }
        const all = {
          camelCase: words[0] + words.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join(""),
          PascalCase: words.map(w => w[0].toUpperCase() + w.slice(1)).join(""),
          snake_case: words.join("_"),
          "kebab-case": words.join("-"),
          CONSTANT_CASE: words.map(w => w.toUpperCase()).join("_"),
          "Title Case": words.map(w => w[0].toUpperCase() + w.slice(1)).join(" ")
        };
        const output = [`Result: ${result}`, "", "All formats:"];
        for (const [k, v] of Object.entries(all)) output.push(`  ${k}: ${v}`);
        return { content: [{ type: "text", text: output.join("\n") }] };
      }

      case "markdown_toc": {
        const { markdown, max_depth = 3 } = args;
        const lines = markdown.split("\n");
        const toc = [];
        for (const line of lines) {
          const match = line.match(/^(#{1,6})\s+(.+)$/);
          if (match) {
            const level = match[1].length;
            if (level > max_depth) continue;
            const text = match[2].replace(/[*_`\[\]]/g, "").trim();
            const anchor = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
            const indent = "  ".repeat(level - 1);
            toc.push(`${indent}- [${text}](#${anchor})`);
          }
        }
        if (toc.length === 0) return { content: [{ type: "text", text: "No headings found." }] };
        return { content: [{ type: "text", text: toc.join("\n") }] };
      }

      case "env_parse": {
        const { content } = args;
        const lines = content.split("\n");
        const keys = [];
        const issues = [];
        const seen = new Set();
        lines.forEach((line, i) => {
          const num = i + 1;
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) return;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx === -1) {
            issues.push(`Line ${num}: Invalid format (no '=' found): ${trimmed}`);
            return;
          }
          const key = trimmed.substring(0, eqIdx).trim();
          const val = trimmed.substring(eqIdx + 1).trim();
          if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
            issues.push(`Line ${num}: Invalid key name '${key}'`);
          }
          if (seen.has(key)) {
            issues.push(`Line ${num}: Duplicate key '${key}'`);
          }
          seen.add(key);
          if (!val) {
            issues.push(`Line ${num}: Empty value for '${key}'`);
          }
          keys.push({ key, value: val.length > 50 ? val.substring(0, 50) + "..." : val, line: num });
        });
        const output = [`Parsed ${keys.length} key(s) from ${lines.length} line(s)`];
        if (keys.length > 0) {
          output.push("\nKeys:");
          keys.forEach(k => output.push(`  ${k.key} = ${k.value} (line ${k.line})`));
        }
        if (issues.length > 0) {
          output.push(`\n⚠ ${issues.length} issue(s):`);
          issues.forEach(i => output.push(`  ${i}`));
        } else {
          output.push("\n✓ No issues found");
        }
        return { content: [{ type: "text", text: output.join("\n") }] };
      }

      case "ip_info": {
        const { ip } = args;
        const trimmed = ip.trim();
        const output = [];
        if (trimmed.includes(":")) {
          output.push(`IP: ${trimmed}`);
          output.push(`Version: IPv6`);
          if (trimmed === "::1") output.push("Type: Loopback");
          else if (trimmed.startsWith("fe80:")) output.push("Type: Link-local");
          else if (trimmed.startsWith("fc") || trimmed.startsWith("fd")) output.push("Type: Unique local (private)");
          else if (trimmed.startsWith("ff")) output.push("Type: Multicast");
          else if (trimmed === "::") output.push("Type: Unspecified");
          else output.push("Type: Global unicast (public)");
        } else {
          const parts = trimmed.split(".");
          if (parts.length !== 4 || parts.some(p => isNaN(p) || +p < 0 || +p > 255)) {
            throw new Error(`Invalid IPv4 address: ${trimmed}`);
          }
          const octets = parts.map(Number);
          output.push(`IP: ${trimmed}`);
          output.push(`Version: IPv4`);
          output.push(`Binary: ${octets.map(o => o.toString(2).padStart(8, "0")).join(".")}`);
          if (octets[0] === 127) output.push("Type: Loopback");
          else if (octets[0] === 10) output.push("Type: Private (10.0.0.0/8, Class A)");
          else if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) output.push("Type: Private (172.16.0.0/12, Class B)");
          else if (octets[0] === 192 && octets[1] === 168) output.push("Type: Private (192.168.0.0/16, Class C)");
          else if (octets[0] === 169 && octets[1] === 254) output.push("Type: Link-local (APIPA)");
          else if (octets[0] >= 224 && octets[0] <= 239) output.push("Type: Multicast");
          else if (octets[0] >= 240) output.push("Type: Reserved");
          else output.push("Type: Public");
          if (octets[0] < 128) output.push("Class: A");
          else if (octets[0] < 192) output.push("Class: B");
          else if (octets[0] < 224) output.push("Class: C");
          else if (octets[0] < 240) output.push("Class: D (Multicast)");
          else output.push("Class: E (Reserved)");
        }
        return { content: [{ type: "text", text: output.join("\n") }] };
      }

      case "password_strength": {
        const { password } = args;
        const len = password.length;
        let charsetSize = 0;
        if (/[a-z]/.test(password)) charsetSize += 26;
        if (/[A-Z]/.test(password)) charsetSize += 26;
        if (/[0-9]/.test(password)) charsetSize += 10;
        if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
        const entropy = Math.round(len * Math.log2(charsetSize || 1) * 100) / 100;
        const issues = [];
        if (len < 8) issues.push("Too short (< 8 characters)");
        if (!/[A-Z]/.test(password)) issues.push("No uppercase letters");
        if (!/[a-z]/.test(password)) issues.push("No lowercase letters");
        if (!/[0-9]/.test(password)) issues.push("No digits");
        if (!/[^a-zA-Z0-9]/.test(password)) issues.push("No special characters");
        if (/(.)\1{2,}/.test(password)) issues.push("Contains repeated characters (3+)");
        if (/^(123|abc|qwerty|password|admin|letmein)/i.test(password)) issues.push("Starts with common pattern");
        let strength;
        if (entropy < 28) strength = "Very Weak";
        else if (entropy < 36) strength = "Weak";
        else if (entropy < 60) strength = "Moderate";
        else if (entropy < 80) strength = "Strong";
        else strength = "Very Strong";
        const output = [
          `Password length: ${len}`,
          `Charset size: ${charsetSize}`,
          `Entropy: ${entropy} bits`,
          `Strength: ${strength}`,
        ];
        if (issues.length > 0) {
          output.push(`\nIssues (${issues.length}):`);
          issues.forEach(i => output.push(`  - ${i}`));
        } else {
          output.push("\n✓ No issues detected");
        }
        return { content: [{ type: "text", text: output.join("\n") }] };
      }

      case "data_size": {
        const { value, unit = "B" } = args;
        const units = {
          B: 1, KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12, PB: 1e15,
          KiB: 1024, MiB: 1048576, GiB: 1073741824, TiB: 1099511627776, PiB: 1125899906842624
        };
        if (!units[unit]) throw new Error(`Unknown unit: ${unit}. Use: ${Object.keys(units).join(", ")}`);
        const bytes = value * units[unit];
        const fmt = (n) => n < 0.01 ? n.toExponential(2) : (n % 1 === 0 ? n.toString() : n.toFixed(2));
        const output = [
          `Input: ${value} ${unit} = ${fmt(bytes)} bytes`,
          "",
          "Decimal (SI):",
          `  ${fmt(bytes)} B`,
          `  ${fmt(bytes / 1e3)} KB`,
          `  ${fmt(bytes / 1e6)} MB`,
          `  ${fmt(bytes / 1e9)} GB`,
          `  ${fmt(bytes / 1e12)} TB`,
          `  ${fmt(bytes / 1e15)} PB`,
          "",
          "Binary (IEC):",
          `  ${fmt(bytes)} B`,
          `  ${fmt(bytes / 1024)} KiB`,
          `  ${fmt(bytes / 1048576)} MiB`,
          `  ${fmt(bytes / 1073741824)} GiB`,
          `  ${fmt(bytes / 1099511627776)} TiB`,
          `  ${fmt(bytes / 1125899906842624)} PiB`,
        ];
        return { content: [{ type: "text", text: output.join("\n") }] };
      }

      case "string_escape": {
        const { text, format, action = "escape" } = args;
        let result;
        if (action === "escape") {
          switch (format) {
            case "json":
              result = JSON.stringify(text).slice(1, -1);
              break;
            case "csv":
              result = text.includes(",") || text.includes('"') || text.includes("\n")
                ? '"' + text.replace(/"/g, '""') + '"'
                : text;
              break;
            case "regex":
              result = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              break;
            case "sql":
              result = text.replace(/'/g, "''");
              break;
            case "shell":
              result = "'" + text.replace(/'/g, "'\\''") + "'";
              break;
            default:
              throw new Error(`Unknown format: ${format}`);
          }
        } else {
          switch (format) {
            case "json":
              result = JSON.parse(`"${text}"`);
              break;
            case "csv":
              result = text.startsWith('"') && text.endsWith('"')
                ? text.slice(1, -1).replace(/""/g, '"')
                : text;
              break;
            case "regex":
              result = text.replace(/\\([.*+?^${}()|[\]\\])/g, "$1");
              break;
            case "sql":
              result = text.replace(/''/g, "'");
              break;
            case "shell":
              result = text.startsWith("'") && text.endsWith("'")
                ? text.slice(1, -1).replace(/'\\''/g, "'")
                : text;
              break;
            default:
              throw new Error(`Unknown format: ${format}`);
          }
        }
        return { content: [{ type: "text", text: result }] };
      }

      case "nanoid": {
        const len = Math.min(Math.max(args.length || 21, 1), 128);
        const alphabet = args.alphabet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
        const count = Math.min(Math.max(args.count || 1, 1), 10);
        const ids = [];
        for (let i = 0; i < count; i++) {
          const bytes = crypto.randomBytes(len);
          let id = "";
          for (let j = 0; j < len; j++) {
            id += alphabet[bytes[j] % alphabet.length];
          }
          ids.push(id);
        }
        return { content: [{ type: "text", text: ids.join("\n") }] };
      }

      case "csv_json": {
        const { input, direction, delimiter = "," } = args;
        if (direction === "csv_to_json") {
          const lines = input.split("\n").filter(l => l.trim());
          if (lines.length < 1) throw new Error("CSV must have at least a header row");
          const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ""));
          const rows = lines.slice(1).map(line => {
            const vals = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ""));
            const obj = {};
            headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
            return obj;
          });
          return { content: [{ type: "text", text: JSON.stringify(rows, null, 2) }] };
        } else {
          const arr = JSON.parse(input);
          if (!Array.isArray(arr) || arr.length === 0) throw new Error("Input must be a non-empty JSON array");
          const headers = Object.keys(arr[0]);
          const csvLines = [headers.join(delimiter)];
          for (const row of arr) {
            csvLines.push(headers.map(h => {
              const val = String(row[h] ?? "");
              return val.includes(delimiter) || val.includes('"') || val.includes("\n")
                ? `"${val.replace(/"/g, '""')}"` : val;
            }).join(delimiter));
          }
          return { content: [{ type: "text", text: csvLines.join("\n") }] };
        }
      }

      case "hex_encode": {
        const action = args.action || "encode";
        if (action === "encode") {
          return { content: [{ type: "text", text: Buffer.from(args.text, "utf-8").toString("hex") }] };
        } else {
          const hex = args.text.replace(/\s/g, "");
          return { content: [{ type: "text", text: Buffer.from(hex, "hex").toString("utf-8") }] };
        }
      }

      case "char_info": {
        const chars = [...args.text].slice(0, 20);
        const info = chars.map(ch => {
          const cp = ch.codePointAt(0);
          const hex = cp.toString(16).toUpperCase().padStart(4, "0");
          const utf8Bytes = Buffer.from(ch, "utf-8");
          const htmlEntity = cp < 128 ? `&#${cp};` : `&#x${hex};`;
          return `'${ch}'  U+${hex}  decimal: ${cp}  UTF-8: ${[...utf8Bytes].map(b => b.toString(16).padStart(2, "0")).join(" ")}  HTML: ${htmlEntity}`;
        });
        return { content: [{ type: "text", text: info.join("\n") }] };
      }

      case "byte_count": {
        const text = args.text;
        const utf8 = Buffer.byteLength(text, "utf-8");
        const utf16 = Buffer.byteLength(text, "utf-16le");
        const ascii = text.length; // JS string length
        const chars = [...text].length; // actual character count (handles surrogate pairs)
        return {
          content: [{ type: "text", text: JSON.stringify({
            characters: chars,
            js_length: text.length,
            utf8_bytes: utf8,
            utf16_bytes: utf16,
            ascii_bytes: ascii
          }, null, 2) }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
