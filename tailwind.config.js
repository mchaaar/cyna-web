module.exports = {
    content: [
        './src/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            animation: {
                'button-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                pulse: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                }
            }
        },
    },
    plugins: [],
}
  