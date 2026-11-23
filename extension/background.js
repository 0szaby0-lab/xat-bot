// Background Service Worker - runs outside of page CSP with direct network access
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const KEEPER_URL = 'https://xat-bot-qziz.onrender.com';

    if (request.type === 'YIELD' || request.type === 'USER_ACTIVE') {
        fetch(`${KEEPER_URL}/user-active`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request.data || { user: 'Szaby' })
        })
        .then(r => r.json())
        .then(res => sendResponse({ ok: true, data: res }))
        .catch(err => sendResponse({ ok: false, error: err.message }));
        return true; // async response
    }

    if (request.type === 'USER_INACTIVE') {
        fetch(`${KEEPER_URL}/user-inactive`, {
            method: 'POST'
        })
        .then(r => r.json())
        .then(res => sendResponse({ ok: true, data: res }))
        .catch(err => sendResponse({ ok: false, error: err.message }));
        return true;
    }

    if (request.type === 'SYNC_SESSION') {
        fetch(`${KEEPER_URL}/api/sync-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request.data || {})
        })
        .then(r => r.json())
        .then(res => sendResponse({ ok: true, data: res }))
        .catch(err => sendResponse({ ok: false, error: err.message }));
        return true;
    }
});
