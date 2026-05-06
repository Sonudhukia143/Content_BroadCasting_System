// Mock content service

export const getAllContent = async () => {

    await new Promise(resolve => setTimeout(resolve, 500))

    return [

        { id: 1, title: 'Math Lesson 1', subject: 'Math', status: 'approved', teacherId: 'teacher1', description: 'Basic algebra', startTime: '2023-01-01T10:00', endTime: '2023-01-01T11:00', rotationDuration: 30 },

        { id: 2, title: 'Science Experiment', subject: 'Science', status: 'pending', teacherId: 'teacher1', description: 'Chemistry lab', startTime: '2023-01-02T10:00', endTime: '2023-01-02T12:00', rotationDuration: 60 },

        { id: 3, title: 'History Lecture', subject: 'History', status: 'rejected', teacherId: 'teacher2', description: 'World War II', startTime: '2023-01-03T09:00', endTime: '2023-01-03T10:00', rotationDuration: 45, rejectionReason: 'Inappropriate content' }

    ]

}

export const getContentByTeacher = async (teacherId) => {

    const all = await getAllContent()

    return all.filter(c => c.teacherId === teacherId)

}

export const uploadContent = async (data) => {

    await new Promise(resolve => setTimeout(resolve, 1000))

    return { id: Date.now(), ...data, status: 'pending' }

}

export const approveContent = async (id) => {

    await new Promise(resolve => setTimeout(resolve, 500))

    return { success: true }

}

export const rejectContent = async (id, reason) => {

    await new Promise(resolve => setTimeout(resolve, 500))

    return { success: true }

}

export const getLiveContent = async (teacherId) => {

    const all = await getAllContent()

    const now = new Date()

    return all.filter(c => c.teacherId === teacherId && new Date(c.startTime) <= now && new Date(c.endTime) >= now && c.status === 'approved')

}