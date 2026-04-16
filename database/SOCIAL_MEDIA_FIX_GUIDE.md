# Fix Social Media Table Schema

## 🔴 **Error Description**
```
[ERROR]: Failed to save social media post: Could not find the 'metrics' column of 'social_media' in the schema cache
```

This error occurs because the `social_media` table in your Supabase database is missing the `metrics` column that's expected by the TypeScript interface.

## 🔧 **Quick Fix Instructions**

### Method 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project
   - Go to **Database** → **SQL Editor**

2. **Run the Fix Script**
   Copy and paste this SQL command:
   
   ```sql
   -- Add missing metrics column
   ALTER TABLE social_media 
   ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '{}';
   
   -- Add missing url column if it doesn't exist
   ALTER TABLE social_media 
   ADD COLUMN IF NOT EXISTS url TEXT;
   
   -- Add missing published column if it doesn't exist
   ALTER TABLE social_media 
   ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;
   
   -- Update any existing records to have empty metrics if null
   UPDATE social_media 
   SET metrics = '{}' 
   WHERE metrics IS NULL;
   ```

3. **Verify the Fix**
   Run this to check your table structure:
   
   ```sql
   SELECT column_name, data_type, is_nullable, column_default
   FROM information_schema.columns 
   WHERE table_name = 'social_media' 
   ORDER BY ordinal_position;
   ```

### Method 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Navigate to your project directory
cd path/to/your/project

# Run the migration
supabase db push

# Or create a new migration
supabase migration new fix_social_media_schema
# Then add the SQL commands above to the generated file
```

## ✅ **Expected Table Structure**

After running the fix, your `social_media` table should have these columns:

```sql
social_media (
  id: uuid (Primary Key)
  title: text
  content: text
  platform: text
  url: text                    -- ✅ Added
  tags: text[]
  metrics: jsonb               -- ✅ Added (Main fix)
  published: boolean           -- ✅ Added
  created_at: timestamp
  updated_at: timestamp
)
```

## 📝 **Metrics Column Format**

The `metrics` column stores JSON data like this:

```json
{
  "views": 1250,
  "likes": 89,
  "comments": 12,
  "shares": 23
}
```

## 🧪 **Test the Fix**

After applying the schema fix:

1. **Refresh your application**
2. **Navigate to Admin → Social Media**
3. **Try adding a new social media post**
4. **Verify the metrics fields work correctly**

## 🚀 **Next Steps**

Once the schema is fixed:

- ✅ Social Media admin forms will work correctly
- ✅ All CRUD operations will function properly
- ✅ Metrics tracking will be enabled
- ✅ The cybersecurity-themed UI will display properly

## 📞 **Support**

If you encounter any issues:

1. Check the browser console for JavaScript errors
2. Verify your Supabase connection settings
3. Ensure your API keys are correctly configured
4. Check the Network tab for failed API requests

---

**🎯 This fix resolves the core database schema mismatch that was preventing social media post creation in your admin dashboard.**