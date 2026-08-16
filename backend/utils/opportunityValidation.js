const REQUIRED_TEXT_FIELDS = ['title', 'description', 'location'];

export const parseArrayField = (value, fieldName) => {
  if (value === undefined || value === null || value === '') return [];
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) throw new Error();
    return parsed.map(String).map((item) => item.trim()).filter(Boolean);
  } catch {
    const error = new Error(`${fieldName} must be a valid JSON array.`);
    error.statusCode = 400;
    throw error;
  }
};

export const validateOpportunityPayload = (payload, { partial = false } = {}) => {
  const errors = [];

  REQUIRED_TEXT_FIELDS.forEach((field) => {
    if (!partial || payload[field] !== undefined) {
      if (typeof payload[field] !== 'string' || !payload[field].trim()) {
        errors.push(`${field.replace('_', ' ')} is required`);
      }
    }
  });

  if (payload.date) {
    const date = new Date(payload.date);
    if (Number.isNaN(date.getTime())) errors.push('date must be valid');
  }

  if (payload.status !== undefined && !['open', 'closed', 'in-progress'].includes(payload.status)) {
    errors.push('status must be open, closed, or in-progress');
  }

  if (errors.length) {
    const error = new Error(errors.join('. '));
    error.statusCode = 400;
    throw error;
  }
};

export const opportunityErrorResponse = (error, fallback) => {
  if (error.statusCode) return { status: error.statusCode, message: error.message };
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return { status: 400, message: error.message };
  }
  return { status: 500, message: fallback };
};
