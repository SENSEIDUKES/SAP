/**
 * Browser/device capability helpers used by UI affordances. These functions are
 * deliberately SSR-safe: unknown server/non-browser environments are treated as
 * desktop-capable so markup is not hidden without real browser evidence.
 */

function getNavigator(): Navigator | undefined {
    return typeof navigator === "undefined" ? undefined : navigator
}

/** True for iPhone/iPad/iPod, including iPadOS Safari's desktop-class UA. */
export function isIOS(): boolean {
    const nav = getNavigator()
    if (!nav) return false

    const ua = nav.userAgent || ""
    const platform = nav.platform || ""
    const maxTouchPoints = nav.maxTouchPoints || 0

    return (
        /iPad|iPhone|iPod/i.test(ua) ||
        // iPadOS 13+ can report as MacIntel while still ignoring audio.volume.
        (platform === "MacIntel" && maxTouchPoints > 1)
    )
}

/**
 * Best-effort mobile browser detection. Used only to avoid showing UI that is
 * often unsupported/misleading on phones and tablets (not for security logic).
 */
export function isMobileDevice(): boolean {
    const nav = getNavigator()
    if (!nav || typeof window === "undefined") return false

    const ua = nav.userAgent || ""
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(ua)) {
        return true
    }

    if (isIOS()) return true

    const hasTouch = "ontouchstart" in window || nav.maxTouchPoints > 0
    const hasCoarsePointer =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(pointer: coarse)").matches
    const narrowViewport =
        typeof window.innerWidth === "number" && window.innerWidth <= 1024

    return hasTouch && hasCoarsePointer && narrowViewport
}

/**
 * Desktop keeps the historical volume slider by default. Mobile browsers hide
 * it unless the host explicitly opts in, avoiding a fake slider on iOS Safari.
 */
export function shouldRenderVolumeSlider(
    showVolume: boolean,
    enableMobileVolume = false
): boolean {
    if (!showVolume) return false
    return !isMobileDevice() || enableMobileVolume
}