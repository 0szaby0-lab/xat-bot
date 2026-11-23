// Bridge between MAIN world (content.js) and extension background service worker
window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (!event.data || event.data.type !== 'XATH_KEEPER_CALL') return;

    try {
        chrome.runtime.sendMessage(event.data.payload, () => {
            if (chrome.runtime.lastError) {
                // Ignore silent background worker sleep/restarts
            }
        });
    } catch (_) {}
});
