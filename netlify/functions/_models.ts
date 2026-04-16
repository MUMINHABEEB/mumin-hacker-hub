import mongoose, { Schema, Model, Document } from 'mongoose';

// Shared transform: expose `id` as string, drop `_id` and `__v`
const toJSON = {
  transform: (_doc: Document, ret: Record<string, unknown>) => {
    ret.id = (ret._id as mongoose.Types.ObjectId).toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

// ─── Project ─────────────────────────────────────────────────────────────────

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    long_description: String,
    technologies: [String],
    features: [String],
    github_url: String,
    demo_url: String,
    image_url: String,
    category: String,
    slug: String,
    status: String,
    project_type: String,
    display_order: { type: Number, default: 0 },
    project_date: String,
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON }
);

export const ProjectModel: Model<Document> =
  mongoose.models.Project || mongoose.model('Project', ProjectSchema);

// ─── BlogPost ─────────────────────────────────────────────────────────────────

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: String,
    slug: { type: String, required: true, unique: true },
    tags: [String],
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    featured_image: String,
    author: { type: String, default: 'Mumin Habeeb' },
    publish_date: String,
    published_at: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON }
);

export const BlogPostModel: Model<Document> =
  mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

// ─── SocialMedia ──────────────────────────────────────────────────────────────

const SocialMediaSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    platform: { type: String, required: true },
    post_url: String,
    thumbnail_url: String,
    tags: [String],
    engagement: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
    },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    post_date: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON }
);

export const SocialMediaModel: Model<Document> =
  mongoose.models.SocialMedia || mongoose.model('SocialMedia', SocialMediaSchema);

// ─── Achievement ──────────────────────────────────────────────────────────────

const AchievementSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['award', 'certification', 'recognition', 'milestone', 'competition'],
      required: true,
    },
    type: {
      type: String,
      enum: ['certificate', 'achievement', 'badge', 'award'],
      required: true,
    },
    date: { type: String, required: true },
    organization: String,
    credential_id: String,
    credential_url: String,
    image_url: String,
    video_url: String,
    skills: [String],
    featured: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON }
);

export const AchievementModel: Model<Document> =
  mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);

// ─── ErrorLog ─────────────────────────────────────────────────────────────────

const ErrorLogSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['javascript', 'network', 'component', 'cms', 'build'],
      required: true,
    },
    level: {
      type: String,
      enum: ['error', 'warning', 'info'],
      required: true,
    },
    message: { type: String, required: true },
    stack: String,
    url: String,
    user_agent: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON }
);

export const ErrorLogModel: Model<Document> =
  mongoose.models.ErrorLog || mongoose.model('ErrorLog', ErrorLogSchema);
