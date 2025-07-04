
export const AnimateNumericValue = (duration: number, raw_value: number, animatedValue: number, setAnimatedValue: (value: number) => void): () => void => () => {
    let animationFrame: number;
    const start = performance.now();
    const startValue = animatedValue;
    const change = raw_value - startValue;

    const animate = (time: number) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = startValue + change * progress;
        setAnimatedValue(currentValue);

        if (progress < 1) {
            animationFrame = requestAnimationFrame(animate);
        }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
}


export const getRandomHighContrastColor = (prevColor?: string): string => {
    const randomHue = Math.floor(Math.random() * 360);
    const saturation = 80 + Math.floor(Math.random() * 20); // 80-100%
    const lightness = 40 + Math.floor(Math.random() * 20); // 40-60%

    if (!prevColor) {
        return `hsl(${randomHue}, ${saturation}%, ${lightness}%)`;
    }

    let prevHue = 0;
    const match = prevColor.match(/hsl\((\d+),/);
    if (match) {
        prevHue = parseInt(match[1], 10);
    }

    let newHue = randomHue;
    if (Math.abs(newHue - prevHue) < 120) {
        newHue = (prevHue + 180 + Math.floor(Math.random() * 60) - 30) % 360;
    }

    return `hsl(${newHue}, ${saturation}%, ${lightness}%)`;
}