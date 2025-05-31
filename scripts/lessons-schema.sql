-- ========================================
-- LESSONS SCHEMA FOR FREEDOM TRAINING
-- ========================================

-- 1. Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_key VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'lesson_1'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_time INTEGER, -- in minutes
    learning_objectives JSONB,
    tags JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Lesson Content Blocks Table
CREATE TABLE IF NOT EXISTS lesson_content_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    block_key VARCHAR(50) NOT NULL, -- e.g., 'text_1_1'
    block_type VARCHAR(20) NOT NULL CHECK (block_type IN ('text', 'video', 'quiz')),
    block_order INTEGER NOT NULL,
    title VARCHAR(255),
    content JSONB, -- stores different content based on type
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lesson_id, block_order)
);

-- 3. User Lesson Progress Table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    current_block_index INTEGER DEFAULT 0,
    completed_blocks JSONB DEFAULT '[]', -- array of completed block IDs
    quiz_answers JSONB DEFAULT '{}', -- quiz answers: { "quiz_id": answer }
    video_watch_time JSONB DEFAULT '{}', -- video watch times: { "video_id": seconds }
    tute_points_earned INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, lesson_id)
);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons(category);
CREATE INDEX IF NOT EXISTS idx_lessons_difficulty ON lessons(difficulty);
CREATE INDEX IF NOT EXISTS idx_lesson_content_blocks_lesson_id ON lesson_content_blocks(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_content_blocks_order ON lesson_content_blocks(lesson_id, block_order);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_completed ON user_lesson_progress(is_completed);

-- 5. Update timestamp trigger for lessons
CREATE OR REPLACE FUNCTION update_lessons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_lessons_updated_at();

-- 6. Trigger to update user's total TUTE points when lesson is completed
CREATE OR REPLACE FUNCTION update_user_tute_points_on_lesson_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- When lesson is marked as completed, add points to user's total
    IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
        UPDATE users 
        SET tute_points = tute_points + NEW.tute_points_earned
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_tute_points_on_lesson_completion
    AFTER UPDATE ON user_lesson_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_user_tute_points_on_lesson_completion(); 