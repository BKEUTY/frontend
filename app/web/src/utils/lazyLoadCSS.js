export const lazyLoadCSS = (href, options = {}) => {
    const { media = 'print', onload = null, onerror = null } = options;

    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = media;

        if (onload) link.onload = onload;
        if (onerror) link.onerror = onerror;

        link.onload = () => {
            link.media = 'all';
            if (onload) onload();
            resolve();
        };

        link.onerror = () => {
            if (onerror) onerror();
            reject(new Error(`Failed to load CSS: ${href}`));
        };

        document.head.appendChild(link);
    });
};

export const lazyLoadCSSWhenReady = (href, options = {}) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            lazyLoadCSS(href, options).catch(err => console.warn(err));
        }, { once: true });
    } else {
        lazyLoadCSS(href, options).catch(err => console.warn(err));
    }
};
