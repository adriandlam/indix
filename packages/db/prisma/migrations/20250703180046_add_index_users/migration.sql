-- DropIndex
DROP INDEX "sessions_user_id_idx";

-- CreateIndex
CREATE INDEX "sessions_user_id_token_idx" ON "sessions"("user_id", "token");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
