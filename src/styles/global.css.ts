import { globalStyle } from "@vanilla-extract/css";

globalStyle(":root", {
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    lineHeight: 1.5,
    fontWeight: 400,
    colorScheme: "light dark",
    fontSynthesis: "none",
    textRendering: "optimizeLegibility",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
});

globalStyle("a", {
    fontWeight: 500,
    color: "#646cff",
    textDecoration: "inherit",
});

globalStyle("a:hover", {
    color: "#535bf2",
});

globalStyle("body", {
    margin: 0,
});

globalStyle("h1", {
    fontSize: "3.2em",
    lineHeight: 1.1,
});
