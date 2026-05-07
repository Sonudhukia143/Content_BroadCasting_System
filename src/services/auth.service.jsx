// Mock auth service

export const login = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'teacher1@example.com' && password === 'pass') {
        return { token: 'teacher1-token', role: 'teacher1' }
    }

    if (email === 'teacher2@example.com' && password === 'pass') {
        return { token: 'teacher2-token', role: 'teacher2' }
    }

    if (email === 'principal@example.com' && password === 'pass') {
        return { token: 'principal-token', role: 'principal' }
    }

    throw new Error('Invalid credentials')
}

export const logout = async () => {
    // mock
}

export const verifyToken = async (token) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Handle teacher-specific tokens (teacher1-token, teacher2-token, etc.)
    const teacherMatch = token.match(/teacher(\d+)-token/);
    if (teacherMatch) {
        const teacherId = teacherMatch[1];
        return { email: `teacher${teacherId}@example.com`, role: `teacher${teacherId}` };
    }

    if (token === 'principal-token') {
        return { email: 'principal@example.com', role: 'principal' };
    }

    throw new Error('Invalid token');
}