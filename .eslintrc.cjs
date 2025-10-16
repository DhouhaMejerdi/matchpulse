module.exports = {
        extends: ["next/core-web-vitals"],
        rules: {
        "@next/next/no-img-element": "off", // we’ll use <img> for crests initially
        "react/jsx-key": "warn"
    }
};
