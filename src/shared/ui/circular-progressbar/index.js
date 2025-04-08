export const CircularProgressBar = ({ percentage, size = 100, strokeWidth = 4, color = "#4CAF50", background = "#ddd" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size}>
            {/* Background Circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={background}
                strokeWidth={strokeWidth}
            />
            {/* Progress Circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
        </svg>
    );
};