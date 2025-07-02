
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