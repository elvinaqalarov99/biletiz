export const durations = {
  oneDayMs: 24 * 60 * 60 * 1000,
  thirtyDaysMs: 30 * 24 * 60 * 60 * 1000,
  fiveMinutesMs: 5 * 60 * 1000,
} as const;

export const sessionDurations = {
  default: durations.oneDayMs,
  rememberMe: durations.thirtyDaysMs,
} as const;

export const securitySettings = {
  maxLoginAttempts: 5,
  maxConcurrentSessions: 5,
  baseAccountLockDuration: durations.fiveMinutesMs,
  passwordResetTokenDuration: durations.oneDayMs,
} as const;

export const databaseErrorCodes = {
  deadlock: '40P01',
  serialization: '40001',
  lockTimeout: '55P03',
  duplicateKey: '23505',
} as const;

export const retryableErrorGroups = {
  transactionConflicts: [
    databaseErrorCodes.deadlock,
    databaseErrorCodes.serialization,
  ],
  timeouts: [databaseErrorCodes.lockTimeout],
  conflicts: [databaseErrorCodes.duplicateKey],
} as const;

export const transactionSettings = {
  defaultTimeout: 5000,
  maxRetries: 3,
  delays: {
    initial: 50,
    max: 1000,
  },
  isolationLevel: 'REPEATABLE READ',
} as const;

export const retryableColumns = {
  timestamp: ['created_at', 'updated_at'],
  versioning: ['sequence_number', 'version'],
} as const;

export const allRetryableColumns = [
  ...retryableColumns.timestamp,
  ...retryableColumns.versioning,
] as const;
