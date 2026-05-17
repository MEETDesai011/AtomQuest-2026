#!/bin/bash
# AtomQuest Enterprise Backup Script
# Executes nightly via cron

BACKUP_DIR="/var/backups/atomquest"
DB_FILE="../backend/prisma/dev.db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=30

echo "Starting AtomQuest Backup Protocol: $TIMESTAMP"

# Ensure backup dir exists
mkdir -p "$BACKUP_DIR"

# 1. Database Backup (SQLite dump)
sqlite3 "$DB_FILE" ".backup '$BACKUP_DIR/db_backup_$TIMESTAMP.sqlite'"

# Compress backup
tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" -C "$BACKUP_DIR" "db_backup_$TIMESTAMP.sqlite"
rm "$BACKUP_DIR/db_backup_$TIMESTAMP.sqlite"

# 2. Enforce 30-Day Retention Policy
echo "Pruning backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +$RETENTION_DAYS -exec rm {} \;

# 3. Verification
if [ -f "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" ]; then
    echo "✅ Backup completed and verified: backup_$TIMESTAMP.tar.gz"
else
    echo "❌ Backup failed!"
    exit 1
fi
