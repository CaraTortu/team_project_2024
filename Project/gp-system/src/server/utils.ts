export const randomString = (length: number) => {
    const dic =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let ran = "";
    for (let i = 0; i < length; i++) {
        ran += dic[Math.floor(Math.random() * dic.length)];
    }

    return ran;
};
