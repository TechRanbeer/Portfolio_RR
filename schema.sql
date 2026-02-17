-- ENUMS
DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('published', 'draft');
    CREATE TYPE employment_type AS ENUM ('FULL_TIME', 'INTERN', 'CONTRACT', 'FREELANCE');
    CREATE TYPE spec_category AS ENUM ('HOST', 'SECURITY', 'INFRA', 'CUSTOM');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- NORMALIZED TABLES
CREATE TABLE IF NOT EXISTS main_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tech_stack_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- CORE TABLES
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    long_description TEXT,
    main_tag_id UUID REFERENCES main_tags(id),
    thumbnail TEXT,
    images TEXT[] DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    featured BOOLEAN DEFAULT false,
    status project_status DEFAULT 'published',
    ai_context TEXT,
    start_date DATE,
    end_date DATE,
    is_ongoing BOOLEAN DEFAULT false,
    role TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    -- Technical Deep Dive Fields
    architecture_impact TEXT,
    scale_strategy_title TEXT,
    scale_strategy_description TEXT,
    latency_profile_title TEXT,
    latency_profile_description TEXT
);

CREATE TABLE IF NOT EXISTS project_tech_stack (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    tech_stack_id UUID REFERENCES tech_stack_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tech_stack_id)
);

CREATE TABLE IF NOT EXISTS project_deployment_specs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    category spec_category DEFAULT 'CUSTOM',
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_feature_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    description TEXT,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    category TEXT,
    verification_url TEXT,
    credential_id TEXT,
    credential_url TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT false,
    status project_status DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    employment_type employment_type DEFAULT 'FULL_TIME',
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    achievements TEXT[] DEFAULT '{}',
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_config (
    id INT PRIMARY KEY CHECK (id = 1), -- Singleton Enforcement
    logo_line1 TEXT,
    logo_line2 TEXT,
    hero_headline_line1 TEXT,
    hero_headline_line2 TEXT,
    hero_subtitle TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    location TEXT,
    bio_summary TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    actor TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXING
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_experience_order ON experience(order_index);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics(event_type);

-- RLS POLICIES
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY "Public Read Experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public Read Certificates" ON certificates FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY "Public Read Config" ON site_config FOR SELECT USING (true);

-- ADMIN POLICIES (Assumes auth.email() check)
CREATE POLICY "Admin All Access" ON projects TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Experience" ON experience TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Certificates" ON certificates TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Config" ON site_config TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Read Analytics" ON analytics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin Read Logs" ON audit_logs FOR SELECT TO authenticated USING (true);

-- TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER tr_experience_updated BEFORE UPDATE ON experience FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER tr_certificates_updated BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER tr_site_config_updated BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();