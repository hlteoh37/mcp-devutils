#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import crypto from "crypto";

const server = new Server(
  { name: "mcp-devutils", version: "1.2.0" },
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
