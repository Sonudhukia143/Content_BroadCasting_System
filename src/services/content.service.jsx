import { libData } from "@/lib/data";

// Mock content service
export const getAllContent = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return libData;
}

export const getContentByTeacher = async (teacherId) => {
    const all = await getAllContent()
    return all.filter(c => c.teacherId === teacherId)
}

export const uploadContent = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    libData.push({
        id: libData.length + 1,
        title: data.title,
        subject: data.subject,
        status: 'pending',
        teacherId: data.teacherId,
        startTime: data.startTime,
        endTime: data.endTime,
        rotationDuration: data.rotationDuration || "",
        description: data.description || ""
    });
    return { id: Date.now(), ...data, status: 'pending' };
}

export const approveContent = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    libData[id - 1].status = 'approved';
    return { success: true }
}

export const rejectContent = async (id, reason) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    libData[id - 1].status = 'rejected';
    libData[id - 1].rejectionReason = reason.toString();

    return { success: true }
}

export const getLiveContent = async (teacherId) => {
    const all = await getAllContent()
    const now = new Date()
    return all.filter(c => c.teacherId === teacherId && new Date(c.startTime) <= now && new Date(c.endTime) >= now && c.status === 'approved')
}










//creating an ai model that can be trained by human entire life and at end the human dies and the model is what that human was  a mimic of that human