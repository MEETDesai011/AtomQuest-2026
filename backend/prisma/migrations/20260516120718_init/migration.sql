-- ============================================================
-- AtomQuest — PostgreSQL initial schema migration
-- Replaces the original SQLite migration.
-- DATETIME → TIMESTAMP(3), REAL → DOUBLE PRECISION,
-- TEXT PRIMARY KEY → TEXT (uuid) with explicit constraint.
-- ============================================================

-- CreateTable
CREATE TABLE "User" (
    "id"           TEXT         NOT NULL,
    "name"         TEXT         NOT NULL,
    "email"        TEXT         NOT NULL,
    "passwordHash" TEXT         NOT NULL,
    "role"         TEXT         NOT NULL DEFAULT 'EMPLOYEE',
    "department"   TEXT,
    "managerId"    TEXT,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalCycle" (
    "id"          TEXT         NOT NULL,
    "year"        INTEGER      NOT NULL,
    "phase"       TEXT         NOT NULL,
    "windowOpen"  TIMESTAMP(3) NOT NULL,
    "windowClose" TIMESTAMP(3) NOT NULL,
    "isActive"    BOOLEAN      NOT NULL DEFAULT false,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoalCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id"           TEXT             NOT NULL,
    "employeeId"   TEXT             NOT NULL,
    "cycleId"      TEXT             NOT NULL,
    "sharedFromId" TEXT,
    "thrustArea"   TEXT             NOT NULL,
    "title"        TEXT             NOT NULL,
    "description"  TEXT,
    "uom"          TEXT             NOT NULL,
    "target"       DOUBLE PRECISION NOT NULL,
    "weightage"    DOUBLE PRECISION NOT NULL,
    "status"       TEXT             NOT NULL DEFAULT 'DRAFT',
    "isLocked"     BOOLEAN          NOT NULL DEFAULT false,
    "createdAt"    TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3)     NOT NULL,
    "deletedAt"    TIMESTAMP(3),

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id"            TEXT             NOT NULL,
    "goalId"        TEXT             NOT NULL,
    "cycleId"       TEXT             NOT NULL,
    "actualValue"   DOUBLE PRECISION,
    "progressScore" DOUBLE PRECISION,
    "status"        TEXT             NOT NULL DEFAULT 'NOT_STARTED',
    "updatedAt"     TIMESTAMP(3)     NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckinComment" (
    "id"            TEXT         NOT NULL,
    "achievementId" TEXT         NOT NULL,
    "managerId"     TEXT         NOT NULL,
    "comment"       TEXT         NOT NULL,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckinComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id"         TEXT         NOT NULL,
    "goalId"     TEXT         NOT NULL,
    "changedBy"  TEXT         NOT NULL,
    "actionType" TEXT         NOT NULL,
    "fieldName"  TEXT         NOT NULL,
    "oldValue"   TEXT,
    "newValue"   TEXT,
    "changedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscalationLog" (
    "id"          TEXT         NOT NULL,
    "type"        TEXT         NOT NULL,
    "userId"      TEXT         NOT NULL,
    "message"     TEXT         NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EscalationLog_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx"      ON "User"("role");
CREATE INDEX "User_managerId_idx" ON "User"("managerId");

CREATE INDEX "GoalCycle_phase_idx"    ON "GoalCycle"("phase");
CREATE INDEX "GoalCycle_isActive_idx" ON "GoalCycle"("isActive");

CREATE INDEX "Goal_employeeId_idx"   ON "Goal"("employeeId");
CREATE INDEX "Goal_cycleId_idx"      ON "Goal"("cycleId");
CREATE INDEX "Goal_status_idx"       ON "Goal"("status");
CREATE INDEX "Goal_sharedFromId_idx" ON "Goal"("sharedFromId");

CREATE INDEX "Achievement_goalId_idx"  ON "Achievement"("goalId");
CREATE INDEX "Achievement_cycleId_idx" ON "Achievement"("cycleId");
CREATE UNIQUE INDEX "Achievement_goalId_cycleId_key" ON "Achievement"("goalId", "cycleId");

CREATE INDEX "AuditLog_goalId_idx"    ON "AuditLog"("goalId");
CREATE INDEX "AuditLog_changedBy_idx" ON "AuditLog"("changedBy");

CREATE INDEX "EscalationLog_userId_idx" ON "EscalationLog"("userId");

-- AddForeignKey
ALTER TABLE "User"
    ADD CONSTRAINT "User_managerId_fkey"
    FOREIGN KEY ("managerId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Goal"
    ADD CONSTRAINT "Goal_employeeId_fkey"
    FOREIGN KEY ("employeeId") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Goal"
    ADD CONSTRAINT "Goal_cycleId_fkey"
    FOREIGN KEY ("cycleId") REFERENCES "GoalCycle"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Achievement"
    ADD CONSTRAINT "Achievement_goalId_fkey"
    FOREIGN KEY ("goalId") REFERENCES "Goal"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Achievement"
    ADD CONSTRAINT "Achievement_cycleId_fkey"
    FOREIGN KEY ("cycleId") REFERENCES "GoalCycle"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CheckinComment"
    ADD CONSTRAINT "CheckinComment_achievementId_fkey"
    FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CheckinComment"
    ADD CONSTRAINT "CheckinComment_managerId_fkey"
    FOREIGN KEY ("managerId") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AuditLog"
    ADD CONSTRAINT "AuditLog_goalId_fkey"
    FOREIGN KEY ("goalId") REFERENCES "Goal"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AuditLog"
    ADD CONSTRAINT "AuditLog_changedBy_fkey"
    FOREIGN KEY ("changedBy") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "EscalationLog"
    ADD CONSTRAINT "EscalationLog_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
