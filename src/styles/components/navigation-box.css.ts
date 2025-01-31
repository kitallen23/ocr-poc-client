import { durations } from "@/styles/tokens.css";
import { style } from "@vanilla-extract/css";

export const navigationBox = style({
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "var(--gray-12)",
    color: "var(--gray-12)",
    borderRadius: "var(--radius-6)",
    transition: `transform ${durations.normal} ease, box-shadow ${durations.normal} ease`,

    ":hover": {
        transform: "scale(1.05)",
        boxShadow: "var(--shadow-5)",
    },
});
