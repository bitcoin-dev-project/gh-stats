import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
            },
            borderColor: {
                "card-border-color": "rgba(31, 35, 40, 0.15)",
                "border-blue": "#0969DA",
                "comment-card-border": "#D0D7DE"
            },
            backgroundColor: {
                "card-bg": "#F6F8FA",
                "secondary-blue": "#0969DA",
                "secondary-orange": "#EF7A0E"
            },
            boxShadow: {
                "card-shadow": "0px 1px 0px 0px rgba(27, 31, 35, 0.04)"
            },
            colors: {
                card: {
                    "light-black": "#636C76",
                    "text-black": "#24292F",
                    "comment-card-black": "#1F2328",
                    "secondary-blue": "#0969DA",
                }
            }
        }
    },
    plugins: []
}
export default config
