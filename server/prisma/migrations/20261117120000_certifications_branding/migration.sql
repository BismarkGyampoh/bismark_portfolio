CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "credentialId" TEXT,
    "credentialUrl" TEXT,
    "description" TEXT,
    "issuedAt" DATE,
    "expiresAt" DATE,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Certification_displayOrder_issuedAt_idx" ON "Certification"("displayOrder", "issuedAt");

INSERT INTO "Certification" ("id", "name", "issuer", "description", "displayOrder", "createdAt", "updatedAt")
VALUES
    ('seed-cert-project-management', 'Project Management Training', 'Coursera / Government of Ghana Initiative', 'In progress', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed-cert-google-ai-workspace', 'Google AI & Workspace Member', 'Google AI & Workspace', 'Certified Google AI Plan Participant.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed-cert-graphic-design', 'Graphic Designing', 'UMaT Today News Media', NULL, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

ALTER TABLE "SiteProfile"
ADD COLUMN "logoPath" TEXT,
ADD COLUMN "faviconPath" TEXT;
