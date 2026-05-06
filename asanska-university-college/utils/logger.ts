
export const logAdminAction = (action: string) => {
    const timestamp = new Date().toISOString();
    console.log(`[AUDIT LOG] ${timestamp}: ${action}`);
};
