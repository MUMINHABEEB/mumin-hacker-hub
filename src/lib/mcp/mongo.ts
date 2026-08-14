import { MongoClient, type Db, type Document } from "mongodb";

type RuntimeGlobals = typeof globalThis & {
  Deno?: { env?: { get?: (name: string) => string | undefined } };
  process?: { env?: Record<string, string | undefined> };
};

function runtimeEnv(name: string): string | undefined {
  const runtime = globalThis as RuntimeGlobals;
  return runtime.Deno?.env?.get?.(name) ?? runtime.process?.env?.[name];
}

let cached: Promise<Db> | null = null;

/**
 * Lazily connects to MongoDB Atlas. The URI is read at call time (never at
 * module load) so this file stays import-safe for the build-time manifest
 * extraction and for cold starts.
 */
export function db(): Promise<Db> {
  if (cached) return cached;
  const uri = runtimeEnv("MONGODB_URI")?.trim();
  if (!uri) throw new Error("MONGODB_URI is not configured for this server");

  cached = (async () => {
    const client = new MongoClient(uri, { maxPoolSize: 5 } as ConstructorParameters<typeof MongoClient>[1]);
    await client.connect();
    return client.db();
  })().catch((err) => {
    cached = null;
    throw err;
  });

  return cached;
}

/** Strips Mongo internals and exposes `id` as a string, like the app's REST API. */
export function serialize(doc: Document): Record<string, unknown> {
  const { _id, __v, ...rest } = doc as Record<string, unknown> & { _id?: unknown };
  return { id: _id ? String(_id) : undefined, ...rest };
}

export function textResult(payload: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
    structuredContent: payload as Record<string, unknown>,
  };
}
