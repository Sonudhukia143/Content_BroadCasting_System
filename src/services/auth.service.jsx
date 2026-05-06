// Mock auth service

export const login = async (email, password) => {

    // Simulate API call

    await new Promise(resolve => setTimeout(resolve, 1000))

    if (email === 'teacher@example.com' && password === 'pass') {

        return { token: 'teacher-token', role: 'teacher' }

    }

    if (email === 'principal@example.com' && password === 'pass') {

        return { token: 'principal-token', role: 'principal' }

    }

    throw new Error('Invalid credentials')

}

export const logout = async () => {

    // mock

}