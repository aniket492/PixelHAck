async function protectDashboardRoute() {
    try {
        // Wait for Clerk to be ready
        if (!window.Clerk) {
            await new Promise(resolve => {
                const checkClerk = setInterval(() => {
                    if (window.Clerk) {
                        clearInterval(checkClerk);
                        resolve();
                    }
                }, 100);
            });
        }

        await window.Clerk.load();
        
        // Check if user is authenticated
        if (!window.Clerk.user) {
            window.location.href = '../index.html';
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        window.location.href = '../index.html';
    }
}