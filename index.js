#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import crypto from "crypto";

const server = new Server(
  { name: "mcp-devutils", version: "1.0.0" },
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
