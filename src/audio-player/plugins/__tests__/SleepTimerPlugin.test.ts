import { describe, expect, it, vi } from "vitest"
import { SleepTimerPlugin } from "../SleepTimerPlugin"
import type { PluginPlayerContext } from "../../core/plugins/PluginInterface"
import type { AudioPlayerEngine } from "../../types"

function createPluginContext(pause = vi.fn()): PluginPlayerContext {
    const engine = {
        currentTime: 0,
        duration: 180,
        pause,
    } as unknown as AudioPlayerEngine

    return {
        getEngine: () => engine,
        getRootElement: () => null,
        getAudioElement: () => null,
        getCurrentTrack: () => ({
            title: "Test Track",
            artist: "SEIHouse",
            audioFile: "/test.mp3",
        }),
        getNextTrack: () => null,
        getSourceKey: () => "test-track",
    }
}

describe("SleepTimerPlugin", () => {
    it("pauses playback when the selected countdown reaches zero", () => {
        vi.useFakeTimers()
        const pause = vi.fn()
        const plugin = new SleepTimerPlugin()

        plugin.init(createPluginContext(pause))
        plugin.setTimer("15m")

        vi.advanceTimersByTime(15 * 60 * 1000 - 1)
        expect(pause).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1)
        expect(pause).toHaveBeenCalledTimes(1)
        expect(plugin.getActiveTimer().preset).toBe("off")

        plugin.destroy()
        vi.useRealTimers()
    })

    it("pauses at the end of the current track without letting the host advance", () => {
        const pause = vi.fn()
        const plugin = new SleepTimerPlugin()

        plugin.init(createPluginContext(pause))
        plugin.setTimer("track-end")

        const handled = plugin.onTrackEnded?.({
            title: "Test Track",
            artist: "SEIHouse",
            audioFile: "/test.mp3",
        })

        expect(handled).toBe(true)
        expect(pause).toHaveBeenCalledTimes(1)
        expect(plugin.getActiveTimer().preset).toBe("off")
    })
})
