// STUDENT PROFILE SCHEMA VALIDATOR v136
// T19 SEALED: additionalProperties rejection added
// schemaVersion field added

export const StudentProfileSchema = {
  studentId:           { type: 'string', required: true,  pattern: /^student-\d+-[a-z0-9]+$/ },
  name:                { type: 'string', required: true,  minLength: 2, maxLength: 100 },
  location:            { type: 'string', required: true,  minLength: 2 },
  birthplace:          { type: 'string', required: true },
  level:               { type: 'string', required: true,  enum: ['beginner', 'intermediate', 'advanced'] },
  goals:               { type: 'string', required: true,  minLength: 10 },
  confidence:          { type: 'string', required: true },
  occupation:          { type: 'string', required: true },
  fear:                { type: 'string', required: true },
  history:             { type: 'string', required: true },
  motivation:          { type: 'string', required: true },
  weak_phonemes:       { type: 'array',  default: [] },
  strong_phonemes:     { type: 'array',  default: [] },
  session_count:       { type: 'number', default: 0, min: 0, max: 100000 },
  total_minutes:       { type: 'number', default: 0, min: 0, max: 1000000 },
  last_session:        { type: 'string', nullable: true },
  onboarding_complete: { type: 'number', default: 0, enum: [0, 1] },
  tigerScoreHistory:   { type: 'array',  default: [] },
  currentTier:         { type: 'string', nullable: true, enum: ['MOUSE', 'CUB', 'TIGER', null] },
  schemaVersion:       { type: 'number', default: 1 },
  created_at:          { type: 'string', required: true }
};

export function validateStudentProfile(data) {
  const errors = [];
  const knownFields = new Set(Object.keys(StudentProfileSchema));

  // T19: REJECT unknown fields (additionalProperties: false)
  for (const key of Object.keys(data)) {
    if (!knownFields.has(key) && key !== 'updated_at' && key !== 'version') {
      errors.push(`Unknown field rejected: ${key} (${ERR_SCHEMA_UNKNOWN_FIELD})`);
    }
  }

  for (const [field, rules] of Object.entries(StudentProfileSchema)) {
    const value = data[field];

    if (rules.required && (value === undefined || value === null)) {
      errors.push(`Missing required field: ${field}`);
      continue;
    }

    if (value === undefined || value === null) {
      if (rules.nullable) continue;
      continue;
    }

    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} must be string, got ${typeof value}`);
      continue;
    }
    if (rules.type === 'number' && typeof value !== 'number') {
      errors.push(`${field} must be number, got ${typeof value}`);
      continue;
    }
    if (rules.type === 'array' && !Array.isArray(value)) {
      errors.push(`${field} must be array`);
      continue;
    }

    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength)
        errors.push(`${field} too short (min ${rules.minLength}, got ${value.length})`);
      if (rules.maxLength && value.length > rules.maxLength)
        errors.push(`${field} too long (max ${rules.maxLength}, got ${value.length})`);
      if (rules.pattern && !rules.pattern.test(value))
        errors.push(`${field} format invalid (pattern mismatch)`);
    }

    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min)
        errors.push(`${field} below minimum (${rules.min})`);
      if (rules.max !== undefined && value > rules.max)
        errors.push(`${field} above maximum (${rules.max})`);
    }

    if (rules.enum && value !== null && !rules.enum.includes(value))
      errors.push(`${field} must be one of: ${rules.enum.filter(v => v !== null).join(', ')}`);
  }

  return { valid: errors.length === 0, errors, schemaVersion: 1 };
}

const ERR_SCHEMA_UNKNOWN_FIELD = 'PHX:ERR:SCHEMA:UNKNOWN_FIELD';
