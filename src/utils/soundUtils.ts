// R2D2-style beep sound generator using Web Audio API
export const playR2D2Alarm = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // R2D2-style beep sequence
    const beepSequence = [
        { freq: 800, duration: 0.1, delay: 0 },
        { freq: 1000, duration: 0.08, delay: 0.12 },
        { freq: 600, duration: 0.15, delay: 0.22 },
        { freq: 1200, duration: 0.1, delay: 0.4 },
        { freq: 900, duration: 0.12, delay: 0.52 },
        { freq: 1100, duration: 0.08, delay: 0.66 },
        { freq: 700, duration: 0.2, delay: 0.76 },
    ];

    beepSequence.forEach(({ freq, duration, delay }) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'square'; // Square wave for that robotic sound

        // Envelope for smoother sound
        const now = audioContext.currentTime + delay;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
    });

    // Clean up after all beeps are done
    setTimeout(() => {
        audioContext.close();
    }, 1500);
};
