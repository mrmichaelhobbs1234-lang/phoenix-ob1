// STUDENT PROFILE SCHEMA VALIDATOR
// Externalized schema validation to prevent hardcoding drift
// CRITICAL: This is a runtime import — src/reincarnate.js imports from ../validators/student-profile.js

export const StudentProfileSchema = {
  studentId: { 
    type: 'string', 
    required: true, 
    pattern: /^student-\d+-[a-z0-9]+$/ 
  },
  name: { 
    type: 'string', 
    required: true, 
    minLength: 2, 
    maxLength: 100 
  },
  location: { 
    type: 'string', 
    required: true, 
    minLength: 2 
  },
  birthplace: { 
    type: 'string', 
    required: true 
  },
  level: { 
    type: 'string', 
    required: true, 
    enum: ['beginner', 'intermediate', 'advanced'] 
  },
  goals: { 
    type: 'string', 
    required: true, 
    minLength: 10 
  },
  confidence: { 
    type: 'string', 
    required: true 
  },
  occupation: { 
    type: 'string', 
    required: true 
  },
  fear: { 
    type: 'string', 
    required: true 
  },
  history: { 
    type: 'string', 
    required: true 
  },
  motivation: { 
    type: 'string', 
    required: true 
  },
  weak_phonemes: { 
    type: 'json', 
    default: '[]' 
  },
  strong_phonemes: { 
    type: 'json', 
    default: '[]' 
  },
  session_count: { 
    type: 'number', 
    default: 0 
  },
  total_minutes: { 
    type: 'number', 
    default: 0 
  },
  last_session: { 
    type: 'string', 
    nullable: true 
  },
  onboarding_complete: { 
    type: 'number', 
    default: 0, 
    enum: [0, 1] 
  },
  created_at: { 
    type: 'string', 
    required: true 
  }
};

export function validateStudentProfile(data) {
  const errors = [];
  
  for (const [field, rules] of Object.entries(StudentProfileSchema)) {
    const value = data[field];
    
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`Missing required field: ${field}`);
      continue;
    }
    
    if (value === undefined || value === null) continue;
    
    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} must be string`);
    }
    if (rules.type === 'number' && typeof value !== 'number') {
      errors.push(`${field} must be number`);
    }
    if (rules.type === 'json') {
      try {
        JSON.parse(value);
      } catch {
        errors.push(`${field} must be valid JSON`);
      }
    }
    
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} too short (min ${rules.minLength})`);
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} too long (max ${rules.maxLength})`);
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format invalid`);
      }
    }
    
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
