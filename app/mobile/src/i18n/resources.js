
import { en as webEn, vi as webVi } from '../../web/src/i18n/resources';

// We can directly export the web resources if the environment supports it.
// Assuming the relative path is correct and the bundler resolves it.
// If direct import fails due to structure, we should copy the keys.
// For now, let's assume we can spread them.

export const enMobile = {
    ...webEn,
    // Mobile specific overrides if needed
};

export const viMobile = {
    ...webVi,
    // Mobile specific overrides if needed
};
