type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return error;
}

function sanitizeContext(context?: LogContext) {
  if (!context) return undefined;

  const entries = Object.entries(context)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, key === "error" ? serializeError(value) : value]);

  return Object.fromEntries(entries);
}

function writeLog(level: LogLevel, event: string, context?: LogContext) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...(sanitizeContext(context) ? { context: sanitizeContext(context) } : {}),
  };

  const line = JSON.stringify(payload);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export const logger = {
  info(event: string, context?: LogContext) {
    writeLog("info", event, context);
  },
  warn(event: string, context?: LogContext) {
    writeLog("warn", event, context);
  },
  error(event: string, context?: LogContext) {
    writeLog("error", event, context);
  },
};
