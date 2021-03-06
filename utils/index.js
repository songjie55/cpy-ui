export const debounce = function (fn, delay = 800) {
    let timer
    return function (...args) {
        const that = this
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            timer = null
            fn.apply(that, args)
        }, delay)
    }
}
export const colorRgb = function (color, alpha = 1) {
    // 16进制颜色值的正则
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    color = color.toLowerCase();
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            let colorNew = '#';
            for (let i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1)
                    .concat(color.slice(i, i + 1));
            }
            color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        const colorChange = [];
        for (let i = 1; i < 7; i += 2) {
            colorChange.push(parseInt(`0x${color.slice(i, i + 2)}`));
        }
        return `rgba(${colorChange.join(',')},${alpha})`;
    } else {
        return color;
    }
};
