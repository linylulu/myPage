(async () => {
    console.log("start")
    await xxx();
    console.log("koniec")
})();


async function xxx() {
    console.log("niby przed delay");
    await delay();
    console.log("niby po delay");
}


function delay() {
    // `delay` returns a promise
    return new Promise(function (resolve, reject) {
        // Only `delay` is able to resolve or reject the promise
        console.log("in function")
        setTimeout(function () {
            console.log("before resolve")
            resolve(42); // After 3 seconds, resolve the promise with value 42
        }, 3000);
    });
}
