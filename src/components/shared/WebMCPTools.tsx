"use client";

import { useEffect } from "react";

declare global {
  interface Navigator {
    modelContext?: {
      provideContext: (context: {
        name: string;
        version: string;
        description: string;
        tools: MCPTool[];
        resources: MCPResource[];
      }) => Promise<void>;
    };
  }
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: object;
}

interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

function getTools(): MCPTool[] {
  return [
    {
      name: "get_services",
      description: "Get available car services (فحص سيارات، ضبط زوايا، ترصيص)",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "check_availability",
      description: "Check if appointments are available",
      inputSchema: {
        type: "object",
        properties: {
          serviceType: {
            type: "string",
            enum: ["inspection", "alignment", "balancing"],
          },
        },
      },
    },
    {
      name: "get_location",
      description: "Get The Drive Center location and contact information",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
  ];
}

function getResources(): MCPResource[] {
  return [
    {
      uri: "https://thedrive.center/docs/api",
      name: "api_docs",
      description: "API documentation for The Drive Center",
      mimeType: "text/html",
    },
    {
      uri: "https://thedrive.center/.well-known/api-catalog",
      name: "api_catalog",
      description: "Linkset-based API catalog (RFC 9727)",
      mimeType: "application/linkset+json",
    },
    {
      uri: "https://thedrive.center/.well-known/openid-configuration",
      name: "oidc_config",
      description: "OpenID Connect discovery metadata",
      mimeType: "application/json",
    },
  ];
}

export function WebMCPTools() {
  useEffect(() => {
    const provideContext = async () => {
      if (typeof navigator !== "undefined" && navigator.modelContext) {
        try {
          await navigator.modelContext.provideContext({
            name: "thedrive-center",
            version: "1.0.0",
            description: "Car inspection and wheel alignment services",
            tools: getTools(),
            resources: getResources(),
          });
          console.log("[WebMCP] Context provided successfully");
        } catch (error) {
          console.log("[WebMCP] Context provision not available:", error);
        }
      }
    };

    provideContext();
  }, []);

  return null;
}