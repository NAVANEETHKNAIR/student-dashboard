db.participants.createIndex({ userId: 1, courseId: 1 }, { unique: true });
db.gradeentities.createIndex({ userId: 1, courseId: 1 }, { unique: true });
