import { resolve } from "path";

export default {
    theme: {
        "primary-color": "#F18D55"
    },
    proxy: {
        "/api": {
            target: "http://172.20.110.42:10000/",
            changeOrigin: true,
            pathRewrite: { "^/api": "" }
        }
    }
};
