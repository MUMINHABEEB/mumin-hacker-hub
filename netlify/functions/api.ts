import type { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { connectDB } from './_db';
import { isAuthorized, validateCredentials, createToken } from './_auth';
import {
  ProjectModel,
  BlogPostModel,
  SocialMediaModel,
  AchievementModel,
  ErrorLogModel,
} from './_models';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(statusCode: number, body: unknown): HandlerResponse {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    body: JSON.stringify(body),
  };
}

function unauthorized(): HandlerResponse {
  return json(401, { error: 'Unauthorized' });
}

function parseBody(event: HandlerEvent): Record<string, unknown> {
  if (!event.body) return {};
  try {
    return JSON.parse(event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf-8')
      : event.body);
  } catch {
    return {};
  }
}

// ─── Auth handler ─────────────────────────────────────────────────────────────

async function handleAuth(event: HandlerEvent, subpath: string | undefined): Promise<HandlerResponse> {
  if (subpath !== 'login' || event.httpMethod !== 'POST') {
    return json(404, { error: 'Not found' });
  }

  const { email, password } = parseBody(event) as { email?: string; password?: string };
  if (!email || !password) return json(400, { error: 'email and password are required' });

  const valid = await validateCredentials(email, password);
  if (!valid) return json(401, { error: 'Invalid credentials' });

  const token = createToken(email);
  return json(200, { token });
}

// ─── Projects ─────────────────────────────────────────────────────────────────

async function handleProjects(event: HandlerEvent, method: string, id: string | undefined): Promise<HandlerResponse> {
  const q = event.queryStringParameters || {};

  if (method === 'GET') {
    if (id) {
      const doc = await ProjectModel.findById(id);
      if (!doc) return json(404, { error: 'Not found' });
      return json(200, doc.toJSON());
    }

    const filter: Record<string, unknown> = {};
    if (q.published === 'true') filter.published = true;
    if (q.featured === 'true') filter.featured = true;

    const sortField = q.sort || 'created_at';
    const sortDir = q.asc === 'true' ? 1 : -1;
    const docs = await ProjectModel.find(filter).sort({ [sortField as string]: sortDir });
    return json(200, docs.map(d => d.toJSON()));
  }

  if (!isAuthorized(event.headers)) return unauthorized();

  if (method === 'POST') {
    const body = parseBody(event);
    const doc = await ProjectModel.create(body);
    return json(201, doc.toJSON());
  }

  if (method === 'PUT' && id) {
    const body = parseBody(event);
    const doc = await ProjectModel.findByIdAndUpdate(id, body, { new: true });
    if (!doc) return json(404, { error: 'Not found' });
    return json(200, doc.toJSON());
  }

  if (method === 'DELETE' && id) {
    await ProjectModel.findByIdAndDelete(id);
    return json(200, { success: true });
  }

  return json(405, { error: 'Method not allowed' });
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

async function handleBlogPosts(event: HandlerEvent, method: string, id: string | undefined): Promise<HandlerResponse> {
  const q = event.queryStringParameters || {};

  if (method === 'GET') {
    if (id) {
      const doc = await BlogPostModel.findById(id);
      if (!doc) return json(404, { error: 'Not found' });
      return json(200, doc.toJSON());
    }

    if (q.slug) {
      const doc = await BlogPostModel.findOne({ slug: q.slug, published: true });
      if (!doc) return json(404, { error: 'Not found' });
      return json(200, doc.toJSON());
    }

    const filter: Record<string, unknown> = {};
    if (q.published === 'true') filter.published = true;

    const docs = await BlogPostModel.find(filter).sort({ publish_date: -1, created_at: -1 });
    return json(200, docs.map(d => d.toJSON()));
  }

  if (!isAuthorized(event.headers)) return unauthorized();

  if (method === 'POST') {
    const body = parseBody(event);
    const doc = await BlogPostModel.create(body);
    return json(201, doc.toJSON());
  }

  if (method === 'PUT' && id) {
    const body = parseBody(event);
    const doc = await BlogPostModel.findByIdAndUpdate(id, body, { new: true });
    if (!doc) return json(404, { error: 'Not found' });
    return json(200, doc.toJSON());
  }

  if (method === 'DELETE' && id) {
    await BlogPostModel.findByIdAndDelete(id);
    return json(200, { success: true });
  }

  return json(405, { error: 'Method not allowed' });
}

// ─── Social Media ─────────────────────────────────────────────────────────────

async function handleSocialMedia(event: HandlerEvent, method: string, id: string | undefined): Promise<HandlerResponse> {
  const q = event.queryStringParameters || {};

  if (method === 'GET') {
    if (id) {
      const doc = await SocialMediaModel.findById(id);
      if (!doc) return json(404, { error: 'Not found' });
      return json(200, doc.toJSON());
    }

    const filter: Record<string, unknown> = {};
    if (q.published === 'true') filter.published = true;

    const sortField = q.sort || 'post_date';
    const docs = await SocialMediaModel.find(filter).sort({ [sortField]: -1, created_at: -1 });
    return json(200, docs.map(d => d.toJSON()));
  }

  if (!isAuthorized(event.headers)) return unauthorized();

  if (method === 'POST') {
    const body = parseBody(event);
    const doc = await SocialMediaModel.create(body);
    return json(201, doc.toJSON());
  }

  if (method === 'PUT' && id) {
    const body = parseBody(event);
    const doc = await SocialMediaModel.findByIdAndUpdate(id, body, { new: true });
    if (!doc) return json(404, { error: 'Not found' });
    return json(200, doc.toJSON());
  }

  if (method === 'DELETE' && id) {
    await SocialMediaModel.findByIdAndDelete(id);
    return json(200, { success: true });
  }

  return json(405, { error: 'Method not allowed' });
}

// ─── Achievements ─────────────────────────────────────────────────────────────

async function handleAchievements(event: HandlerEvent, method: string, id: string | undefined): Promise<HandlerResponse> {
  const q = event.queryStringParameters || {};

  if (method === 'GET') {
    if (id) {
      const doc = await AchievementModel.findById(id);
      if (!doc) return json(404, { error: 'Not found' });
      return json(200, doc.toJSON());
    }

    const filter: Record<string, unknown> = {};
    if (q.featured === 'true') filter.featured = true;
    if (q.category) filter.category = q.category;
    if (q.type) filter.type = q.type;

    const docs = await AchievementModel.find(filter).sort({ date: -1 });
    return json(200, docs.map(d => d.toJSON()));
  }

  if (!isAuthorized(event.headers)) return unauthorized();

  if (method === 'POST') {
    const body = parseBody(event);
    const doc = await AchievementModel.create(body);
    return json(201, doc.toJSON());
  }

  if (method === 'PUT' && id) {
    const body = parseBody(event);
    const doc = await AchievementModel.findByIdAndUpdate(id, body, { new: true });
    if (!doc) return json(404, { error: 'Not found' });
    return json(200, doc.toJSON());
  }

  if (method === 'DELETE' && id) {
    await AchievementModel.findByIdAndDelete(id);
    return json(200, { success: true });
  }

  return json(405, { error: 'Method not allowed' });
}

// ─── Error Logs ───────────────────────────────────────────────────────────────

async function handleErrorLogs(event: HandlerEvent, method: string, _id: string | undefined): Promise<HandlerResponse> {
  if (method === 'POST') {
    const body = parseBody(event);
    const doc = await ErrorLogModel.create(body);
    return json(201, doc.toJSON());
  }

  if (method === 'GET') {
    if (!isAuthorized(event.headers)) return unauthorized();
    const limit = parseInt(event.queryStringParameters?.limit || '100', 10);
    const docs = await ErrorLogModel.find().sort({ created_at: -1 }).limit(limit);
    return json(200, docs.map(d => d.toJSON()));
  }

  return json(405, { error: 'Method not allowed' });
}

// ─── Main handler ─────────────────────────────────────────────────────────────

const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  // Parse path: handle both /api/<resource> and /.netlify/functions/api/<resource>
  const cleanPath = (event.path || '')
    .replace(/^\/\.netlify\/functions\/api\/?/, '')
    .replace(/^\/api\/?/, '');

  const pathParts = cleanPath.split('/').filter(Boolean);
  const resource = pathParts[0];
  const id = pathParts[1] || undefined;
  const method = event.httpMethod;

  try {
    if (resource === 'auth') {
      return await handleAuth(event, id);
    }

    await connectDB();

    switch (resource) {
      case 'projects':     return handleProjects(event, method, id);
      case 'blog-posts':   return handleBlogPosts(event, method, id);
      case 'social-media': return handleSocialMedia(event, method, id);
      case 'achievements': return handleAchievements(event, method, id);
      case 'error-logs':   return handleErrorLogs(event, method, id);
      default:             return json(404, { error: 'Not found' });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[api]', err);
    return json(500, { error: message });
  }
};

export { handler };
