import { useEffect, useState } from "react";
import type { Frame } from "./types";

export function usePlayer(frames: Frame[]) {
    const [source, setSource] = useState(frames);
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(600); // milliseconds per frame

    // A new operation arrived: restart from the first frame and auto-play it
    if(source !== frames) {
        setSource(frames);
        setIndex(0);
        setPlaying(frames.length > 1);
    }

    const last = Math.max(frames.length - 1, 0);
    const current = Math.min(index, last);
    const atStart = current === 0;
    const atEnd = current >= last;
    const isPlaying = playing && !atEnd;

    // While playing, advance one frame every `speed` milliseconds
    useEffect(() => {
        if(!isPlaying) return;
        const id = setInterval(() => {
            setIndex((i) => Math.min(i+1, last));
        }, speed);
        return () => clearInterval(id);
    }, [isPlaying, speed, last]);

    function play() {
        if (atEnd) setIndex(0); //replay from the index
        setPlaying(true);
    }
    function pause() {
        setPlaying(false);
    }
    function toggle() {
        if (isPlaying) pause();
        else play();
    }
    function next() {
        setPlaying(false);
        setIndex(Math.min(current+1, last));
    }
    function prev() {
        setPlaying(false);
        setIndex(Math.max(current-1, 0));
    }
    function reset() {
        setPlaying(false);
        setIndex(0);
    }

    return {
        frame: frames[current],
        index: current,
        total: frames.length,
        playing: isPlaying,
        atStart,
        atEnd,
        speed,
        setSpeed,
        play,
        pause,
        toggle,
        next,
        prev,
        reset,
    };
}

export type Player = ReturnType<typeof usePlayer>;