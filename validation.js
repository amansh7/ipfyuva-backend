function formatFieldName(field) {
    return field
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
}

export function validateFields(data, rules) {
    const errors = {};

    for (const field in rules) {
        const validations = rules[field];
        const value = data[field];

        validations.forEach(rule => {
            const formattedField = formatFieldName(field);

            switch (rule) {
                case 'required':
                    if (!value) {
                        errors[field] = `${formattedField} is required.`;
                    }
                    break;
                case 'mobile':
                    if (value && !/^\d{10}$/.test(value)) {
                        errors[field] = 'Mobile number must be 10 digits.';
                    }
                    break;
                case 'email':
                    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        errors[field] = 'Invalid email format.';
                    }
                    break;
                case 'password':
                    if (value && value.length < 6) {
                        errors[field] = 'Password must be at least 6 characters long.';
                    }
                    break;
                default:
                    break;
            }
        });
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}
